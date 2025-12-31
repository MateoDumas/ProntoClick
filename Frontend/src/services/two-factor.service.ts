import { api } from './api';

export interface GenerateTwoFactorResponse {
  success: boolean;
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
}

export interface TwoFactorResponse {
  success: boolean;
  message: string;
}

export interface RegenerateBackupCodesResponse {
  success: boolean;
  backupCodes: string[];
  message: string;
}

export const generateTwoFactorSecret = async (): Promise<GenerateTwoFactorResponse> => {
  const { data } = await api.post<GenerateTwoFactorResponse>('/auth/two-factor/generate');
  return data;
};

export const verifyAndEnableTwoFactor = async (code: string): Promise<TwoFactorResponse> => {
  const { data } = await api.post<TwoFactorResponse>('/auth/two-factor/verify-and-enable', { code });
  return data;
};

export const disableTwoFactor = async (): Promise<TwoFactorResponse> => {
  const { data } = await api.post<TwoFactorResponse>('/auth/two-factor/disable');
  return data;
};

export const regenerateBackupCodes = async (): Promise<RegenerateBackupCodesResponse> => {
  const { data } = await api.post<RegenerateBackupCodesResponse>('/auth/two-factor/regenerate-backup-codes');
  return data;
};

