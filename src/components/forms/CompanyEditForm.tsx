
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { useCompany, Company } from "@/context/CompanyContext";
import { useToast } from "@/hooks/use-toast";

interface CompanyEditFormProps {
  company: Company;
  onSuccess?: () => void;
  onCancel?: () => void;
}

type CompanyFormValues = Omit<Company, 'id' | 'created_at' | 'updated_at' | 'final_score' | 'score_color'>;

const CompanyEditForm: React.FC<CompanyEditFormProps> = ({ company, onSuccess, onCancel }) => {
  const { updateCompany } = useCompany();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<CompanyFormValues>({
    defaultValues: {
      name: company.name || "",
      sector: company.sector || "",
      about: company.about || "",
      cnpj: company.cnpj || "",
      website: company.website || "",
      responsible: company.responsible || "",
      cac: company.cac,
      average_ticket: company.average_ticket,
      market_cap: company.market_cap,
      annual_revenue_2024: company.annual_revenue_2024,
      net_margin_2024: company.net_margin_2024,
      ebitda_2023: company.ebitda_2023,
      ebitda_2024: company.ebitda_2024,
      ebitda_2025: company.ebitda_2025,
      yoy_growth_21_22: company.yoy_growth_21_22,
      yoy_growth_22_23: company.yoy_growth_22_23,
      yoy_growth_23_24: company.yoy_growth_23_24,
      risk_factors: company.risk_factors || "",
      leverage: company.leverage,
      cash_flow: company.cash_flow,
      dividend_distribution: company.dividend_distribution || false,
      status: company.status || "evaluating",
      pipeline_status: company.pipeline_status || "prospect"
    }
  });
  
  const onSubmit = async (values: CompanyFormValues) => {
    try {
      setIsSubmitting(true);
      console.log("Enviando dados atualizados:", values);
      
      // Certifique-se de que os campos numéricos são do tipo correto
      const formattedValues = {
        ...values,
        cac: values.cac !== undefined ? Number(values.cac) : undefined,
        average_ticket: values.average_ticket !== undefined ? Number(values.average_ticket) : undefined,
        market_cap: values.market_cap !== undefined ? Number(values.market_cap) : undefined,
        annual_revenue_2024: values.annual_revenue_2024 !== undefined ? Number(values.annual_revenue_2024) : undefined,
        net_margin_2024: values.net_margin_2024 !== undefined ? Number(values.net_margin_2024) : undefined,
        ebitda_2023: values.ebitda_2023 !== undefined ? Number(values.ebitda_2023) : undefined,
        ebitda_2024: values.ebitda_2024 !== undefined ? Number(values.ebitda_2024) : undefined,
        ebitda_2025: values.ebitda_2025 !== undefined ? Number(values.ebitda_2025) : undefined,
        yoy_growth_21_22: values.yoy_growth_21_22 !== undefined ? Number(values.yoy_growth_21_22) : undefined,
        yoy_growth_22_23: values.yoy_growth_22_23 !== undefined ? Number(values.yoy_growth_22_23) : undefined,
        yoy_growth_23_24: values.yoy_growth_23_24 !== undefined ? Number(values.yoy_growth_23_24) : undefined,
        leverage: values.leverage !== undefined ? Number(values.leverage) : undefined
      };
      
      console.log("Valores formatados para atualização:", formattedValues);
      
      await updateCompany(company.id, formattedValues);
      
      toast({
        title: "Empresa atualizada",
        description: "Os dados da empresa foram atualizados com sucesso."
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Erro ao atualizar empresa:", error);
      toast({
        title: "Erro ao atualizar",
        description: "Ocorreu um erro ao atualizar os dados da empresa. Verifique os dados e tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Informações Básicas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Empresa *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome da empresa" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="sector"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Setor da Empresa *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Tecnologia, Saúde, Financeiro..." {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="cnpj"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CNPJ *</FormLabel>
                <FormControl>
                  <Input placeholder="XX.XXX.XXX/0001-XX" {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input placeholder="https://www.empresa.com.br" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="responsible"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Responsável</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do responsável" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="cac"
              render={({ field: { onChange, value, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>CAC (R$)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      {...fieldProps}
                      value={value === undefined ? '' : value}
                      onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="average_ticket"
              render={({ field: { onChange, value, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Ticket Médio (R$)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      {...fieldProps}
                      value={value === undefined ? '' : value}
                      onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="about"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sobre a Empresa</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Descreva brevemente a empresa, seu histórico e atuação..." 
                    className="min-h-[100px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Dados Financeiros</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="market_cap"
              render={({ field: { onChange, value, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Market Cap (R$)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      {...fieldProps}
                      value={value === undefined ? '' : value}
                      onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="annual_revenue_2024"
              render={({ field: { onChange, value, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Faturamento Anual 2024 (R$)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      {...fieldProps}
                      value={value === undefined ? '' : value}
                      onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="net_margin_2024"
              render={({ field: { onChange, value, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Margem Líquida 2024 (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      {...fieldProps}
                      value={value === undefined ? '' : value}
                      onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="leverage"
              render={({ field: { onChange, value, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Alavancagem (% dívida/patrimônio)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      {...fieldProps}
                      value={value === undefined ? '' : value}
                      onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="cash_flow"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fluxo de Caixa</FormLabel>
                  <FormControl>
                    <select 
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value === "" ? undefined : e.target.value)}
                    >
                      <option value="">Selecione</option>
                      <option value="positive">Positivo</option>
                      <option value="negative">Negativo</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">EBITDA (%)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="ebitda_2023"
              render={({ field: { onChange, value, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>EBITDA 2023</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      {...fieldProps}
                      value={value === undefined ? '' : value}
                      onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="ebitda_2024"
              render={({ field: { onChange, value, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>EBITDA 2024</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      {...fieldProps}
                      value={value === undefined ? '' : value}
                      onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="ebitda_2025"
              render={({ field: { onChange, value, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>EBITDA 2025</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      {...fieldProps}
                      value={value === undefined ? '' : value}
                      onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Crescimento YoY (%)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="yoy_growth_21_22"
              render={({ field: { onChange, value, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>YoY Growth 21/22</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      {...fieldProps}
                      value={value === undefined ? '' : value}
                      onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="yoy_growth_22_23"
              render={({ field: { onChange, value, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>YoY Growth 22/23</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      {...fieldProps}
                      value={value === undefined ? '' : value}
                      onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="yoy_growth_23_24"
              render={({ field: { onChange, value, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>YoY Growth 23/24</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      {...fieldProps}
                      value={value === undefined ? '' : value}
                      onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Outras Informações</h3>
          
          <FormField
            control={form.control}
            name="risk_factors"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fatores de Risco</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Descreva os principais fatores de risco da empresa..." 
                    className="min-h-[100px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="dividend_distribution"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-md border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Distribuição de Dividendos</FormLabel>
                    <FormDescription>
                      A empresa distribui dividendos aos acionistas?
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value === true}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <select 
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      value={field.value || "evaluating"}
                      onChange={(e) => field.onChange(e.target.value || "evaluating")}
                    >
                      <option value="evaluating">Em Avaliação</option>
                      <option value="approved">Aprovada</option>
                      <option value="not_approved">Não Aprovada</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="pipeline_status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status Pipeline</FormLabel>
                <FormControl>
                  <select 
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                    value={field.value || "prospect"}
                    onChange={(e) => field.onChange(e.target.value || "prospect")}
                  >
                    <option value="prospect">Prospects</option>
                    <option value="meeting_scheduled">Reunião agendada</option>
                    <option value="meeting_done">Reunião feita</option>
                    <option value="due_diligence">Due Diligence feita</option>
                    <option value="invested">Investida</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end space-x-2 pt-6">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button 
            type="submit" 
            className="bg-atria-red hover:bg-atria-red/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              "Salvar Alterações"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CompanyEditForm;
