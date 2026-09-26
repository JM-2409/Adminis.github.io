-- Complete Database Schema for ParkControl Total (Multi-conjunto)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Conjuntos Table
CREATE TABLE IF NOT EXISTS conjuntos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(255) NOT NULL,
    direccion TEXT NOT NULL,
    ciudad VARCHAR(100) NOT NULL DEFAULT 'Bogota',
    nit VARCHAR(50),
    telefono VARCHAR(50),
    email_contacto VARCHAR(255),
    estado_suscripcion VARCHAR(20) NOT NULL DEFAULT 'activa' CHECK (estado_suscripcion IN ('activa', 'suspendida', 'vencida', 'prueba')),
    plan VARCHAR(20) NOT NULL DEFAULT 'basico' CHECK (plan IN ('basico', 'pro', 'enterprise')),
    fecha_inicio_suscripcion TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    fecha_fin_suscripcion TIMESTAMPTZ DEFAULT (CURRENT_TIMESTAMP + INTERVAL '1 year'),
    max_unidades INT NOT NULL DEFAULT 100,
    max_parqueaderos_visitantes INT NOT NULL DEFAULT 20,
    logo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. Units Table
CREATE TABLE IF NOT EXISTS units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conjunto_id UUID REFERENCES conjuntos(id) ON DELETE CASCADE,
    torre_bloque VARCHAR(50) NOT NULL,
    numero_unidad VARCHAR(50) NOT NULL,
    propietario_nombre VARCHAR(255),
    propietario_telefono VARCHAR(50),
    propietario_email VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(conjunto_id, torre_bloque, numero_unidad)
);

-- 3. App Users Table
CREATE TABLE IF NOT EXISTS app_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('super_admin', 'administracion', 'presidente', 'vigilante', 'residente')),
    conjunto_id UUID REFERENCES conjuntos(id) ON DELETE SET NULL,
    unidad_id UUID REFERENCES units(id) ON DELETE SET NULL,
    telefono VARCHAR(50),
    cedula VARCHAR(50),
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Private Parkings Table
CREATE TABLE IF NOT EXISTS private_parkings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conjunto_id UUID NOT NULL REFERENCES conjuntos(id) ON DELETE CASCADE,
    codigo VARCHAR(50) NOT NULL,
    torre_bloque VARCHAR(50),
    nivel VARCHAR(50),
    estado VARCHAR(20) NOT NULL DEFAULT 'libre' CHECK (estado IN ('libre', 'ocupado')),
    unidad_id UUID REFERENCES units(id) ON DELETE SET NULL,
    placa VARCHAR(20),
    propietario_nombre VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(conjunto_id, codigo)
);

-- 5. Visitor Parkings Table (Grid V-01 to V-20)
CREATE TABLE IF NOT EXISTS visitor_parkings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conjunto_id UUID NOT NULL REFERENCES conjuntos(id) ON DELETE CASCADE,
    codigo VARCHAR(20) NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'libre' CHECK (estado IN ('libre', 'ocupado')),
    placa VARCHAR(20),
    nombre_visitante VARCHAR(255),
    tipo_vehiculo VARCHAR(20) DEFAULT 'carro' CHECK (tipo_vehiculo IN ('carro', 'moto')),
    unidad_destino_id UUID REFERENCES units(id) ON DELETE SET NULL,
    unidad_destino_texto VARCHAR(100),
    hora_entrada TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(conjunto_id, codigo)
);

-- 6. Parking Tariffs Table
CREATE TABLE IF NOT EXISTS tariffs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conjunto_id UUID NOT NULL UNIQUE REFERENCES conjuntos(id) ON DELETE CASCADE,
    carro_hora NUMERIC(12, 2) NOT NULL DEFAULT 5000,
    moto_hora NUMERIC(12, 2) NOT NULL DEFAULT 3000,
    carro_dia NUMERIC(12, 2) NOT NULL DEFAULT 35000,
    moto_dia NUMERIC(12, 2) NOT NULL DEFAULT 20000,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. Access Control Logs Table
CREATE TABLE IF NOT EXISTS access_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conjunto_id UUID NOT NULL REFERENCES conjuntos(id) ON DELETE CASCADE,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('peatonal', 'vehicular')),
    cedula VARCHAR(50),
    nombre VARCHAR(255) NOT NULL,
    placa VARCHAR(20),
    unidad_destino VARCHAR(100) NOT NULL,
    motivo TEXT,
    hora_entrada TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    hora_salida TIMESTAMPTZ,
    estado VARCHAR(20) NOT NULL DEFAULT 'adentro' CHECK (estado IN ('adentro', 'afuera', 'pre_registro')),
    es_pre_registro BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 8. Packages Table
CREATE TABLE IF NOT EXISTS packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conjunto_id UUID NOT NULL REFERENCES conjuntos(id) ON DELETE CASCADE,
    unidad_destino_id UUID REFERENCES units(id) ON DELETE CASCADE,
    unidad_texto VARCHAR(100) NOT NULL,
    remitente VARCHAR(255),
    empresa_mensajeria VARCHAR(100),
    descripcion TEXT,
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'entregado')),
    fecha_recepcion TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    fecha_entrega TIMESTAMPTZ,
    recibido_por VARCHAR(255),
    entregado_a VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 9. Common Areas Table
CREATE TABLE IF NOT EXISTS common_areas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conjunto_id UUID NOT NULL REFERENCES conjuntos(id) ON DELETE CASCADE,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    valor_hora NUMERIC(12, 2) DEFAULT 0,
    capacidad_max INT,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 10. Common Area Reservations Table
CREATE TABLE IF NOT EXISTS reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conjunto_id UUID NOT NULL REFERENCES conjuntos(id) ON DELETE CASCADE,
    common_area_id UUID NOT NULL REFERENCES common_areas(id) ON DELETE CASCADE,
    unidad_id UUID REFERENCES units(id) ON DELETE CASCADE,
    solicitante_nombre VARCHAR(255) NOT NULL,
    fecha_reserva DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    valor NUMERIC(12, 2) NOT NULL DEFAULT 0,
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'confirmada', 'cancelada', 'pagada')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 11. Fines Table
CREATE TABLE IF NOT EXISTS fines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conjunto_id UUID NOT NULL REFERENCES conjuntos(id) ON DELETE CASCADE,
    tipo_objetivo VARCHAR(20) NOT NULL CHECK (tipo_objetivo IN ('unidad', 'visitante')),
    unidad_id UUID REFERENCES units(id) ON DELETE SET NULL,
    visitante_nombre VARCHAR(255),
    motivo TEXT NOT NULL,
    valor NUMERIC(12, 2) NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'pagada', 'anulada')),
    impuesto_por VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 12. Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conjunto_id UUID NOT NULL REFERENCES conjuntos(id) ON DELETE CASCADE,
    concepto VARCHAR(50) NOT NULL CHECK (concepto IN ('parqueadero_visitante', 'multa', 'salon_social', 'administracion', 'otro')),
    referencia_id UUID,
    valor NUMERIC(12, 2) NOT NULL,
    metodo VARCHAR(50) NOT NULL CHECK (metodo IN ('efectivo', 'nequi', 'bancolombia', 'transferencia')),
    registrado_por VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 13. Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conjunto_id UUID REFERENCES conjuntos(id) ON DELETE CASCADE,
    usuario VARCHAR(100) NOT NULL,
    accion VARCHAR(100) NOT NULL,
    detalle TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
