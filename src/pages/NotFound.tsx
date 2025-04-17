import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: Usuário tentou acessar rota inexistente:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-7xl font-bold mb-4 text-atria-red">404</h1>
        <p className="text-xl mb-6">Página não encontrada</p>
        <Button className="bg-atria-red hover:bg-atria-red/90" asChild>
          <a href="/">
            <Home className="mr-2 h-4 w-4" />
            Voltar ao Início
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
