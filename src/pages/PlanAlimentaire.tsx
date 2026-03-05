import { usePlanAlimentaire } from '@/hooks/useAirtableData';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const REPAS_ICONS: Record<string, string> = {
  'Petit-déjeuner': '🌅',
  'Déjeuner': '☀️',
  'Collation': '🍎',
  'Dîner': '🌙',
  'Hydratation': '💧',
};

const PlanAlimentaire = () => {
  const { data: plans, isLoading } = usePlanAlimentaire();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (!plans || plans.length === 0) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <h1 className="text-4xl font-heading text-success tracking-wider">Plan Alimentaire</h1>
        <div className="glass-card p-8 text-center">
          <p className="text-4xl mb-3">🥗</p>
          <p className="text-muted-foreground">Aucun plan alimentaire disponible pour le moment.</p>
        </div>
      </div>
    );
  }

  // Group by semaine
  const semaines = new Map<string, any[]>();
  plans.forEach((p: any) => {
    const sem = p.Semaine || 'unknown';
    if (!semaines.has(sem)) semaines.set(sem, []);
    semaines.get(sem)!.push(p);
  });

  const sortedSemaines = Array.from(semaines.entries()).sort(([a], [b]) => b.localeCompare(a));
  const currentSemaine = sortedSemaines[0];

  const renderJour = (items: any[]) => {
    // Group by Repas
    const repas = new Map<string, any[]>();
    items.forEach((item) => {
      const r = item.Repas || 'Autre';
      if (!repas.has(r)) repas.set(r, []);
      repas.get(r)!.push(item);
    });

    const totalP = items.reduce((s, i) => s + (i['Protéines (g)'] || 0), 0);
    const totalG = items.reduce((s, i) => s + (i['Glucides (g)'] || 0), 0);
    const totalL = items.reduce((s, i) => s + (i['Lipides (g)'] || 0), 0);

    return (
      <div className="space-y-4">
        {Array.from(repas.entries()).map(([repasName, aliments]) => (
          <div key={repasName}>
            <p className="text-sm font-semibold text-success mb-2">
              {REPAS_ICONS[repasName] || '🍽️'} {repasName}
            </p>
            <div className="space-y-1">
              {aliments.map((a: any, i: number) => (
                <div key={i} className="bg-muted rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <p className="text-foreground text-sm font-medium">{a.Aliment}</p>
                    <p className="text-muted-foreground text-xs">{a.Quantité}</p>
                  </div>
                  <div className="flex gap-2 text-xs">
                    {a['Protéines (g)'] != null && (
                      <span className="px-2 py-1 rounded-lg bg-secondary/20 text-secondary">{a['Protéines (g)']}P</span>
                    )}
                    {a['Glucides (g)'] != null && (
                      <span className="px-2 py-1 rounded-lg bg-warning/20 text-warning">{a['Glucides (g)']}G</span>
                    )}
                    {a['Lipides (g)'] != null && (
                      <span className="px-2 py-1 rounded-lg bg-primary/20 text-primary">{a['Lipides (g)']}L</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="bg-muted rounded-xl p-3 flex justify-around text-center">
          <div>
            <p className="text-foreground font-semibold">{totalP.toFixed(0)}g</p>
            <p className="text-muted-foreground text-xs">Protéines</p>
          </div>
          <div>
            <p className="text-foreground font-semibold">{totalG.toFixed(0)}g</p>
            <p className="text-muted-foreground text-xs">Glucides</p>
          </div>
          <div>
            <p className="text-foreground font-semibold">{totalL.toFixed(0)}g</p>
            <p className="text-muted-foreground text-xs">Lipides</p>
          </div>
        </div>
      </div>
    );
  };

  const renderSemaine = (items: any[]) => {
    const jours = new Map<string, any[]>();
    items.forEach((item) => {
      const j = item.Jour || 'Jour 1';
      if (!jours.has(j)) jours.set(j, []);
      jours.get(j)!.push(item);
    });
    const sortedJours = Array.from(jours.entries()).sort(([a], [b]) => a.localeCompare(b));

    return (
      <Tabs defaultValue={sortedJours[0]?.[0]} className="w-full">
        <TabsList className="bg-muted w-full flex overflow-x-auto">
          {sortedJours.map(([jour]) => (
            <TabsTrigger key={jour} value={jour} className="flex-1 text-xs data-[state=active]:bg-success data-[state=active]:text-primary-foreground">
              {jour}
            </TabsTrigger>
          ))}
        </TabsList>
        {sortedJours.map(([jour, items]) => (
          <TabsContent key={jour} value={jour} className="mt-4">
            {renderJour(items)}
          </TabsContent>
        ))}
      </Tabs>
    );
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h1 className="text-4xl font-heading text-success tracking-wider">Plan Alimentaire</h1>

      {/* Current week */}
      {currentSemaine && (
        <div className="glass-card p-6">
          <p className="text-muted-foreground text-sm mb-4">
            Semaine du {new Date(currentSemaine[0]).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          {renderSemaine(currentSemaine[1])}
        </div>
      )}

      {/* History */}
      {sortedSemaines.length > 1 && (
        <div className="glass-card p-6">
          <h2 className="text-2xl font-heading text-foreground mb-4">Historique</h2>
          <Accordion type="single" collapsible>
            {sortedSemaines.slice(1).map(([sem, items]) => (
              <AccordionItem key={sem} value={`sem-${sem}`}>
                <AccordionTrigger className="text-sm text-foreground hover:no-underline">
                  Semaine du {new Date(sem).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                </AccordionTrigger>
                <AccordionContent>{renderSemaine(items)}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </div>
  );
};

export default PlanAlimentaire;
