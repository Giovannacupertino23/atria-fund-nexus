import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCompany, Company } from "@/context/CompanyContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Building2, ExternalLink } from "lucide-react";

const Companies = () => {
  const { companies, addCompany } = useCompany();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCompany, setNewCompany] = useState<Partial<Company>>({
    name: "",
    cnpj: "",
    revenue: 0,
    profitMargin: 0,
    retention: 0,
    churn: 0,
    cac: 0,
    ltv: 0,
    nps: 0,
    website: "",
    segment: "SaaS",
    status: "prospect",
    responsiblePerson: ""
  });
  const navigate = useNavigate();

  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.cnpj.includes(searchTerm)
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let parsedValue: string | number = value;
    
    if (["revenue", "profitMargin", "retention", "churn", "cac", "ltv", "nps"].includes(name)) {
      parsedValue = value === "" ? 0 : parseFloat(value);
    }
    
    setNewCompany({ ...newCompany, [name]: parsedValue });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewCompany({ ...newCompany, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newCompany.name && newCompany.cnpj) {
      addCompany(newCompany as Omit<Company, "id" | "documents">);
      setNewCompany({
        name: "",
        cnpj: "",
        revenue: 0,
        profitMargin: 0,
        retention: 0,
        churn: 0,
        cac: 0,
        ltv: 0,
        nps: 0,
        website: "",
        segment: "SaaS",
        status: "prospect",
        responsiblePerson: ""
      });
      setIsDialogOpen(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
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
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Cadastrar Nova Empresa</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Empresa *</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Nome da empresa"
                    value={newCompany.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ *</Label>
                  <Input
                    id="cnpj"
                    name="cnpj"
                    placeholder="XX.XXX.XXX/0001-XX"
                    value={newCompany.cnpj}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="revenue">Receita Mensal (R$)</Label>
                  <Input
                    id="revenue"
                    name="revenue"
                    type="number"
                    placeholder="0"
                    value={newCompany.revenue === 0 ? "" : newCompany.revenue}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profitMargin">Margem de Lucro (%)</Label>
                  <Input
                    id="profitMargin"
                    name="profitMargin"
                    type="number"
                    placeholder="0"
                    value={newCompany.profitMargin === 0 ? "" : newCompany.profitMargin}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="retention">Retenção (%)</Label>
                  <Input
                    id="retention"
                    name="retention"
                    type="number"
                    placeholder="0"
                    value={newCompany.retention === 0 ? "" : newCompany.retention}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="churn">Churn (%)</Label>
                  <Input
                    id="churn"
                    name="churn"
                    type="number"
                    placeholder="0"
                    value={newCompany.churn === 0 ? "" : newCompany.churn}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cac">CAC (R$)</Label>
                  <Input
                    id="cac"
                    name="cac"
                    type="number"
                    placeholder="0"
                    value={newCompany.cac === 0 ? "" : newCompany.cac}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ltv">LTV (R$)</Label>
                  <Input
                    id="ltv"
                    name="ltv"
                    type="number"
                    placeholder="0"
                    value={newCompany.ltv === 0 ? "" : newCompany.ltv}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nps">NPS</Label>
                  <Input
                    id="nps"
                    name="nps"
                    type="number"
                    placeholder="0"
                    value={newCompany.nps === 0 ? "" : newCompany.nps}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    name="website"
                    placeholder="https://..."
                    value={newCompany.website}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="segment">Segmento</Label>
                  <select
                    id="segment"
                    name="segment"
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                    value={newCompany.segment}
                    onChange={handleSelectChange}
                  >
                    <option value="SaaS">SaaS</option>
                    <option value="Marketplace">Marketplace</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="Fintech">Fintech</option>
                    <option value="Healthtech">Healthtech</option>
                    <option value="Edtech">Edtech</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    name="status"
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                    value={newCompany.status}
                    onChange={handleSelectChange}
                  >
                    <option value="prospect">Prospect</option>
                    <option value="agendado">Reunião Agendada</option>
                    <option value="reunido">Reunião Feita</option>
                    <option value="diligence">Due Diligence</option>
                    <option value="investida">Investida</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="responsiblePerson">Pessoa Responsável</Label>
                  <Input
                    id="responsiblePerson"
                    name="responsiblePerson"
                    placeholder="Nome do responsável"
                    value={newCompany.responsiblePerson}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="bg-atria-red hover:bg-atria-red/90">
                  Cadastrar
                </Button>
              </div>
            </form>
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
                      <TableHead>CNPJ</TableHead>
                      <TableHead>Segmento</TableHead>
                      <TableHead>Receita Mensal</TableHead>
                      <TableHead>Margem</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Responsável</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCompanies.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                          Nenhuma empresa encontrada.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCompanies.map((company) => (
                        <TableRow 
                          key={company.id} 
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => navigate(`/company/${company.id}`)}
                        >
                          <TableCell className="font-medium">{company.name}</TableCell>
                          <TableCell>{company.cnpj}</TableCell>
                          <TableCell>{company.segment}</TableCell>
                          <TableCell>{formatCurrency(company.revenue)}</TableCell>
                          <TableCell>{company.profitMargin}%</TableCell>
                          <TableCell>
                            <span className={`
                              px-2.5 py-0.5 rounded-full text-xs font-medium 
                              ${company.status === 'investida' ? 'bg-green-100 text-green-800' : ''}
                              ${company.status === 'diligence' ? 'bg-blue-100 text-blue-800' : ''}
                              ${company.status === 'reunido' ? 'bg-yellow-100 text-yellow-800' : ''}
                              ${company.status === 'agendado' ? 'bg-purple-100 text-purple-800' : ''}
                              ${company.status === 'prospect' ? 'bg-gray-100 text-gray-800' : ''}
                            `}>
                              {company.status === 'investida' && 'Investida'}
                              {company.status === 'diligence' && 'Due Diligence'}
                              {company.status === 'reunido' && 'Reunião Feita'}
                              {company.status === 'agendado' && 'Reunião Agendada'}
                              {company.status === 'prospect' && 'Prospect'}
                            </span>
                          </TableCell>
                          <TableCell>{company.responsiblePerson || '-'}</TableCell>
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
                    Nenhuma empresa encontrada.
                  </div>
                ) : (
                  filteredCompanies.map((company) => (
                    <Card 
                      key={company.id} 
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => navigate(`/company/${company.id}`)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <CardTitle className="text-lg">{company.name}</CardTitle>
                            <p className="text-xs text-muted-foreground">{company.cnpj}</p>
                          </div>
                          <span className={`
                            px-2.5 py-0.5 rounded-full text-xs font-medium 
                            ${company.status === 'investida' ? 'bg-green-100 text-green-800' : ''}
                            ${company.status === 'diligence' ? 'bg-blue-100 text-blue-800' : ''}
                            ${company.status === 'reunido' ? 'bg-yellow-100 text-yellow-800' : ''}
                            ${company.status === 'agendado' ? 'bg-purple-100 text-purple-800' : ''}
                            ${company.status === 'prospect' ? 'bg-gray-100 text-gray-800' : ''}
                          `}>
                            {company.status === 'investida' && 'Investida'}
                            {company.status === 'diligence' && 'Due Diligence'}
                            {company.status === 'reunido' && 'Reunião Feita'}
                            {company.status === 'agendado' && 'Reunião Agendada'}
                            {company.status === 'prospect' && 'Prospect'}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Segmento:</span>
                            <span>{company.segment}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Receita:</span>
                            <span>{formatCurrency(company.revenue)}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Margem:</span>
                            <span>{company.profitMargin}%</span>
                          </div>
                          {company.website && (
                            <div className="pt-2">
                              <a 
                                href={company.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs text-atria-red flex items-center hover:underline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                Visitar website
                              </a>
                            </div>
                          )}
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Responsável:</span>
                            <span>{company.responsiblePerson || '-'}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Companies;
