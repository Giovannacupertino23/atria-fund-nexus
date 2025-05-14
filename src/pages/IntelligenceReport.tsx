
import { useState, useMemo } from 'react';
import { useCompany, Company } from '@/context/CompanyContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, FileText, FileCsv, FileX, Loader2, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PromptGenerator } from '@/components/intelligence/PromptGenerator';
import { CompanyReportCard } from '@/components/intelligence/CompanyReportCard';
import { ExportOptions } from '@/components/intelligence/ExportOptions';

const IntelligenceReport = () => {
  const { companies, isLoading } = useCompany();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'consolidated' | 'prompt' | 'export'>('consolidated');
  
  // Filter companies based on search term
  const filteredCompanies = useMemo(() => {
    if (!searchTerm.trim()) return companies;
    
    const lowerCaseSearch = searchTerm.toLowerCase();
    return companies.filter(company => 
      company.name.toLowerCase().includes(lowerCaseSearch) || 
      company.sector.toLowerCase().includes(lowerCaseSearch) ||
      (company.status && company.status.toLowerCase().includes(lowerCaseSearch))
    );
  }, [companies, searchTerm]);

  // Get selected company details
  const selectedCompany = useMemo(() => {
    if (!selectedCompanyId) return null;
    return companies.find(c => c.id === selectedCompanyId) || null;
  }, [companies, selectedCompanyId]);

  const handleCompanySelect = (companyId: string) => {
    setSelectedCompanyId(companyId);
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <Loader2 className="h-10 w-10 animate-spin text-atria-red mb-4" />
        <p className="text-muted-foreground">Carregando informações...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Relatório de Inteligência</h1>
          <p className="text-muted-foreground">
            Análise consolidada, prompts inteligentes e exportação de dados
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Pesquisar empresas..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Company Sidebar */}
        <Card className="lg:col-span-3 h-[calc(100vh-220px)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Empresas</CardTitle>
            <CardDescription>Selecione uma empresa para análise</CardDescription>
          </CardHeader>
          <ScrollArea className="h-[calc(100vh-300px)]">
            <div className="px-4 py-2">
              {filteredCompanies.length === 0 ? (
                <p className="text-sm text-center text-muted-foreground py-4">
                  Nenhuma empresa encontrada
                </p>
              ) : (
                <div className="space-y-1">
                  {filteredCompanies.map((company) => (
                    <div
                      key={company.id}
                      className={`p-2 rounded-md cursor-pointer ${
                        selectedCompanyId === company.id
                          ? 'bg-muted'
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => handleCompanySelect(company.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{company.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {company.sector}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full ${
                            company.score_color === 'green' ? 'bg-green-500' :
                            company.score_color === 'orange' ? 'bg-orange-500' : 
                            company.score_color === 'red' ? 'bg-red-500' : 'bg-gray-500'
                          }`} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </Card>

        {/* Main Content Area */}
        <div className="lg:col-span-9">
          {!selectedCompany ? (
            <Card className="h-[calc(100vh-220px)] flex flex-col items-center justify-center p-6">
              <BarChart3 className="h-16 w-16 text-muted-foreground/40 mb-4" />
              <h3 className="text-xl font-medium mb-2">Selecione uma Empresa</h3>
              <p className="text-muted-foreground text-center max-w-md">
                Escolha uma empresa na lista para visualizar o relatório de inteligência, 
                gerar prompts inteligentes ou exportar dados
              </p>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{selectedCompany.name}</CardTitle>
                    <CardDescription>
                      {selectedCompany.sector} • CNPJ: {selectedCompany.cnpj}
                    </CardDescription>
                  </div>
                  {selectedCompany.final_score !== null && (
                    <Badge className={`
                      ${selectedCompany.score_color === 'green' ? 'bg-green-500' :
                        selectedCompany.score_color === 'orange' ? 'bg-orange-500' :
                        selectedCompany.score_color === 'red' ? 'bg-red-500' : 'bg-gray-500'} 
                      text-white px-3 py-1`
                    }>
                      {selectedCompany.final_score.toFixed(1)}
                    </Badge>
                  )}
                </div>
                <Tabs onValueChange={(value) => setCurrentView(value as any)} value={currentView}>
                  <TabsList className="grid grid-cols-3 w-[400px]">
                    <TabsTrigger value="consolidated">Relatório Consolidado</TabsTrigger>
                    <TabsTrigger value="prompt">Gerar Prompts</TabsTrigger>
                    <TabsTrigger value="export">Exportar Dados</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>

              <CardContent>
                {currentView === 'consolidated' && (
                  <CompanyReportCard company={selectedCompany} />
                )}

                {currentView === 'prompt' && (
                  <PromptGenerator company={selectedCompany} />
                )}

                {currentView === 'export' && (
                  <ExportOptions company={selectedCompany} />
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default IntelligenceReport;
