import { useQuery } from '@tanstack/react-query';
import { airtableFetchAll, TABLES } from '@/lib/airtable';
import { useAuth } from '@/contexts/AuthContext';

export function useEleveData() {
  const { session } = useAuth();
  return useQuery({
    queryKey: ['eleve', session?.eleveId],
    queryFn: async () => {
      const data = await airtableFetchAll(TABLES.ELEVES, {
        filterByFormula: `{Code}='${session?.eleveCode}'`,
      });
      return data[0]?.fields || null;
    },
    enabled: !!session,
  });
}

export function useMesures() {
  const { session } = useAuth();
  return useQuery({
    queryKey: ['mesures', session?.eleveName],
    queryFn: () =>
      airtableFetchAll(TABLES.MESURES, {
        filterByFormula: `FIND('${session?.eleveName}', {Élève})`,
        sort: JSON.stringify([{ field: 'Date de Mesure', direction: 'desc' }]),
      }),
    enabled: !!session,
    select: (records) =>
      records
        .map((r: any) => ({ id: r.id, ...r.fields }))
        .sort((a: any, b: any) => new Date(b['Date de Mesure']).getTime() - new Date(a['Date de Mesure']).getTime()),
  });
}

export function useBCG() {
  const { session } = useAuth();
  return useQuery({
    queryKey: ['bcg', session?.eleveName],
    queryFn: () =>
      airtableFetchAll(TABLES.BCG, {
        filterByFormula: `FIND('${session?.eleveName}', {Élève})`,
      }),
    enabled: !!session,
    select: (records) =>
      records
        .map((r: any) => ({ id: r.id, ...r.fields }))
        .sort((a: any, b: any) => new Date(b.Semaine).getTime() - new Date(a.Semaine).getTime()),
  });
}

export function useWorkouts() {
  const { session } = useAuth();
  return useQuery({
    queryKey: ['workouts', session?.eleveName],
    queryFn: () =>
      airtableFetchAll(TABLES.WORKOUT, {
        filterByFormula: `FIND('${session?.eleveName}', {Élève})`,
      }),
    enabled: !!session,
    select: (records) =>
      records
        .map((r: any) => ({ id: r.id, ...r.fields }))
        .sort((a: any, b: any) => {
          const semDiff = new Date(b.Semaine).getTime() - new Date(a.Semaine).getTime();
          if (semDiff !== 0) return semDiff;
          return (b.Bloc || 0) - (a.Bloc || 0);
        }),
  });
}

export function usePlanAlimentaire() {
  const { session } = useAuth();
  return useQuery({
    queryKey: ['plan', session?.eleveName],
    queryFn: () =>
      airtableFetchAll(TABLES.PLAN_ALIMENTAIRE, {
        filterByFormula: `FIND('${session?.eleveName}', {Élève})`,
      }),
    enabled: !!session,
    select: (records) =>
      records
        .map((r: any) => ({ id: r.id, ...r.fields }))
        .sort((a: any, b: any) => new Date(b.Semaine).getTime() - new Date(a.Semaine).getTime()),
  });
}

export function useEbooks() {
  return useQuery({
    queryKey: ['ebooks'],
    queryFn: () =>
      airtableFetchAll(TABLES.EBOOK, {
        filterByFormula: `{Statut}='Publié'`,
      }),
    select: (records) => records.map((r: any) => ({ id: r.id, ...r.fields })),
  });
}
