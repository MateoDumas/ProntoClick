import { useEffect, useState } from 'react';
import { referralService } from '../../services/referral.service';
import { useToast } from '../../hooks/useToast';
import { useCurrentUser } from '../../hooks/useAuth';

export default function ReferralCard() {
  const { data: user } = useCurrentUser();
  const { success } = useToast();
  const [code, setCode] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadCode();
    }
  }, [user]);

  const loadCode = async () => {
    try {
      const data = await referralService.getCode();
      setCode(data.code);
    } catch (error) {
      console.error('Error loading referral code:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!code) return;
    
    navigator.clipboard.writeText(code);
    setCopied(true);
    success('Código copiado al portapapeles');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (!code) return;

    const shareText = `¡Únete a ProntoClick usando mi código de referido ${code} y obtén puntos de bienvenida! 🎁`;
    const shareUrl = `${window.location.origin}/register?ref=${code}`;

    if (navigator.share) {
      navigator.share({
        title: 'Invita a tus amigos a ProntoClick',
        text: shareText,
        url: shareUrl,
      }).catch(() => {
        // Si el usuario cancela, copiar al portapapeles
        navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        success('Enlace copiado al portapapeles');
      });
    } else {
      // Fallback: copiar al portapapeles
      navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      success('Enlace copiado al portapapeles');
    }
  };

  if (!user || loading) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
          <span className="text-2xl">🎁</span>
        </div>
        <div>
          <h3 className="text-xl font-bold">Invita a tus amigos</h3>
          <p className="text-purple-100 text-sm">Gana puntos por cada amigo que se registre</p>
        </div>
      </div>

      <div className="bg-white/10 rounded-lg p-4 mb-4">
        <p className="text-sm text-purple-100 mb-2">Tu código de referido:</p>
        <div className="flex items-center gap-2">
          <code className="flex-1 bg-white/20 px-4 py-2 rounded-lg font-mono text-lg font-bold text-center">
            {code}
          </code>
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            title="Copiar código"
          >
            {copied ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <button
        onClick={handleShare}
        className="w-full px-6 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
      >
        Compartir código
      </button>

      <p className="text-xs text-purple-100 mt-4 text-center">
        Gana 100 puntos cuando tu amigo haga su primer pedido
      </p>
    </div>
  );
}

