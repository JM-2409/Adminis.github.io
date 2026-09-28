-- ==========================================
-- ESTRUCTURA BASE DE DATOS SUPABASE - ADMINIS
-- Conjunto Residencial (Parqueaderos, Visitantes, Paquetes, Zonas Comunes, Trasteos, Empleados, Residentes)
-- ==========================================

-- 1. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLA DE CONFIGURACIÓN DEL CONJUNTO Y NOMENCLATURA
CREATE TABLE IF NOT EXISTS public.complex_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_name VARCHAR(150) NOT NULL DEFAULT 'Conjunto Residencial',
    address TEXT,
    visitor_parking_spots INT DEFAULT 20,
    moving_hours VARCHAR(100) DEFAULT 'Lunes a Sábado: 08:00 AM - 05:00 PM',
    social_room_fee NUMERIC(10, 2) DEFAULT 150000,
    bbq_fee NUMERIC(10, 2) DEFAULT 80000,
    single_level_nomenclature BOOLEAN DEFAULT FALSE, -- FALSE = 2 niveles (Torre + Apto), TRUE = 1 nivel (Casa/Lote)
    level_1_name VARCHAR(50) DEFAULT 'Torre / Bloque / Manzana',
    level_2_name VARCHAR(50) DEFAULT 'Apartamento / Casa',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABLA DE EMPLEADOS Y PERSONAL DE VIGILANCIA
CREATE TABLE IF NOT EXISTS public.staff_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL, -- Ej: Turno Noche / Juan Perez
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) DEFAULT 'Vigilante',
    status VARCHAR(20) CHECK (status IN ('Activo', 'Inactivo')) DEFAULT 'Activo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABLA DE UNIDADES Y RESIDENTES (Con credenciales opcionales y parqueadero asignado)
CREATE TABLE IF NOT EXISTS public.units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sector VARCHAR(50) DEFAULT 'N/A', -- Torre, Bloque, Manzana
    unit_number VARCHAR(50) NOT NULL, -- Apt 301, Casa 12
    resident_name VARCHAR(150) NOT NULL,
    document VARCHAR(50),
    role VARCHAR(20) CHECK (role IN ('Propietario', 'Inquilino')) DEFAULT 'Propietario',
    phone VARCHAR(30),
    email VARCHAR(150),
    parking_spot VARCHAR(30), -- Opcional
    vehicles_count INT DEFAULT 0,
    pets_count INT DEFAULT 0,
    has_app_access BOOLEAN DEFAULT FALSE, -- Si tiene acceso creado para la app
    username VARCHAR(50) UNIQUE, -- Opcional
    password_hash TEXT, -- Opcional
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. TABLA DE VISITANTES Y PARQUEADERO
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

-- 6. TABLA DE PAQUETERÍA Y CORRESPONDENCIA
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

-- 7. TABLA DE RESERVAS ZONAS COMUNES
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

-- 8. TABLA DE AUTORIZACIONES DE TRASTEOS (MUDANZAS)
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

-- 9. TABLA DE ANUNCIOS Y COMUNICADOS CON EXPIRACIÓN AUTOMÁTICA
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

-- 10. SEGURIDAD Y POLÍTICAS RLS (Row Level Security)
ALTER TABLE public.complex_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parcels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moving_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Politica permisiva por defecto para desarrollo con Supabase
CREATE POLICY "Acceso total administracion" ON public.complex_settings FOR ALL USING (true);
CREATE POLICY "Acceso total administracion" ON public.staff_users FOR ALL USING (true);
CREATE POLICY "Acceso total administracion" ON public.units FOR ALL USING (true);
CREATE POLICY "Acceso total administracion" ON public.visitors FOR ALL USING (true);
CREATE POLICY "Acceso total administracion" ON public.parcels FOR ALL USING (true);
CREATE POLICY "Acceso total administracion" ON public.reservations FOR ALL USING (true);
CREATE POLICY "Acceso total administracion" ON public.moving_requests FOR ALL USING (true);
CREATE POLICY "Acceso total administracion" ON public.announcements FOR ALL USING (true);
