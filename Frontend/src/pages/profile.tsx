import { useState, useEffect } from 'react';
import { useCurrentUser, useUpdateProfile, useChangePassword, useDeleteAccount } from '../hooks/useAuth';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import { useToast } from '../hooks/useToast';
import Loader from '../components/ui/Loader';
import { getReports } from '../services/reports.service';
import type { Report } from '../services/reports.service';
import { useRouter } from 'next/router';

type TabType = 'profile' | 'password' | 'reports' | 'account';

function ProfilePageContent() {
  const router = useRouter();
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();
  const deleteAccountMutation = useDeleteAccount();
  const { success, error: toastError } = useToast();

  const [activeTab, setActiveTab] = useState<TabType>('profile');

  // Estados para el perfil
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    avatar: '',
  });
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Estados para cambio de contraseña
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [changingPassword, setChangingPassword] = useState(false);

  // Estados para borrar cuenta
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const [reports, setReports] = useState<Report[]>([]);
  const [loadingReports, setLoadingReports] = useState(false);

  // Cargar datos del usuario
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        avatar: user.avatar || '',
      });
      if (activeTab === 'reports') {
        loadReports();
      }
    }
  }, [user, activeTab]);

  const loadReports = async () => {
    setLoadingReports(true);
    try {
      const data = await getReports();
      setReports(data);
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoadingReports(false);
    }
  };

  const handleProfileChange = (field: 'name' | 'email' | 'avatar', value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
    if (profileErrors[field]) {
      setProfileErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateProfile = (): boolean => {
    const errors: Record<string, string> = {};

    if (!profileData.name.trim()) {
      errors.name = 'El nombre es requerido';
    } else if (profileData.name.trim().length < 2) {
      errors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!profileData.email.trim()) {
      errors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      errors.email = 'El email no es válido';
    }

    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateProfile()) return;

    setUpdatingProfile(true);
    try {
      await updateProfileMutation.mutateAsync({
        name: profileData.name.trim(),
        email: profileData.email.trim(),
        avatar: profileData.avatar.trim() || undefined,
      });
      success('Perfil actualizado exitosamente');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toastError(error.response?.data?.message || 'Error al actualizar el perfil');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handlePasswordChange = (field: 'currentPassword' | 'newPassword' | 'confirmPassword', value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
    if (passwordErrors[field]) {
      setPasswordErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validatePassword = (): boolean => {
    const errors: Record<string, string> = {};

    if (!passwordData.currentPassword) {
      errors.currentPassword = 'La contraseña actual es requerida';
    }

    if (!passwordData.newPassword) {
      errors.newPassword = 'La nueva contraseña es requerida';
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!passwordData.confirmPassword) {
      errors.confirmPassword = 'Confirma tu nueva contraseña';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword()) return;

    setChangingPassword(true);
    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      success('Contraseña actualizada exitosamente');
      // Limpiar formulario
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      console.error('Error changing password:', error);
      toastError(error.response?.data?.message || 'Error al cambiar la contraseña');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    if (deleteConfirmText !== 'ELIMINAR') {
      toastError('Debes escribir "ELIMINAR" para confirmar');
      return;
    }

    if (!deletePassword) {
      toastError('Debes ingresar tu contraseña para eliminar la cuenta');
      return;
    }

    try {
      await deleteAccountMutation.mutateAsync(deletePassword);
      success('Tu cuenta ha sido eliminada exitosamente');
      // El hook ya redirige al login
    } catch (error: any) {
      console.error('Error deleting account:', error);
      toastError(error.response?.data?.message || 'Error al eliminar la cuenta');
    }
  };

  if (userLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader text="Cargando perfil..." />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const tabs = [
    { id: 'profile' as TabType, label: 'Mi Perfil', icon: '👤' },
    { id: 'password' as TabType, label: 'Contraseña', icon: '🔒' },
    { id: 'reports' as TabType, label: 'Mis Reportes', icon: '📋' },
    { id: 'account' as TabType, label: 'Configuración', icon: '⚙️' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">Dashboard de Usuario</h1>
        <p className="text-gray-600 dark:text-gray-400">Gestiona tu cuenta y preferencias</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id === 'reports') {
                  loadReports();
                }
              }}
              className={`
                px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap
                ${
                  activeTab === tab.id
                    ? 'border-b-2 border-red-600 text-red-600 dark:text-red-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }
              `}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        {/* Tab: Mi Perfil */}
        {activeTab === 'profile' && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Información Personal</h2>

            {/* Avatar */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                {profileData.avatar ? (
                  <img
                    src={profileData.avatar}
                    alt={user.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-red-500"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white text-4xl font-bold border-4 border-red-500">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <Input
                label="URL de Foto de Perfil"
                type="text"
                placeholder="https://ejemplo.com/foto.jpg"
                value={profileData.avatar}
                onChange={(e) => handleProfileChange('avatar', e.target.value)}
                error={profileErrors.avatar}
                className="mt-4 max-w-md"
              />
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">
              <Input
                label="Nombre completo"
                type="text"
                placeholder="Juan Pérez"
                value={profileData.name}
                onChange={(e) => handleProfileChange('name', e.target.value)}
                error={profileErrors.name}
                required
              />

              <Input
                label="Email"
                type="email"
                placeholder="tu@email.com"
                value={profileData.email}
                onChange={(e) => handleProfileChange('email', e.target.value)}
                error={profileErrors.email}
                required
              />

              <Button
                type="submit"
                className="w-full"
                disabled={updatingProfile || updateProfileMutation.isPending}
              >
                {updatingProfile || updateProfileMutation.isPending ? 'Actualizando...' : 'Actualizar Perfil'}
              </Button>
            </form>
          </div>
        )}

        {/* Tab: Cambiar Contraseña */}
        {activeTab === 'password' && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Cambiar Contraseña</h2>

            <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
              <Input
                label="Contraseña Actual"
                type="password"
                placeholder="••••••••"
                value={passwordData.currentPassword}
                onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                error={passwordErrors.currentPassword}
                required
                autoComplete="current-password"
              />

              <Input
                label="Nueva Contraseña"
                type="password"
                placeholder="••••••••"
                value={passwordData.newPassword}
                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                error={passwordErrors.newPassword}
                required
                autoComplete="new-password"
              />

              <Input
                label="Confirmar Nueva Contraseña"
                type="password"
                placeholder="••••••••"
                value={passwordData.confirmPassword}
                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                error={passwordErrors.confirmPassword}
                required
                autoComplete="new-password"
              />

              <Button
                type="submit"
                variant="outline"
                className="w-full"
                disabled={changingPassword || changePasswordMutation.isPending}
              >
                {changingPassword || changePasswordMutation.isPending ? 'Cambiando...' : 'Cambiar Contraseña'}
              </Button>
            </form>
          </div>
        )}

        {/* Tab: Mis Reportes */}
        {activeTab === 'reports' && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Mis Reportes</h2>

            {loadingReports ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              </div>
            ) : reports.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">No tienes reportes registrados</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            Pedido #{report.order.id.slice(0, 8)}
                          </span>
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded ${
                              report.status === 'pending'
                                ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300'
                                : report.status === 'resolved'
                                ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300'
                                : report.status === 'rejected'
                                ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300'
                                : 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300'
                            }`}
                          >
                            {report.status === 'pending'
                              ? 'Pendiente'
                              : report.status === 'resolved'
                              ? 'Resuelto'
                              : report.status === 'rejected'
                              ? 'Rechazado'
                              : 'Revisado'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                          <span className="font-medium">Razón:</span> {report.reason}
                        </p>
                        {report.fee && (
                          <p className="text-sm text-red-600 dark:text-red-400 font-semibold mb-2">
                            Costo de cancelación: ${report.fee.toFixed(2)}
                          </p>
                        )}
                        {report.notes && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                            Nota: {report.notes}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(report.createdAt).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Restaurante: {report.order.restaurant.name}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Total del pedido: ${report.order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Configuración de Cuenta */}
        {activeTab === 'account' && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Configuración de Cuenta</h2>

            {/* Información de la cuenta */}
            <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Información de tu Cuenta</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Email:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Estado de verificación:</span>
                  <span className={`font-medium ${user.emailVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                    {user.emailVerified ? '✓ Verificado' : '⚠ No verificado'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Miembro desde:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {new Date(user.createdAt || Date.now()).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Zona de Peligro - Borrar Cuenta */}
            <div className="border-2 border-red-200 dark:border-red-900/50 rounded-lg p-6 bg-red-50 dark:bg-red-900/10">
              <h3 className="text-lg font-semibold text-red-900 dark:text-red-300 mb-2">⚠️ Zona de Peligro</h3>
              <p className="text-sm text-red-700 dark:text-red-400 mb-4">
                Una vez que elimines tu cuenta, no podrás recuperarla. Todos tus datos, pedidos, puntos y recompensas
                serán eliminados permanentemente.
              </p>

              {!showDeleteConfirm ? (
                <Button
                  variant="danger"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Eliminar Mi Cuenta
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-red-200 dark:border-red-900/50">
                    <p className="text-sm font-semibold text-red-900 mb-2">
                      Confirma que deseas eliminar tu cuenta:
                    </p>
                    <Input
                      label="Escribe 'ELIMINAR' para confirmar"
                      type="text"
                      placeholder="ELIMINAR"
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value.toUpperCase())}
                      className="mb-4"
                    />
                    <Input
                      label="Ingresa tu contraseña para confirmar"
                      type="password"
                      placeholder="••••••••"
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="danger"
                      onClick={handleDeleteAccount}
                      disabled={deleteAccountMutation.isPending || deleteConfirmText !== 'ELIMINAR' || !deletePassword}
                      className="flex-1"
                    >
                      {deleteAccountMutation.isPending ? 'Eliminando...' : 'Confirmar Eliminación'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeleteConfirmText('');
                        setDeletePassword('');
                      }}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfilePageContent />
    </ProtectedRoute>
  );
}
