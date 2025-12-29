import { useState, useEffect } from 'react';
import SupportRoute from '../../components/auth/SupportRoute';
import {
  getDashboardStats,
  getActiveChats,
  getResolvedChats,
  getPendingReports,
  getOrdersWithReports,
  getSurveyStats,
  getAllSurveys,
  updateReportStatus,
  type DashboardStats,
  type ActiveChat,
  type PendingReport,
  type OrderWithReports,
  type SurveyStats,
  type SupportSurvey,
} from '../../services/support.service';
import Loader from '../../components/ui/Loader';
import { useToast } from '../../hooks/useToast';
import ChatViewer from '../../components/support/ChatViewer';
import Modal from '../../components/ui/Modal';

export default function SupportDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activeChats, setActiveChats] = useState<ActiveChat[]>([]);
  const [resolvedChats, setResolvedChats] = useState<ActiveChat[]>([]);
  const [pendingReports, setPendingReports] = useState<PendingReport[]>([]);
  const [ordersWithReports, setOrdersWithReports] = useState<OrderWithReports[]>([]);
  const [surveyStats, setSurveyStats] = useState<SurveyStats | null>(null);
  const [surveys, setSurveys] = useState<SupportSurvey[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'chats' | 'resolved' | 'reports' | 'orders' | 'surveys'>('overview');
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [updatingReports, setUpdatingReports] = useState<Set<string>>(new Set());
  const { error: toastError, success } = useToast();

  useEffect(() => {
    loadDashboardData();
    // Refrescar cada 30 segundos
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, chatsData, resolvedData, reportsData, ordersData, surveyStatsData, surveysData] = await Promise.all([
        getDashboardStats(),
        getActiveChats(),
        getResolvedChats(),
        getPendingReports(),
        getOrdersWithReports(),
        getSurveyStats(),
        getAllSurveys(),
      ]);

      console.log('[Dashboard] Chats activos:', chatsData.length);
      console.log('[Dashboard] Chats resueltos:', resolvedData.length);
      console.log('[Dashboard] Encuestas recibidas:', surveysData.length);

      setStats(statsData);
      setActiveChats(chatsData);
      setResolvedChats(resolvedData);
      setPendingReports(reportsData);
      setOrdersWithReports(ordersData);
      setSurveyStats(surveyStatsData);
      setSurveys(surveysData);
    } catch (error: any) {
      console.error('[Dashboard] Error:', error);
      toastError(error.response?.data?.message || 'Error al cargar datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !stats) {
    return (
      <SupportRoute>
        <div className="flex items-center justify-center min-h-screen">
          <Loader />
        </div>
      </SupportRoute>
    );
  }

  return (
    <SupportRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Dashboard de Soporte
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gestiona chats, reportes y pedidos con problemas
            </p>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Chats Activos</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {stats.totalActiveChats}
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Necesitan Soporte
                </div>
                <div className="text-2xl font-bold text-red-600">
                  {stats.chatsNeedingSupport}
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Reportes Pendientes
                </div>
                <div className="text-2xl font-bold text-yellow-600">
                  {stats.pendingReports}
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">En Revisión</div>
                <div className="text-2xl font-bold text-blue-600">
                  {stats.inProgressReports}
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Pedidos con Reportes
                </div>
                <div className="text-2xl font-bold text-purple-600">
                  {stats.totalOrdersWithReports}
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex -mb-px">
                {[
                  { id: 'overview', label: 'Resumen' },
                  { id: 'chats', label: `Chats Activos (${activeChats.length})` },
                  { id: 'resolved', label: `Resueltos (${resolvedChats.length})` },
                  { id: 'surveys', label: `Valoraciones (${surveys.length})` },
                  { id: 'reports', label: `Reportes (${pendingReports.length})` },
                  { id: 'orders', label: `Pedidos (${ordersWithReports.length})` },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-red-600 text-red-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Chats que Necesitan Atención</h3>
                    {activeChats.filter((c) => c.needsSupport).length === 0 ? (
                      <p className="text-gray-500">No hay chats que requieran atención urgente</p>
                    ) : (
                      <div className="space-y-2">
                        {activeChats
                          .filter((c) => c.needsSupport)
                          .slice(0, 5)
                          .map((chat) => (
                            <div
                              key={chat.id}
                              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                              onClick={() => setActiveTab('chats')}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">{chat.user.name}</p>
                                  <p className="text-sm text-gray-500">{chat.user.email}</p>
                                </div>
                                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                                  Urgente
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Reportes Recientes</h3>
                    {pendingReports.length === 0 ? (
                      <p className="text-gray-500">No hay reportes pendientes</p>
                    ) : (
                      <div className="space-y-2">
                        {pendingReports.slice(0, 5).map((report) => (
                          <div
                            key={report.id}
                            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">{report.user.name}</p>
                                <p className="text-sm text-gray-500">{report.reason}</p>
                              </div>
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                                {report.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'chats' && (
                <div className="space-y-4">
                  {activeChats.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No hay chats activos</p>
                  ) : (
                    activeChats.map((chat) => (
                      <div
                        key={chat.id}
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            {chat.user.avatar && (
                              <img
                                src={chat.user.avatar}
                                alt={chat.user.name}
                                className="w-10 h-10 rounded-full"
                              />
                            )}
                            <div>
                              <p className="font-medium">{chat.user.name}</p>
                              <p className="text-sm text-gray-500">{chat.user.email}</p>
                            </div>
                          </div>
                          {chat.needsSupport && (
                            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                              Necesita Soporte
                            </span>
                          )}
                        </div>
                        {chat.lastMessage && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            {chat.lastMessage.substring(0, 100)}...
                          </p>
                        )}
                        <button
                          onClick={() => setSelectedChat(chat.id)}
                          className="mt-3 text-sm text-blue-600 hover:text-blue-700"
                        >
                          Ver conversación →
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'resolved' && (
                <div className="space-y-4">
                  {resolvedChats.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No hay chats resueltos</p>
                  ) : (
                    resolvedChats.map((chat: any) => (
                      <div
                        key={chat.id}
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow bg-green-50 dark:bg-green-900/20"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            {chat.user.avatar && (
                              <img
                                src={chat.user.avatar}
                                alt={chat.user.name}
                                className="w-10 h-10 rounded-full"
                              />
                            )}
                            <div>
                              <p className="font-medium">{chat.user.name}</p>
                              <p className="text-sm text-gray-500">{chat.user.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {chat.hasSurvey && chat.surveyRating && (
                              <div className="flex items-center gap-1">
                                <span className="text-yellow-500">★</span>
                                <span className="text-sm font-medium">{chat.surveyRating}/5</span>
                              </div>
                            )}
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                              Resuelto
                            </span>
                          </div>
                        </div>
                        {chat.lastMessage && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            {chat.lastMessage.substring(0, 100)}...
                          </p>
                        )}
                        {chat.hasSurvey && chat.surveyComment && (
                          <div className="mt-2 p-2 bg-white dark:bg-gray-800 rounded text-sm">
                            <p className="text-gray-700 dark:text-gray-300">
                              <strong>Comentario:</strong> {chat.surveyComment}
                            </p>
                          </div>
                        )}
                        {chat.resolvedBy && (
                          <p className="text-xs text-gray-500 mt-2">
                            Resuelto por: {chat.resolvedBy.name}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          Resuelto: {new Date(chat.updatedAt).toLocaleString()}
                        </p>
                        <button
                          onClick={() => setSelectedChat(chat.id)}
                          className="mt-3 text-sm text-blue-600 hover:text-blue-700"
                        >
                          Ver conversación →
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'reports' && (
                <div className="space-y-4">
                  {pendingReports.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No hay reportes pendientes</p>
                  ) : (
                    pendingReports.map((report) => (
                      <div
                        key={report.id}
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium">{report.user.name}</p>
                            <p className="text-sm text-gray-500">{report.user.email}</p>
                          </div>
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                            {report.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <strong>Tipo:</strong> {report.type} | <strong>Razón:</strong>{' '}
                          {report.reason}
                        </p>
                        <p className="text-sm text-gray-500">
                          Pedido: {report.order.restaurant.name} - ${report.order.total}
                        </p>
                        <div className="mt-3 flex gap-2">
                          <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                            Revisar
                          </button>
                          <button className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300">
                            Ver Detalles
                          </button>
                          {(report.status === 'pending' || report.status === 'reviewed') && (
                            <button
                              onClick={async () => {
                                if (updatingReports.has(report.id)) return;
                                try {
                                  setUpdatingReports((prev) => new Set(prev).add(report.id));
                                  await updateReportStatus(report.id, 'resolved');
                                  success('Reporte marcado como resuelto');
                                  await loadDashboardData();
                                } catch (error: any) {
                                  toastError(error.response?.data?.message || 'Error al actualizar el reporte');
                                } finally {
                                  setUpdatingReports((prev) => {
                                    const newSet = new Set(prev);
                                    newSet.delete(report.id);
                                    return newSet;
                                  });
                                }
                              }}
                              disabled={updatingReports.has(report.id)}
                              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                            >
                              {updatingReports.has(report.id) ? (
                                <>
                                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  Procesando...
                                </>
                              ) : (
                                <>
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  Marcar como Resuelto
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'surveys' && (
                <div className="space-y-6">
                  {/* Estadísticas de Valoraciones */}
                  {surveyStats && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          Total de Valoraciones
                        </div>
                        <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                          {surveyStats.total}
                        </div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          Valoración Promedio
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-3xl font-bold text-yellow-600">
                            {surveyStats.averageRating.toFixed(1)}
                          </div>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg
                                key={star}
                                className={`w-5 h-5 ${
                                  star <= Math.round(surveyStats.averageRating)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300 dark:text-gray-600'
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          Distribución
                        </div>
                        <div className="space-y-1">
                          {[5, 4, 3, 2, 1].map((rating) => (
                            <div key={rating} className="flex items-center gap-2">
                              <span className="text-xs w-4">{rating}★</span>
                              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div
                                  className="bg-yellow-400 h-2 rounded-full"
                                  style={{
                                    width: `${
                                      surveyStats.total > 0
                                        ? ((surveyStats.ratingsDistribution[rating] || 0) / surveyStats.total) * 100
                                        : 0
                                    }%`,
                                  }}
                                />
                              </div>
                              <span className="text-xs text-gray-500 w-8 text-right">
                                {surveyStats.ratingsDistribution[rating] || 0}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Lista de Encuestas */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Valoraciones Recibidas</h3>
                    {surveys.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">
                        No hay valoraciones aún
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {surveys.map((survey) => (
                          <div
                            key={survey.id}
                            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                {survey.session.user.avatar && (
                                  <img
                                    src={survey.session.user.avatar}
                                    alt={survey.session.user.name}
                                    className="w-10 h-10 rounded-full"
                                  />
                                )}
                                <div>
                                  <p className="font-medium text-gray-900 dark:text-gray-100">
                                    {survey.session.user.name}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {survey.session.user.email}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <svg
                                      key={star}
                                      className={`w-5 h-5 ${
                                        star <= (survey.rating || 0)
                                          ? 'text-yellow-400 fill-current'
                                          : 'text-gray-300 dark:text-gray-600'
                                      }`}
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ))}
                                </div>
                                <span className="text-lg font-bold text-yellow-600">
                                  {survey.rating}/5
                                </span>
                              </div>
                            </div>
                            {survey.comment && (
                              <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                  <strong>Comentario:</strong> {survey.comment}
                                </p>
                              </div>
                            )}
                            <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                              <span>
                                Resuelto: {new Date(survey.resolvedAt || survey.createdAt).toLocaleString()}
                              </span>
                              <span>
                                Por: {survey.supportUser.name}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'surveys' && (
                <div className="space-y-6">
                  {/* Estadísticas de Valoraciones */}
                  {surveyStats && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          Total de Valoraciones
                        </div>
                        <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                          {surveyStats.total}
                        </div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          Valoración Promedio
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-3xl font-bold text-yellow-600">
                            {surveyStats.averageRating.toFixed(1)}
                          </div>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg
                                key={star}
                                className={`w-5 h-5 ${
                                  star <= Math.round(surveyStats.averageRating)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300 dark:text-gray-600'
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          Distribución
                        </div>
                        <div className="space-y-1">
                          {[5, 4, 3, 2, 1].map((rating) => (
                            <div key={rating} className="flex items-center gap-2">
                              <span className="text-xs w-4">{rating}★</span>
                              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div
                                  className="bg-yellow-400 h-2 rounded-full"
                                  style={{
                                    width: `${
                                      surveyStats.total > 0
                                        ? ((surveyStats.ratingsDistribution[rating] || 0) / surveyStats.total) * 100
                                        : 0
                                    }%`,
                                  }}
                                />
                              </div>
                              <span className="text-xs text-gray-500 w-8 text-right">
                                {surveyStats.ratingsDistribution[rating] || 0}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Lista de Encuestas */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Valoraciones Recibidas</h3>
                    {surveys.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">
                        No hay valoraciones aún
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {surveys.map((survey) => (
                          <div
                            key={survey.id}
                            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                {survey.session?.user?.avatar && (
                                  <img
                                    src={survey.session.user.avatar}
                                    alt={survey.session.user.name}
                                    className="w-10 h-10 rounded-full"
                                  />
                                )}
                                <div>
                                  <p className="font-medium text-gray-900 dark:text-gray-100">
                                    {survey.session?.user?.name || 'Usuario'}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {survey.session?.user?.email || ''}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <svg
                                      key={star}
                                      className={`w-5 h-5 ${
                                        star <= (survey.rating || 0)
                                          ? 'text-yellow-400 fill-current'
                                          : 'text-gray-300 dark:text-gray-600'
                                      }`}
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ))}
                                </div>
                                <span className="text-lg font-bold text-yellow-600">
                                  {survey.rating}/5
                                </span>
                              </div>
                            </div>
                            {survey.comment && (
                              <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                  <strong>Comentario:</strong> {survey.comment}
                                </p>
                              </div>
                            )}
                            <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                              <span>
                                Resuelto: {new Date(survey.resolvedAt || survey.createdAt).toLocaleString()}
                              </span>
                              <span>
                                Por: {survey.supportUser?.name || 'Soporte'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="space-y-4">
                  {ordersWithReports.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      No hay pedidos con reportes
                    </p>
                  ) : (
                    ordersWithReports.map((orderData) => (
                      <div
                        key={orderData.order.id}
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium">
                              Pedido #{orderData.order.id.slice(0, 8)} -{' '}
                              {orderData.order.restaurant.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {orderData.order.user.name} ({orderData.order.user.email})
                            </p>
                          </div>
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                            {orderData.reports.length} reporte(s)
                          </span>
                        </div>
                        <div className="mt-3 space-y-2">
                          {orderData.reports.map((report) => (
                            <div
                              key={report.id}
                              className="p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm"
                            >
                              <p>
                                <strong>{report.type}:</strong> {report.reason}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(report.createdAt).toLocaleString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal de Chat */}
        {selectedChat && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 p-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Chat con Usuario
                </h2>
                <button
                  onClick={() => setSelectedChat(null)}
                  className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <ChatViewer
                  sessionId={selectedChat}
                  onClose={() => setSelectedChat(null)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </SupportRoute>
  );
}

