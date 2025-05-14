
import { useState } from 'react';
import { Company } from '@/context/CompanyContext';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { FileCsv, FileText, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ExportOptionsProps {
  company: Company;
}

type ExportFormat = 'csv' | 'txt';

export const ExportOptions = ({ company }: ExportOptionsProps) => {
  const { toast } = useToast();
  const [selectedFields, setSelectedFields] = useState({
    basicInfo: true,
    financials: true,
    ratings: true,
    risks: true,
    dueDiligence: true
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('csv');
  
  // Helper functions for formatting data
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
  
  // Function to export data based on selected format and fields
  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const fileName = `report-${company.name.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}`;
      let content = '';
      let fileExtension = exportFormat === 'csv' ? 'csv' : 'txt';
      
      // Generate content based on format and selected fields
      if (exportFormat === 'csv') {
        // CSV Header
        const headers = ['Campo', 'Valor'];
        content = headers.join(',') + '\n';
        
        // Basic Info
        if (selectedFields.basicInfo) {
          content += `"Nome","${company.name}"\n`;
          content += `"Setor","${company.sector}"\n`;
          content += `"CNPJ","${company.cnpj}"\n`;
          if (company.website) content += `"Website","${company.website}"\n`;
          if (company.responsible) content += `"Responsável","${company.responsible}"\n`;
        }
        
        // Financials
        if (selectedFields.financials) {
          content += `"Receita Anual 2024","${company.annual_revenue_2024 || 'N/A'}"\n`;
          content += `"Market Cap","${company.market_cap || 'N/A'}"\n`;
          content += `"Margem Líquida 2024","${company.net_margin_2024 || 'N/A'}%"\n`;
          content += `"EBITDA 2023","${company.ebitda_2023 || 'N/A'}%"\n`;
          content += `"EBITDA 2024","${company.ebitda_2024 || 'N/A'}%"\n`;
          content += `"EBITDA 2025","${company.ebitda_2025 || 'N/A'}%"\n`;
          content += `"Crescimento 21/22","${company.yoy_growth_21_22 || 'N/A'}%"\n`;
          content += `"Crescimento 22/23","${company.yoy_growth_22_23 || 'N/A'}%"\n`;
          content += `"Crescimento 23/24","${company.yoy_growth_23_24 || 'N/A'}%"\n`;
          content += `"Fluxo de Caixa","${company.cash_flow === 'positive' ? 'Positivo' : company.cash_flow === 'negative' ? 'Negativo' : 'N/A'}"\n`;
          content += `"Alavancagem","${company.leverage || 'N/A'}%"\n`;
          content += `"Distribuição de Dividendos","${company.dividend_distribution === true ? 'Sim' : 'Não'}"\n`;
        }
        
        // Ratings
        if (selectedFields.ratings) {
          content += `"Score Final","${company.final_score?.toFixed(1) || 'N/A'}"\n`;
          content += `"Status","${getStatusLabel(company.status)}"\n`;
          content += `"Status Pipeline","${company.pipeline_status?.replace('_', ' ') || 'N/A'}"\n`;
        }
        
        // Risks
        if (selectedFields.risks) {
          content += `"Risco Financeiro","${company.financial_risk || 'N/A'}"\n`;
          content += `"Risco Jurídico","${company.legal_risk || 'N/A'}"\n`;
          content += `"Risco Estratégico","${company.governance_risk || 'N/A'}"\n`;
          if (company.risk_factors) content += `"Fatores de Risco","${company.risk_factors.replace(/"/g, '""')}"\n`;
        }
        
        // Due Diligence
        if (selectedFields.dueDiligence) {
          if (company.financial_analysis) content += `"Análise Financeira","${company.financial_analysis.replace(/"/g, '""')}"\n`;
          if (company.legal_analysis) content += `"Análise Jurídica","${company.legal_analysis.replace(/"/g, '""')}"\n`;
          if (company.governance_analysis) content += `"Análise Estratégica","${company.governance_analysis.replace(/"/g, '""')}"\n`;
        }
      }
      else {
        // TXT Format (structured plain text)
        content += `RELATÓRIO DE INTELIGÊNCIA: ${company.name}\n`;
        content += `Data de exportação: ${new Date().toLocaleDateString('pt-BR')}\n\n`;
        
        // Basic Info
        if (selectedFields.basicInfo) {
          content += `=== INFORMAÇÕES BÁSICAS ===\n`;
          content += `Nome: ${company.name}\n`;
          content += `Setor: ${company.sector}\n`;
          content += `CNPJ: ${company.cnpj}\n`;
          if (company.website) content += `Website: ${company.website}\n`;
          if (company.responsible) content += `Responsável: ${company.responsible}\n`;
          content += `\n`;
        }
        
        // Financials
        if (selectedFields.financials) {
          content += `=== INFORMAÇÕES FINANCEIRAS ===\n`;
          content += `Receita Anual 2024: ${formatCurrency(company.annual_revenue_2024)}\n`;
          content += `Market Cap: ${formatCurrency(company.market_cap)}\n`;
          content += `Margem Líquida 2024: ${formatPercent(company.net_margin_2024)}\n`;
          content += `EBITDA 2023: ${formatPercent(company.ebitda_2023)}\n`;
          content += `EBITDA 2024: ${formatPercent(company.ebitda_2024)}\n`;
          content += `EBITDA 2025: ${formatPercent(company.ebitda_2025)}\n`;
          content += `Crescimento 21/22: ${formatPercent(company.yoy_growth_21_22)}\n`;
          content += `Crescimento 22/23: ${formatPercent(company.yoy_growth_22_23)}\n`;
          content += `Crescimento 23/24: ${formatPercent(company.yoy_growth_23_24)}\n`;
          content += `Fluxo de Caixa: ${company.cash_flow === 'positive' ? 'Positivo' : company.cash_flow === 'negative' ? 'Negativo' : 'N/A'}\n`;
          content += `Alavancagem: ${formatPercent(company.leverage)}\n`;
          content += `Distribuição de Dividendos: ${company.dividend_distribution === true ? 'Sim' : 'Não'}\n`;
          content += `\n`;
        }
        
        // Ratings
        if (selectedFields.ratings) {
          content += `=== AVALIAÇÃO ===\n`;
          content += `Score Final: ${company.final_score?.toFixed(1) || 'N/A'}\n`;
          content += `Status: ${getStatusLabel(company.status)}\n`;
          content += `Status Pipeline: ${company.pipeline_status?.replace('_', ' ') || 'N/A'}\n`;
          content += `\n`;
        }
        
        // Risks
        if (selectedFields.risks) {
          content += `=== RISCOS ===\n`;
          content += `Risco Financeiro: ${company.financial_risk || 'N/A'}\n`;
          content += `Risco Jurídico: ${company.legal_risk || 'N/A'}\n`;
          content += `Risco Estratégico: ${company.governance_risk || 'N/A'}\n`;
          if (company.risk_factors) {
            content += `\nFatores de Risco:\n${company.risk_factors}\n`;
          }
          content += `\n`;
        }
        
        // Due Diligence
        if (selectedFields.dueDiligence) {
          content += `=== DUE DILIGENCE ===\n`;
          if (company.financial_analysis) {
            content += `Análise Financeira:\n${company.financial_analysis}\n\n`;
          }
          if (company.legal_analysis) {
            content += `Análise Jurídica:\n${company.legal_analysis}\n\n`;
          }
          if (company.governance_analysis) {
            content += `Análise Estratégica:\n${company.governance_analysis}\n\n`;
          }
        }
      }
      
      // Create and download the file
      const blob = new Blob([content], { type: exportFormat === 'csv' ? 'text/csv;charset=utf-8;' : 'text/plain;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `${fileName}.${fileExtension}`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Exportação concluída",
        description: `Os dados foram exportados com sucesso no formato ${exportFormat.toUpperCase()}.`
      });
    } catch (error) {
      console.error("Erro ao exportar dados:", error);
      toast({
        title: "Erro na exportação",
        description: "Ocorreu um erro ao exportar os dados. Por favor, tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="format" className="w-full">
        <TabsList>
          <TabsTrigger value="format">Formato</TabsTrigger>
          <TabsTrigger value="content">Conteúdo</TabsTrigger>
        </TabsList>
        
        <TabsContent value="format" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card 
              className={`cursor-pointer ${exportFormat === 'csv' ? 'ring-2 ring-primary' : ''}`}
              onClick={() => setExportFormat('csv')}
            >
              <CardContent className="p-4 flex items-center space-x-4">
                <div className={`
                  p-3 rounded-full 
                  ${exportFormat === 'csv' ? 'bg-primary text-primary-foreground' : 'bg-muted'}
                `}>
                  <FileCsv className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-medium">CSV</h3>
                  <p className="text-sm text-muted-foreground">
                    Formato estruturado para análise em Excel
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card 
              className={`cursor-pointer ${exportFormat === 'txt' ? 'ring-2 ring-primary' : ''}`}
              onClick={() => setExportFormat('txt')}
            >
              <CardContent className="p-4 flex items-center space-x-4">
                <div className={`
                  p-3 rounded-full 
                  ${exportFormat === 'txt' ? 'bg-primary text-primary-foreground' : 'bg-muted'}
                `}>
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-medium">TXT</h3>
                  <p className="text-sm text-muted-foreground">
                    Texto estruturado para uso como prompt
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Separator />
          
          <div className="text-sm text-muted-foreground">
            <p>
              <strong>CSV (Valores Separados por Vírgula):</strong> Ideal para importar em planilhas e ferramentas de análise de dados.
            </p>
            <p className="mt-2">
              <strong>TXT (Texto Estruturado):</strong> Perfeito para uso como prompt em ferramentas de IA ou para leitura rápida.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="content" className="space-y-4 pt-4">
          <Label>Selecione os dados que deseja exportar:</Label>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="basicInfo"
                checked={selectedFields.basicInfo}
                onCheckedChange={(checked) => 
                  setSelectedFields({...selectedFields, basicInfo: checked === true})
                }
              />
              <label
                htmlFor="basicInfo"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Informações Básicas (Nome, Setor, CNPJ)
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="financials"
                checked={selectedFields.financials}
                onCheckedChange={(checked) => 
                  setSelectedFields({...selectedFields, financials: checked === true})
                }
              />
              <label
                htmlFor="financials"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Dados Financeiros (Receita, EBITDA, Margens)
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="ratings"
                checked={selectedFields.ratings}
                onCheckedChange={(checked) => 
                  setSelectedFields({...selectedFields, ratings: checked === true})
                }
              />
              <label
                htmlFor="ratings"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Avaliação e Status
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="risks"
                checked={selectedFields.risks}
                onCheckedChange={(checked) => 
                  setSelectedFields({...selectedFields, risks: checked === true})
                }
              />
              <label
                htmlFor="risks"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Riscos e Fatores de Risco
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="dueDiligence"
                checked={selectedFields.dueDiligence}
                onCheckedChange={(checked) => 
                  setSelectedFields({...selectedFields, dueDiligence: checked === true})
                }
              />
              <label
                htmlFor="dueDiligence"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Análises de Due Diligence
              </label>
            </div>
          </div>
          
          <Separator />
          
          <div className="text-sm text-muted-foreground">
            <p>
              Selecione as categorias de informações que deseja incluir no arquivo exportado.
              Pelo menos uma categoria deve ser selecionada.
            </p>
          </div>
        </TabsContent>
      </Tabs>
      
      <Button 
        className="w-full" 
        onClick={handleExport}
        disabled={
          isExporting || 
          !Object.values(selectedFields).some(Boolean) // At least one field should be selected
        }
      >
        {isExporting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Exportando...
          </>
        ) : (
          <>
            {exportFormat === 'csv' ? (
              <FileCsv className="mr-2 h-4 w-4" />
            ) : (
              <FileText className="mr-2 h-4 w-4" />
            )}
            Exportar como {exportFormat.toUpperCase()}
          </>
        )}
      </Button>
    </div>
  );
};
