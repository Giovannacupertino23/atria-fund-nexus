import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCompany, Company } from "@/context/CompanyContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, ExternalLink, Trash2, Loader2 } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import CompanyForm from "@/components/forms/CompanyForm";
import DataCard from "@/components/ui/DataCard";

const Companies = () => {
  const { companies, deleteCompany, loadCompanies, isLoading } = useCompany();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.cnpj.includes(searchTerm) ||
      company.sector.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (e: React.MouseEvent, companyId: string) => {
    e.stopPropagation();
    setCompanyToDelete(companyId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (companyToDelete) {
      await deleteCompany(companyToDelete);
      toast({
        title: "Empresa excluída",
        description: "A empresa foi excluída com sucesso.",
      });
      setIsDeleteDialogOpen(false);
      setCompanyToDelete(null);
    }
  };

  const formatCurrency = (value: number | null | undefined) => {
    if (value === null || value === undefined) return "N/A";
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusLabel = (status: string | null | undefined) => {
    switch (status) {
      case "approved": return "Aprovada";
      case "evaluating": return "Em Avaliação";
      case "not_approved": return "Não Aprovada";
      default: return "Em Avaliação";
    }
  };

  const getStatusColor = (status: string | null | undefined) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-800";
      case "evaluating": return "bg-yellow-100 text-yellow-800";
      case "not_approved": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getScoreColor = (color: string | null | undefined) => {
    switch (color) {
      case "green": return "bg-green-500";
      case "orange": return "bg-orange-500";
      case "red": return "bg-red-500";
      default: return "bg-gray-300";
    }
  };

  const getPipelineStatusLabel = (status: string | null | undefined) => {
    switch (status) {
      case "prospect": return "Prospect";
      case "meeting_scheduled": return "Reunião Agendada";
      case "meeting_done": return "Reunião Feita";
      case "due_diligence": return "Due Diligence";
      case "invested": return "Investida";
      default: return "Não definido";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Empresas</h1>
          <p className="text-muted-foreground">
            Gerencie e acompanhe todas as empresas do seu portfólio.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-atria-red hover:bg-atria-red/90">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Empresa
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Cadastrar Nova Empresa</DialogTitle>
            </DialogHeader>
            <CompanyForm onSuccess={() => setIsDialogOpen(false)} onCancel={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Lista de Empresas</CardTitle>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar empresa..."
                className="w-full sm:w-[300px] pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-atria-red" />
            </div>
          ) : (
            <Tabs defaultValue="table" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="table">Tabela</TabsTrigger>
                <TabsTrigger value="cards">Cartões</TabsTrigger>
              </TabsList>
              <TabsContent value="table">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Responsável</TableHead>
                        <TableHead>Pipeline</TableHead>
                        <TableHead>Nota</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCompanies.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                            Nenhuma empresa cadastrada.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredCompanies.map((company) => (
                          <TableRow 
                            key={company.id} 
                            className="cursor-pointer hover:bg-muted/50"
                          >
                            <TableCell 
                              className="font-medium flex items-center gap-2"
                              onClick={() => navigate(`/company/${company.id}`)}
                            >
                              <div className={`w-3 h-3 rounded-full ${getScoreColor(company.score_color)}`}></div>
                              {company.name}
                            </TableCell>
                            <TableCell onClick={() => navigate(`/company/${company.id}`)}>
                              {company.responsible || "Não definido"}
                            </TableCell>
                            <TableCell onClick={() => navigate(`/company/${company.id}`)}>
                              {getPipelineStatusLabel(company.pipeline_status)}
                            </TableCell>
                            <TableCell onClick={() => navigate(`/company/${company.id}`)}>
                              {company.final_score !== null && company.final_score !== undefined
                                ? company.final_score.toFixed(1)
                                : "N/A"}
                            </TableCell>
                            <TableCell onClick={() => navigate(`/company/${company.id}`)}>
                              <span className={`
                                px-2.5 py-0.5 rounded-full text-xs font-medium 
                                ${getStatusColor(company.status)}
                              `}>
                                {getStatusLabel(company.status)}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                                onClick={(e) => handleDeleteClick(e, company.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              <TabsContent value="cards">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCompanies.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                      Nenhuma empresa cadastrada.
                    </div>
                  ) : (
                    filteredCompanies.map((company) => (
                      <div key={company.id} className="relative" onClick={() => navigate(`/company/${company.id}`)}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 z-10 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(e, company.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <DataCard
                          title={company.name}
                          value={company.name}
                          responsible={company.responsible || undefined}
                          pipelineStatus={company.pipeline_status || undefined}
                          finalScore={company.final_score}
                          scoreColor={company.score_color as "green" | "orange" | "red" | null}
                          status={company.status || undefined}
                          className="cursor-pointer hover:shadow-md transition-shadow h-full"
                        />
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta empresa? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCompanyToDelete(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Companies;
