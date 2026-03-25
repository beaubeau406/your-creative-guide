import { useBCG } from '@/hooks/useAirtableData';
import { Skeleton } from '@/components/ui/skeleton';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Flame, Zap, Droplets } from 'lucide-react';

const MACRO_COLORS = {
  proteines: 'hsl(180, 60%, 53%)',
  glucides: 'hsl(38, 92%, 50%)',
  lipides: 'hsl(20, 100%, 58%)',
};

const Nutrition = () => {
  const { data: bcgList, isLoading } = useBCG();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (!bcgList || bcgList.length === 0) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <h1 className="text-4xl font-heading text-energy tracking-wider">Nutrition</h1>
        <div className="glass-card p-8 text-center">
          <p className="text-4xl mb-3">🔥</p>
          <p className="text-muted-foreground">Aucun calcul nutritionnel disponible pour le moment.</p>
        </div>
      </div>
    );
  }

  const current = bcgList[0];
  const mondayDate = current.Semaine
    ? new Date(current.Semaine).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';

  const donutData = [
    { name: 'Protéines', value: current['Protéines (%)'] || 0 },
    { name: 'Glucides', value: current['Glucides (%)'] || 0 },
    { name: 'Lipides', value: current['Lipides (%)'] || 0 },
  ];

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h1 className="text-4xl font-heading text-energy tracking-wider">Nutrition</h1>

      {/* Hero card */}
      <div className="glass-card p-6">
        <p className="text-muted-foreground text-sm mb-2">Besoins de la semaine du {mondayDate}</p>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-muted-foreground text-xs">BMR</p>
            <p className="text-foreground text-2xl font-heading">{current['BMR (kcal)'] || '-'}</p>
            <p className="text-muted-foreground text-xs">kcal</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">BCJ</p>
            <p className="text-foreground text-2xl font-heading">{current['BCJ (kcal)'] || '-'}</p>
            <p className="text-muted-foreground text-xs">kcal</p>
          </div>
          <div className="bg-muted rounded-xl p-3">
            <p className="text-muted-foreground text-xs">Objectif</p>
            <p className="text-energy text-3xl font-heading">{current['BCJ / Obj (kcal)'] || '-'}</p>
            <p className="text-muted-foreground text-xs">kcal/jour</p>
          </div>
        </div>
      </div>

      {/* Donut chart */}
      <div className="glass-card p-6">
        <h2 className="text-2xl font-heading text-foreground mb-4">Répartition Macros</h2>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <ResponsiveContainer width={200} height={200}>
            <PieChart>
              <Pie
                data={donutData}
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                <Cell fill={MACRO_COLORS.proteines} />
                <Cell fill={MACRO_COLORS.glucides} />
                <Cell fill={MACRO_COLORS.lipides} />
              </Pie>
              <Tooltip
                contentStyle={{ background: 'hsl(220, 22%, 11%)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12 }}
                itemStyle={{ color: 'hsl(216, 25%, 95%)' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 text-sm">
            {[
              { name: 'Protéines', g: current['Protéines (g)'], kcal: current['Protéines (kcal)'], pct: current['Protéines (%)'], color: MACRO_COLORS.proteines },
              { name: 'Glucides', g: current['Glucides (g)'], kcal: current['Glucides (kcal)'], pct: current['Glucides (%)'], color: MACRO_COLORS.glucides },
              { name: 'Lipides', g: current['Lipides (g)'], kcal: current['Lipides (kcal)'], pct: current['Lipides (%)'], color: MACRO_COLORS.lipides },
            ].map((m) => (
              <div key={m.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: m.color }} />
                <span className="text-foreground font-medium">{m.name}</span>
                <span className="text-muted-foreground">{m.g || 0}g</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">{m.kcal || 0} kcal</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">{m.pct || 0}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Macro cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { name: 'Protéines', g: current['Protéines (g)'], kcal: current['Protéines (kcal)'], pct: current['Protéines (%)'], icon: Zap, gradient: 'gradient-cyan' },
          { name: 'Glucides', g: current['Glucides (g)'], kcal: current['Glucides (kcal)'], pct: current['Glucides (%)'], icon: Flame, gradient: 'gradient-gold' },
          { name: 'Lipides', g: current['Lipides (g)'], kcal: current['Lipides (kcal)'], pct: current['Lipides (%)'], icon: Droplets, gradient: 'gradient-orange' },
        ].map((m) => (
          <div key={m.name} className="glass-card p-4 text-center">
            <div className={`w-10 h-10 rounded-xl ${m.gradient} flex items-center justify-center mx-auto mb-2`}>
              <m.icon className="w-5 h-5 text-primary-foreground" />
            </div>
            <p className="text-muted-foreground text-xs">{m.name}</p>
            <p className="text-foreground text-2xl font-heading">{m.g || 0}g</p>
            <p className="text-muted-foreground text-xs">{m.kcal || 0} kcal | {m.pct || 0}%</p>
          </div>
        ))}
      </div>

      {/* History */}
      {bcgList.length > 1 && (
        <div className="glass-card p-6">
          <h2 className="text-2xl font-heading text-foreground mb-4">Historique</h2>
          <Accordion type="single" collapsible>
            {bcgList.slice(1).map((b: any, i: number) => (
              <AccordionItem key={b.id || i} value={`b-${i}`}>
                <AccordionTrigger className="text-sm text-foreground hover:no-underline">
                  Semaine du {new Date(b.Semaine).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} — {b['BCJ par Objectif'] || b.BCJ} kcal
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground">
                    <p>P: {b['Protéines (g)']}g</p>
                    <p>G: {b['Glucides (g)']}g</p>
                    <p>L: {b['Lipides (g)']}g</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </div>
  );
};

export default Nutrition;
