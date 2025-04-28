import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, X, MoonStar, Sun, Github, Database, MousePointerClick, Server, RefreshCw, AlertOctagon, BookOpen } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../utils/cn';

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { path: '/basic-query', label: 'Basic Fetching', icon: <Database size={18} /> },
  { path: '/mutations', label: 'Mutations', icon: <MousePointerClick size={18} /> },
  { path: '/cache', label: 'Cache Management', icon: <Server size={18} /> },
  { path: '/error-handling', label: 'Error Handling', icon: <AlertOctagon size={18} /> },
  { path: '/pagination', label: 'Pagination & Infinite', icon: <RefreshCw size={18} /> },
  { path: '/devtools', label: 'DevTools', icon: <BookOpen size={18} /> },
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 md:hidden">
            <button onClick={toggleMenu} className="btn btn-ghost btn-icon">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Database className="h-6 w-6 text-primary" />
              <span className="inline-block font-bold">TanStack Query Guide</span>
            </Link>
          </div>
          
          <div className="flex-1" />
          
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-1 transition-colors hover:text-primary",
                  location.pathname === item.path ? "text-primary font-medium" : "text-muted-foreground"
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          
          <div className="ml-4 flex items-center gap-2">
            <a 
              href="https://tanstack.com/query/latest" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-ghost btn-icon"
            >
              <Github size={20} />
            </a>
            <button onClick={toggleTheme} className="btn btn-ghost btn-icon">
              {theme === 'dark' ? <Sun size={20} /> : <MoonStar size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-30 bg-background md:hidden pt-16">
          <nav className="container py-8">
            <ul className="space-y-4">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 text-base py-2 px-3 rounded-md transition-colors",
                      location.pathname === item.path 
                        ? "bg-primary/10 text-primary font-medium" 
                        : "text-muted-foreground hover:bg-muted"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 container py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col gap-4 md:h-16 md:flex-row md:items-center">
          <p className="text-sm text-muted-foreground md:text-base">
            Built with React, TanStack Query v6 and Tailwind CSS
          </p>
          <div className="flex-1" />
          <p className="text-sm text-muted-foreground md:text-base">
            © {new Date().getFullYear()} - TanStack Query Guide by Manish
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;