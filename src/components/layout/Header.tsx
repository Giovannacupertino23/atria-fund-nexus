
import { Link, useLocation } from 'react-router-dom';
import { BarChart, Calendar, Database, LayoutDashboard, FileText } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const path = location.pathname;

  const isActive = (route: string) => {
    if (route === '/' && path === '/') return true;
    if (route !== '/' && path.startsWith(route)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-10 border-b bg-white dark:bg-gray-950 dark:border-gray-800">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-atria-red">ATRIA</h1>
          </Link>
          <nav className="hidden md:flex items-center gap-5">
            <Link
              to="/"
              className={`flex items-center gap-1 text-sm font-medium ${
                isActive('/') && !isActive('/company/')
                  ? 'text-atria-red'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Database className="h-4 w-4" />
              Empresas
            </Link>
            <Link
              to="/pipeline"
              className={`flex items-center gap-1 text-sm font-medium ${
                isActive('/pipeline')
                  ? 'text-atria-red'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              to="/calendar"
              className={`flex items-center gap-1 text-sm font-medium ${
                isActive('/calendar')
                  ? 'text-atria-red'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Calendar className="h-4 w-4" />
              Calendário
            </Link>
            <Link
              to="/intelligence-report"
              className={`flex items-center gap-1 text-sm font-medium ${
                isActive('/intelligence-report')
                  ? 'text-atria-red'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <FileText className="h-4 w-4" />
              Relatório de Inteligência
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
