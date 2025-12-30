export type User = {
  id: string;
  email: string;
  name: string;
  avatar?: string | null;
  role?: string;
  emailVerified?: boolean;
  pendingPenalty?: number; // Penalización pendiente por cancelaciones (se aplica en el próximo pedido)
  createdAt?: string | Date;
};

