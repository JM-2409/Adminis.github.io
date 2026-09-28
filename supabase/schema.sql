-- ==========================================
-- ESTRUCTURA BASE DE DATOS SUPABASE - ADMINIS
-- Conjunto Residencial & Portal Súper Admin
-- ==========================================

-- 1. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLA DE UNIDADES Y RESIDENTES
CREATE TABLE IF NOT EXISTS public.units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tower VARCHAR(50) NOT NULL,
    apartment VARCHAR(20) NOT NULL,
    resident_name VARCHAR(150) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('Propietario', 'Inquilino')) DEFAULT 'Propietario',
    phone VARCHAR(30),
    email VARCHAR(150),
    vehicles_count INT DEFAULT 0,
    pets_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABLA DE VISITANTES Y PARQUEADERO
CREATE TABLE IF NOT EXISTS public.visitors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(20) CHECK (type IN ('Vehicular', 'Peatonal')) NOT NULL,
    name VARCHAR(150) NOT NULL,
    document VARCHAR(50),
    apartment_unit VARCHAR(100) NOT NULL,
    license_plate VARCHAR(20),
    parking_spot VARCHAR(20),
    entry_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    exit_time TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) CHECK (status IN ('En sitio', 'Finalizado')) DEFAULT 'En sitio'
);

-- 4. TABLA DE PAQUETERÍA Y CORRESPONDENCIA
CREATE TABLE IF NOT EXISTS public.parcels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    apartment_unit VARCHAR(100) NOT NULL,
    recipient_name VARCHAR(150) NOT NULL,
    courier_company VARCHAR(100) NOT NULL,
    description TEXT,
    received_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    delivered_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) CHECK (status IN ('Pendiente', 'Entregado')) DEFAULT 'Pendiente'
);

-- 5. TABLA DE RESERVAS ZONAS COMUNES
CREATE TABLE IF NOT EXISTS public.reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    facility_name VARCHAR(100) NOT NULL, -- 'Salón Social', 'Terraza BBQ 1', 'Terraza BBQ 2'
    resident_name VARCHAR(150) NOT NULL,
    apartment_unit VARCHAR(100) NOT NULL,
    event_date DATE NOT NULL,
    time_slot VARCHAR(50) NOT NULL,
    fee_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    status VARCHAR(20) CHECK (status IN ('Pendiente', 'Aprobada', 'Rechazada')) DEFAULT 'Pendiente',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. TABLA DE AUTORIZACIONES DE TRASTEOS (MUDANZAS)
CREATE TABLE IF NOT EXISTS public.moving_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_type VARCHAR(30) CHECK (request_type IN ('Entrada (Ingreso)', 'Salida (Retiro)')) NOT NULL,
    resident_name VARCHAR(150) NOT NULL,
    document VARCHAR(50) NOT NULL,
    apartment_unit VARCHAR(100) NOT NULL,
    moving_company VARCHAR(100),
    vehicle_plate VARCHAR(20),
    scheduled_date DATE NOT NULL,
    scheduled_time VARCHAR(50) NOT NULL,
    deposit_paid BOOLEAN DEFAULT FALSE,
    notes TEXT,
    status VARCHAR(20) CHECK (status IN ('Pendiente', 'Aprobado', 'Rechazado')) DEFAULT 'Pendiente',
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. TABLA DE ANUNCIOS Y COMUNICADOS CON EXPIRACIÓN AUTOMÁTICA
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) CHECK (category IN ('General', 'Mantenimiento', 'Asamblea', 'Urgente')) DEFAULT 'General',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_days INT DEFAULT 3,
    is_expired BOOLEAN DEFAULT FALSE
);

-- 8. TABLAS DE SÚPER ADMIN / DUEÑO DE LA PLATAFORMA

-- 8.1 TABLA DE CONJUNTOS RESIDENCIALES
CREATE TABLE IF NOT EXISTS public.complexes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    nip VARCHAR(50) NOT NULL UNIQUE,
    address TEXT NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    subscription_status VARCHAR(20) CHECK (subscription_status IN ('Al día', 'Pendiente', 'Suspendido')) DEFAULT 'Al día',
    subscription_due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8.2 TABLA DE USUARIOS ADMINISTRADORES
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(150) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    address TEXT,
    complex_id UUID REFERENCES public.complexes(id) ON DELETE SET NULL,
    status VARCHAR(20) CHECK (status IN ('Activo', 'Suspendido')) DEFAULT 'Activo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8.3 TABLA DE NOTIFICACIONES Y COMUNICADOS DEL SISTEMA (DUEÑO -> ADMINISTRADORES)
CREATE TABLE IF NOT EXISTS public.system_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    category VARCHAR(50) CHECK (category IN ('Actualización', 'Mantenimiento', 'Urgente', 'Informativo')) DEFAULT 'Actualización',
    target_role VARCHAR(50) DEFAULT 'administradores',
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. FUNCIÓN Y TRIGGER PARA LIMPIEZA DE ANUNCIOS EXPIRADOS (OPTIMIZACIÓN PLAN GRATUITO SUPABASE)
CREATE OR REPLACE FUNCTION purge_expired_announcements()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.announcements
    SET is_expired = TRUE
    WHERE expires_at < NOW() AND is_expired = FALSE;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 10. SEGURIDAD Y POLÍTICAS RLS (Row Level Security)
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parcels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moving_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complexes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_notifications ENABLE ROW LEVEL SECURITY;

-- Política permisiva por defecto para desarrollo con Supabase
CREATE POLICY "Acceso total para administradores" ON public.units FOR ALL USING (true);
CREATE POLICY "Acceso total para administradores" ON public.visitors FOR ALL USING (true);
CREATE POLICY "Acceso total para administradores" ON public.parcels FOR ALL USING (true);
CREATE POLICY "Acceso total para administradores" ON public.reservations FOR ALL USING (true);
CREATE POLICY "Acceso total para administradores" ON public.moving_requests FOR ALL USING (true);
CREATE POLICY "Acceso total para administradores" ON public.announcements FOR ALL USING (true);
CREATE POLICY "Acceso total para super admin" ON public.complexes FOR ALL USING (true);
CREATE POLICY "Acceso total para super admin" ON public.admin_users FOR ALL USING (true);
CREATE POLICY "Acceso total para super admin" ON public.system_notifications FOR ALL USING (true);
