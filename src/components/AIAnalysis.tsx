
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AIAnalysisProps {
  companyData: any;
  companyId: string;
}

const AIAnalysis: React.FC<AIAnalysisProps> = ({ companyData, companyId }) => {
  const [response, setResponse] = useState('');
  const [isSendingToWebhook, setIsSendingToWebhook] = useState(false);
  const { toast } = useToast();

  const handleSendToWebhook = async () => {
    setIsSendingToWebhook(true);
    
    try {
      // Coletar todas as informações da empresa
      const allCompanyData = {
        ...companyData
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

      // Exibir a resposta no campo de texto
      if (data && data.webhookResponse) {
        setResponse(data.webhookResponse);
      }

      toast({
        title: "Análise concluída",
        description: "A análise foi processada e a resposta foi salva."
      });

      console.log('Resposta do webhook salva:', data);

    } catch (error) {
      console.error('Erro ao enviar para webhook:', error);
      toast({
        title: "Erro ao processar análise",
        description: "Ocorreu um erro ao processar a análise.",
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
          disabled={isSendingToWebhook}
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
            placeholder="A resposta da análise aparecerá aqui..."
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            className="min-h-[200px]"
            readOnly={false}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AIAnalysis;
