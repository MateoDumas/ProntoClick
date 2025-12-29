import { useState, useEffect, useRef } from 'react';
import { getChatHistory, sendSupportMessage, type ChatHistory } from '../../services/support.service';
import { createSurvey } from '../../services/support.service';
import { useToast } from '../../hooks/useToast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Button from '../ui/Button';
import Input from '../ui/Input';
import SurveyModal from './SurveyModal';

interface ChatViewerProps {
  sessionId: string;
  onClose: () => void;
}

export default function ChatViewer({ sessionId, onClose }: ChatViewerProps) {
  const [chatHistory, setChatHistory] = useState<ChatHistory | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { success, error: toastError } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    loadChatHistory();
    // Refrescar cada 5 segundos para ver nuevos mensajes
    const interval = setInterval(loadChatHistory, 5000);
    return () => clearInterval(interval);
  }, [sessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory?.messages]);

  const loadChatHistory = async () => {
    try {
      const history = await getChatHistory(sessionId);
      setChatHistory(history);
    } catch (error: any) {
      toastError(error.response?.data?.message || 'Error al cargar el chat');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || sending) return;

    setSending(true);
    try {
      await sendSupportMessage(sessionId, message);
      setMessage('');
      await loadChatHistory();
      success('Mensaje enviado correctamente');
    } catch (error: any) {
      toastError(error.response?.data?.message || 'Error al enviar el mensaje');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!chatHistory) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No se pudo cargar el chat</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px] bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          {chatHistory.user.avatar && (
            <img
              src={chatHistory.user.avatar}
              alt={chatHistory.user.name}
              className="w-10 h-10 rounded-full"
            />
          )}
          <div>
            <p className="font-semibold">{chatHistory.user.name}</p>
            <p className="text-xs text-blue-100">{chatHistory.user.email}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.messages.map((msg) => {
          const isSupport = (msg.metadata as any)?.fromSupport === true;
          const isUser = msg.role === 'user';

          return (
            <div
              key={msg.id}
              className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  isUser
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white'
                    : isSupport
                    ? 'bg-gradient-to-r from-green-600 to-green-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                }`}
              >
                {isSupport && (
                  <p className="text-xs font-semibold mb-1 opacity-90">
                    👤 Soporte Humano
                  </p>
                )}
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {new Date(msg.createdAt).toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Actions */}
      <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <Button
          type="button"
          variant="secondary"
          onClick={() => setShowSurveyModal(true)}
          className="w-full"
          disabled={chatHistory?.status === 'resolved' || chatHistory?.status === 'closed'}
        >
          {chatHistory?.status === 'resolved' || chatHistory?.status === 'closed'
            ? '✅ Caso Resuelto'
            : '✅ Marcar como Resuelto y Enviar Encuesta'}
        </Button>
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          <Input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escribe tu mensaje..."
            className="flex-1"
            disabled={sending}
          />
          <Button type="submit" isLoading={sending} disabled={!message.trim()}>
            Enviar
          </Button>
        </div>
      </form>

      {/* Survey Modal - Solo para enviar la encuesta al usuario */}
      <SurveyModal
        isOpen={showSurveyModal}
        onClose={() => setShowSurveyModal(false)}
        onSubmit={async () => {
          try {
            await createSurvey(sessionId);
            success('Encuesta enviada al usuario. El caso se marcará como resuelto cuando el usuario la complete.');
            setShowSurveyModal(false);
            queryClient.invalidateQueries({ queryKey: ['support', 'chats'] });
            queryClient.invalidateQueries({ queryKey: ['support', 'stats'] });
            loadChatHistory();
          } catch (error: any) {
            toastError(error.response?.data?.message || 'Error al enviar la encuesta');
          }
        }}
        userName={chatHistory?.user?.name}
        isSupportMode={true}
      />
    </div>
  );
}

