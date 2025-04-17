
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, Building2, PieChart, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Empresas", href: "/", icon: Building2 },
    { name: "Funil de Operação", href: "/pipeline", icon: PieChart },
    { name: "Calendário", href: "/calendar", icon: Calendar },
  ];

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="bg-atria-dark text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-md bg-atria-red flex items-center justify-center font-bold text-xl">A</div>
              <span className="text-xl font-semibold hidden sm:block">Atria</span>
            </Link>
            <nav className="ml-10 space-x-2 hidden md:flex">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1.5 hover:bg-atria-red/20 ${
                    isActive(item.href)
                      ? "text-white bg-atria-red/20 font-medium"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white hover:bg-atria-red/20 flex items-center gap-1.5">
                  <Avatar className="h-8 w-8 bg-atria-red">
                    <AvatarFallback>MS</AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block text-sm font-medium">Marcos Silva</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 mt-1" align="end">
                <DropdownMenuItem>Perfil</DropdownMenuItem>
                <DropdownMenuItem>Configurações</DropdownMenuItem>
                <DropdownMenuItem>Sair</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <button
              className="ml-2 md:hidden text-white hover:text-gray-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-atria-dark/95 absolute z-50 w-full">
          <div className="px-2 pt-2 pb-3 space-y-1 border-t border-atria-red/20">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2 ${
                  isActive(item.href)
                    ? "text-white bg-atria-red/20"
                    : "text-gray-300 hover:text-white hover:bg-atria-red/10"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
