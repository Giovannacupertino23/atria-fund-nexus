
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useCompany } from "@/context/CompanyContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertTriangle, CircleAlert, CircleCheck, Link } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// Define o schema de validação para cada tipo de due diligence
const dueDiligenceSchema = z.object({
  financialLink: z.string().url({ message: "Insira uma URL válida" }).or(z.string().length(0)),
  financialAnalysis: z.string().min(5, { message: "A análise deve ter pelo menos 5 caracteres" }).max(1000),
  financialRisk: z.enum(["high", "medium", "low"]),
  
  legalLink: z.string().url({ message: "Insira uma URL válida" }).or(z.string().length(0)),
  legalAnalysis: z.string().min(5, { message: "A análise deve ter pelo menos 5 caracteres" }).max(1000),
  legalRisk: z.enum(["high", "medium", "low"]),
  
  governanceLink: z.string().url({ message: "Insira uma URL válida" }).or(z.string().length(0)),
  governanceAnalysis: z.string().min(5, { message: "A análise deve ter pelo menos 5 caracteres" }).max(1000),
  governanceRisk: z.enum(["high", "medium", "low"]),
});

type DueDiligenceFormValues = z.infer<typeof dueDiligenceSchema>;

interface DueDiligenceFormProps {
  companyId: string;
  initialData?: {
    financial_link?: string;
    financial_analysis?: string;
    financial_risk?: string;
    legal_link?: string;
    legal_analysis?: string;
    legal_risk?: string;
    governance_link?: string;
    governance_analysis?: string;
    governance_risk?: string;
  };
  onSuccess?: () => void;
}

export default function DueDiligenceForm({ companyId, initialData, onSuccess }: DueDiligenceFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { updateCompany } = useCompany();
  const { toast } = useToast();

  // Converter dados iniciais para o formato do formulário
  const defaultValues: DueDiligenceFormValues = {
    financialLink: initialData?.financial_link || "",
    financialAnalysis: initialData?.financial_analysis || "",
    financialRisk: (initialData?.financial_risk as "high" | "medium" | "low") || "medium",
    
    legalLink: initialData?.legal_link || "",
    legalAnalysis: initialData?.legal_analysis || "",
    legalRisk: (initialData?.legal_risk as "high" | "medium" | "low") || "medium",
    
    governanceLink: initialData?.governance_link || "",
    governanceAnalysis: initialData?.governance_analysis || "",
    governanceRisk: (initialData?.governance_risk as "high" | "medium" | "low") || "medium",
  };

  const form = useForm<DueDiligenceFormValues>({
    resolver: zodResolver(dueDiligenceSchema),
    defaultValues,
  });

  const onSubmit = async (data: DueDiligenceFormValues) => {
    setIsLoading(true);
    
    try {
      // Convertendo os dados do formulário para o formato esperado pelo updateCompany
      const updatedData = {
        financial_link: data.financialLink,
        financial_analysis: data.financialAnalysis,
        financial_risk: data.financialRisk,
        legal_link: data.legalLink,
        legal_analysis: data.legalAnalysis,
        legal_risk: data.legalRisk,
        governance_link: data.governanceLink,
        governance_analysis: data.governanceAnalysis,
        governance_risk: data.governanceRisk,
      };
      
      await updateCompany(companyId, updatedData);
      
      toast({
        title: "Due Diligence atualizada",
        description: "Os dados foram salvos com sucesso",
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Erro ao salvar due diligence:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar os dados",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Função para renderizar o ícone de risco
  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "high":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "medium":
        return <CircleAlert className="h-5 w-5 text-orange-500" />;
      case "low":
        return <CircleCheck className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Due Diligence Financeira */}
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Due Diligence Financeira</h3>
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="financialLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Link className="h-4 w-4" />
                        Link para documentação
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://example.com/financial-docs" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        URL para documentos financeiros relevantes
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="financialAnalysis"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Análise Financeira</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="A empresa apresenta indicadores financeiros sólidos, com crescimento consistente nos últimos 3 anos..." 
                          className="min-h-[120px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Detalhes sobre a saúde financeira da empresa
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="financialRisk"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nível de Risco</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o nível de risco" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low" className="text-green-600 flex items-center gap-2">
                            <CircleCheck className="h-4 w-4" /> Baixo
                          </SelectItem>
                          <SelectItem value="medium" className="text-orange-500 flex items-center gap-2">
                            <CircleAlert className="h-4 w-4" /> Médio
                          </SelectItem>
                          <SelectItem value="high" className="text-red-500 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" /> Alto
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Due Diligence Jurídica */}
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Due Diligence Jurídica</h3>
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="legalLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Link className="h-4 w-4" />
                        Link para documentação
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://example.com/legal-docs" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        URL para documentos jurídicos relevantes
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="legalAnalysis"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Análise Jurídica</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="A empresa possui todos os registros legais em dia e não apresenta litígios significativos..." 
                          className="min-h-[120px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Avaliação jurídica e compliance da empresa
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="legalRisk"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nível de Risco</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o nível de risco" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low" className="text-green-600 flex items-center gap-2">
                            <CircleCheck className="h-4 w-4" /> Baixo
                          </SelectItem>
                          <SelectItem value="medium" className="text-orange-500 flex items-center gap-2">
                            <CircleAlert className="h-4 w-4" /> Médio
                          </SelectItem>
                          <SelectItem value="high" className="text-red-500 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" /> Alto
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Due Diligence de Governança */}
          <Card className="border-l-4 border-l-emerald-500">
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Due Diligence de Governança</h3>
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="governanceLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Link className="h-4 w-4" />
                        Link para documentação
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://example.com/governance-docs" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        URL para documentos de governança relevantes
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="governanceAnalysis"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Análise de Governança</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="A estrutura de governança é bem definida, com conselho administrativo ativo e políticas claras de compliance..." 
                          className="min-h-[120px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Estrutura e práticas de governança corporativa
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="governanceRisk"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nível de Risco</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o nível de risco" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low" className="text-green-600 flex items-center gap-2">
                            <CircleCheck className="h-4 w-4" /> Baixo
                          </SelectItem>
                          <SelectItem value="medium" className="text-orange-500 flex items-center gap-2">
                            <CircleAlert className="h-4 w-4" /> Médio
                          </SelectItem>
                          <SelectItem value="high" className="text-red-500 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" /> Alto
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={isLoading}
            className="min-w-[120px]"
          >
            {isLoading ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
