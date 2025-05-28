
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCompany } from "@/context/CompanyContext";
import { RiskLevel } from "@/context/CompanyContext";

const formSchema = z.object({
  financial_link: z.string().optional(),
  financial_analysis: z.string().optional(),
  financial_risk: z.enum(["high", "medium", "low"]).optional(),
  legal_link: z.string().optional(),
  legal_analysis: z.string().optional(),
  legal_risk: z.enum(["high", "medium", "low"]).optional(),
  governance_link: z.string().optional(),
  governance_analysis: z.string().optional(),
  governance_risk: z.enum(["high", "medium", "low"]).optional(),
});

type FormData = z.infer<typeof formSchema>;

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

const DueDiligenceForm = ({ companyId, initialData, onSuccess }: DueDiligenceFormProps) => {
  const { updateCompany } = useCompany();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      financial_link: initialData?.financial_link || "",
      financial_analysis: initialData?.financial_analysis || "",
      financial_risk: initialData?.financial_risk || undefined,
      legal_link: initialData?.legal_link || "",
      legal_analysis: initialData?.legal_analysis || "",
      legal_risk: initialData?.legal_risk || undefined,
      governance_link: initialData?.governance_link || "",
      governance_analysis: initialData?.governance_analysis || "",
      governance_risk: initialData?.governance_risk || undefined,
    },
  });

  const onSubmit = async (values: FormData) => {
    try {
      setIsSubmitting(true);
      await updateCompany(companyId, values);
      onSuccess?.();
    } catch (error) {
      console.error('Error updating due diligence:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRiskColor = (risk?: string) => {
    switch (risk) {
      case "high": return "text-red-600";
      case "medium": return "text-yellow-600";
      case "low": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  const getRiskLabel = (risk?: string) => {
    switch (risk) {
      case "high": return "Alto";
      case "medium": return "Médio";
      case "low": return "Baixo";
      default: return "Selecione...";
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Financial Section */}
        <div className="space-y-4 p-4 border border-l-4 border-l-blue-500 rounded-md bg-blue-50">
          <h3 className="text-lg font-semibold text-blue-800">Due Diligence Financeira</h3>
          
          <FormField
            control={form.control}
            name="financial_link"
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
            name="financial_analysis"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Análise</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Descreva a análise financeira da empresa..."
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
            name="financial_risk"
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
        </div>

        {/* Legal Section */}
        <div className="space-y-4 p-4 border border-l-4 border-l-purple-500 rounded-md bg-purple-50">
          <h3 className="text-lg font-semibold text-purple-800">Due Diligence Jurídica</h3>
          
          <FormField
            control={form.control}
            name="legal_link"
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
            name="legal_analysis"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Análise</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Descreva a análise jurídica da empresa..."
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
            name="legal_risk"
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
        </div>

        {/* Governance Section */}
        <div className="space-y-4 p-4 border border-l-4 border-l-emerald-500 rounded-md bg-emerald-50">
          <h3 className="text-lg font-semibold text-emerald-800">Due Diligence de Governança</h3>
          
          <FormField
            control={form.control}
            name="governance_link"
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
            name="governance_analysis"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Análise</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Descreva a análise de governança da empresa..."
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
            name="governance_risk"
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
        </div>

        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar Due Diligence"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default DueDiligenceForm;
