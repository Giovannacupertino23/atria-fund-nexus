
import React, { useState } from "react";
import { format, startOfWeek, addDays, startOfMonth, endOfMonth, isSameDay, isSameMonth, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, FolderOpen, Users, Plus, Trash2, Edit, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCompany, CalendarEvent } from "@/context/CompanyContext";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

type EventFormData = {
  title: string;
  type: "meeting" | "deadline" | "follow-up";
  description: string;
  start: string;
  end: string;
  companyId?: string;
  teamMemberId: string;
};

const Calendar = () => {
  const { events, companies, teamMembers, addEvent, deleteEvent } = useCompany();
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedView, setSelectedView] = useState<"month" | "week" | "day">("month");
  const [selectedTeamMember, setSelectedTeamMember] = useState<string | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState<{ show: boolean, eventId?: string }>({ show: false });
  const [eventForm, setEventForm] = useState<EventFormData>({
    title: "",
    type: "meeting",
    description: "",
    start: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    end: format(addDays(new Date(), 1), "yyyy-MM-dd'T'HH:mm"),
    teamMemberId: teamMembers.length > 0 ? teamMembers[0].id : "",
  });

  const filteredEvents = events.filter((event) => {
    // Filter by team member if selected
    if (selectedTeamMember && event.teamMemberId !== selectedTeamMember) {
      return false;
    }
    
    // Always apply the date filter
    if (selectedView === "day" && selectedDate) {
      return isSameDay(new Date(event.start), selectedDate);
    } else if (selectedView === "week" && selectedDate) {
      const weekStart = startOfWeek(selectedDate);
      const weekEnd = addDays(weekStart, 6);
      const eventDate = new Date(event.start);
      return eventDate >= weekStart && eventDate <= weekEnd;
    } else if (selectedView === "month" && currentDate) {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      const eventDate = new Date(event.start);
      return eventDate >= monthStart && eventDate <= monthEnd;
    }
    
    return true;
  });

  // Get event type color
  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "meeting":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "deadline":
        return "bg-red-100 text-red-800 border-red-300";
      case "follow-up":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  // Get company name by ID
  const getCompanyName = (companyId?: string) => {
    if (!companyId) return "N/A";
    const company = companies.find((c) => c.id === companyId);
    return company ? company.name : "N/A";
  };

  // Get team member name by ID
  const getTeamMemberName = (teamMemberId: string) => {
    const member = teamMembers.find((m) => m.id === teamMemberId);
    return member ? member.name : "N/A";
  };

  // Navigation functions
  const prevPeriod = () => {
    if (selectedView === "day") {
      setSelectedDate(addDays(selectedDate || new Date(), -1));
    } else if (selectedView === "week") {
      setSelectedDate(addDays(selectedDate || new Date(), -7));
    } else {
      const newDate = new Date(currentDate);
      newDate.setMonth(newDate.getMonth() - 1);
      setCurrentDate(newDate);
    }
  };

  const nextPeriod = () => {
    if (selectedView === "day") {
      setSelectedDate(addDays(selectedDate || new Date(), 1));
    } else if (selectedView === "week") {
      setSelectedDate(addDays(selectedDate || new Date(), 7));
    } else {
      const newDate = new Date(currentDate);
      newDate.setMonth(newDate.getMonth() + 1);
      setCurrentDate(newDate);
    }
  };

  // Title formatting
  const formatTitle = () => {
    if (selectedView === "day" && selectedDate) {
      return format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } else if (selectedView === "week" && selectedDate) {
      const weekStart = startOfWeek(selectedDate);
      const weekEnd = addDays(weekStart, 6);
      return `${format(weekStart, "dd/MM", { locale: ptBR })} - ${format(
        weekEnd,
        "dd/MM/yyyy",
        { locale: ptBR }
      )}`;
    } else {
      return format(currentDate, "MMMM 'de' yyyy", { locale: ptBR });
    }
  };

  // Event form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEventForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setEventForm(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setEventForm({
      title: "",
      type: "meeting",
      description: "",
      start: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      end: format(addDays(new Date(), 1), "yyyy-MM-dd'T'HH:mm"),
      teamMemberId: teamMembers.length > 0 ? teamMembers[0].id : "",
      companyId: undefined,
    });
  };

  // Submit event form
  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!eventForm.title || !eventForm.start || !eventForm.end || !eventForm.teamMemberId) {
        toast({
          title: "Campos obrigatórios",
          description: "Preencha todos os campos obrigatórios",
          variant: "destructive",
        });
        return;
      }

      // Parse dates
      const startDate = new Date(eventForm.start);
      const endDate = new Date(eventForm.end);

      // Validate dates
      if (endDate <= startDate) {
        toast({
          title: "Datas inválidas",
          description: "A data de término deve ser posterior à data de início",
          variant: "destructive",
        });
        return;
      }

      const newEvent: Omit<CalendarEvent, "id"> = {
        title: eventForm.title,
        description: eventForm.description || "",
        type: eventForm.type,
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        teamMemberId: eventForm.teamMemberId,
        companyId: eventForm.companyId,
      };

      await addEvent(newEvent);
      toast({
        title: "Evento adicionado",
        description: "O evento foi adicionado com sucesso ao calendário",
      });

      // Reset form and close dialog
      resetForm();
      setShowEventDialog(false);
    } catch (error) {
      console.error("Erro ao adicionar evento:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao adicionar o evento",
        variant: "destructive",
      });
    }
  };

  // Delete event
  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteEvent(eventId);
      toast({
        title: "Evento excluído",
        description: "O evento foi excluído com sucesso",
      });
      setConfirmDeleteDialog({ show: false });
    } catch (error) {
      console.error("Erro ao excluir evento:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir o evento",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Calendário</h1>
        <p className="text-muted-foreground">
          Acompanhe reuniões e prazos importantes.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center">
              <CardTitle>Calendário de Eventos</CardTitle>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <Tabs
                value={selectedView}
                onValueChange={(value: string) => setSelectedView(value as "month" | "week" | "day")}
              >
                <TabsList>
                  <TabsTrigger value="month">Mês</TabsTrigger>
                  <TabsTrigger value="week">Semana</TabsTrigger>
                  <TabsTrigger value="day">Dia</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={prevPeriod}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-8"
                    >
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {formatTitle()}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="center" className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        if (date) {
                          setSelectedDate(date);
                          setCurrentDate(date);
                        }
                        setShowDatePicker(false);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={nextPeriod}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <select
                className="h-8 rounded-md border border-input bg-background px-3 text-sm"
                onChange={(e) => setSelectedTeamMember(e.target.value || undefined)}
                value={selectedTeamMember || ""}
              >
                <option value="">Todos os membros</option>
                {teamMembers.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>

              <Button 
                onClick={() => setShowEventDialog(true)}
                size="sm"
                className="h-8"
              >
                <Plus className="h-4 w-4 mr-1" />
                Novo Evento
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {filteredEvents.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                Nenhum evento encontrado para este período.
              </div>
            ) : (
              filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className={`p-3 border rounded-md ${getEventTypeColor(
                    event.type
                  )}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{event.title}</h4>
                      <p className="text-sm">
                        {format(new Date(event.start), "dd/MM/yyyy - HH:mm", {
                          locale: ptBR,
                        })}{" "}
                        até{" "}
                        {format(new Date(event.end), "HH:mm", {
                          locale: ptBR,
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={getEventTypeColor(event.type)}
                      >
                        {event.type === "meeting"
                          ? "Reunião"
                          : event.type === "deadline"
                          ? "Prazo"
                          : event.type === "follow-up"
                          ? "Follow-up"
                          : "Outro"}
                      </Badge>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            className="text-red-600 cursor-pointer"
                            onClick={() => setConfirmDeleteDialog({ show: true, eventId: event.id })}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir evento
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center">
                      <FolderOpen className="h-4 w-4 mr-2" />
                      <span>Empresa: {getCompanyName(event.companyId)}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      <span>Responsável: {getTeamMemberName(event.teamMemberId)}</span>
                    </div>
                  </div>
                  {event.description && (
                    <div className="mt-2 text-sm">
                      <p>{event.description}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialog for adding new events */}
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Evento</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEventSubmit}>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={eventForm.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="type">Tipo de Evento *</Label>
                  <Select
                    value={eventForm.type}
                    onValueChange={(value) => handleSelectChange("type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="meeting">Reunião</SelectItem>
                      <SelectItem value="deadline">Prazo</SelectItem>
                      <SelectItem value="follow-up">Follow-up</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start">Início *</Label>
                    <Input
                      id="start"
                      name="start"
                      type="datetime-local"
                      value={eventForm.start}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="end">Término *</Label>
                    <Input
                      id="end"
                      name="end"
                      type="datetime-local"
                      value={eventForm.end}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="teamMemberId">Responsável *</Label>
                  <Select
                    value={eventForm.teamMemberId}
                    onValueChange={(value) => handleSelectChange("teamMemberId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o responsável" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamMembers.map((member) => (
                        <SelectItem key={member.id} value={member.id}>{member.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="companyId">Empresa (opcional)</Label>
                  <Select
                    value={eventForm.companyId || ""}
                    onValueChange={(value) => handleSelectChange("companyId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma empresa" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Nenhuma</SelectItem>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={eventForm.description}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button">Cancelar</Button>
              </DialogClose>
              <Button type="submit">Salvar Evento</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={confirmDeleteDialog.show} onOpenChange={(open) => setConfirmDeleteDialog({ show: open })}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita.</p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDeleteDialog({ show: false })}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => confirmDeleteDialog.eventId && handleDeleteEvent(confirmDeleteDialog.eventId)}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Calendar;
