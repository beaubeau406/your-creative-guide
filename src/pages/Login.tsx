import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Lock, ArrowRight, Loader2, Dumbbell } from 'lucide-react';

const Login = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setError('');
    const result = await login(code.trim());
    setLoading(false);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Code invalide');
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left panel - decorative */}
      <div className="hidden lg:flex lg:w-1/2 grad-blue flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white" />
          <div className="absolute bottom-20 right-10 w-48 h-48 rounded-full bg-white" />
          <div className="absolute top-1/2 left-1/3 w-20 h-20 rounded-full bg-white" />
        </div>
        <div className="relative z-10 text-center text-white">
          <div className="w-20 h-20 rounded-3xl bg-white/20 flex items-center justify-center mx-auto mb-6">
            <Dumbbell className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-heading mb-3">Coach Sportif</h2>
          <p className="text-blue-100 text-lg max-w-xs">Votre plateforme de suivi personnalisé pour atteindre vos objectifs</p>
          <div className="mt-10 space-y-3 text-left">
            {['📏 Suivi de vos mesures', '🔥 Plans nutritionnels adaptés', '💪 Programmes d\'entraînement', '📚 Ressources exclusives'].map(f => (
              <div key={f} className="flex items-center gap-3 text-blue-100 text-sm">
                <div className="w-2 h-2 rounded-full bg-white flex-shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - login form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl grad-blue flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-2xl font-heading text-white">CS</span>
            </div>
            <h1 className="text-3xl font-heading text-foreground">Mon Espace Coach</h1>
            <p className="text-muted-foreground mt-2 text-sm">Entrez votre code d'accès personnel</p>
          </div>

          <form onSubmit={handleSubmit} className="card-base p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Code d'accès</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Votre code d'accès"
                  className="w-full border border-border rounded-xl py-3 pl-10 pr-4 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                  autoFocus
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !code.trim()}
              className="w-full grad-blue text-white font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 shadow-sm"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Accéder à mon espace <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <p className="text-center text-muted-foreground text-xs mt-4">
            Vous n'avez pas de code ? Contactez votre coach.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
