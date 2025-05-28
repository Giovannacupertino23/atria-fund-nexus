import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCompany } from "@/context/CompanyContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, Edit, Info, Loader2, RefreshCw } from "lucide-react";
import DataCard from "@/components/ui/DataCard";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CompanyEditForm from "@/components/forms/CompanyEditForm";
import DueDiligenceForm from "@/components/forms/DueDiligenceForm";
import DueDiligenceView from "@/components/DueDiligenceView";
import SingleDueDiligenceForm, { DueDiligenceType } from "@/components/forms/SingleDueDiligenceForm";
import IntelligentAnalysis from "@/components/IntelligentAnalysis";
import InefficiencyLogsList from "@/components/InefficiencyLogs/InefficiencyLogsList";

const CompanyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCompanyById, loadCompanies, isLoading, companyLoadError, loadingCompanyId, companies } = useCompany();
  const { toast } = useToast();
  const [retryCount, setRetryCount] = useState(0);
  const [localLoading, setLocalLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDueDiligenceEditMode, setIsDueDiligenceEditMode] = useState(false);
  const [currentDueDiligenceType, setCurrentDueDiligenceType] = useState<DueDiligenceType | null>(null);
  const [showInefficiencyLogs, setShowInefficiencyLogs] = useState(false);
  
  useEffect(() => {
    const loadData = async () => {
      if (id && companies.length === 0) {
        console.log("Carregando dados da empresa:", id);
        await loadCompanies();
      }
      setLocalLoading(false);
    };
    loadData();
  }, [id, loadCompanies, companies.length, retryCount]);
  
  const company = id ? getCompanyById(id) : undefined;
  
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setLocalLoading(true);
    toast({
      title: "Tentando novamente",
      description: "Tentando carregar os dados da empresa novamente..."
    });
  };
  
  const handleEditComplete = () => {
    setIsEditDialogOpen(false);
    toast({
      title: "Empresa atualizada",
      description: "Os dados foram atualizados com sucesso."
    });
  };

  const handleDueDiligenceComplete = () => {
    setIsDueDiligenceEditMode(false);
    setCurrentDueDiligenceType(null);
    toast({
      title: "Due Diligence atualizada",
      description: "As informações de due diligence foram atualizadas com sucesso."
    });
  };
  
  const handleEditFinancial = () => {
    setCurrentDueDiligenceType("financial");
  };
  
  const handleEditLegal = () => {
    setCurrentDueDiligenceType("legal");
  };
  
  const handleEditGovernance = () => {
    setCurrentDueDiligenceType("governance");
  };
  
  const handleCancelSingleEdit = () => {
    setCurrentDueDiligenceType(null);
  };

  const handleAnalysisUpdate = () => {
    // Refresh company data to get the latest analysis
    loadCompanies();
  };
  
  if (isLoading || localLoading) {
    return <div className="flex flex-col items-center justify-center h-[70vh]">
        <Loader2 className="h-10 w-10 animate-spin text-atria-red mb-4" />
        <p className="text-muted-foreground">Carregando informações...</p>
      </div>;
  }
  
  if (companyLoadError) {
    return <div className="flex flex-col items-center justify-center h-[70vh]">
        <h1 className="text-2xl font-bold mb-4">Erro ao carregar dados</h1>
        <p className="text-muted-foreground mb-6">Ocorreu um erro ao tentar carregar as informações da empresa</p>
        <Button onClick={handleRetry} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Tentar novamente
        </Button>
      </div>;
  }
  
  if (!company) {
    return <div className="flex flex-col items-center justify-center h-[70vh]">
        <h1 className="text-2xl font-bold mb-4">Empresa não encontrada</h1>
        <p className="text-muted-foreground mb-6">Não foi possível encontrar os dados desta empresa</p>
        <div className="flex gap-4">
          <Button onClick={() => navigate("/")} variant="outline">
            Voltar para listagem
          </Button>
          <Button onClick={handleRetry} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Tentar novamente
          </Button>
        </div>
      </div>;
  }
  
  const formatCurrency = (value: number | null | undefined) => {
    if (value === null || value === undefined) return "N/A";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(value);
  };
  
  const formatPercent = (value: number | null | undefined) => {
    if (value === null || value === undefined) return "N/A";
    return `${value}%`;
  };
  
  const getStatusLabel = (status: string | null | undefined) => {
    switch (status) {
      case "approved":
        return "Aprovada";
      case "evaluating":
        return "Em Avaliação";
      case "not_approved":
        return "Não Aprovada";
      default:
        return "Em Avaliação";
    }
  };
  
  const getStatusColor = (status: string | null | undefined) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "evaluating":
        return "bg-yellow-100 text-yellow-800";
      case "not_approved":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  const getScoreColor = (color: string | null | undefined) => {
    switch (color) {
      case "green":
        return "bg-green-500 text-white";
      case "orange":
        return "bg-orange-500 text-white";
      case "red":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-300 text-gray-800";
    }
  };
  
  const getScoreColorBg = (color: string | null | undefined) => {
    switch (color) {
      case "green":
        return "bg-green-50";
      case "orange":
        return "bg-orange-50";
      case "red":
        return "bg-red-50";
      default:
        return "bg-gray-50";
    }
  };
  
  // Função auxiliar para calcular médias com segurança
  const calculateAverage = (values: (number | null | undefined)[]) => {
    const validValues = values.filter((v): v is number => v !== null && v !== undefined);
    if (validValues.length === 0) return null;
    return validValues.reduce((sum, val) => sum + val, 0) / validValues.length;
  };
  
  // Calcular médias de EBITDA e YoY com segurança
  const ebitdaAvg = calculateAverage([company.ebitda_2023, company.ebitda_2024, company.ebitda_2025]);
  const yoyAvg = calculateAverage([company.yoy_growth_21_22, company.yoy_growth_22_23, company.yoy_growth_23_24]);
  
  const renderDueDiligenceContent = () => {
    if (currentDueDiligenceType === "financial") {
      return (
        <SingleDueDiligenceForm 
          companyId={company.id}
          type="financial"
          title="Financeira"
          borderColor="border-l-blue-500"
          initialData={{
            link: company.financial_link,
            analysis: company.financial_analysis,
            risk: company.financial_risk,
          }}
          onSuccess={handleDueDiligenceComplete}
          onCancel={handleCancelSingleEdit}
        />
      );
    } else if (currentDueDiligenceType === "legal") {
      return (
        <SingleDueDiligenceForm 
          companyId={company.id}
          type="legal"
          title="Jurídica"
          borderColor="border-l-purple-500"
          initialData={{
            link: company.legal_link,
            analysis: company.legal_analysis,
            risk: company.legal_risk,
          }}
          onSuccess={handleDueDiligenceComplete}
          onCancel={handleCancelSingleEdit}
        />
      );
    } else if (currentDueDiligenceType === "governance") {
      return (
        <SingleDueDiligenceForm 
          companyId={company.id}
          type="governance"
          title="de Governança"
          borderColor="border-l-emerald-500"
          initialData={{
            link: company.governance_link,
            analysis: company.governance_analysis,
            risk: company.governance_risk,
          }}
          onSuccess={handleDueDiligenceComplete}
          onCancel={handleCancelSingleEdit}
        />
      );
    }
    
    if (isDueDiligenceEditMode) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Editar Due Diligence</CardTitle>
            <CardDescription>
              Preencha as informações de due diligence para esta empresa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DueDiligenceForm 
              companyId={company.id}
              initialData={{
                financial_link: company.financial_link,
                financial_analysis: company.financial_analysis,
                financial_risk: company.financial_risk,
                legal_link: company.legal_link,
                legal_analysis: company.legal_analysis,
                legal_risk: company.legal_risk,
                governance_link: company.governance_link,
                governance_analysis: company.governance_analysis,
                governance_risk: company.governance_risk,
              }}
              onSuccess={handleDueDiligenceComplete}
            />
          </CardContent>
        </Card>
      );
    } else {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Due Diligence</CardTitle>
            <CardDescription>
              Análise detalhada de due diligence da empresa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DueDiligenceView 
              dueDiligenceData={{
                financial_link: company.financial_link,
                financial_analysis: company.financial_analysis,
                financial_risk: company.financial_risk,
                legal_link: company.legal_link,
                legal_analysis: company.legal_analysis,
                legal_risk: company.legal_risk,
                governance_link: company.governance_link,
                governance_analysis: company.governance_analysis,
                governance_risk: company.governance_risk,
              }}
              onEdit={() => setIsDueDiligenceEditMode(true)}
              onEditFinancial={handleEditFinancial}
              onEditLegal={handleEditLegal}
              onEditGovernance={handleEditGovernance}
            />
          </CardContent>
        </Card>
      );
    }
  };
  
  return <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => navigate("/")} className="h-9 w-9">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">{company.name}</h1>
              <div className={`w-3 h-3 rounded-full ${company.score_color ? `bg-${company.score_color}-500` : "bg-gray-300"}`}></div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{company.cnpj}</span>
              <span className="text-lg">•</span>
              <span>{company.sector}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(company.status)}`}>
            {getStatusLabel(company.status)}
          </span>
          <Button variant="outline" size="sm" onClick={() => setIsEditDialogOpen(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
        </div>
      </div>

      {/* Modal de Edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Empresa: {company.name}</DialogTitle>
            <DialogDescription>
              Atualize as informações da empresa. Clique em salvar quando terminar.
            </DialogDescription>
          </DialogHeader>
          <CompanyEditForm company={company} onSuccess={handleEditComplete} onCancel={() => setIsEditDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Score Card */}
        <Card className={`${getScoreColorBg(company.score_color)} border-2 ${company.score_color ? `border-${company.score_color}-500` : "border-gray-300"}`}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Avaliação Final</span>
              <div className={`px-4 py-2 rounded-md ${getScoreColor(company.score_color)}`}>
                {company.final_score !== null && company.final_score !== undefined ? company.final_score.toFixed(1) : "N/A"}
              </div>
            </CardTitle>
            <CardDescription>
              Nota calculada com base nos critérios financeiros
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2 p-3 bg-white rounded-md shadow-sm">
                <p className="text-sm text-muted-foreground">EBITDA Médio</p>
                <p className="text-xl font-semibold">
                  {ebitdaAvg !== null ? `${ebitdaAvg.toFixed(1)}%` : "N/A"}
                </p>
                <p className="text-xs text-muted-foreground">Peso: 35%</p>
              </div>
              
              <div className="space-y-2 p-3 bg-white rounded-md shadow-sm">
                <p className="text-sm text-muted-foreground">Crescimento YoY</p>
                <p className="text-xl font-semibold">
                  {yoyAvg !== null ? `${yoyAvg.toFixed(1)}%` : "N/A"}
                </p>
                <p className="text-xs text-muted-foreground">Peso: 30%</p>
              </div>
              
              <div className="space-y-2 p-3 bg-white rounded-md shadow-sm">
                <p className="text-sm text-muted-foreground">Faturamento</p>
                <p className="text-xl font-semibold">
                  {company.annual_revenue_2024 ? formatCurrency(company.annual_revenue_2024 / 1000000) + "M" : "N/A"}
                </p>
                <p className="text-xs text-muted-foreground">Peso: 20%</p>
              </div>
              
              <div className="space-y-2 p-3 bg-white rounded-md shadow-sm">
                <p className="text-sm text-muted-foreground">Alavancagem</p>
                <p className="text-xl font-semibold">
                  {company.leverage !== null && company.leverage !== undefined ? `${company.leverage}%` : "N/A"}
                </p>
                <p className="text-xs text-muted-foreground">Peso: 15%</p>
              </div>
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground bg-white rounded-md p-3">
              <Info className="h-4 w-4 mr-2" />
              <span>Verde: nota ≥ 7,5 | Laranja: nota entre 5 e 7,4 | Vermelho: nota &lt; 5</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dados Gerais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Market Cap</p>
                <p className="font-medium text-lg">{formatCurrency(company.market_cap)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Faturamento 2024</p>
                <p className="font-medium text-lg">{formatCurrency(company.annual_revenue_2024)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Margem Líquida 2024</p>
                <p className="font-medium text-lg">{formatPercent(company.net_margin_2024)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Fluxo de Caixa</p>
                <p className="font-medium text-lg">
                  {company.cash_flow === "positive" ? "Positivo" : company.cash_flow === "negative" ? "Negativo" : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Distribuição de Dividendos</p>
                <p className="font-medium text-lg">
                  {company.dividend_distribution === true ? "Sim" : company.dividend_distribution === false ? "Não" : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Alavancagem</p>
                <p className="font-medium text-lg">{formatPercent(company.leverage)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="financial" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="financial">Dados Financeiros</TabsTrigger>
          <TabsTrigger value="about">Sobre</TabsTrigger>
          <TabsTrigger value="risks">Fatores de Risco</TabsTrigger>
          <TabsTrigger value="due_diligence">Due Diligence</TabsTrigger>
          <TabsTrigger value="intelligent_analysis">Análise Inteligente</TabsTrigger>
          <TabsTrigger value="inefficiency_logs">Logs de Ineficiência</TabsTrigger>
        </TabsList>
        
        <TabsContent value="financial">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">EBITDA</CardTitle>
                <CardDescription>Valores percentuais por ano</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-muted-foreground">EBITDA 2022</span>
                      <span className="font-medium">{formatPercent(company.ebitda_2023)}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      {company.ebitda_2023 !== null && company.ebitda_2023 !== undefined && (
                        <div 
                          className={`h-full ${company.ebitda_2023 >= 0 ? 'bg-atria-red' : 'bg-red-500'} rounded-full`} 
                          style={{
                            width: `${Math.abs(company.ebitda_2023)}%`,
                            maxWidth: '100%',
                            marginLeft: company.ebitda_2023 < 0 ? 'auto' : '0',
                            marginRight: company.ebitda_2023 < 0 ? '0' : 'auto'
                          }} 
                        />
                      )}
                    </div>
                    {company.ebitda_2023 !== null && company.ebitda_2023 !== undefined && company.ebitda_2023 < 0 && (
                      <p className="text-xs text-red-500 mt-1">Valor negativo</p>
                    )}
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-muted-foreground">EBITDA 2023</span>
                      <span className="font-medium">{formatPercent(company.ebitda_2024)}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      {company.ebitda_2024 !== null && company.ebitda_2024 !== undefined && (
                        <div 
                          className={`h-full ${company.ebitda_2024 >= 0 ? 'bg-atria-red' : 'bg-red-500'} rounded-full`} 
                          style={{
                            width: `${Math.abs(company.ebitda_2024)}%`,
                            maxWidth: '100%',
                            marginLeft: company.ebitda_2024 < 0 ? 'auto' : '0',
                            marginRight: company.ebitda_2024 < 0 ? '0' : 'auto'
                          }} 
                        />
                      )}
                    </div>
                    {company.ebitda_2024 !== null && company.ebitda_2024 !== undefined && company.ebitda_2024 < 0 && (
                      <p className="text-xs text-red-500 mt-1">Valor negativo</p>
                    )}
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-muted-foreground">EBITDA 2024</span>
                      <span className="font-medium">{formatPercent(company.ebitda_2025)}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      {company.ebitda_2025 !== null && company.ebitda_2025 !== undefined && (
                        <div 
                          className={`h-full ${company.ebitda_2025 >= 0 ? 'bg-atria-red' : 'bg-red-500'} rounded-full`} 
                          style={{
                            width: `${Math.abs(company.ebitda_2025)}%`,
                            maxWidth: '100%',
                            marginLeft: company.ebitda_2025 < 0 ? 'auto' : '0',
                            marginRight: company.ebitda_2025 < 0 ? '0' : 'auto'
                          }} 
                        />
                      )}
                    </div>
                    {company.ebitda_2025 !== null && company.ebitda_2025 !== undefined && company.ebitda_2025 < 0 && (
                      <p className="text-xs text-red-500 mt-1">Valor negativo</p>
                    )}
                  </div>
                  
                  <Separator className="my-2" />
                  
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Média EBITDA</p>
                    <p className={`font-medium text-lg ${ebitdaAvg !== null && ebitdaAvg < 0 ? 'text-red-500' : ''}`}>
                      {ebitdaAvg !== null ? `${ebitdaAvg.toFixed(1)}%` : "N/A"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Crescimento Anual (YoY)</CardTitle>
                <CardDescription>Valores percentuais por período</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-muted-foreground">YoY 21/22</span>
                      <span className="font-medium">{formatPercent(company.yoy_growth_21_22)}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      {company.yoy_growth_21_22 !== null && company.yoy_growth_21_22 !== undefined && (
                        <div 
                          className={`h-full ${company.yoy_growth_21_22 >= 0 ? 'bg-blue-500' : 'bg-red-500'} rounded-full`} 
                          style={{
                            width: `${Math.min(Math.abs(company.yoy_growth_21_22), 100)}%`,
                            maxWidth: '100%',
                            marginLeft: company.yoy_growth_21_22 < 0 ? 'auto' : '0',
                            marginRight: company.yoy_growth_21_22 < 0 ? '0' : 'auto'
                          }} 
                        />
                      )}
                    </div>
                    {company.yoy_growth_21_22 !== null && company.yoy_growth_21_22 !== undefined && company.yoy_growth_21_22 < 0 && (
                      <p className="text-xs text-red-500 mt-1">Valor negativo</p>
                    )}
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-muted-foreground">YoY 22/23</span>
                      <span className="font-medium">{formatPercent(company.yoy_growth_22_23)}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      {company.yoy_growth_22_23 !== null && company.yoy_growth_22_23 !== undefined && (
                        <div 
                          className={`h-full ${company.yoy_growth_22_23 >= 0 ? 'bg-blue-500' : 'bg-red-500'} rounded-full`} 
                          style={{
                            width: `${Math.min(Math.abs(company.yoy_growth_22_23), 100)}%`,
                            maxWidth: '100%',
                            marginLeft: company.yoy_growth_22_23 < 0 ? 'auto' : '0',
                            marginRight: company.yoy_growth_22_23 < 0 ? '0' : 'auto'
                          }} 
                        />
                      )}
                    </div>
                    {company.yoy_growth_22_23 !== null && company.yoy_growth_22_23 !== undefined && company.yoy_growth_22_23 < 0 && (
                      <p className="text-xs text-red-500 mt-1">Valor negativo</p>
                    )}
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-muted-foreground">YoY 23/24</span>
                      <span className="font-medium">{formatPercent(company.yoy_growth_23_24)}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      {company.yoy_growth_23_24 !== null && company.yoy_growth_23_24 !== undefined && (
                        <div 
                          className={`h-full ${company.yoy_growth_23_24 >= 0 ? 'bg-blue-500' : 'bg-red-500'} rounded-full`} 
                          style={{
                            width: `${Math.min(Math.abs(company.yoy_growth_23_24), 100)}%`,
                            maxWidth: '100%',
                            marginLeft: company.yoy_growth_23_24 < 0 ? 'auto' : '0',
                            marginRight: company.yoy_growth_23_24 < 0 ? '0' : 'auto'
                          }} 
                        />
                      )}
                    </div>
                    {company.yoy_growth_23_24 !== null && company.yoy_growth_23_24 !== undefined && company.yoy_growth_23_24 < 0 && (
                      <p className="text-xs text-red-500 mt-1">Valor negativo</p>
                    )}
                  </div>
                  
                  <Separator className="my-2" />
                  
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Crescimento Médio</p>
                    <p className={`font-medium text-lg ${yoyAvg !== null && yoyAvg < 0 ? 'text-red-500' : ''}`}>
                      {yoyAvg !== null ? `${yoyAvg.toFixed(1)}%` : "N/A"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle>Sobre a Empresa</CardTitle>
            </CardHeader>
            <CardContent>
              {company.about ? <div className="prose max-w-none">
                  <p>{company.about}</p>
                </div> : <div className="text-muted-foreground italic">
                  Nenhuma informação disponível sobre esta empresa.
                </div>}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="risks">
          <Card>
            <CardHeader>
              <CardTitle>Fatores de Risco</CardTitle>
            </CardHeader>
            <CardContent>
              {company.risk_factors ? <div className="prose max-w-none">
                  <p>{company.risk_factors}</p>
                </div> : <div className="text-muted-foreground italic">
                  Nenhum fator de risco registrado para esta empresa.
                </div>}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="due_diligence">
          {renderDueDiligenceContent()}
        </TabsContent>

        <TabsContent value="intelligent_analysis">
          <IntelligentAnalysis 
            companyId={company.id}
            initialAnalysis={company.intelligent_analysis || null}
            onUpdate={handleAnalysisUpdate}
            companyData={company}
          />
        </TabsContent>

        <TabsContent value="inefficiency_logs">
          <InefficiencyLogsList 
            companyId={company.id}
            isVisible={showInefficiencyLogs}
            onToggleVisibility={() => setShowInefficiencyLogs(!showInefficiencyLogs)}
          />
        </TabsContent>
      </Tabs>
    </div>;
};

export default CompanyDetails;
