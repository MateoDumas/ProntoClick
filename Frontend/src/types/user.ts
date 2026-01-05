export type User = {
  id: string;
  email: string;
  name: string;
  avatar?: string | null;
  role?: string;
  emailVerified?: boolean;
  twoFactorEnabled?: boolean;
  pendingPenalty?: number; // Penalización pendiente por cancelaciones (se aplica en el próximo pedido)
  phoneNumber?: string | null;
  securityQuestion?: string | null;
  securityAnswer?: string | null;
  createdAt?: string | Date;
};

