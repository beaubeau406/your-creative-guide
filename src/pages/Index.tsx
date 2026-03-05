import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEleveData, useMesures } from '@/hooks/useAirtableData';
import { User, Ruler, Flame, Dumbbell, Salad, BookOpen, ArrowRight, TrendingDown, Target } from 'lucide-react';

const sections = [
  { path: '/dashboard/profil',         label: 'Profil & Objectifs',    desc: 'Consultez votre fiche élève et vos objectifs', icon: User,      grad: 'grad-yellow', light: '#FFFBEB', text: '#D97706' },
  { path: '/dashboard/mesures',        label: 'Mesures',               desc: 'Suivez l\'évolution de vos mesures corporelles', icon: Ruler,   grad: 'grad-green',  light: '#ECFDF5', text: '#059669' },
  { path: '/dashboard/nutrition',      label: 'Calculs Nutritionnels', desc: 'BMR, BCJ et macronutriments personnalisés',      icon: Flame,   grad: 'grad-red',    light: '#FEF2F2', text: '#DC2626' },
  { path: '/dashboard/entrainement',   label: 'Entraînements',         desc: 'Accédez à vos programmes d\'entraînement',       icon: Dumbbell, grad: 'grad-violet', light: '#F5F3FF', text: '#7C3AED' },
  { path: '/dashboard/plan-alimentaire', label: 'Plan Alimentaire',    desc: 'Suivez vos plans alimentaires personnalisés',    icon: Salad,   grad: 'grad-cyan',   light: '#ECFEFF', text: '#0891B2' },
  { path: '/dashboard/ebooks',         label: 'eBooks',                desc: 'Accédez à vos ressources exclusives',            icon: BookOpen, grad: 'grad-gold',   light: '#FFFBEB', text: '#D97706' },
];

const Dashboard = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const { data: eleve } = useEleveData();
  const { data: mesures } = useMesures();

  const firstName = session?.eleveName?.split(' ')[0] || 'Élève';
  const poidsInitial = eleve?.['Poids Initial (kg)'] || 0;
  const poidsCible = eleve?.['Poids Cible (kg)'] || 0;
  const poidsActuel = mesures && mesures.length > 0 ? mesures[0].Poids : poidsInitial;
  const poidsPerdu = poidsInitial > 0 ? (poidsInitial - poidsActuel).toFixed(1) : null;
  const progression = poidsInitial !== poidsCible && poidsInitial > 0
    ? Math.min(100, Math.max(0, ((poidsInitial - poidsActuel) / (poidsInitial - poidsCible)) * 100))
    : 0;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Welcome hero */}
      <div className="card-base p-6 grad-blue text-white rounded-2xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium mb-1">Bienvenue 👋</p>
            <h1 className="text-3xl font-heading">{session?.eleveName || firstName}</h1>
            <p className="text-blue-100 text-sm mt-1">Votre espace personnel pour suivre vos progrès</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
            <span className="text-2xl font-heading text-white">{firstName[0]}</span>
          </div>
        </div>

        {poidsInitial > 0 && (
          <div className="mt-5 bg-white/15 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-blue-100 text-xs">Progression vers l'objectif</span>
              <span className="text-white text-xs font-semibold">{progression.toFixed(0)}%</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all duration-700" style={{ width: `${progression}%` }} />
            </div>
            <div className="flex justify-between mt-2 text-xs text-blue-100">
              <span>{poidsInitial} kg départ</span>
              {poidsPerdu && <span className="text-white font-semibold">−{poidsPerdu} kg perdus 🎉</span>}
              <span>{poidsCible} kg cible</span>
            </div>
          </div>
        )}
      </div>

      {/* Section cards */}
      <div>
        <h2 className="text-lg font-heading text-foreground mb-4">Mes espaces</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {sections.map((s) => (
            <button
              key={s.path}
              onClick={() => navigate(s.path)}
              className="card-base p-4 text-left group hover:scale-[1.02] transition-all duration-200 hover:shadow-lg"
            >
              <div className={`w-12 h-12 rounded-xl ${s.grad} flex items-center justify-center mb-3`}>
                <s.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-heading text-foreground text-sm leading-tight mb-1">{s.label}</h3>
              <p className="text-muted-foreground text-xs leading-snug mb-3 line-clamp-2">{s.desc}</p>
              <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: s.text }}>
                Accéder <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Quick stats */}
      {mesures && mesures.length > 0 && (
        <div className="card-base p-5">
          <h2 className="text-lg font-heading text-foreground mb-4">Résumé rapide</h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl p-3 text-center" style={{ background: '#EFF6FF' }}>
              <p className="text-2xl font-heading text-blue-600">{poidsActuel.toFixed(1)}</p>
              <p className="text-xs text-blue-500 mt-0.5">kg actuels</p>
            </div>
            <div className="rounded-xl p-3 text-center" style={{ background: '#ECFDF5' }}>
              <p className="text-2xl font-heading text-green-600">{poidsPerdu || '0'}</p>
              <p className="text-xs text-green-500 mt-0.5">kg perdus</p>
            </div>
            <div className="rounded-xl p-3 text-center" style={{ background: '#F5F3FF' }}>
              <p className="text-2xl font-heading text-violet-600">{mesures.length}</p>
              <p className="text-xs text-violet-500 mt-0.5">mesures</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
