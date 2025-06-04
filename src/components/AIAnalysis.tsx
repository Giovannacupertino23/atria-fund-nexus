
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AIAnalysisProps {
  companyData: any;
  companyId: string;
}

const AIAnalysis: React.FC<AIAnalysisProps> = ({ companyData, companyId }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [prompt, setPrompt] = useState('');
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt necessário",
        description: "Por favor, insira uma pergunta ou instrução para análise.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Preparar contexto da empresa para a IA
      const companyContext = {
        nome: companyData.name,
        setor: companyData.sector,
        sobre: companyData.about,
        faturamento_2024: companyData.annual_revenue_2024,
        market_cap: companyData.market_cap,
        margem_liquida_2024: companyData.net_margin_2024,
        ebitda_2023: companyData.ebitda_2023,
        ebitda_2024: companyData.ebitda_2024,
        ebitda_2025: companyData.ebitda_2025,
        crescimento_yoy_21_22: companyData.yoy_growth_21_22,
        crescimento_yoy_22_23: companyData.yoy_growth_22_23,
        crescimento_yoy_23_24: companyData.yoy_growth_23_24,
        alavancagem: companyData.leverage,
        fluxo_caixa: companyData.cash_flow,
        distribuicao_dividendos: companyData.dividend_distribution,
        nota_final: companyData.final_score,
        status: companyData.status,
        fatores_risco: companyData.risk_factors,
        analise_financeira: companyData.financial_analysis,
        risco_financeiro: companyData.financial_risk,
        analise_juridica: companyData.legal_analysis,
        risco_juridico: companyData.legal_risk,
        analise_governanca: companyData.governance_analysis,
        risco_governanca: companyData.governance_risk,
        analise_inteligente: companyData.intelligent_analysis
      };

      const contextualPrompt = `
        Contexto da empresa: ${JSON.stringify(companyContext, null, 2)}
        
        Pergunta/Instrução do usuário: ${prompt}
        
        Por favor, forneça uma análise contextualizada baseada nos dados da empresa acima.
      `;

      // Simulação de chamada para IA (substituir por integração real)
      const mockAnalysis = await simulateAIAnalysis(contextualPrompt);
      
      setAnalysisResult(mockAnalysis);
      
      toast({
        title: "Análise concluída",
        description: "A análise da IA foi gerada com sucesso."
      });
      
    } catch (error) {
      console.error('Erro na análise da IA:', error);
      toast({
        title: "Erro na análise",
        description: "Ocorreu um erro ao processar a análise. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Função simulada de análise - substituir por integração real com IA
  const simulateAIAnalysis = async (prompt: string): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`Análise baseada nos dados da empresa ${companyData.name}:

Com base nos dados financeiros apresentados, observo os seguintes pontos-chave:

1. **Performance Financeira**: A empresa apresenta uma nota final de ${companyData.final_score}, indicando um perfil de investimento ${companyData.score_color === 'green' ? 'atrativo' : companyData.score_color === 'orange' ? 'moderado' : 'de risco'}.

2. **Crescimento**: O crescimento YoY mostra uma tendência ${companyData.yoy_growth_23_24 > 0 ? 'positiva' : 'negativa'} no último período analisado.

3. **Rentabilidade**: Os índices de EBITDA indicam ${companyData.ebitda_2024 > 0 ? 'eficiência operacional positiva' : 'desafios operacionais'}.

4. **Recomendações**: 
   - Monitorar de perto os indicadores de crescimento
   - Avaliar estratégias para otimização da margem EBITDA
   - Considerar os fatores de risco identificados na análise

Esta é uma análise automatizada baseada nos dados disponíveis. Para insights mais aprofundados, recomenda-se análise complementar com especialistas do setor.`);
      }, 2000);
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Análise Inteligente com IA
        </CardTitle>
        <CardDescription>
          Faça perguntas sobre a empresa e receba análises contextualizadas baseadas em IA
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={handleAnalyze}
          disabled={isAnalyzing || !prompt.trim()}
          className="w-full"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analisando...
            </>
          ) : (
            <>
              <Brain className="h-4 w-4 mr-2" />
              Analisar
            </>
          )}
        </Button>

        <div className="space-y-2">
          <Textarea
            placeholder="Digite sua pergunta ou instrução para análise..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[100px]"
          />
        </div>

        {analysisResult && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Resultado da Análise:</h4>
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap text-sm">{analysisResult}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIAnalysis;
