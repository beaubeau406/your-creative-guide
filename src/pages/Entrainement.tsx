import { useWorkouts } from '@/hooks/useAirtableData';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dumbbell, Clock, Weight } from 'lucide-react';

const Entrainement = () => {
  const { data: workouts, isLoading } = useWorkouts();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (!workouts || workouts.length === 0) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <h1 className="text-4xl font-heading text-violet tracking-wider">Entraînement</h1>
        <div className="glass-card p-8 text-center">
          <p className="text-4xl mb-3">💪</p>
          <p className="text-muted-foreground">Aucun entraînement programmé pour le moment.</p>
        </div>
      </div>
    );
  }

  // Group by bloc then semaine then jour
  const blocs = new Map<number, Map<string, any[]>>();
  workouts.forEach((w: any) => {
    const bloc = w.Bloc || 1;
    if (!blocs.has(bloc)) blocs.set(bloc, new Map());
    const semaines = blocs.get(bloc)!;
    const sem = w.Semaine || 'unknown';
    if (!semaines.has(sem)) semaines.set(sem, []);
    semaines.get(sem)!.push(w);
  });

  const sortedBlocs = Array.from(blocs.entries()).sort(([a], [b]) => b - a);
  const currentBloc = sortedBlocs[0];

  const renderDay = (exercises: any[]) => {
    // Group by Partie
    const parties = new Map<string, any[]>();
    exercises.forEach((ex) => {
      const p = ex.Partie || 'Exercices';
      if (!parties.has(p)) parties.set(p, []);
      parties.get(p)!.push(ex);
    });

    return (
      <div className="space-y-4">
        {Array.from(parties.entries()).map(([partie, exs]) => (
          <div key={partie}>
            <p className="text-sm font-semibold text-violet mb-2">{partie}</p>
            <div className="space-y-2">
              {exs.map((ex: any, i: number) => (
                <div key={i} className="bg-muted rounded-xl p-3 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg gradient-violet flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Dumbbell className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground font-medium text-sm">{ex.Exercice}</p>
                    <div className="flex flex-wrap gap-3 mt-1 text-xs text-muted-foreground">
                      {ex['Format de travail'] && (
                        <span className="flex items-center gap-1">
                          <Weight className="w-3 h-3" /> {ex['Format de travail']}
                        </span>
                      )}
                      {ex.Rest && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {ex.Rest}
                        </span>
                      )}
                      {ex['Charge (kg)'] && <span>{ex['Charge (kg)']} kg</span>}
                    </div>
                    {ex.Notes && <p className="text-xs text-muted-foreground mt-1 italic">{ex.Notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderSemaine = (exercises: any[]) => {
    const jours = new Map<string, any[]>();
    exercises.forEach((ex) => {
      const j = ex.Jour || 'Jour 1';
      if (!jours.has(j)) jours.set(j, []);
      jours.get(j)!.push(ex);
    });
    const sortedJours = Array.from(jours.entries()).sort(([a], [b]) => a.localeCompare(b));

    return (
      <Tabs defaultValue={sortedJours[0]?.[0]} className="w-full">
        <TabsList className="bg-muted w-full flex overflow-x-auto">
          {sortedJours.map(([jour]) => (
            <TabsTrigger key={jour} value={jour} className="flex-1 text-xs data-[state=active]:bg-violet data-[state=active]:text-primary-foreground">
              {jour}
            </TabsTrigger>
          ))}
        </TabsList>
        {sortedJours.map(([jour, exs]) => (
          <TabsContent key={jour} value={jour} className="mt-4">
            {renderDay(exs)}
          </TabsContent>
        ))}
      </Tabs>
    );
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h1 className="text-4xl font-heading text-violet tracking-wider">Entraînement</h1>

      {/* Current bloc */}
      {currentBloc && (
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-semibold gradient-violet text-primary-foreground">
              Bloc {currentBloc[0]}
            </span>
            <span className="text-muted-foreground text-sm">Bloc actuel</span>
          </div>
          {(() => {
            const semaines = Array.from(currentBloc[1].entries()).sort(([a], [b]) => b.localeCompare(a));
            const latestSemaine = semaines[0];
            return (
              <>
                <p className="text-muted-foreground text-sm mb-4">
                  Semaine du {new Date(latestSemaine[0]).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                </p>
                {renderSemaine(latestSemaine[1])}
              </>
            );
          })()}
        </div>
      )}

      {/* Historical blocs */}
      {sortedBlocs.length > 0 && (
        <div className="glass-card p-6">
          <h2 className="text-2xl font-heading text-foreground mb-4">Historique</h2>
          <Accordion type="single" collapsible>
            {sortedBlocs.map(([blocNum, semaines]) => (
              <AccordionItem key={blocNum} value={`bloc-${blocNum}`}>
                <AccordionTrigger className="text-sm text-foreground hover:no-underline">
                  Bloc {blocNum}
                </AccordionTrigger>
                <AccordionContent>
                  <Accordion type="single" collapsible>
                    {Array.from(semaines.entries())
                      .sort(([a], [b]) => b.localeCompare(a))
                      .map(([sem, exs]) => (
                        <AccordionItem key={sem} value={`sem-${sem}`}>
                          <AccordionTrigger className="text-xs text-muted-foreground hover:no-underline">
                            Semaine du {new Date(sem).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                          </AccordionTrigger>
                          <AccordionContent>{renderSemaine(exs)}</AccordionContent>
                        </AccordionItem>
                      ))}
                  </Accordion>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </div>
  );
};

export default Entrainement;
