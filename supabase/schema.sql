-- ==========================================
-- ESTRUCTURA BASE DE DATOS SUPABASE - PARKCONTROL TOTAL
-- Sistema de Gestión Completa para Conjuntos Residenciales
-- ==========================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CONJUNTOS RESIDENCIALES
CREATE TABLE IF NOT EXISTS public.complexes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    nip VARCHAR(50) NOT NULL UNIQUE,
    address TEXT NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    subscription_status VARCHAR(20) CHECK (subscription_status IN ('Al día', 'Pendiente', 'Suspendido')) DEFAULT 'Al día',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. USUARIOS DEL SISTEMA (super_admin, administrador, vigilante, residente)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complex_id UUID REFERENCES public.complexes(id) ON DELETE CASCADE,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('super_admin', 'administrador', 'vigilante', 'residente')) NOT NULL,
    email VARCHAR(150),
    phone VARCHAR(30),
    unit_number VARCHAR(50), -- p.ej. Torre 1 - Apto 201 (para residentes)
    status VARCHAR(20) CHECK (status IN ('Activo', 'Inactivo', 'Suspendido')) DEFAULT 'Activo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. UNIDADES Y RESIDENTES
CREATE TABLE IF NOT EXISTS public.units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complex_id UUID REFERENCES public.complexes(id) ON DELETE CASCADE NOT NULL,
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

-- 4. VISITANTES Y PARQUEADEROS
CREATE TABLE IF NOT EXISTS public.visitors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complex_id UUID REFERENCES public.complexes(id) ON DELETE CASCADE NOT NULL,
    type VARCHAR(20) CHECK (type IN ('Vehicular', 'Peatonal')) NOT NULL,
    name VARCHAR(150) NOT NULL,
    document VARCHAR(50),
    apartment_unit VARCHAR(100) NOT NULL,
    license_plate VARCHAR(20),
    parking_spot VARCHAR(20),
    registered_by VARCHAR(150),
    entry_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    exit_time TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) CHECK (status IN ('En sitio', 'Finalizado')) DEFAULT 'En sitio'
);

-- 5. PAQUETERÍA Y CORRESPONDENCIA
CREATE TABLE IF NOT EXISTS public.parcels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complex_id UUID REFERENCES public.complexes(id) ON DELETE CASCADE NOT NULL,
    apartment_unit VARCHAR(100) NOT NULL,
    recipient_name VARCHAR(150) NOT NULL,
    courier_company VARCHAR(100) NOT NULL,
    description TEXT,
    received_by VARCHAR(150),
    delivered_by VARCHAR(150),
    delivered_to VARCHAR(150),
    received_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    delivered_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) CHECK (status IN ('Pendiente', 'Entregado')) DEFAULT 'Pendiente'
);

-- 6. RESERVAS Y ZONAS COMUNES
CREATE TABLE IF NOT EXISTS public.reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complex_id UUID REFERENCES public.complexes(id) ON DELETE CASCADE NOT NULL,
    facility_name VARCHAR(100) NOT NULL, -- 'Salón Social', 'Terraza BBQ 1', 'Terraza BBQ 2'
    resident_name VARCHAR(150) NOT NULL,
    apartment_unit VARCHAR(100) NOT NULL,
    event_date DATE NOT NULL,
    time_slot VARCHAR(50) NOT NULL,
    fee_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    status VARCHAR(20) CHECK (status IN ('Pendiente', 'Aprobada', 'Rechazada')) DEFAULT 'Pendiente',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. SOLICITUDES DE TRASTEO (MUDANZAS)
CREATE TABLE IF NOT EXISTS public.moving_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complex_id UUID REFERENCES public.complexes(id) ON DELETE CASCADE NOT NULL,
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

-- 8. INFRACCIONES
CREATE TABLE IF NOT EXISTS public.infractions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complex_id UUID REFERENCES public.complexes(id) ON DELETE CASCADE NOT NULL,
    apartment_unit VARCHAR(100) NOT NULL,
    resident_name VARCHAR(150),
    reported_by VARCHAR(150) NOT NULL, -- Vigilante o Admin
    infraction_type VARCHAR(100) NOT NULL, -- Ruido excesivo, Mal parqueo, Mascotas sin correa, etc.
    description TEXT NOT NULL,
    evidence_url TEXT,
    status VARCHAR(30) CHECK (status IN ('Pendiente', 'Multado', 'Llamado de atención', 'Desestimado')) DEFAULT 'Pendiente',
    sanction_amount NUMERIC(10, 2) DEFAULT 0,
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. COMUNICADOS Y ANUNCIOS
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complex_id UUID REFERENCES public.complexes(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) CHECK (category IN ('General', 'Mantenimiento', 'Asamblea', 'Urgente')) DEFAULT 'General',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_expired BOOLEAN DEFAULT FALSE
);

-- 10. NOTIFICACIONES DEL SISTEMA (SUPER ADMIN -> ADMINS)
CREATE TABLE IF NOT EXISTS public.system_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'Actualización',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
