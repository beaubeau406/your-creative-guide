import { useMesures, useEleveData } from '@/hooks/useAirtableData';
import { useAuth } from '@/contexts/AuthContext';
import { ExternalLink, TrendingUp, TrendingDown, Minus, Ruler } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const Mesures = () => {
  const { session } = useAuth();
  const { data: mesures, isLoading } = useMesures();
  const { data: eleve } = useEleveData();

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-14 w-full rounded-2xl" /><Skeleton className="h-64 w-full rounded-2xl" /></div>;

  const poidsInitial = eleve?.['Poids Initial (kg)'] || 0;
  const poidsCible = eleve?.['Poids Cible (kg)'] || 0;
  const current = mesures && mesures.length > 0 ? mesures[0] : null;
  const previous = mesures && mesures.length > 1 ? mesures[1] : null;
  const poidsActuel = current?.Poids || poidsInitial;
  const youformUrl = `https://app.youform.com/build/eks9hz3h?block_id=15ee2ed2-b1d0-4744-98c9-0fcbabff24f6&nom=${encodeURIComponent(session?.eleveName||'')}&id=${encodeURIComponent(session?.eleveIDU||'')}`;

  const chartData = mesures ? [...mesures].reverse().map((m: any) => ({
    date: new Date(m['Date de Mesure']).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
    poids: m.Poids,
  })) : [];

  const delta = (curr: number|undefined, prev: number|undefined) => {
    if (curr == null || prev == null) return null;
    const diff = curr - prev;
    if (diff > 0) return { icon: TrendingUp, text: `+${diff.toFixed(1)}`, color: '#EF4444' };
    if (diff < 0) return { icon: TrendingDown, text: diff.toFixed(1), color: '#10B981' };
    return { icon: Minus, text: '0', color: '#94A3B8' };
  };

  const hasComposition = current && (current['Masse Grasse (%)'] || current['Masse Musulaire'] || current['Eau']);
  const hasMensurations = current && (current['Tour de Taille'] || current['Tour de Hanches']);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-border rounded-xl p-3 shadow-lg">
          <p className="text-xs text-muted-foreground mb-1">{label}</p>
          <p className="text-lg font-bold text-green-600">{payload[0].value} kg</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl grad-green flex items-center justify-center"><Ruler className="w-5 h-5 text-white" /></div>
        <h1 className="text-3xl font-heading text-foreground">Mesures</h1>
      </div>

      {/* CTA Button */}
      <a href={youformUrl} target="_blank" rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 grad-green text-white font-semibold py-4 rounded-2xl hover:opacity-90 transition-opacity shadow-sm text-sm">
        📏 Enregistrer mes mesures <ExternalLink className="w-4 h-4" />
      </a>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Poids actuel', value: `${poidsActuel.toFixed(1)} kg`, bg: '#ECFDF5', text: '#059669', border: '#BBF7D0' },
          { label: 'Poids perdu', value: `${(poidsInitial - poidsActuel).toFixed(1)} kg`, bg: '#EFF6FF', text: '#3B82F6', border: '#BFDBFE' },
          { label: 'Restant', value: `${Math.max(0, poidsActuel - poidsCible).toFixed(1)} kg`, bg: '#FEF3C7', text: '#D97706', border: '#FDE68A' },
          { label: 'Objectif', value: `${poidsCible} kg`, bg: '#F5F3FF', text: '#7C3AED', border: '#DDD6FE' },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl p-3 text-center border" style={{ background: s.bg, borderColor: s.border }}>
            <p className="text-xs mb-1" style={{ color: s.text }}>{s.label}</p>
            <p className="font-bold text-lg" style={{ color: s.text }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Weight chart */}
      {chartData.length > 0 && (
        <div className="card-base p-6">
          <h2 className="text-xl font-heading text-foreground mb-5">📈 Évolution du poids</h2>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorPoids" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="date" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={['dataMin - 2', 'dataMax + 2']} tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              {poidsCible > 0 && <ReferenceLine y={poidsCible} stroke="#10B981" strokeDasharray="5 5" label={{ value: `Cible: ${poidsCible}kg`, fill: '#10B981', fontSize: 11 }} />}
              {poidsInitial > 0 && <ReferenceLine y={poidsInitial} stroke="#CBD5E1" strokeDasharray="5 5" label={{ value: `Départ: ${poidsInitial}kg`, fill: '#94A3B8', fontSize: 11 }} />}
              <Area type="monotone" dataKey="poids" stroke="#10B981" strokeWidth={2.5} fill="url(#colorPoids)" dot={{ fill: '#10B981', r: 4, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Composition corporelle */}
      {hasComposition && (
        <div className="card-base p-6">
          <h2 className="text-xl font-heading text-foreground mb-4">🏃 Composition corporelle</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Masse Grasse', key: 'Masse Grasse (%)', unit: '%', bg: '#FEF2F2', text: '#DC2626', border: '#FECACA' },
              { label: 'Masse Musculaire', key: 'Masse Musulaire', unit: '%', bg: '#ECFDF5', text: '#059669', border: '#BBF7D0' },
              { label: 'Eau', key: 'Eau', unit: '%', bg: '#EFF6FF', text: '#3B82F6', border: '#BFDBFE' },
              { label: 'Gr. Viscérale', key: 'Graisse Viscérale', unit: '', bg: '#FFF7ED', text: '#EA580C', border: '#FED7AA' },
            ].map((item) => {
              const val = current?.[item.key];
              const prevVal = previous?.[item.key];
              const d = delta(val, prevVal);
              return val != null ? (
                <div key={item.key} className="rounded-2xl p-3 text-center border" style={{ background: item.bg, borderColor: item.border }}>
                  <p className="text-xs mb-1" style={{ color: item.text }}>{item.label}</p>
                  <p className="font-bold text-xl" style={{ color: item.text }}>{val}{item.unit}</p>
                  {d && <span className="text-xs flex items-center justify-center gap-1 mt-1" style={{ color: d.color }}><d.icon className="w-3 h-3" />{d.text}</span>}
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* Mensurations */}
      {hasMensurations && (
        <div className="card-base p-6">
          <h2 className="text-xl font-heading text-foreground mb-4">📐 Mensurations</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {['Tour de Taille','Tour de Hanches','Tour de Poitrine','Tour de Cuisses G','Tour de Cuisses D','Tour de Bras G','Tour de Bras D'].map((key) => {
              const val = current?.[key];
              const first = mesures && mesures.length > 0 ? mesures[mesures.length-1]?.[key] : null;
              const diff = val != null && first != null ? val - first : null;
              return val != null ? (
                <div key={key} className="rounded-xl p-3 bg-muted/40 border border-border">
                  <p className="text-muted-foreground text-xs mb-1">{key.replace('Tour de ','')}</p>
                  <p className="text-foreground font-semibold">{val} cm</p>
                  {diff != null && diff !== 0 && (
                    <span className="text-xs" style={{ color: diff < 0 ? '#10B981' : '#EF4444' }}>{diff > 0 ? '+' : ''}{diff.toFixed(1)} cm</span>
                  )}
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* Historique */}
      {mesures && mesures.length > 0 && (
        <div className="card-base p-6">
          <h2 className="text-xl font-heading text-foreground mb-4">Historique des mesures</h2>
          <Accordion type="single" collapsible>
            {mesures.map((m: any, i: number) => (
              <AccordionItem key={m.id||i} value={`m-${i}`} className="border-border">
                <AccordionTrigger className="text-sm text-foreground hover:no-underline py-3">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                    {new Date(m['Date de Mesure']).toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'})}
                    <span className="font-bold text-green-600 ml-1">{m.Poids} kg</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 gap-2 text-sm pt-2">
                    {m['Masse Grasse (%)'] && <p className="text-muted-foreground">MG: <span className="font-medium text-foreground">{m['Masse Grasse (%)']}%</span></p>}
                    {m['Masse Musulaire'] && <p className="text-muted-foreground">MM: <span className="font-medium text-foreground">{m['Masse Musulaire']}%</span></p>}
                    {m.Eau && <p className="text-muted-foreground">Eau: <span className="font-medium text-foreground">{m.Eau}%</span></p>}
                    {m['Tour de Taille'] && <p className="text-muted-foreground">Taille: <span className="font-medium text-foreground">{m['Tour de Taille']} cm</span></p>}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}

      {(!mesures || mesures.length === 0) && (
        <div className="card-base p-10 text-center" style={{ background: '#ECFDF5', border: '1px solid #BBF7D0' }}>
          <p className="text-5xl mb-3">📏</p>
          <p className="text-green-800 font-semibold">Aucune mesure enregistrée</p>
          <p className="text-green-600 text-sm mt-1">Clique sur le bouton ci-dessus pour commencer ! 💪</p>
        </div>
      )}
    </div>
  );
};
export default Mesures;
