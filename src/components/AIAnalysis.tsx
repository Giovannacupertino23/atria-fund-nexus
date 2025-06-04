
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Loader2, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AIAnalysisProps {
  companyData: any;
  companyId: string;
}

const AIAnalysis: React.FC<AIAnalysisProps> = ({ companyData, companyId }) => {
  const [prompt, setPrompt] = useState('');
  const [isSendingToWebhook, setIsSendingToWebhook] = useState(false);
  const { toast } = useToast();

  const handleSendToWebhook = async () => {
    setIsSendingToWebhook(true);
    
    try {
      // Coletar todas as informações da empresa
      const allCompanyData = {
        ...companyData,
        prompt_usuario: prompt
      };

      console.log('Enviando dados para webhook:', allCompanyData);

      // Chamar a edge function que fará a integração com o webhook
      const { data, error } = await supabase.functions.invoke('webhook-integration', {
        body: {
          companyId: companyId,
          companyData: allCompanyData
        }
      });

      if (error) throw error;

      toast({
        title: "Dados enviados com sucesso",
        description: "As informações foram enviadas para o webhook e a resposta foi salva."
      });

      console.log('Resposta do webhook salva:', data);

    } catch (error) {
      console.error('Erro ao enviar para webhook:', error);
      toast({
        title: "Erro ao enviar dados",
        description: "Ocorreu um erro ao enviar os dados para o webhook.",
        variant: "destructive"
      });
    } finally {
      setIsSendingToWebhook(false);
    }
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
          onClick={handleSendToWebhook}
          disabled={isSendingToWebhook || !prompt.trim()}
          className="w-full"
        >
          {isSendingToWebhook ? (
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
      </CardContent>
    </Card>
  );
};

export default AIAnalysis;
