
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { useCompany, Company, PipelineStatus } from "@/context/CompanyContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CompanyFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

type CompanyFormValues = Omit<Company, 'id' | 'created_at' | 'updated_at' | 'final_score' | 'score_color'> & {
  valuation?: number;
};

// Lista de responsáveis
const responsiblesList = [
  "Giovanna Cupertino", 
  "Giovanna Dangelo", 
  "Mel Bayde", 
  "Mauro Soledade", 
  "Ester Martins", 
  "Maria Paula", 
  "Nicolle Aguiar"
];

const CompanyForm: React.FC<CompanyFormProps> = ({
  onSuccess,
  onCancel
}) => {
  const { addCompany } = useCompany();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<CompanyFormValues>({
    defaultValues: {
      name: "",
      sector: "",
      about: "",
      cnpj: "",
      website: "",
      responsible: "",
      valuation: undefined,
      cac: undefined,
      average_ticket: undefined,
      market_cap: undefined,
      annual_revenue_2024: undefined,
      net_margin_2024: undefined,
      ebitda_2023: undefined,
      ebitda_2024: undefined,
      ebitda_2025: undefined,
      yoy_growth_21_22: undefined,
      yoy_growth_22_23: undefined,
      yoy_growth_23_24: undefined,
      risk_factors: "",
      leverage: undefined,
      cash_flow: undefined,
      dividend_distribution: false,
      status: "evaluating",
      pipeline_status: "prospect"
    }
  });
  
  const onSubmit = async (values: CompanyFormValues) => {
    try {
      setIsSubmitting(true);
      console.log("Enviando dados do formulário:", values);

      // Certifique-se de que os campos numéricos são do tipo correto
      const formattedValues = {
        ...values,
        valuation: values.valuation !== undefined ? Number(values.valuation) : undefined,
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
      console.log("Valores formatados:", formattedValues);
      const result = await addCompany(formattedValues);
      if (result) {
        console.log("Empresa cadastrada com sucesso:", result);
        toast({
          title: "Empresa cadastrada",
          description: "A empresa foi cadastrada com sucesso."
        });
        if (onSuccess) {
          onSuccess();
        } else {
          navigate(`/company/${result.id}`);
        }
      } else {
        // Se result for undefined mas não houve erro capturado
        toast({
          title: "Aviso",
          description: "A empresa foi processada, mas não foi possível obter confirmação completa.",
          variant: "default"
        });
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      console.error("Erro ao cadastrar empresa:", error);
      toast({
        title: "Erro ao cadastrar",
        description: "Ocorreu um erro ao cadastrar a empresa. Verifique os dados e tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Informações Básicas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="name" render={({
            field
          }) => <FormItem>
                  <FormLabel>Nome da Empresa *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome da empresa" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>} />
            
            <FormField control={form.control} name="sector" render={({
            field
          }) => <FormItem>
                  <FormLabel>Setor da Empresa *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Tecnologia, Saúde, Financeiro..." {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>} />
          </div>
          
          <FormField control={form.control} name="cnpj" render={({
          field
        }) => <FormItem>
                <FormLabel>CNPJ *</FormLabel>
                <FormControl>
                  <Input placeholder="XX.XXX.XXX/0001-XX" {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="website" render={({
            field
          }) => <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input placeholder="https://www.empresa.com.br" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>} />
            
            <FormField control={form.control} name="responsible" render={({
            field
          }) => <FormItem>
                  <FormLabel>Responsável</FormLabel>
                  <FormControl>
                    <Select 
                      value={field.value || ""} 
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um responsável" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* Fixed: Use a non-empty string for the first SelectItem's value */}
                        <SelectItem value="_none">Selecione um responsável</SelectItem>
                        {responsiblesList.map((name) => (
                          <SelectItem key={name} value={name}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField control={form.control} name="cac" render={({
            field: {
              onChange,
              value,
              ...fieldProps
            }
          }) => <FormItem>
                  <FormLabel>CAC (USD)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...fieldProps} value={value === undefined ? '' : value} onChange={e => onChange(e.target.value === '' ? undefined : Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>} />
            
            <FormField control={form.control} name="average_ticket" render={({
            field: {
              onChange,
              value,
              ...fieldProps
            }
          }) => <FormItem>
                  <FormLabel>ARPU (USD)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...fieldProps} value={value === undefined ? '' : value} onChange={e => onChange(e.target.value === '' ? undefined : Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>} />

            <FormField control={form.control} name="valuation" render={({
            field: {
              onChange,
              value,
              ...fieldProps
            }
          }) => <FormItem>
                  <FormLabel>Valuation (USD)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...fieldProps} value={value === undefined ? '' : value} onChange={e => onChange(e.target.value === '' ? undefined : Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>} />
          </div>
          
          <FormField control={form.control} name="about" render={({
          field
        }) => <FormItem>
                <FormLabel>Sobre a Empresa</FormLabel>
                <FormControl>
                  <Textarea placeholder="Descreva brevemente a empresa, seu histórico e atuação..." className="min-h-[100px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>} />
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Dados Financeiros</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="market_cap" render={({
            field: {
              onChange,
              value,
              ...fieldProps
            }
          }) => <FormItem>
                  <FormLabel>Market Cap (USD)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...fieldProps} value={value === undefined ? '' : value} onChange={e => onChange(e.target.value === '' ? undefined : Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>} />
            
            <FormField control={form.control} name="annual_revenue_2024" render={({
            field: {
              onChange,
              value,
              ...fieldProps
            }
          }) => <FormItem>
                  <FormLabel>Faturamento Anual 2024 (USD)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...fieldProps} value={value === undefined ? '' : value} onChange={e => onChange(e.target.value === '' ? undefined : Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField control={form.control} name="net_margin_2024" render={({
            field: {
              onChange,
              value,
              ...fieldProps
            }
          }) => <FormItem>
                  <FormLabel>Margem Líquida 2024 (%)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...fieldProps} value={value === undefined ? '' : value} onChange={e => onChange(e.target.value === '' ? undefined : Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>} />
            
            <FormField control={form.control} name="leverage" render={({
            field: {
              onChange,
              value,
              ...fieldProps
            }
          }) => <FormItem>
                  <FormLabel>Alavancagem (% dívida/patrimônio)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...fieldProps} value={value === undefined ? '' : value} onChange={e => onChange(e.target.value === '' ? undefined : Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>} />
            
            <FormField control={form.control} name="cash_flow" render={({
            field
          }) => <FormItem>
                  <FormLabel>Fluxo de Caixa</FormLabel>
                  <FormControl>
                    <select className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm" value={field.value || ""} onChange={e => field.onChange(e.target.value === "" ? undefined : e.target.value)}>
                      <option value="_none">Selecione</option>
                      <option value="positive">Positivo</option>
                      <option value="negative">Negativo</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>} />
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">EBITDA (%)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField control={form.control} name="ebitda_2023" render={({
            field: {
              onChange,
              value,
              ...fieldProps
            }
          }) => <FormItem>
                  <FormLabel>EBITDA 2023</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...fieldProps} value={value === undefined ? '' : value} onChange={e => onChange(e.target.value === '' ? undefined : Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>} />
            
            <FormField control={form.control} name="ebitda_2024" render={({
            field: {
              onChange,
              value,
              ...fieldProps
            }
          }) => <FormItem>
                  <FormLabel>EBITDA 2024</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...fieldProps} value={value === undefined ? '' : value} onChange={e => onChange(e.target.value === '' ? undefined : Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>} />
            
            <FormField control={form.control} name="ebitda_2025" render={({
            field: {
              onChange,
              value,
              ...fieldProps
            }
          }) => <FormItem>
                  <FormLabel>EBITDA 2025</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...fieldProps} value={value === undefined ? '' : value} onChange={e => onChange(e.target.value === '' ? undefined : Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>} />
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Crescimento YoY (%)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField control={form.control} name="yoy_growth_21_22" render={({
            field: {
              onChange,
              value,
              ...fieldProps
            }
          }) => <FormItem>
                  <FormLabel>YoY Growth 21/22</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...fieldProps} value={value === undefined ? '' : value} onChange={e => onChange(e.target.value === '' ? undefined : Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>} />
            
            <FormField control={form.control} name="yoy_growth_22_23" render={({
            field: {
              onChange,
              value,
              ...fieldProps
            }
          }) => <FormItem>
                  <FormLabel>YoY Growth 22/23</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...fieldProps} value={value === undefined ? '' : value} onChange={e => onChange(e.target.value === '' ? undefined : Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>} />
            
            <FormField control={form.control} name="yoy_growth_23_24" render={({
            field: {
              onChange,
              value,
              ...fieldProps
            }
          }) => <FormItem>
                  <FormLabel>YoY Growth 23/24</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...fieldProps} value={value === undefined ? '' : value} onChange={e => onChange(e.target.value === '' ? undefined : Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>} />
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Outras Informações</h3>
          
          <FormField control={form.control} name="risk_factors" render={({
          field
        }) => <FormItem>
                <FormLabel>Fatores de Risco</FormLabel>
                <FormControl>
                  <Textarea placeholder="Descreva os principais fatores de risco da empresa..." className="min-h-[100px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="dividend_distribution" render={({
            field
          }) => <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-md border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Distribuição de Dividendos</FormLabel>
                    <FormDescription>
                      A empresa distribui dividendos aos acionistas?
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value === true} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>} />
            
            <FormField control={form.control} name="status" render={({
            field
          }) => <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <select className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm" value={field.value || "evaluating"} onChange={e => field.onChange(e.target.value || "evaluating")}>
                      <option value="evaluating">Em Avaliação</option>
                      <option value="approved">Aprovada</option>
                      <option value="not_approved">Não Aprovada</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>} />
          </div>

          <FormField control={form.control} name="pipeline_status" render={({
          field
        }) => <FormItem>
                <FormLabel>Status Pipeline</FormLabel>
                <FormControl>
                  <select className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm" value={field.value || "prospect"} onChange={e => field.onChange(e.target.value || "prospect")}>
                    <option value="prospect">Prospects</option>
                    <option value="meeting_scheduled">Reunião agendada</option>
                    <option value="meeting_done">Reunião feita</option>
                    <option value="due_diligence">Due Diligence feita</option>
                    <option value="invested">Investida</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>} />
        </div>
        
        <div className="flex justify-end space-x-2 pt-6">
          {onCancel && <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>}
          <Button type="submit" className="bg-atria-red hover:bg-atria-red/90" disabled={isSubmitting}>
            {isSubmitting ? <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </> : "Cadastrar Empresa"}
          </Button>
        </div>
      </form>
    </Form>;
};

export default CompanyForm;
