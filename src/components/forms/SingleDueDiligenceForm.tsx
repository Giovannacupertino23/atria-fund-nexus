
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCompany } from "@/context/CompanyContext";
import { RiskLevel } from "@/context/CompanyContext";

export type DueDiligenceType = "financial" | "legal" | "governance";

const formSchema = z.object({
  link: z.string().optional(),
  analysis: z.string().optional(),
  risk: z.enum(["high", "medium", "low"]).optional(),
});

type FormData = z.infer<typeof formSchema>;

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      link: initialData?.link || "",
      analysis: initialData?.analysis || "",
      risk: initialData?.risk || undefined,
    },
  });

  const onSubmit = async (values: FormData) => {
    try {
      setIsSubmitting(true);
      
      // Map form values to company fields based on type
      const updateData: Record<string, any> = {};
      updateData[`${type}_link`] = values.link;
      updateData[`${type}_analysis`] = values.analysis;
      updateData[`${type}_risk`] = values.risk;
      
      await updateCompany(companyId, updateData);
      onSuccess?.();
    } catch (error) {
      console.error(`Error updating ${type} due diligence:`, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`space-y-4 p-4 border border-l-4 ${borderColor} rounded-md`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Editar Due Diligence {title}</h3>
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Link dos Documentos</FormLabel>
                <FormControl>
                  <Input placeholder="https://..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="analysis"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Análise</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder={`Descreva a análise ${title.toLowerCase()} da empresa...`}
                    className="min-h-[100px]"
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
                <FormLabel>Nível de Risco</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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

          <div className="flex justify-end gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SingleDueDiligenceForm;
