import { useMesures, useEleveData } from '@/hooks/useAirtableData';
import { useAuth } from '@/contexts/AuthContext';
import { ExternalLink, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const Mesures = () => {
  const { session } = useAuth();
  const { data: mesures, isLoading } = useMesures();
  const { data: eleve } = useEleveData();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-14 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    );
  }

  const poidsInitial = eleve?.['Poids Initial (kg)'] || 0;
  const poidsCible = eleve?.['Poids Cible (kg)'] || 0;
  const current = mesures && mesures.length > 0 ? mesures[0] : null;
  const previous = mesures && mesures.length > 1 ? mesures[1] : null;
  const poidsActuel = current?.Poids || poidsInitial;

  const youformUrl = `https://app.youform.com/build/eks9hz3h?block_id=15ee2ed2-b1d0-4744-98c9-0fcbabff24f6&nom=${encodeURIComponent(session?.eleveName || '')}&id=${encodeURIComponent(session?.eleveIDU || '')}`;

  const chartData = mesures
    ? [...mesures].reverse().map((m: any) => ({
        date: new Date(m['Date de Mesure']).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
        poids: m.Poids,
      }))
    : [];

  const delta = (curr: number | undefined, prev: number | undefined) => {
    if (curr == null || prev == null) return null;
    const diff = curr - prev;
    if (diff > 0) return { icon: TrendingUp, text: `+${diff.toFixed(1)}`, color: 'text-destructive' };
    if (diff < 0) return { icon: TrendingDown, text: diff.toFixed(1), color: 'text-success' };
    return { icon: Minus, text: '0', color: 'text-muted-foreground' };
  };

  const hasComposition = current && (current['Masse Grasse (%)'] || current['Masse Musulaire'] || current['Eau']);
  const hasMensurations = current && (current['Tour de Taille'] || current['Tour de Hanches']);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h1 className="text-4xl font-heading text-secondary tracking-wider">Mesures</h1>

      {/* Youform button */}
      <a
        href={youformUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="glass-card p-4 flex items-center justify-center gap-2 gradient-cyan text-primary-foreground font-semibold rounded-2xl hover:opacity-90 transition-opacity"
      >
        📏 Enregistrer mes mesures
        <ExternalLink className="w-4 h-4" />
      </a>

      {/* Weight chart */}
      {chartData.length > 0 && (
        <div className="glass-card p-6">
          <h2 className="text-2xl font-heading text-foreground mb-4">Évolution du Poids</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 10%, 15%)" />
              <XAxis dataKey="date" tick={{ fill: 'hsl(213, 18%, 61%)', fontSize: 12 }} />
              <YAxis domain={['dataMin - 2', 'dataMax + 2']} tick={{ fill: 'hsl(213, 18%, 61%)', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: 'hsl(220, 22%, 11%)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12 }}
                labelStyle={{ color: 'hsl(216, 25%, 95%)' }}
                itemStyle={{ color: 'hsl(180, 60%, 53%)' }}
              />
              {poidsCible > 0 && <ReferenceLine y={poidsCible} stroke="hsl(142, 71%, 45%)" strokeDasharray="5 5" label={{ value: 'Cible', fill: 'hsl(142, 71%, 45%)', fontSize: 11 }} />}
              {poidsInitial > 0 && <ReferenceLine y={poidsInitial} stroke="hsl(213, 18%, 61%)" strokeDasharray="5 5" label={{ value: 'Initial', fill: 'hsl(213, 18%, 61%)', fontSize: 11 }} />}
              <Line type="monotone" dataKey="poids" stroke="hsl(180, 60%, 53%)" strokeWidth={2} dot={{ fill: 'hsl(180, 60%, 53%)', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            {[
              { label: 'Actuel', value: `${poidsActuel.toFixed(1)} kg` },
              { label: 'Perdu', value: `${(poidsInitial - poidsActuel).toFixed(1)} kg` },
              { label: 'Restant', value: `${(poidsActuel - poidsCible).toFixed(1)} kg` },
              { label: 'Cible', value: `${poidsCible} kg` },
            ].map((s, i) => (
              <div key={i} className="bg-muted rounded-xl p-3 text-center">
                <p className="text-muted-foreground text-xs">{s.label}</p>
                <p className="text-foreground font-semibold">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Body composition */}
      {hasComposition && (
        <div className="glass-card p-6">
          <h2 className="text-2xl font-heading text-foreground mb-4">Composition Corporelle</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Masse Grasse', key: 'Masse Grasse (%)', unit: '%', color: 'text-destructive' },
              { label: 'Masse Musculaire', key: 'Masse Musulaire', unit: '%', color: 'text-success' },
              { label: 'Eau', key: 'Eau', unit: '%', color: 'text-secondary' },
              { label: 'Graisse Viscérale', key: 'Graisse Viscérale', unit: '', color: 'text-warning' },
            ].map((item) => {
              const val = current?.[item.key];
              const prevVal = previous?.[item.key];
              const d = delta(val, prevVal);
              return val != null ? (
                <div key={item.key} className="bg-muted rounded-xl p-3 text-center">
                  <p className="text-muted-foreground text-xs mb-1">{item.label}</p>
                  <p className={`font-semibold text-lg ${item.color}`}>{val}{item.unit}</p>
                  {d && (
                    <span className={`text-xs ${d.color} flex items-center justify-center gap-1`}>
                      <d.icon className="w-3 h-3" /> {d.text}
                    </span>
                  )}
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* Mensurations */}
      {hasMensurations && (
        <div className="glass-card p-6">
          <h2 className="text-2xl font-heading text-foreground mb-4">Mensurations</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              'Tour de Taille', 'Tour de Hanches', 'Tour de Poitrine',
              'Tour de Cuisses G', 'Tour de Cuisses D',
              'Tour de Bras G', 'Tour de Bras D',
            ].map((key) => {
              const val = current?.[key];
              const first = mesures && mesures.length > 0 ? mesures[mesures.length - 1]?.[key] : null;
              const diff = val != null && first != null ? val - first : null;
              return val != null ? (
                <div key={key} className="bg-muted rounded-xl p-3">
                  <p className="text-muted-foreground text-xs mb-1">{key.replace('Tour de ', '')}</p>
                  <p className="text-foreground font-semibold">{val} cm</p>
                  {diff != null && diff !== 0 && (
                    <span className={`text-xs ${diff < 0 ? 'text-success' : 'text-destructive'}`}>
                      {diff > 0 ? '+' : ''}{diff.toFixed(1)} cm
                    </span>
                  )}
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* History */}
      {mesures && mesures.length > 0 && (
        <div className="glass-card p-6">
          <h2 className="text-2xl font-heading text-foreground mb-4">Historique</h2>
          <Accordion type="single" collapsible>
            {mesures.map((m: any, i: number) => (
              <AccordionItem key={m.id || i} value={`m-${i}`}>
                <AccordionTrigger className="text-sm text-foreground hover:no-underline">
                  {new Date(m['Date de Mesure']).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} — {m.Poids} kg
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {m['Masse Grasse (%)'] && <p className="text-muted-foreground">MG: {m['Masse Grasse (%)']}%</p>}
                    {m['Masse Musulaire'] && <p className="text-muted-foreground">MM: {m['Masse Musulaire']}%</p>}
                    {m.Eau && <p className="text-muted-foreground">Eau: {m.Eau}%</p>}
                    {m['Tour de Taille'] && <p className="text-muted-foreground">Taille: {m['Tour de Taille']} cm</p>}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}

      {(!mesures || mesures.length === 0) && (
        <div className="glass-card p-8 text-center">
          <p className="text-4xl mb-3">📏</p>
          <p className="text-muted-foreground">Aucune mesure enregistrée pour l'instant.</p>
          <p className="text-muted-foreground text-sm">Clique sur le bouton ci-dessus pour commencer ! 💪</p>
        </div>
      )}
    </div>
  );
};

export default Mesures;
