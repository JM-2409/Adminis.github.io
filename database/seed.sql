-- Seed Initial Data for ParkControl Total

-- Insert Test Conjunto
INSERT INTO conjuntos (
    id,
    nombre,
    direccion,
    ciudad,
    nit,
    telefono,
    email_contacto,
    estado_suscripcion,
    plan,
    max_unidades,
    max_parqueaderos_visitantes
) VALUES (
    'a1b2c3d4-0000-0000-0000-000000000001',
    'Conjunto Prueba Bogota',
    'Calle 100 # 15-20',
    'Bogota',
    '900123456-7',
    '6015551234',
    'contacto@conjuntoprueba.com',
    'activa',
    'pro',
    100,
    20
) ON CONFLICT (id) DO NOTHING;

-- Insert default tariffs for test conjunto
INSERT INTO tariffs (
    conjunto_id,
    carro_hora,
    moto_hora,
    carro_dia,
    moto_dia
) VALUES (
    'a1b2c3d4-0000-0000-0000-000000000001',
    5000,
    3000,
    35000,
    20000
) ON CONFLICT (conjunto_id) DO NOTHING;

-- Insert default visitor parking spots V-01 to V-20 for test conjunto
DO $$
DECLARE
    i INT;
    v_code VARCHAR(20);
BEGIN
    FOR i IN 1..20 LOOP
        v_code := 'V-' || LPAD(i::text, 2, '0');
        INSERT INTO visitor_parkings (conjunto_id, codigo, estado)
        VALUES ('a1b2c3d4-0000-0000-0000-000000000001', v_code, 'libre')
        ON CONFLICT (conjunto_id, codigo) DO NOTHING;
    END LOOP;
END $$;

-- Insert default common areas
INSERT INTO common_areas (conjunto_id, nombre, descripcion, valor_hora, capacidad_max) VALUES
('a1b2c3d4-0000-0000-0000-000000000001', 'Salon Social', 'Salon principal para eventos y reuniones', 50000, 80),
('a1b2c3d4-0000-0000-0000-000000000001', 'Zona BBQ', 'Area de parrilla y comedor exterior', 30000, 25),
('a1b2c3d4-0000-0000-0000-000000000001', 'Proyector Cine', 'Equipo de sonido y proyector HD', 15000, 15)
ON CONFLICT DO NOTHING;

-- Insert sample unit Torre A 101
INSERT INTO units (
    id,
    conjunto_id,
    torre_bloque,
    numero_unidad,
    propietario_nombre,
    propietario_telefono
) VALUES (
    'u1b2c3d4-0000-0000-0000-000000000101',
    'a1b2c3d4-0000-0000-0000-000000000001',
    'Torre A',
    '101',
    'Carlos Residente',
    '3001234567'
) ON CONFLICT (id) DO NOTHING;

-- Insert sample private parking P1-01 assigned to Torre A 101
INSERT INTO private_parkings (
    conjunto_id,
    codigo,
    torre_bloque,
    nivel,
    estado,
    unidad_id,
    placa,
    propietario_nombre
) VALUES (
    'a1b2c3d4-0000-0000-0000-000000000001',
    'P1-01',
    'Torre A',
    'Sotano 1',
    'ocupado',
    'u1b2c3d4-0000-0000-0000-000000000101',
    'ABC123',
    'Carlos Residente'
) ON CONFLICT (conjunto_id, codigo) DO NOTHING;

-- Insert Seed Users with real bcrypt hashed passwords:
-- admin.prueba / Admin123: $2b$10$.4PvbeWZLT6ktTB3hTlYNe0j5hiRtLRsDgn/8Y.6OwK/DzPHaaNrC
-- vigilante1 / Vig123: $2b$10$Qu8.5okHmIiqBnpR6zHwmOjeExoCUD.9cjsVrcx3cpD2Z0ISAnA2K
-- torreA101 / Resi123: $2b$10$h0AHLU5yU.zk.QKoAOAHwOlUiKXchD2xrnQmYeWjI.xTgM.eNQf8e
INSERT INTO app_users (
    id,
    username,
    password_hash,
    full_name,
    role,
    conjunto_id,
    unidad_id,
    activo
) VALUES
('u1111111-0000-0000-0000-000000000001', 'admin.prueba', '$2b$10$.4PvbeWZLT6ktTB3hTlYNe0j5hiRtLRsDgn/8Y.6OwK/DzPHaaNrC', 'Admin Prueba', 'administracion', 'a1b2c3d4-0000-0000-0000-000000000001', NULL, TRUE),
('u2222222-0000-0000-0000-000000000002', 'vigilante1', '$2b$10$Qu8.5okHmIiqBnpR6zHwmOjeExoCUD.9cjsVrcx3cpD2Z0ISAnA2K', 'Vigilante Principal', 'vigilante', 'a1b2c3d4-0000-0000-0000-000000000001', NULL, TRUE),
('u3333333-0000-0000-0000-000000000003', 'torreA101', '$2b$10$h0AHLU5yU.zk.QKoAOAHwOlUiKXchD2xrnQmYeWjI.xTgM.eNQf8e', 'Carlos Residente', 'residente', 'a1b2c3d4-0000-0000-0000-000000000001', 'u1b2c3d4-0000-0000-0000-000000000101', TRUE)
ON CONFLICT (username) DO NOTHING;
