
import { useState } from 'react';
import { Company } from '@/context/CompanyContext';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Copy, RefreshCw } from 'lucide-react';

interface PromptGeneratorProps {
  company: Company;
}

type AudienceType = 'internal' | 'investors' | 'advisors';
type PromptType = 'analysis' | 'executive-summary' | 'communication';

export const PromptGenerator = ({ company }: PromptGeneratorProps) => {
  const { toast } = useToast();
  const [audience, setAudience] = useState<AudienceType>('internal');
  const [promptType, setPromptType] = useState<PromptType>('analysis');
  const [includeFields, setIncludeFields] = useState({
    financial: true,
    strategic: true,
    risks: true,
    rating: true,
    dueDiligence: true
  });
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  
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
  
  // Function to generate a prompt based on selected options
  const generatePrompt = () => {
    setIsGenerating(true);
    
    try {
      let prompt = '';
      const companyName = company.name;
      const statusLabel = getStatusLabel(company.status);
      
      // Base introduction based on prompt type
      if (promptType === 'analysis') {
        prompt = `Atualizar análise ${includeFields.risks ? 'de risco ' : ''}para ${companyName}`;
        
        if (includeFields.rating) {
          prompt += ` considerando nota de rating ${company.final_score?.toFixed(1) || "N/A"}`;
        }
        
        if (includeFields.financial) {
          prompt += ` e projeções financeiras recentes`;
        }
        
        prompt += `. A empresa está atualmente com status: ${statusLabel}.`;
      } 
      else if (promptType === 'executive-summary') {
        prompt = `Gerar sumário executivo sobre ${companyName}`;
        
        if (audience === 'investors') {
          prompt += ` para envio a potenciais investidores`;
        } else if (audience === 'advisors') {
          prompt += ` para compartilhamento com consultores estratégicos`;
        } else {
          prompt += ` para uso interno da equipe`;
        }
        
        prompt += `.`;
      }
      else if (promptType === 'communication') {
        prompt = `Criar template de e-mail`;
        
        if (audience === 'investors') {
          prompt += ` para investidores`;
        } else if (audience === 'advisors') {
          prompt += ` para advisors`;
        } else {
          prompt += ` para comunicação interna`;
        }
        
        prompt += ` sobre ${companyName} com status atual: ${statusLabel}.`;
      }
      
      // Add details based on selected fields
      let details = '';
      
      if (includeFields.financial) {
        details += `\n\nInformações Financeiras:`;
        if (company.annual_revenue_2024) details += `\n- Receita Anual: ${formatCurrency(company.annual_revenue_2024)}`;
        if (company.ebitda_2024) details += `\n- EBITDA: ${company.ebitda_2024}%`;
        if (company.net_margin_2024) details += `\n- Margem Líquida: ${company.net_margin_2024}%`;
        if (company.market_cap) details += `\n- Market Cap: ${formatCurrency(company.market_cap)}`;
      }
      
      if (includeFields.strategic) {
        details += `\n\nInformações Estratégicas:`;
        if (company.sector) details += `\n- Setor: ${company.sector}`;
        if (company.governance_analysis) details += `\n- Análise Estratégica: ${company.governance_analysis}`;
      }
      
      if (includeFields.risks) {
        details += `\n\nRiscos:`;
        if (company.risk_factors) details += `\n- Fatores de Risco: ${company.risk_factors}`;
        if (company.financial_risk) details += `\n- Risco Financeiro: ${company.financial_risk}`;
        if (company.legal_risk) details += `\n- Risco Jurídico: ${company.legal_risk}`;
        if (company.governance_risk) details += `\n- Risco Estratégico: ${company.governance_risk}`;
      }
      
      if (includeFields.dueDiligence) {
        details += `\n\nDue Diligence:`;
        if (company.financial_analysis) details += `\n- Análise Financeira: ${company.financial_analysis}`;
        if (company.legal_analysis) details += `\n- Análise Jurídica: ${company.legal_analysis}`;
      }
      
      if (includeFields.rating && company.final_score) {
        details += `\n\nAvaliação Final:`;
        details += `\n- Score: ${company.final_score.toFixed(1)}/10`;
        details += `\n- Status: ${statusLabel}`;
      }
      
      // Tailor the conclusion based on audience
      let conclusion = '';
      
      if (audience === 'investors') {
        conclusion = `\n\nEsta análise é destinada a investidores interessados em avaliar o potencial de investimento em ${companyName}.`;
      } else if (audience === 'advisors') {
        conclusion = `\n\nEsta análise é destinada a consultores estratégicos para auxiliar na avaliação de ${companyName}.`;
      } else {
        conclusion = `\n\nEsta análise é para uso interno da equipe de avaliação.`;
      }
      
      // Combine all parts
      const finalPrompt = prompt + details + conclusion;
      setGeneratedPrompt(finalPrompt);
    } catch (error) {
      console.error("Erro ao gerar prompt:", error);
      toast({
        title: "Erro ao gerar prompt",
        description: "Ocorreu um erro ao gerar o prompt. Por favor, tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const copyToClipboard = () => {
    if (generatedPrompt) {
      navigator.clipboard.writeText(generatedPrompt);
      toast({
        title: "Prompt copiado!",
        description: "O texto foi copiado para a área de transferência."
      });
    }
  };
  
  // Helper function to format currency
  const formatCurrency = (value: number | null | undefined) => {
    if (value === null || value === undefined) return "N/A";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <Label>Tipo de Prompt</Label>
                <Select value={promptType} onValueChange={(value) => setPromptType(value as PromptType)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de prompt" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="analysis">Reanálise com IA</SelectItem>
                    <SelectItem value="executive-summary">Relatório Executivo</SelectItem>
                    <SelectItem value="communication">Comunicação Estratégica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Público-Alvo</Label>
                <Select value={audience} onValueChange={(value) => setAudience(value as AudienceType)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o público-alvo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="internal">Uso Interno</SelectItem>
                    <SelectItem value="investors">Investidores</SelectItem>
                    <SelectItem value="advisors">Consultores</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Incluir Campos</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="financial" 
                      checked={includeFields.financial}
                      onCheckedChange={(checked) => 
                        setIncludeFields({...includeFields, financial: checked === true})
                      }
                    />
                    <label 
                      htmlFor="financial" 
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Dados Financeiros
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="strategic" 
                      checked={includeFields.strategic}
                      onCheckedChange={(checked) => 
                        setIncludeFields({...includeFields, strategic: checked === true})
                      }
                    />
                    <label 
                      htmlFor="strategic" 
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Dados Estratégicos
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="risks" 
                      checked={includeFields.risks}
                      onCheckedChange={(checked) => 
                        setIncludeFields({...includeFields, risks: checked === true})
                      }
                    />
                    <label 
                      htmlFor="risks" 
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Riscos
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="rating" 
                      checked={includeFields.rating}
                      onCheckedChange={(checked) => 
                        setIncludeFields({...includeFields, rating: checked === true})
                      }
                    />
                    <label 
                      htmlFor="rating" 
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Nota e Status
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="dueDiligence" 
                      checked={includeFields.dueDiligence}
                      onCheckedChange={(checked) => 
                        setIncludeFields({...includeFields, dueDiligence: checked === true})
                      }
                    />
                    <label 
                      htmlFor="dueDiligence" 
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Due Diligence
                    </label>
                  </div>
                </div>
              </div>
              
              <Button 
                className="w-full" 
                onClick={generatePrompt}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  'Gerar Prompt'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-2">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <Label className="flex justify-between">
                  <span>Prompt Gerado</span>
                  {generatedPrompt && (
                    <Button variant="outline" size="sm" onClick={copyToClipboard}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copiar
                    </Button>
                  )}
                </Label>
                <Textarea 
                  className="min-h-[300px] font-mono text-sm" 
                  value={generatedPrompt} 
                  readOnly
                  placeholder="O prompt gerado aparecerá aqui."
                />
              </div>
              
              <div className="text-xs text-muted-foreground">
                <p>Este texto pode ser usado como prompt para:</p>
                <ul className="list-disc ml-4 mt-1">
                  <li>Reanálise de dados com ferramentas de IA</li>
                  <li>Criação de relatórios executivos</li>
                  <li>Comunicação com stakeholders</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
