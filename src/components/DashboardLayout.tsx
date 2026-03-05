import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { User, Ruler, Flame, Dumbbell, Salad, BookOpen, LogOut } from 'lucide-react';

const navItems = [
  { path: '/dashboard/profil', label: 'Profil', icon: User, colorClass: 'text-primary' },
  { path: '/dashboard/mesures', label: 'Mesures', icon: Ruler, colorClass: 'text-secondary' },
  { path: '/dashboard/nutrition', label: 'Nutrition', icon: Flame, colorClass: 'text-energy' },
  { path: '/dashboard/entrainement', label: 'Entraînement', icon: Dumbbell, colorClass: 'text-violet' },
  { path: '/dashboard/plan-alimentaire', label: 'Plan', icon: Salad, colorClass: 'text-success' },
  { path: '/dashboard/ebooks', label: 'Ebooks', icon: BookOpen, colorClass: 'text-warning' },
];

const DashboardLayout = () => {
  const { session, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const firstName = session?.eleveName?.split(' ')[0] || 'Élève';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border p-4 fixed h-full">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-10 h-10 rounded-xl gradient-orange flex items-center justify-center">
            <span className="text-sm font-heading text-primary-foreground">CS</span>
          </div>
          <div>
            <p className="text-foreground font-semibold text-sm">Bonjour, {firstName}</p>
            <p className="text-muted-foreground text-xs">{session?.eleveIDU}</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all ${
                  isActive
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? item.colorClass : ''}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-3 text-muted-foreground hover:text-destructive text-sm transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Déconnexion
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 md:ml-64 pb-24 md:pb-8">
        {/* Mobile header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl gradient-orange flex items-center justify-center">
              <span className="text-xs font-heading text-primary-foreground">CS</span>
            </div>
            <p className="text-foreground font-semibold text-sm">Bonjour, {firstName}</p>
          </div>
          <button onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
            <LogOut className="w-5 h-5" />
          </button>
        </header>

        <div className="p-4 md:p-8 page-enter">
          <Outlet />
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border flex justify-around py-2 px-1 z-50">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 px-2 py-1 min-w-[3rem] transition-colors ${
                isActive ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? item.colorClass : ''}`} />
              <span className="text-[10px]">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default DashboardLayout;
