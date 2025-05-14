
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Trash2 } from "lucide-react";

// Define the form schema
const singleDueDiligenceSchema = z.object({
  links: z.array(z.string().url("URL inválida").or(z.string().length(0))),
  analysis: z.string(),
  risk: z.enum(["high", "medium", "low"]),
});

export type SingleDueDiligenceFormValues = z.infer<typeof singleDueDiligenceSchema>;

export type DueDiligenceType = "financial" | "legal" | "governance";

interface SingleDueDiligenceFormProps {
  companyId: string;
  type: DueDiligenceType;
  title: string;
  borderColor: string;
  initialData?: {
    link?: string | null;
    analysis?: string | null;
    risk?: RiskLevel | null;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

const SingleDueDiligenceForm = ({
  companyId,
  type,
  title,
  borderColor,
  initialData,
  onSuccess,
  onCancel
}: SingleDueDiligenceFormProps) => {
  const { updateCompany } = useCompany();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Convert initial data to form values with array of links
  const splitLinks = (linkString: string | null | undefined): string[] => {
    if (!linkString) return [""];
    const links = linkString.split(',').map(link => link.trim());
    return links.length > 0 ? links : [""];
  };
  
  const defaultValues: SingleDueDiligenceFormValues = {
    links: splitLinks(initialData?.link),
    analysis: initialData?.analysis || "",
    risk: (initialData?.risk as "high" | "medium" | "low") || "medium",
  };

  const form = useForm<SingleDueDiligenceFormValues>({
    resolver: zodResolver(singleDueDiligenceSchema),
    defaultValues,
  });

  // Create field arrays for links
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "links",
  });

  // Handle form submission
  const onSubmit = async (values: SingleDueDiligenceFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Join links back to comma-separated string, filtering out empty ones
      const linkValue = values.links
        .filter(link => link.trim() !== "")
        .join(", ");
      
      const updateData: Partial<Record<string, unknown>> = {};
      
      // Set the correct fields based on type
      if (type === "financial") {
        updateData.financial_link = linkValue || null;
        updateData.financial_analysis = values.analysis || null;
        updateData.financial_risk = values.risk || null;
      } else if (type === "legal") {
        updateData.legal_link = linkValue || null;
        updateData.legal_analysis = values.analysis || null;
        updateData.legal_risk = values.risk || null;
      } else if (type === "governance") {
        updateData.governance_link = linkValue || null;
        updateData.governance_analysis = values.analysis || null;
        updateData.governance_risk = values.risk || null;
      }
      
      // Update company with due diligence data
      await updateCompany(companyId, updateData);
      
      toast({
        title: `Due Diligence ${title} atualizada`,
        description: `As informações de due diligence ${title.toLowerCase()} foram atualizadas com sucesso.`
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Erro ao atualizar due diligence:", error);
      toast({
        title: "Erro ao atualizar",
        description: `Ocorreu um erro ao tentar atualizar as informações de due diligence ${title.toLowerCase()}.`,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update the title based on the type
  const getFormTitle = () => {
    if (type === "governance") {
      return "Estratégica";
    }
    return title;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className={`border-l-4 ${borderColor}`}>
          <CardHeader>
            <CardTitle>{getFormTitle()}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <FormLabel>Link para documentação</FormLabel>
              
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <FormField
                    control={form.control}
                    name={`links.${index}`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
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
                  
                  <div className="flex items-center space-x-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    
                    {index === fields.length - 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => append("")}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              
              <FormField
                control={form.control}
                name="analysis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Análise {getFormTitle()}</FormLabel>
                    <FormControl>
                      <Textarea
                        className="min-h-[200px]"
                        placeholder={
                          type === "financial"
                            ? "Resultados da análise financeira, incluindo fluxo de caixa, margens e projeções..."
                            : type === "legal"
                            ? "Questões jurídicas, compliance e conformidades regulatórias..."
                            : "Avaliação da estratégia e posicionamento de mercado..."
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="risk"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nível de Risco {getFormTitle()}</FormLabel>
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
            
            <div className="flex justify-end space-x-2 pt-4">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancelar
                </Button>
              )}
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
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};

export default SingleDueDiligenceForm;
