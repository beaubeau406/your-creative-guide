import { useEleveData, useMesures } from '@/hooks/useAirtableData';
import { Target, Activity, Heart, Calendar, Scale, TrendingDown, User } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const Profil = () => {
  const { data: eleve, isLoading: loadingEleve } = useEleveData();
  const { data: mesures, isLoading: loadingMesures } = useMesures();

  if (loadingEleve || loadingMesures) {
    return <div className="space-y-4"><Skeleton className="h-48 w-full rounded-2xl" /><Skeleton className="h-32 w-full rounded-2xl" /></div>;
  }
  if (!eleve) return <p className="text-muted-foreground text-center py-12">Impossible de charger le profil.</p>;

  const poidsInitial = eleve['Poids Initial'] || 0;
  const poidsCible = eleve['Poids Cible'] || 0;
  const poidsActuel = mesures && mesures.length > 0 ? mesures[0].Poids : poidsInitial;
  const progression = poidsInitial !== poidsCible
    ? Math.min(100, Math.max(0, ((poidsInitial - poidsActuel) / (poidsInitial - poidsCible)) * 100)) : 0;
  const poidsPerdu = poidsInitial - poidsActuel;
  const poidsRestant = poidsActuel - poidsCible;
  const age = eleve['Date de naissance']
    ? Math.floor((Date.now() - new Date(eleve['Date de naissance']).getTime()) / (365.25*24*60*60*1000)) : null;

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl grad-yellow flex items-center justify-center"><User className="w-5 h-5 text-white" /></div>
        <h1 className="text-3xl font-heading text-foreground">Profil & Objectifs</h1>
      </div>

      {/* Hero objectif */}
      <div className="card-base p-6" style={{ background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)' }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl grad-yellow flex items-center justify-center"><Target className="w-5 h-5 text-white" /></div>
          <div>
            <p className="text-yellow-700 text-xs font-medium">Objectif principal</p>
            <p className="text-yellow-900 font-bold text-lg">{eleve.Objectif || 'Non défini'}</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span className="text-yellow-700">{poidsInitial} kg</span>
            <span className="text-yellow-900 font-bold">{poidsActuel.toFixed(1)} kg actuel</span>
            <span className="text-green-600">{poidsCible} kg 🎯</span>
          </div>
          <div className="h-3 bg-yellow-200 rounded-full overflow-hidden">
            <div className="h-full grad-yellow rounded-full transition-all duration-700" style={{ width: `${progression}%` }} />
          </div>
          <div className="flex justify-between text-xs text-yellow-600">
            <span>Départ</span>
            <span className="font-semibold text-yellow-800">{progression.toFixed(0)}% accompli</span>
            <span>Cible</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-white rounded-xl p-3 text-center border border-yellow-200">
            <TrendingDown className="w-5 h-5 text-green-500 mx-auto mb-1" />
            <p className="text-green-600 font-bold text-lg">{poidsPerdu.toFixed(1)} kg</p>
            <p className="text-yellow-600 text-xs">Poids perdu</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center border border-yellow-200">
            <Scale className="w-5 h-5 text-yellow-500 mx-auto mb-1" />
            <p className="text-yellow-700 font-bold text-lg">{poidsRestant.toFixed(1)} kg</p>
            <p className="text-yellow-600 text-xs">Restant</p>
          </div>
        </div>
      </div>

      {/* Infos perso */}
      <div className="card-base p-6">
        <h2 className="text-xl font-heading text-foreground mb-4">Informations personnelles</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { icon: Heart, label: 'Sexe', value: eleve.Sexe, color: '#EC4899' },
            { icon: Calendar, label: 'Âge', value: age ? `${age} ans` : '-', color: '#3B82F6' },
            { icon: Activity, label: 'Taille', value: eleve['Taille (cm)'] ? `${eleve['Taille (cm)']} cm` : '-', color: '#10B981' },
            { icon: Activity, label: 'Activité', value: eleve["Niveau d'activité"], color: '#F59E0B' },
            { icon: Target, label: 'Repas/jour', value: eleve['Fréquence de Repas'], color: '#8B5CF6' },
            { icon: Target, label: 'Statut', value: eleve.Statut, color: '#06B6D4' },
          ].map((item, i) => (
            <div key={i} className="rounded-xl p-3 border border-border bg-muted/30">
              <div className="flex items-center gap-2 mb-1">
                <item.icon className="w-3.5 h-3.5" style={{ color: item.color }} />
                <p className="text-muted-foreground text-xs">{item.label}</p>
              </div>
              <p className="text-foreground font-semibold text-sm">{item.value || '-'}</p>
            </div>
          ))}
        </div>
      </div>

      {(eleve.Motivations || eleve['Antécédents Médicaux & Sportifs'] || eleve['Habitudes Alimentaires Spécifiques']) && (
        <div className="card-base p-6 space-y-4">
          <h2 className="text-xl font-heading text-foreground">Motivations & Notes</h2>
          {eleve['Antécédents sportifs'] && (
            <div className="rounded-xl p-3 bg-blue-50 border border-blue-100">
              <p className="text-blue-500 text-xs font-medium mb-1">Antécédents sportifs</p>
              <p className="text-blue-900 text-sm">{eleve['Antécédents sportifs']}</p>
            </div>
          )}
          {eleve.Motivations && (
            <div className="rounded-xl p-3 bg-green-50 border border-green-100">
              <p className="text-green-500 text-xs font-medium mb-1">Motivations</p>
              <p className="text-green-900 text-sm">{eleve.Motivations}</p>
            </div>
          )}
          {eleve['Aliments à éviter'] && (
            <div className="rounded-xl p-3 bg-red-50 border border-red-100">
              <p className="text-red-500 text-xs font-medium mb-1">Aliments à éviter</p>
              <p className="text-red-900 text-sm">{eleve['Aliments à éviter']}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default Profil;
