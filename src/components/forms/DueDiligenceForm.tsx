import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { useCompany, RiskLevel } from "@/context/CompanyContext";
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
import { AlertTriangle, CircleAlert, CircleCheck, Link, Plus, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// Define o schema de validação para cada tipo de due diligence
const dueDiligenceSchema = z.object({
  financialLinks: z.array(z.string().url({ message: "Insira uma URL válida" }).or(z.string().length(0))),
  financialAnalysis: z.string().min(5, { message: "A análise deve ter pelo menos 5 caracteres" }),
  financialRisk: z.enum(["high", "medium", "low"]),
  
  legalLinks: z.array(z.string().url({ message: "Insira uma URL válida" }).or(z.string().length(0))),
  legalAnalysis: z.string().min(5, { message: "A análise deve ter pelo menos 5 caracteres" }),
  legalRisk: z.enum(["high", "medium", "low"]),
  
  governanceLinks: z.array(z.string().url({ message: "Insira uma URL válida" }).or(z.string().length(0))),
  governanceAnalysis: z.string().min(5, { message: "A análise deve ter pelo menos 5 caracteres" }),
  governanceRisk: z.enum(["high", "medium", "low"]),
});

type DueDiligenceFormValues = z.infer<typeof dueDiligenceSchema>;

interface DueDiligenceFormProps {
  companyId: string;
  initialData?: {
    financial_link?: string | null;
    financial_analysis?: string | null;
    financial_risk?: RiskLevel | null;
    legal_link?: string | null;
    legal_analysis?: string | null;
    legal_risk?: RiskLevel | null;
    governance_link?: string | null;
    governance_analysis?: string | null;
    governance_risk?: string | null;
  };
  onSuccess?: () => void;
}

export interface DueDiligenceFormData {
  financial_link: string | null | undefined;
  financial_analysis: string | null | undefined;
  financial_risk: string | null | undefined;
  legal_link: string | null | undefined;
  legal_analysis: string | null | undefined;
  legal_risk: string | null | undefined;
  governance_link: string | null | undefined;
  governance_analysis: string | null | undefined;
  governance_risk: string | null | undefined;
  [key: string]: any; // Changed from string | null | undefined to any to fix type error
}

export default function DueDiligenceForm({ companyId, initialData, onSuccess }: DueDiligenceFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { updateCompany } = useCompany();
  const { toast } = useToast();

  // Split any existing links into arrays
  const splitLinks = (linkString: string | null | undefined): string[] => {
    if (!linkString) return [""];
    const links = linkString.split(',').map(link => link.trim());
    return links.length > 0 ? links : [""];
  };

  // Converter dados iniciais para o formato do formulário
  const defaultValues: DueDiligenceFormValues = {
    financialLinks: splitLinks(initialData?.financial_link),
    financialAnalysis: initialData?.financial_analysis || "",
    financialRisk: (initialData?.financial_risk as "high" | "medium" | "low") || "medium",
    
    legalLinks: splitLinks(initialData?.legal_link),
    legalAnalysis: initialData?.legal_analysis || "",
    legalRisk: (initialData?.legal_risk as "high" | "medium" | "low") || "medium",
    
    governanceLinks: splitLinks(initialData?.governance_link),
    governanceAnalysis: initialData?.governance_analysis || "",
    governanceRisk: (initialData?.governance_risk as "high" | "medium" | "low") || "medium",
  };

  const form = useForm<DueDiligenceFormValues>({
    resolver: zodResolver(dueDiligenceSchema),
    defaultValues,
  });

  // Create field arrays for links
  const financialLinksArray = useFieldArray({
    control: form.control,
    name: "financialLinks",
  });

  const legalLinksArray = useFieldArray({
    control: form.control,
    name: "legalLinks",
  });

  const governanceLinksArray = useFieldArray({
    control: form.control,
    name: "governanceLinks",
  });

  const onSubmit = async (data: DueDiligenceFormValues) => {
    setIsLoading(true);
    
    try {
      // Filter and join links for each type
      const filterAndJoinLinks = (links: string[]): string | null => {
        const filteredLinks = links.filter(link => link.trim() !== "");
        return filteredLinks.length > 0 ? filteredLinks.join(',') : null;
      };
      
      // Convertendo os dados do formulário para o formato esperado pelo updateCompany
      const updatedData = {
        financial_link: filterAndJoinLinks(data.financialLinks),
        financial_analysis: data.financialAnalysis,
        financial_risk: data.financialRisk,
        legal_link: filterAndJoinLinks(data.legalLinks),
        legal_analysis: data.legalAnalysis,
        legal_risk: data.legalRisk,
        governance_link: filterAndJoinLinks(data.governanceLinks),
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

  // Render links field array UI
  const renderLinksFieldArray = (
    fieldArray: { 
      fields: any[]; 
      append: (value: string) => void; 
      remove: (index: number) => void;
    },
    name: "financialLinks" | "legalLinks" | "governanceLinks"
  ) => {
    return (
      <div className="space-y-3">
        <FormLabel className="flex items-center gap-2">
          <Link className="h-4 w-4" />
          Links para documentação
        </FormLabel>
        
        {fieldArray.fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2">
            <FormField
              control={form.control}
              name={`${name}.${index}`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input 
                      placeholder="https://example.com/docs" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {fieldArray.fields.length > 1 && (
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0"
                onClick={() => fieldArray.remove(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fieldArray.append("")}
          className="mt-2 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Adicionar link
        </Button>
        
        <FormDescription>
          URLs para documentos relevantes
        </FormDescription>
      </div>
    );
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
                {renderLinksFieldArray(financialLinksArray, "financialLinks")}
                
                <FormField
                  control={form.control}
                  name="financialAnalysis"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Análise Financeira</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="A empresa apresenta indicadores financeiros sólidos, com crescimento consistente nos últimos 3 anos..." 
                          className="min-h-[200px]" 
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
                {renderLinksFieldArray(legalLinksArray, "legalLinks")}
                
                <FormField
                  control={form.control}
                  name="legalAnalysis"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Análise Jurídica</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="A empresa possui todos os registros legais em dia e não apresenta litígios significativos..." 
                          className="min-h-[200px]" 
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

          {/* Due Diligence Estratégica */}
          <Card className="border-l-4 border-l-emerald-500">
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Due Diligence Estratégica</h3>
              
              <div className="space-y-4">
                {renderLinksFieldArray(governanceLinksArray, "governanceLinks")}
                
                <FormField
                  control={form.control}
                  name="governanceAnalysis"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Análise Estratégica</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="A estratégia da empresa é bem definida, com planos claros de crescimento e posicionamento de mercado..." 
                          className="min-h-[200px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Avaliação da estratégia e posicionamento de mercado
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
