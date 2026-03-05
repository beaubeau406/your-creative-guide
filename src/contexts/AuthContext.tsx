import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SessionData, getSession, setSession, clearSession, airtableFetch, TABLES } from '@/lib/airtable';

interface AuthContextType {
  session: SessionData | null;
  loading: boolean;
  login: (code: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = getSession();
    if (stored) setSessionState(stored);
    setLoading(false);
  }, []);

  const login = async (code: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const data = await airtableFetch(TABLES.ELEVES, {
        filterByFormula: `{code}='${code}'`,
        pageSize: '1',
      });

      if (!data.records || data.records.length === 0) {
        return { success: false, error: 'Code invalide' };
      }

      const record = data.records[0];
      const fields = record.fields;

      const sessionData: SessionData = {
        eleveId: record.id,
        eleveName: fields.Nom || '',
        eleveCode: fields.code || '',
        eleveIDU: fields['IDU Eleve'] || '',
      };

      setSession(sessionData);
      setSessionState(sessionData);
      return { success: true };
    } catch {
      return { success: false, error: 'Erreur de connexion. Vérifiez votre connexion internet.' };
    }
  };

  const logout = () => {
    clearSession();
    setSessionState(null);
  };

  return (
    <AuthContext.Provider value={{ session, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
