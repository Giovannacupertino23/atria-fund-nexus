
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { useCompany, RiskLevel } from "@/context/CompanyContext";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Plus, Trash2 } from "lucide-react";

// Form Schema
const linksSchema = z.array(z.string().url("URL inválida").or(z.string().length(0)));

const dueDiligenceSchema = z.object({
  financialLinks: linksSchema,
  financialAnalysis: z.string(),
  financialRisk: z.enum(["high", "medium", "low"]),
  legalLinks: linksSchema,
  legalAnalysis: z.string(),
  legalRisk: z.enum(["high", "medium", "low"]),
  governanceLinks: linksSchema,
  governanceAnalysis: z.string(),
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
    governance_risk?: RiskLevel | null;
  };
  onSuccess?: () => void;
}

const DueDiligenceForm = ({
  companyId,
  initialData,
  onSuccess
}: DueDiligenceFormProps) => {
  const { updateCompany } = useCompany();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Split links into arrays
  const splitLinks = (linkString: string | null | undefined): string[] => {
    if (!linkString) return [""];
    const links = linkString.split(',').map(link => link.trim());
    return links.length > 0 ? links : [""];
  };

  // Initial form values
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

  // Form hook
  const form = useForm<DueDiligenceFormValues>({
    resolver: zodResolver(dueDiligenceSchema),
    defaultValues,
  });

  // Create field arrays for links
  const financialLinksArray = useFieldArray({
    control: form.control,
    name: "financialLinks"
  });

  const legalLinksArray = useFieldArray({
    control: form.control,
    name: "legalLinks"
  });

  const governanceLinksArray = useFieldArray({
    control: form.control,
    name: "governanceLinks"
  });

  // Handle form submission
  const onSubmit = async (values: DueDiligenceFormValues) => {
    setIsSubmitting(true);
    try {
      // Join links back to comma-separated string, filtering out empty ones
      const financialLink = values.financialLinks
        .filter(link => link.trim() !== "")
        .join(", ");
      
      const legalLink = values.legalLinks
        .filter(link => link.trim() !== "")
        .join(", ");
      
      const governanceLink = values.governanceLinks
        .filter(link => link.trim() !== "")
        .join(", ");
      
      // Update company with due diligence data
      await updateCompany(companyId, {
        financial_link: financialLink || null,
        financial_analysis: values.financialAnalysis || null,
        financial_risk: values.financialRisk || null,
        legal_link: legalLink || null,
        legal_analysis: values.legalAnalysis || null,
        legal_risk: values.legalRisk || null,
        governance_link: governanceLink || null,
        governance_analysis: values.governanceAnalysis || null,
        governance_risk: values.governanceRisk || null,
      });
      
      toast({
        title: "Due Diligence atualizada",
        description: "As informações de due diligence foram atualizadas com sucesso."
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Erro ao atualizar due diligence:", error);
      toast({
        title: "Erro ao atualizar",
        description: "Ocorreu um erro ao tentar atualizar as informações de due diligence.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to render link field arrays
  const renderLinksFieldArray = (
    fieldArray: ReturnType<typeof useFieldArray>,
    fieldName: "financialLinks" | "legalLinks" | "governanceLinks"
  ) => {
    return (
      <div className="space-y-2">
        {fieldArray.fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2">
            <FormField
              control={form.control}
              name={`${fieldName}.${index}`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className={index !== 0 ? "sr-only" : ""}>
                    {index === 0 ? "Link para documentação" : ""}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://exemplo.com/documentação"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center space-x-1 mt-6">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => fieldArray.remove(index)}
                disabled={fieldArray.fields.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              {index === fieldArray.fields.length - 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => fieldArray.append("")}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-6">
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
                          placeholder="Resultados da análise financeira, incluindo fluxo de caixa, margens e projeções..." 
                          className="min-h-[200px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Análise detalhada da saúde financeira da empresa
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
                      <FormLabel>Nível de Risco Financeiro</FormLabel>
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
                          <SelectItem value="low">Baixo</SelectItem>
                          <SelectItem value="medium">Médio</SelectItem>
                          <SelectItem value="high">Alto</SelectItem>
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
                          placeholder="A empresa possui pendências jurídicas em processos trabalhistas, mas está regular com suas obrigações fiscais..." 
                          className="min-h-[200px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Questões jurídicas, compliance e conformidades regulatórias
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
                      <FormLabel>Nível de Risco Jurídico</FormLabel>
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
                          <SelectItem value="low">Baixo</SelectItem>
                          <SelectItem value="medium">Médio</SelectItem>
                          <SelectItem value="high">Alto</SelectItem>
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
                      <FormLabel>Nível de Risco Estratégico</FormLabel>
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
                          <SelectItem value="low">Baixo</SelectItem>
                          <SelectItem value="medium">Médio</SelectItem>
                          <SelectItem value="high">Alto</SelectItem>
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
        
        <div className="flex justify-end space-x-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default DueDiligenceForm;
