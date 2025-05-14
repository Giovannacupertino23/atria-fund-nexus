
import { Company } from '@/context/CompanyContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Info } from 'lucide-react';

interface CompanyReportCardProps {
  company: Company;
}

export const CompanyReportCard = ({ company }: CompanyReportCardProps) => {
  // Helper functions for formatting
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

  // Calculate averages safely
  const calculateAverage = (values: (number | null | undefined)[]) => {
    const validValues = values.filter((v): v is number => v !== null && v !== undefined);
    if (validValues.length === 0) return null;
    return validValues.reduce((sum, val) => sum + val, 0) / validValues.length;
  };
  
  const ebitdaAvg = calculateAverage([company.ebitda_2023, company.ebitda_2024, company.ebitda_2025]);
  const yoyAvg = calculateAverage([company.yoy_growth_21_22, company.yoy_growth_22_23, company.yoy_growth_23_24]);
  
  // Get status label
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

  const getRiskLevelLabel = (level: string | null | undefined) => {
    switch (level) {
      case "high":
        return "Alto";
      case "medium":
        return "Médio";
      case "low":
        return "Baixo";
      default:
        return "N/A";
    }
  };

  const getRiskLevelColor = (level: string | null | undefined) => {
    switch (level) {
      case "high":
        return "text-red-600";
      case "medium":
        return "text-amber-600";
      case "low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Status do Investimento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Status:</span>
                <Badge className={getStatusColor(company.status)}>
                  {getStatusLabel(company.status)}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Score Final:</span>
                <span className="font-medium">{company.final_score?.toFixed(1) ?? "N/A"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Pipeline:</span>
                <span className="font-medium capitalize">
                  {company.pipeline_status?.replace("_", " ") ?? "N/A"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Métricas Financeiras</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs text-muted-foreground">Receita (2024)</p>
                <p className="font-medium">
                  {formatCurrency(company.annual_revenue_2024)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Market Cap</p>
                <p className="font-medium">
                  {formatCurrency(company.market_cap)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">EBITDA Médio</p>
                <p className="font-medium">{ebitdaAvg ? formatPercent(ebitdaAvg) : "N/A"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Margem Líquida</p>
                <p className="font-medium">{formatPercent(company.net_margin_2024)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Crescimento YoY</p>
                <p className="font-medium">{yoyAvg ? formatPercent(yoyAvg) : "N/A"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Alavancagem</p>
                <p className="font-medium">{formatPercent(company.leverage)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Riscos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-2">
              <div>
                <p className="text-xs text-muted-foreground">Financeiro</p>
                <p className={`font-medium ${getRiskLevelColor(company.financial_risk)}`}>
                  {getRiskLevelLabel(company.financial_risk)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Jurídico</p>
                <p className={`font-medium ${getRiskLevelColor(company.legal_risk)}`}>
                  {getRiskLevelLabel(company.legal_risk)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Estratégico</p>
                <p className={`font-medium ${getRiskLevelColor(company.governance_risk)}`}>
                  {getRiskLevelLabel(company.governance_risk)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Fluxo de Caixa</p>
                <p className={`font-medium ${company.cash_flow === "positive" ? "text-green-600" : "text-red-600"}`}>
                  {company.cash_flow === "positive" ? "Positivo" : company.cash_flow === "negative" ? "Negativo" : "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="col-span-3">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Análises Detalhadas</CardTitle>
          <CardDescription>Due diligence e fatores de risco</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ScrollArea className="h-[300px]">
            <div className="space-y-4">
              {company.about && (
                <div>
                  <h4 className="font-medium mb-1">Sobre a Empresa</h4>
                  <p className="text-sm text-muted-foreground">{company.about}</p>
                  <Separator className="my-3" />
                </div>
              )}
              
              {company.risk_factors && (
                <div>
                  <h4 className="font-medium mb-1">Fatores de Risco</h4>
                  <p className="text-sm text-muted-foreground">{company.risk_factors}</p>
                  <Separator className="my-3" />
                </div>
              )}
              
              {company.financial_analysis && (
                <div>
                  <h4 className="font-medium mb-1">Análise Financeira</h4>
                  <p className="text-sm text-muted-foreground">{company.financial_analysis}</p>
                  <Separator className="my-3" />
                </div>
              )}
              
              {company.legal_analysis && (
                <div>
                  <h4 className="font-medium mb-1">Análise Jurídica</h4>
                  <p className="text-sm text-muted-foreground">{company.legal_analysis}</p>
                  <Separator className="my-3" />
                </div>
              )}
              
              {company.governance_analysis && (
                <div>
                  <h4 className="font-medium mb-1">Análise Estratégica</h4>
                  <p className="text-sm text-muted-foreground">{company.governance_analysis}</p>
                </div>
              )}
              
              {!company.financial_analysis && !company.legal_analysis && !company.governance_analysis && !company.risk_factors && !company.about && (
                <div className="flex flex-col items-center justify-center py-8">
                  <Info className="h-8 w-8 text-muted-foreground/40 mb-2" />
                  <p className="text-muted-foreground text-center">
                    Não há análises detalhadas disponíveis para esta empresa.
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};
