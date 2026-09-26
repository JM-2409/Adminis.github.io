import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

async function getAdminUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload || !payload.conjunto_id) return null;
  return payload;
}

// POST occupy or release visitor parking
export async function POST(request: Request) {
  const user = await getAdminUser();
  if (!user || !user.conjunto_id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action, parking_id, placa, nombre_visitante, tipo_vehiculo, unidad_destino_texto, metodo_pago } = body;

    if (action === 'occupy') {
      const { data, error } = await supabase
        .from('visitor_parkings')
        .update({
          estado: 'ocupado',
          placa: placa?.toUpperCase(),
          nombre_visitante,
          tipo_vehiculo: tipo_vehiculo || 'carro',
          unidad_destino_texto,
          hora_entrada: new Date().toISOString(),
        })
        .eq('id', parking_id)
        .eq('conjunto_id', user.conjunto_id)
        .select()
        .single();

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ parking: data, message: 'Parqueadero ocupado correctamente' });
    }

    if (action === 'release') {
      // Get current parking record
      const { data: parking, error: fetchErr } = await supabase
        .from('visitor_parkings')
        .select('*')
        .eq('id', parking_id)
        .eq('conjunto_id', user.conjunto_id)
        .single();

      if (fetchErr || !parking || parking.estado !== 'ocupado') {
        return NextResponse.json({ error: 'Parqueadero no encontrado o no está ocupado' }, { status: 400 });
      }

      // Calculate tariff
      const { data: tariff } = await supabase
        .from('tariffs')
        .select('*')
        .eq('conjunto_id', user.conjunto_id)
        .single();

      const rates = tariff || { carro_hora: 5000, moto_hora: 3000, carro_dia: 35000, moto_dia: 20000 };
      const entryTime = new Date(parking.hora_entrada).getTime();
      const exitTime = new Date().getTime();
      const diffMs = Math.max(exitTime - entryTime, 1000 * 60 * 5); // At least 5 mins
      const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));

      const isCar = (parking.tipo_vehiculo || 'carro') === 'carro';
      const hourlyRate = isCar ? Number(rates.carro_hora) : Number(rates.moto_hora);
      const dailyRate = isCar ? Number(rates.carro_dia) : Number(rates.moto_dia);

      let totalCalculated = 0;
      if (diffHours >= 24) {
        const days = Math.floor(diffHours / 24);
        const remHours = diffHours % 24;
        totalCalculated = days * dailyRate + remHours * hourlyRate;
      } else {
        totalCalculated = Math.min(diffHours * hourlyRate, dailyRate);
      }

      // Record payment
      const { data: payment, error: paymentErr } = await supabase
        .from('payments')
        .insert({
          conjunto_id: user.conjunto_id,
          concepto: 'parqueadero_visitante',
          referencia_id: parking.id,
          valor: totalCalculated,
          metodo: metodo_pago || 'efectivo',
          registrado_por: user.username,
        })
        .select()
        .single();

      if (paymentErr) {
        return NextResponse.json({ error: paymentErr.message }, { status: 500 });
      }

      // Reset parking to free
      const { data: updatedParking, error: updateErr } = await supabase
        .from('visitor_parkings')
        .update({
          estado: 'libre',
          placa: null,
          nombre_visitante: null,
          unidad_destino_texto: null,
          hora_entrada: null,
        })
        .eq('id', parking_id)
        .select()
        .single();

      if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 });

      // Audit log
      await supabase.from('audit_logs').insert({
        conjunto_id: user.conjunto_id,
        usuario: user.username,
        accion: 'Cobro Parqueadero Visitantes',
        detalle: `Cobrado ${totalCalculated} COP por puestos ${parking.codigo} (${diffHours}h, placa ${parking.placa})`,
      });

      return NextResponse.json({
        parking: updatedParking,
        payment,
        totalHours: diffHours,
        totalFee: totalCalculated,
        message: `Parqueadero liberado. Total a cobrar: $${totalCalculated.toLocaleString('es-CO')} COP`,
      });
    }

    return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });
  } catch (err: unknown) {
    return NextResponse.json({ error: 'Error procesando solicitud' }, { status: 500 });
  }
}

// PATCH update tariffs
export async function PATCH(request: Request) {
  const user = await getAdminUser();
  if (!user || !user.conjunto_id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { carro_hora, moto_hora, carro_dia, moto_dia } = body;

    const { data: updatedTariff, error } = await supabase
      .from('tariffs')
      .upsert({
        conjunto_id: user.conjunto_id,
        carro_hora: Number(carro_hora),
        moto_hora: Number(moto_hora),
        carro_dia: Number(carro_dia),
        moto_dia: Number(moto_dia),
      }, { onConflict: 'conjunto_id' })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await supabase.from('audit_logs').insert({
      conjunto_id: user.conjunto_id,
      usuario: user.username,
      accion: 'Actualización de Tarifas',
      detalle: `Tarifas actualizadas: Carro hora=$${carro_hora}, Moto hora=$${moto_hora}`,
    });

    return NextResponse.json({ tariff: updatedTariff, message: 'Tarifas actualizadas con éxito' });
  } catch {
    return NextResponse.json({ error: 'Error actualizando tarifas' }, { status: 500 });
  }
}
