import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LayoutDashboard, User, Ruler, Flame, Dumbbell, Salad, BookOpen, LogOut } from 'lucide-react';

const navItems = [
  { path: '/dashboard',               label: 'Accueil',        icon: LayoutDashboard, grad: 'grad-blue',   active: '#3B82F6', light: '#EFF6FF' },
  { path: '/dashboard/profil',        label: 'Profil',         icon: User,            grad: 'grad-yellow', active: '#D97706', light: '#FFFBEB' },
  { path: '/dashboard/mesures',       label: 'Mesures',        icon: Ruler,           grad: 'grad-green',  active: '#059669', light: '#ECFDF5' },
  { path: '/dashboard/nutrition',     label: 'Nutrition',      icon: Flame,           grad: 'grad-red',    active: '#DC2626', light: '#FEF2F2' },
  { path: '/dashboard/entrainement',  label: 'Entraînement',   icon: Dumbbell,        grad: 'grad-violet', active: '#7C3AED', light: '#F5F3FF' },
  { path: '/dashboard/plan-alimentaire', label: 'Plan',        icon: Salad,           grad: 'grad-cyan',   active: '#0891B2', light: '#ECFEFF' },
  { path: '/dashboard/ebooks',        label: 'Ebooks',         icon: BookOpen,        grad: 'grad-gold',   active: '#D97706', light: '#FFFBEB' },
];

const DashboardLayout = () => {
  const { session, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const firstName = session?.eleveName?.split(' ')[0] || 'Élève';

  const handleLogout = () => { logout(); navigate('/'); };

  const isActive = (path: string) => {
    if (path === '/dashboard') return location.pathname === '/dashboard' || location.pathname === '/dashboard/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border p-5 fixed h-full shadow-sm">
        <div className="flex items-center gap-3 mb-8 px-1">
          <div className="w-10 h-10 rounded-xl grad-blue flex items-center justify-center shadow-sm">
            <span className="text-sm font-heading text-white">CS</span>
          </div>
          <div>
            <p className="text-foreground font-semibold text-sm">Coach Sportif</p>
            <p className="text-muted-foreground text-xs">Espace élève</p>
          </div>
        </div>

        {/* User badge */}
        <div className="flex items-center gap-3 mb-6 p-3 rounded-xl bg-muted">
          <div className="w-9 h-9 rounded-full grad-blue flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-heading">{firstName[0]}</span>
          </div>
          <div className="min-w-0">
            <p className="text-foreground font-semibold text-sm truncate">{session?.eleveName}</p>
            <p className="text-muted-foreground text-xs">{session?.eleveIDU}</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all"
                style={active ? { background: item.light, color: item.active, fontWeight: 600 } : { color: '#64748B' }}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${active ? item.grad : 'bg-muted'}`}>
                  <item.icon className={`w-4 h-4 ${active ? 'text-white' : 'text-muted-foreground'}`} />
                </div>
                {item.label}
              </button>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 text-muted-foreground hover:text-destructive text-sm transition-colors rounded-xl hover:bg-red-50"
        >
          <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center">
            <LogOut className="w-4 h-4" />
          </div>
          Déconnexion
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 md:ml-64 pb-24 md:pb-8">
        <header className="md:hidden flex items-center justify-between p-4 bg-card border-b border-border shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl grad-blue flex items-center justify-center">
              <span className="text-xs font-heading text-white">CS</span>
            </div>
            <div>
              <p className="text-foreground font-semibold text-sm">{session?.eleveName}</p>
              <p className="text-muted-foreground text-xs">{session?.eleveIDU}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="text-muted-foreground hover:text-destructive p-2">
            <LogOut className="w-5 h-5" />
          </button>
        </header>

        <div className="p-4 md:p-8 page-enter">
          <Outlet />
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border flex justify-around py-2 px-1 z-50 shadow-lg">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-1 px-1 py-1 min-w-[2.5rem] transition-all"
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${active ? item.grad : ''}`}>
                <item.icon className={`w-4 h-4 ${active ? 'text-white' : 'text-muted-foreground'}`} />
              </div>
              <span className="text-[9px]" style={active ? { color: item.active, fontWeight: 600 } : { color: '#94A3B8' }}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default DashboardLayout;
