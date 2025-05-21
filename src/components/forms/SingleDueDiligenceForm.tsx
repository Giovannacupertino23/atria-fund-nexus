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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Define schema for a single type of due diligence
const singleDueDiligenceSchema = z.object({
  links: z.array(z.string().url({ message: "Insira uma URL válida" }).or(z.string().length(0))),
  analysis: z.string().min(5, { message: "A análise deve ter pelo menos 5 caracteres" }),
  risk: z.enum(["high", "medium", "low"]),
});

type SingleDueDiligenceFormValues = z.infer<typeof singleDueDiligenceSchema>;

export type DueDiligenceType = "financial" | "legal" | "governance";

interface SingleDueDiligenceFormProps {
  companyId: string;
  type: DueDiligenceType;
  initialData?: {
    link?: string | null;
    analysis?: string | null;
    risk?: RiskLevel | null;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
  title: string;
  borderColor: string;
}

export interface SingleDueDiligenceFormData {
  link: string | null | undefined;
  analysis: string | null | undefined;
  risk: string | null | undefined;
  [key: string]: any; // Changed from string | null | undefined to any to fix type error
}

export default function SingleDueDiligenceForm({
  companyId,
  type,
  initialData,
  onSuccess,
  onCancel,
  title,
  borderColor
}: SingleDueDiligenceFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { updateCompany } = useCompany();
  const { toast } = useToast();

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

  const onSubmit = async (data: SingleDueDiligenceFormValues) => {
    setIsLoading(true);
    
    try {
      // Filter out empty links and join with comma if multiple links
      const filteredLinks = data.links.filter(link => link.trim() !== "");
      const linkString = filteredLinks.length > 0 ? filteredLinks.join(',') : null;
      
      // Construct the update object based on due diligence type
      const updateFields: Record<string, any> = {};
      
      if (type === "financial") {
        updateFields.financial_link = linkString;
        updateFields.financial_analysis = data.analysis;
        updateFields.financial_risk = data.risk;
      } else if (type === "legal") {
        updateFields.legal_link = linkString;
        updateFields.legal_analysis = data.analysis;
        updateFields.legal_risk = data.risk;
      } else if (type === "governance") {
        updateFields.governance_link = linkString;
        updateFields.governance_analysis = data.analysis;
        updateFields.governance_risk = data.risk;
      }
      
      await updateCompany(companyId, updateFields);
      
      toast({
        title: `Due Diligence ${title} atualizada`,
        description: "Os dados foram salvos com sucesso",
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error(`Erro ao salvar due diligence ${type}:`, error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar os dados",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
              <FormLabel className="flex items-center gap-2">
                <Link className="h-4 w-4" />
                Links para documentação
              </FormLabel>
              
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <FormField
                    control={form.control}
                    name={`links.${index}`}
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
                  {fields.length > 1 && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => remove(index)}
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
                onClick={() => append("")}
                className="mt-2 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Adicionar link
              </Button>
              
              <FormDescription>
                URLs para documentos relevantes
              </FormDescription>
            </div>
            
            <FormField
              control={form.control}
              name="analysis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Análise</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Insira sua análise aqui..." 
                      className="min-h-[200px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Detalhes sobre a análise realizada
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="risk"
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

            <div className="flex justify-end gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline"
                onClick={onCancel}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
              >
                {isLoading ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
