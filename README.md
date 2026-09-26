# ParkControl Total 🏢🚗

**ParkControl Total** es una solución integral y moderna de administración para propiedad horizontal multi-conjunto con soporte en tiempo real, seguridad avanzada con JWT, bcrypt y Supabase PostgreSQL con Row Level Security (RLS).

---

## 🚀 Características Principales

- 🏢 **Multi-Conjunto Residencial:** Control centralizado con aislamiento total de datos por `conjunto_id`.
- 🔐 **Autenticación y Seguridad Avanzada:**
  - Login único sin selector de rol. Redirección automática en middleware basada en JWT.
  - Expiración de token JWT: **2 horas** para Admins / Super Admins, **8 horas** para Vigilantes / Residentes.
  - Encriptación de contraseñas con `bcryptjs` (10 rounds).
  - Rate limiting en login (máximo 5 intentos por IP cada 15 minutos).
  - Protección de creación de `super_admin` con **Código Secreto 768**.
- 📊 **Dashboards por Rol:**
  - **Super Administrador (`/super-admin`):** Gestión global de conjuntos, planes, estados de suscripción y asignación de administradores.
  - **Administrador de Conjunto (`/admin`):** Grid interactivo de parqueaderos de visitantes (V-01 a V-20) con cobro automático por hora/día, control de parq. privados, control de acceso peatonal/vehicular, paquetería, reservas de zonas comunes (salón social, BBQ, proyector), gestión de multas, pagos y usuarios.
  - **Vigilante (`/vigilante`):** Panel de portería optimizado para registro rápido de ingresos/salidas y paquetería.
  - **Residente (`/residente`):** Vista "Mi Unidad" con parqueadero privado, estado de cuenta, paquetes y reservas.
  - **Presidente (`/presidente`):** Dashboard financiero y operativo de solo lectura.

---

## 🔑 Código Secreto de Super Admin y Creación de Usuarios

### 🛡️ Código Secreto: `768`
- En la página principal (`/`), en el formulario inferior **"Crear cuenta de prueba (Temporal)"**, al seleccionar el rol **Super Administrador**, el sistema exigirá el **Código Secreto de Super Admin**.
- Debe ingresar el valor `768` (configurado en `SUPER_ADMIN_SECRET_CODE` en `.env.local`).
- Una vez creado el usuario Super Admin, puede iniciar sesión en la página principal para gestionar conjuntos y administradores.

---

## 🧪 Datos de Prueba Iniciales (Seeding)

Para probar la plataforma inmediatamente tras ejecutar los scripts SQL (`database/schema.sql` y `database/seed.sql`):

1. **Crear el primer Super Admin:**
   - Ve a `http://localhost:3000`
   - En **Crear cuenta de prueba**, elige el rol **Super Administrador**
   - Código Secreto: `768`
   - Usuario: `superadmin` | Contraseña: `SuperAdmin123`

2. **Cuentas de Prueba Preconfiguradas para Conjunto Prueba Bogotá:**
   - **Administrador de Conjunto:**
     - **Usuario:** `admin.prueba`
     - **Contraseña:** `Admin123`
   - **Vigilante:**
     - **Usuario:** `vigilante1`
     - **Contraseña:** `Vig123`
   - **Residente (Torre A 101):**
     - **Usuario:** `torreA101`
     - **Contraseña:** `Resi123`

*(Nota: También puedes crear cualquiera de estas cuentas desde el área de registro temporal o directamente desde el panel de Super Admin / Admin de Conjunto).*

---

## ⚙️ Configuración del Entorno (.env / .env.local)

Asegúrese de contar con las siguientes variables en `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://jzrkhfpigdvuvueleclf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xOU1vfi_25TF0ZFimPJilg_l9k3VZV7
SUPABASE_SERVICE_ROLE_KEY=sb_publishable_xOU1vfi_25TF0ZFimPJilg_l9k3VZV7
SUPER_ADMIN_SECRET_CODE=768
JWT_SECRET=G/mzoiFvVyPLmd//UoAzP8/WF1XQU+TyuAjFhlWO6L8=
```

---

## 🛠️ Ejecución y Despliegue

### Local
```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### Despliegue en Vercel
1. Conecte este repositorio a Vercel.
2. Agregue las variables de entorno (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPER_ADMIN_SECRET_CODE`, `JWT_SECRET`).
3. Despliegue con un clic.
