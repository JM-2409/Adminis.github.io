import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

export async function getAdminUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload || (payload.role !== 'administracion' && payload.role !== 'super_admin')) return null;
  return payload;
}

// GET admin dashboard stats
export async function GET() {
  const user = await getAdminUser();
  if (!user || !user.conjunto_id) {
    return NextResponse.json({ error: 'No autorizado o conjunto no seleccionado' }, { status: 401 });
  }

  const conjuntoId = user.conjunto_id;

  // 1. Private Parkings
  const { data: privateParkings } = await supabase
    .from('private_parkings')
    .select('*')
    .eq('conjunto_id', conjuntoId);

  const privateOccupied = privateParkings?.filter((p) => p.estado === 'ocupado').length || 0;
  const privateTotal = privateParkings?.length || 0;

  // 2. Visitor Parkings
  const { data: visitorParkings } = await supabase
    .from('visitor_parkings')
    .select('*')
    .eq('conjunto_id', conjuntoId)
    .order('codigo', { ascending: true });

  const visitorOccupied = visitorParkings?.filter((v) => v.estado === 'ocupado').length || 0;
  const visitorFree = (visitorParkings?.length || 20) - visitorOccupied;

  // 3. Daily Income
  const today = new Date().toISOString().split('T')[0];
  const { data: todayPayments } = await supabase
    .from('payments')
    .select('valor')
    .eq('conjunto_id', conjuntoId)
    .gte('created_at', today);

  const dailyIncome = todayPayments?.reduce((acc, p) => acc + Number(p.valor), 0) || 0;

  // 4. Pending Packages
  const { data: pendingPackages } = await supabase
    .from('packages')
    .select('id')
    .eq('conjunto_id', conjuntoId)
    .eq('estado', 'pendiente');

  // 5. Pending Fines
  const { data: pendingFines } = await supabase
    .from('fines')
    .select('id, valor')
    .eq('conjunto_id', conjuntoId)
    .eq('estado', 'pendiente');

  const totalPendingFines = pendingFines?.reduce((acc, f) => acc + Number(f.valor), 0) || 0;

  // 6. Common Areas & Reservations
  const { data: commonAreas } = await supabase
    .from('common_areas')
    .select('*')
    .eq('conjunto_id', conjuntoId);

  const { data: tariffs } = await supabase
    .from('tariffs')
    .select('*')
    .eq('conjunto_id', conjuntoId)
    .single();

  return NextResponse.json({
    privateOccupied,
    privateTotal,
    visitorFree,
    visitorTotal: visitorParkings?.length || 20,
    visitorParkings: visitorParkings || [],
    dailyIncome,
    pendingPackagesCount: pendingPackages?.length || 0,
    pendingFinesCount: pendingFines?.length || 0,
    totalPendingFines,
    commonAreas: commonAreas || [],
    tariffs: tariffs || { carro_hora: 5000, moto_hora: 3000, carro_dia: 35000, moto_dia: 20000 },
  });
}
