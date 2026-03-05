import { useEleveData, useMesures } from '@/hooks/useAirtableData';
import { Target, Activity, Heart, Calendar, Scale, TrendingDown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const Profil = () => {
  const { data: eleve, isLoading: loadingEleve } = useEleveData();
  const { data: mesures, isLoading: loadingMesures } = useMesures();

  if (loadingEleve || loadingMesures) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>
    );
  }

  if (!eleve) {
    return <p className="text-muted-foreground text-center py-12">Impossible de charger le profil.</p>;
  }

  const poidsInitial = eleve['Poids Initial (kg)'] || 0;
  const poidsCible = eleve['Poids Cible (kg)'] || 0;
  const poidsActuel = mesures && mesures.length > 0 ? mesures[0].Poids : poidsInitial;
  const progression = poidsInitial !== poidsCible
    ? Math.min(100, Math.max(0, ((poidsInitial - poidsActuel) / (poidsInitial - poidsCible)) * 100))
    : 0;
  const poidsPerdu = poidsInitial - poidsActuel;
  const poidsRestant = poidsActuel - poidsCible;

  const birthDate = eleve['Date de naissance'];
  const age = birthDate
    ? Math.floor((Date.now() - new Date(birthDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    : null;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h1 className="text-4xl font-heading text-primary tracking-wider">Profil & Objectifs</h1>

      {/* Goal hero card */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-orange flex items-center justify-center">
            <Target className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Objectif principal</p>
            <p className="text-foreground font-semibold text-lg">{eleve.Objectif || 'Non défini'}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{poidsInitial} kg</span>
            <span className="text-primary font-semibold">{poidsActuel.toFixed(1)} kg</span>
            <span className="text-success">{poidsCible} kg</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full gradient-orange rounded-full transition-all duration-700"
              style={{ width: `${progression}%` }}
            />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Départ</span>
            <span className="text-muted-foreground">{progression.toFixed(0)}% accompli</span>
            <span className="text-muted-foreground">Cible</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="bg-muted rounded-xl p-3 text-center">
            <TrendingDown className="w-5 h-5 text-success mx-auto mb-1" />
            <p className="text-foreground font-semibold text-lg">{poidsPerdu.toFixed(1)} kg</p>
            <p className="text-muted-foreground text-xs">Poids perdu</p>
          </div>
          <div className="bg-muted rounded-xl p-3 text-center">
            <Scale className="w-5 h-5 text-secondary mx-auto mb-1" />
            <p className="text-foreground font-semibold text-lg">{poidsRestant.toFixed(1)} kg</p>
            <p className="text-muted-foreground text-xs">Restant</p>
          </div>
        </div>
      </div>

      {/* Personal info */}
      <div className="glass-card p-6">
        <h2 className="text-2xl font-heading text-foreground mb-4">Informations</h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: Heart, label: 'Sexe', value: eleve.Sexe },
            { icon: Calendar, label: 'Âge', value: age ? `${age} ans` : '-' },
            { icon: Activity, label: 'Taille', value: eleve['Taille (cm)'] ? `${eleve['Taille (cm)']} cm` : '-' },
            { icon: Activity, label: 'Activité', value: eleve["Niveau d'activité"] },
            { icon: Target, label: 'Repas/jour', value: eleve['Nombre de repas/jour'] },
            { icon: Target, label: 'Statut', value: eleve.Statut },
          ].map((item, i) => (
            <div key={i} className="bg-muted rounded-xl p-3">
              <p className="text-muted-foreground text-xs mb-1">{item.label}</p>
              <p className="text-foreground font-medium text-sm">{item.value || '-'}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Motivations */}
      {(eleve.Motivations || eleve['Antécédents sportifs'] || eleve['Aliments à éviter']) && (
        <div className="glass-card p-6 space-y-4">
          <h2 className="text-2xl font-heading text-foreground">Motivations & Notes</h2>
          {eleve['Antécédents sportifs'] && (
            <div>
              <p className="text-muted-foreground text-xs mb-1">Antécédents sportifs</p>
              <p className="text-foreground text-sm">{eleve['Antécédents sportifs']}</p>
            </div>
          )}
          {eleve.Motivations && (
            <div>
              <p className="text-muted-foreground text-xs mb-1">Motivations</p>
              <p className="text-foreground text-sm">{eleve.Motivations}</p>
            </div>
          )}
          {eleve['Aliments à éviter'] && (
            <div>
              <p className="text-muted-foreground text-xs mb-1">Aliments à éviter</p>
              <p className="text-foreground text-sm">{eleve['Aliments à éviter']}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profil;
