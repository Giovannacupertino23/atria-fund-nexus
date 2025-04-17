
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCompany } from "@/context/CompanyContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  ChevronLeft,
  ExternalLink,
  Upload,
  FileText,
  Download,
  Trash2,
  Edit,
} from "lucide-react";
import DataCard from "@/components/ui/DataCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const CompanyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCompanyById, addDocument } = useCompany();
  const company = getCompanyById(id || "");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [docName, setDocName] = useState("");
  const [docType, setDocType] = useState("PDF");
  
  if (!company) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <h1 className="text-2xl font-bold mb-4">Empresa não encontrada</h1>
        <Button onClick={() => navigate("/")}>Voltar para listagem</Button>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (docName && docType) {
      addDocument(company.id, {
        name: docName,
        type: docType,
        url: "#", // Em uma implementação real, isso seria o URL do arquivo no storage
      });
      setDocName("");
      setDocType("PDF");
      setIsDialogOpen(false);
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "investida":
        return "Investida";
      case "diligence":
        return "Due Diligence";
      case "reunido":
        return "Reunião Feita";
      case "agendado":
        return "Reunião Agendada";
      case "prospect":
        return "Prospect";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "investida":
        return "bg-green-100 text-green-800";
      case "diligence":
        return "bg-blue-100 text-blue-800";
      case "reunido":
        return "bg-yellow-100 text-yellow-800";
      case "agendado":
        return "bg-purple-100 text-purple-800";
      case "prospect":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/")}
            className="h-9 w-9"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{company.name}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{company.cnpj}</span>
              <span className="text-lg">•</span>
              <span>{company.segment}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(company.status)}`}>
            {getStatusLabel(company.status)}
          </span>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <DataCard
              title="Receita Mensal"
              value={formatCurrency(company.revenue)}
              info="Receita mensal média"
            />
            <DataCard
              title="Margem de Lucro"
              value={`${company.profitMargin}%`}
              info="Percentual de lucro sobre a receita"
            />
            <DataCard
              title="NPS"
              value={company.nps}
              info="Net Promoter Score - índice de satisfação do cliente"
              valueClassName={
                company.nps >= 75
                  ? "text-green-600"
                  : company.nps >= 50
                  ? "text-yellow-600"
                  : "text-red-600"
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Métricas de Retenção</CardTitle>
                <CardDescription>Indicadores de retenção de clientes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Retenção</span>
                    <span className="font-medium">{company.retention}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-atria-red rounded-full"
                      style={{ width: `${company.retention}%` }}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Churn</span>
                    <span className="font-medium">{company.churn}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 rounded-full"
                      style={{ width: `${company.churn}%` }}
                    />
                  </div>
                </div>
                
                <Separator className="my-2" />
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">CAC</p>
                    <p className="font-medium">{formatCurrency(company.cac)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">LTV</p>
                    <p className="font-medium">{formatCurrency(company.ltv)}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Relação LTV:CAC</p>
                  <p className="font-medium text-xl">
                    {(company.ltv / company.cac).toFixed(1)}x
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações Adicionais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {company.website && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Website</p>
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-atria-red hover:underline"
                    >
                      {company.website}
                      <ExternalLink className="h-3.5 w-3.5 ml-1" />
                    </a>
                  </div>
                )}
                
                {company.lastContact && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Último Contato</p>
                    <p className="font-medium">
                      {new Date(company.lastContact).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                )}
                
                {company.nextMeeting && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Próxima Reunião</p>
                    <p className="font-medium">
                      {new Date(company.nextMeeting).toLocaleDateString("pt-BR")} às{" "}
                      {new Date(company.nextMeeting).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                )}
                
                <Separator className="my-2" />
                
                <div>
                  <p className="text-sm text-muted-foreground mb-3">Documentos</p>
                  {company.documents.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic">
                      Nenhum documento disponível
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {company.documents.slice(0, 2).map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-2 bg-muted rounded"
                        >
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-sm">{doc.name}</span>
                          </div>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      
                      {company.documents.length > 2 && (
                        <Button
                          variant="link"
                          className="text-xs pl-0"
                          onClick={() => document.getElementById("documents-tab")?.click()}
                        >
                          Ver todos os documentos
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="documents" id="documents-tab">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Documentos</CardTitle>
                <CardDescription>
                  Gerencie os documentos relacionados a esta empresa
                </CardDescription>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-atria-red hover:bg-atria-red/90">
                    <Upload className="mr-2 h-4 w-4" />
                    Adicionar Documento
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Documento</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="docName">Nome do Documento</Label>
                      <Input
                        id="docName"
                        value={docName}
                        onChange={(e) => setDocName(e.target.value)}
                        placeholder="Ex: Contrato, Relatório, etc."
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="docType">Tipo</Label>
                      <select
                        id="docType"
                        value={docType}
                        onChange={(e) => setDocType(e.target.value)}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      >
                        <option value="PDF">PDF</option>
                        <option value="DOCX">DOCX</option>
                        <option value="XLSX">XLSX</option>
                        <option value="PPTX">PPTX</option>
                        <option value="JPG">JPG</option>
                        <option value="PNG">PNG</option>
                        <option value="Outro">Outro</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="docFile">Arquivo</Label>
                      <Input
                        id="docFile"
                        type="file"
                        className="cursor-pointer"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        *Arquivos PDF, Word, Excel, PowerPoint ou imagens
                      </p>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" className="bg-atria-red hover:bg-atria-red/90">
                        Adicionar
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {company.documents.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 bg-muted/50 rounded-lg">
                  <FileText className="h-12 w-12 text-muted-foreground mb-2" />
                  <h3 className="text-lg font-medium mb-1">Nenhum documento</h3>
                  <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
                    Adicione documentos importantes relacionados a esta empresa para facilitar o acesso e organização.
                  </p>
                  <Button onClick={() => setIsDialogOpen(true)} className="bg-atria-red hover:bg-atria-red/90">
                    <Upload className="mr-2 h-4 w-4" />
                    Adicionar Documento
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {company.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted/80 transition-colors"
                    >
                      <div className="flex items-center">
                        <div className="p-2 bg-white rounded shadow mr-3">
                          <FileText className="h-6 w-6 text-atria-red" />
                        </div>
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="uppercase">{doc.type}</span>
                            <span>
                              {new Date(doc.uploadDate).toLocaleDateString("pt-BR")}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompanyDetails;
