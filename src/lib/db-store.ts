// Store in-memory data as a fallback/sync layer for database state

export interface StoredUser {
  id: string;
  username: string;
  password_hash: string;
  full_name: string;
  role: 'super_admin' | 'administracion' | 'presidente' | 'vigilante' | 'residente';
  conjunto_id?: string | null;
  unidad_id?: string | null;
  activo: boolean;
  created_at: string;
}

export interface StoredConjunto {
  id: string;
  nombre: string;
  direccion: string;
  ciudad: string;
  nit: string;
  telefono: string;
  email_contacto: string;
  estado_suscripcion: 'activa' | 'suspendida' | 'vencida' | 'prueba';
  plan: 'basico' | 'pro' | 'enterprise';
  max_unidades: number;
  max_parqueaderos_visitantes: number;
  created_at: string;
}

// Global in-memory storage to survive API calls in process
const globalStore = globalThis as unknown as {
  storedUsers?: StoredUser[];
  storedConjuntos?: StoredConjunto[];
};

if (!globalStore.storedConjuntos) {
  globalStore.storedConjuntos = [
    {
      id: 'a1b2c3d4-0000-0000-0000-000000000001',
      nombre: 'Conjunto Prueba Bogota',
      direccion: 'Calle 100 # 15-20',
      ciudad: 'Bogota',
      nit: '900123456-7',
      telefono: '6015551234',
      email_contacto: 'contacto@conjuntoprueba.com',
      estado_suscripcion: 'activa',
      plan: 'pro',
      max_unidades: 100,
      max_parqueaderos_visitantes: 20,
      created_at: new Date().toISOString(),
    },
  ];
}

if (!globalStore.storedUsers) {
  globalStore.storedUsers = [];
}

export const dbStore = {
  getConjuntos: () => globalStore.storedConjuntos!,
  addConjunto: (conjunto: StoredConjunto) => {
    globalStore.storedConjuntos!.unshift(conjunto);
    return conjunto;
  },
  updateConjunto: (id: string, updates: Partial<StoredConjunto>) => {
    const conj = globalStore.storedConjuntos!.find((c) => c.id === id);
    if (conj) {
      Object.assign(conj, updates);
    }
    return conj;
  },
  getUsers: () => globalStore.storedUsers!,
  findUserByUsername: (username: string) =>
    globalStore.storedUsers!.find((u) => u.username.toLowerCase() === username.toLowerCase()),
  addUser: (user: StoredUser) => {
    globalStore.storedUsers!.unshift(user);
    return user;
  },
};
