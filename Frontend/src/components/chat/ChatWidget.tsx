import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  createChatSession,
  sendMessage,
  getSession,
  closeSession,
  submitSurvey,
  type ChatMessage,
  type ChatSession,
} from '../../services/chat.service';
import { useCurrentUser } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Button from '../ui/Button';
import SurveyModal from '../support/SurveyModal';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [pendingSurvey, setPendingSurvey] = useState<{ surveyId: string; sessionId: string } | null>(null);
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { data: user } = useCurrentUser();
  const { error: toastError, success } = useToast();

  // Scroll al final cuando hay nuevos mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Detectar si hay mensajes de encuesta cuando se cargan los mensajes
  useEffect(() => {
    if (messages.length > 0 && session) {
      const surveyMessage = messages.find(
        (msg) => msg.role === 'assistant' && msg.metadata?.type === 'survey'
      );
      if (surveyMessage && surveyMessage.metadata?.surveyId) {
        setPendingSurvey({
          surveyId: surveyMessage.metadata.surveyId,
          sessionId: session.id,
        });
      }
    }
  }, [messages, session]);

  // Inicializar sesión cuando se abre el chat
  useEffect(() => {
    if (isOpen && !session && user) {
      initializeSession();
    }
  }, [isOpen, session, user]);

  // Conectar WebSocket cuando hay sesión
  useEffect(() => {
    if (session && user && isOpen) {
      // Pequeño delay para asegurar que la sesión esté lista
      const timer = setTimeout(() => {
        connectWebSocket();
      }, 100);

      return () => {
        clearTimeout(timer);
      };
    }

    return () => {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
    };
  }, [session?.id, user, isOpen]);

  const initializeSession = async () => {
    setIsLoading(true);
    try {
      const newSession = await createChatSession();
      setSession(newSession);
      if (newSession.messages) {
        setMessages(newSession.messages);
      }
    } catch (error: any) {
      toastError(error.response?.data?.message || 'Error al inicializar el chat');
    } finally {
      setIsLoading(false);
    }
  };

  const connectWebSocket = () => {
    if (!user || !session) return;

    setIsConnecting(true);
    setIsConnected(false);
    const token = localStorage.getItem('token');

    if (!token) {
      console.warn('No hay token disponible para WebSocket');
      setIsConnecting(false);
      return;
    }

    const newSocket = io(`${API_BASE}/chat`, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      timeout: 20000,
    });

    newSocket.on('connect', () => {
      console.log('✅ Conectado al chat WebSocket');
      setIsConnecting(false);
      setIsConnected(true);
      // Unirse a la sesión
      if (session?.id) {
        newSocket.emit('join_session', session.id);
      }
    });

    newSocket.on('disconnect', (reason) => {
      console.log('❌ Desconectado del chat WebSocket:', reason);
      setIsConnecting(false);
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ Error de conexión WebSocket:', error);
      setIsConnecting(false);
      setIsConnected(false);
      // No mostrar error al usuario, el chat funcionará con HTTP REST
    });

    newSocket.on('reconnect', (attemptNumber) => {
      console.log(`🔄 Reconectado al chat después de ${attemptNumber} intentos`);
      setIsConnected(true);
      if (session?.id) {
        newSocket.emit('join_session', session.id);
      }
    });

    newSocket.on('reconnect_error', (error) => {
      console.error('❌ Error al reconectar:', error);
      setIsConnected(false);
    });

    newSocket.on('reconnect_failed', () => {
      console.error('❌ Falló la reconexión al chat');
      setIsConnected(false);
    });

    newSocket.on('new_message', (data: {
      userMessage: ChatMessage;
      assistantMessage: ChatMessage | null; // Puede ser null cuando está conectado con soporte humano
    }) => {
      setMessages((prev) => {
        // Remover mensajes temporales y duplicados
        const filtered = prev.filter((msg) => !msg.id.startsWith('temp-'));
        // Verificar si el mensaje ya existe para evitar duplicados
        const userExists = filtered.some((msg) => msg.id === data.userMessage.id);
        
        // Verificar si el mensaje del asistente existe (puede ser null cuando está conectado con soporte humano)
        const assistantMessage = data.assistantMessage;
        const assistantExists = assistantMessage 
          ? filtered.some((msg) => msg.id === assistantMessage.id) 
          : false;
        
        const newMessages: ChatMessage[] = [];
        if (!userExists) {
          newMessages.push(data.userMessage);
        }
        // Solo agregar mensaje del asistente si existe y no está duplicado
        if (assistantMessage && !assistantExists) {
          newMessages.push(assistantMessage);
        }
        
        return [...filtered, ...newMessages];
      });
      setIsLoading(false);
    });

    // Escuchar mensajes de soporte humano
    newSocket.on('support_message', (data: { message: ChatMessage; fromSupport: boolean }) => {
      setMessages((prev) => {
        // Remover mensajes temporales
        const filtered = prev.filter((msg) => !msg.id.startsWith('temp-'));
        // Verificar si el mensaje ya existe
        const exists = filtered.some((msg) => msg.id === data.message.id);

        if (!exists) {
          return [...filtered, data.message];
        }
        return filtered;
      });
    });

    // Escuchar cuando hay una encuesta disponible
    newSocket.on('survey_available', (data: {
      sessionId: string;
      surveyId: string;
      message: ChatMessage;
    }) => {
      console.log('[ChatWidget] Encuesta disponible:', data);
      setPendingSurvey({ surveyId: data.surveyId, sessionId: data.sessionId });
      // Agregar el mensaje de la encuesta a los mensajes
      setMessages((prev) => {
        const exists = prev.some((msg) => msg.id === data.message.id);
        if (exists) return prev;
        return [...prev, data.message];
      });
      // Mostrar el modal de encuesta después de un pequeño delay
      setTimeout(() => {
        setShowSurveyModal(true);
      }, 500);
    });

    // Escuchar cuando el caso es resuelto
    newSocket.on('case_resolved', (data: {
      sessionId: string;
      message: string;
    }) => {
      console.log('[ChatWidget] Caso resuelto:', data);
      success(data.message);
      // Recargar la sesión para actualizar el estado
      if (session) {
        getSession(session.id).then((updatedSession) => {
          setSession(updatedSession);
        });
      }
    });

    setSocket(newSocket);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !session) return;

    const userMessageText = inputValue.trim();
    setInputValue('');
    setIsLoading(true);

    // Agregar mensaje del usuario inmediatamente (optimistic update)
    const tempUserMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      sessionId: session.id,
      role: 'user',
      content: userMessageText,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMessage]);

    try {
      if (socket && isConnected && socket.connected) {
        // Usar WebSocket si está disponible y conectado
        socket.emit('send_message', {
          content: userMessageText,
          sessionId: session.id,
        });
        // El mensaje temporal se mantendrá hasta que llegue la respuesta por WebSocket
        // La respuesta por WebSocket reemplazará el mensaje temporal
      } else {
        // Fallback a HTTP REST (siempre funciona)
        const response = await sendMessage({
          content: userMessageText,
          sessionId: session.id,
        });
        setMessages((prev) => {
          // Remover mensaje temporal y verificar duplicados
          const filtered = prev.filter((msg) => msg.id !== tempUserMessage.id);
          const userExists = filtered.some((msg) => msg.id === response.userMessage.id);
          
          // Verificar si el mensaje del asistente existe (puede ser null cuando está conectado con soporte humano)
          const assistantMessage = response.assistantMessage;
          const assistantExists = assistantMessage 
            ? filtered.some((msg) => msg.id === assistantMessage.id) 
            : false;
          
          const newMessages: ChatMessage[] = [];
          if (!userExists) {
            newMessages.push(response.userMessage);
          }
          // Solo agregar mensaje del asistente si existe y no está duplicado
          if (assistantMessage && !assistantExists) {
            newMessages.push(assistantMessage);
          }
          
          return [...filtered, ...newMessages];
        });
      }
    } catch (error: any) {
      toastError(error.response?.data?.message || 'Error al enviar mensaje');
      // Remover mensaje temporal en caso de error
      setMessages((prev) => prev.filter((msg) => msg.id !== tempUserMessage.id));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = async () => {
    if (session) {
      try {
        await closeSession(session.id);
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
      }
    }
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
    setIsOpen(false);
    setSession(null);
    setMessages([]);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleOptionClick = async (optionLabel: string) => {
    if (!session) return;

    setIsLoading(true);

    // Agregar mensaje del usuario inmediatamente
    const tempUserMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      sessionId: session.id,
      role: 'user',
      content: optionLabel,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMessage]);

    try {
      if (socket && isConnected && socket.connected) {
        socket.emit('send_message', {
          content: optionLabel,
          sessionId: session.id,
        });
      } else {
        const response = await sendMessage({
          content: optionLabel,
          sessionId: session.id,
        });
        setMessages((prev) => {
          const filtered = prev.filter((msg) => msg.id !== tempUserMessage.id);
          const userExists = filtered.some((msg) => msg.id === response.userMessage.id);
          
          // Verificar si el mensaje del asistente existe (puede ser null cuando está conectado con soporte humano)
          const assistantMessage = response.assistantMessage;
          const assistantExists = assistantMessage 
            ? filtered.some((msg) => msg.id === assistantMessage.id) 
            : false;
          
          const newMessages: ChatMessage[] = [];
          if (!userExists) {
            newMessages.push(response.userMessage);
          }
          // Solo agregar mensaje del asistente si existe y no está duplicado
          if (assistantMessage && !assistantExists) {
            newMessages.push(assistantMessage);
          }
          
          return [...filtered, ...newMessages];
        });
      }
    } catch (error: any) {
      toastError(error.response?.data?.message || 'Error al enviar mensaje');
      setMessages((prev) => prev.filter((msg) => msg.id !== tempUserMessage.id));
    } finally {
      setIsLoading(false);
    }
  };

  const handleEscalateToHuman = async () => {
    if (!session) return;

    setIsLoading(true);

    // Mensaje específico que el backend detectará
    const supportRequestMessage = 'Quiero conectar con soporte humano';

    // Agregar mensaje del usuario inmediatamente
    const tempUserMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      sessionId: session.id,
      role: 'user',
      content: supportRequestMessage,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMessage]);

    try {
      if (socket && isConnected && socket.connected) {
        socket.emit('send_message', {
          content: supportRequestMessage,
          sessionId: session.id,
        });
      } else {
        const response = await sendMessage({
          content: supportRequestMessage,
          sessionId: session.id,
        });
        setMessages((prev) => {
          const filtered = prev.filter((msg) => msg.id !== tempUserMessage.id);
          const userExists = filtered.some((msg) => msg.id === response.userMessage.id);
          
          // Verificar si el mensaje del asistente existe (puede ser null cuando está conectado con soporte humano)
          const assistantMessage = response.assistantMessage;
          const assistantExists = assistantMessage 
            ? filtered.some((msg) => msg.id === assistantMessage.id) 
            : false;
          
          const newMessages: ChatMessage[] = [];
          if (!userExists) {
            newMessages.push(response.userMessage);
          }
          // Solo agregar mensaje del asistente si existe y no está duplicado
          if (assistantMessage && !assistantExists) {
            newMessages.push(assistantMessage);
          }
          
          return [...filtered, ...newMessages];
        });
      }
    } catch (error: any) {
      toastError(error.response?.data?.message || 'Error al conectar con soporte');
      setMessages((prev) => prev.filter((msg) => msg.id !== tempUserMessage.id));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-white rounded-full p-5 shadow-glow-lg hover:shadow-glow-xl hover:scale-110 transition-all duration-300 z-[100] group"
        aria-label="Abrir chat de soporte"
      >
        <svg
          className="w-7 h-7 transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </button>

      {/* Panel de chat */}
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-end justify-end pointer-events-none">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm pointer-events-auto" onClick={handleClose} />
          <div className="relative w-full max-w-md h-full max-h-[600px] bg-white dark:bg-gray-800 rounded-t-2xl shadow-2xl flex flex-col pointer-events-auto transform transition-all duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Soporte ProntoClick</h3>
                  <p className="text-xs text-blue-100 flex items-center gap-1">
                    {isConnecting ? (
                      <>
                        <span className="inline-block w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                        Conectando...
                      </>
                    ) : isConnected ? (
                      <>
                        <span className="inline-block w-2 h-2 bg-green-400 rounded-full"></span>
                        En línea
                      </>
                    ) : (
                      <>
                        <span className="inline-block w-2 h-2 bg-gray-400 rounded-full"></span>
                        Desconectado (usando HTTP)
                      </>
                    )}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Cerrar chat"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {isLoading && messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-gray-500 dark:text-gray-400">Inicializando chat...</p>
                  </div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500 dark:text-gray-400 text-center">
                    ¡Hola! ¿En qué puedo ayudarte?
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className="space-y-2">
                    <div
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {new Date(message.createdAt).toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                    {/* Mostrar botones si hay opciones en metadata */}
                    {message.role === 'assistant' && message.metadata?.type === 'menu' && message.metadata?.options && (
                      <div className="flex flex-wrap gap-2 justify-start">
                        {message.metadata.options.map((option: any) => (
                          <button
                            key={option.id}
                            onClick={() => handleOptionClick(option.label)}
                            className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors border border-blue-200 dark:border-blue-800"
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}
                    {/* Mostrar indicador de conexión con soporte */}
                    {message.role === 'assistant' && message.metadata?.connectingToSupport && (
                      <div className="flex justify-start mt-2">
                        <div className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm font-medium border border-green-200 dark:border-green-800 flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          Conectando con soporte humano...
                        </div>
                      </div>
                    )}
                    {/* Mostrar botón de escalar a soporte humano si está disponible (solo si no está conectando) */}
                    {message.role === 'assistant' && message.metadata?.canEscalate && !message.metadata?.connectingToSupport && (
                      <div className="flex justify-start">
                        <button
                          onClick={() => handleEscalateToHuman()}
                          className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors border border-red-200 dark:border-red-800 flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                          </svg>
                          Conectar con soporte humano
                        </button>
                      </div>
                    )}
                    {/* Mostrar encuesta si el mensaje es de tipo survey */}
                    {message.role === 'assistant' && message.metadata?.type === 'survey' && (
                      <div className="flex justify-start mt-2">
                        <div className="px-4 py-3 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-lg max-w-md">
                          <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2 flex items-center gap-2">
                            <span>📋</span>
                            Encuesta de Satisfacción
                          </p>
                          <p className="text-xs text-yellow-700 dark:text-yellow-300 mb-3">
                            Por favor, completa nuestra encuesta para ayudarnos a mejorar
                          </p>
                          <button
                            onClick={() => {
                              if (message.metadata?.surveyId) {
                                setPendingSurvey({ 
                                  surveyId: message.metadata.surveyId, 
                                  sessionId: session?.id || '' 
                                });
                                setShowSurveyModal(true);
                              }
                            }}
                            className="w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm font-medium transition-colors shadow-md hover:shadow-lg"
                          >
                            Completar Encuesta
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
              {isLoading && messages.length > 0 && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe tu mensaje..."
                  disabled={isLoading || !session}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading || !session}
                  size="md"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Encuesta para el Usuario */}
      {pendingSurvey && (
        <SurveyModal
          isOpen={showSurveyModal}
          onClose={() => setShowSurveyModal(false)}
          onSubmit={async (rating, comment) => {
            if (!rating) return;
            try {
              await submitSurvey(pendingSurvey.sessionId, rating, comment);
              success('¡Gracias por completar la encuesta! Tu caso ha sido marcado como resuelto.');
              setPendingSurvey(null);
              setShowSurveyModal(false);
              // Recargar la sesión para actualizar el estado
              if (session) {
                const updatedSession = await getSession(session.id);
                setSession(updatedSession);
              }
            } catch (error: any) {
              toastError(error.response?.data?.message || 'Error al enviar la encuesta');
            }
          }}
          isSupportMode={false}
        />
      )}
    </>
  );
}

