import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { format, parse } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Plus, Trash2, User } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCompany, CalendarEvent, TeamMember } from "@/context/CompanyContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface EventFormValues {
  title: string;
  start: Date;
  end: Date;
  teamMemberId: string;
  type: "meeting" | "deadline" | "follow-up" | "other";
  companyId?: string;
}

const Calendar = () => {
  const { companies, events, teamMembers, addEvent, deleteEvent } = useCompany();
  const { toast } = useToast();
  
  // State for event dialog
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  
  // State for delete confirmation
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);

  // Form for new event
  const form = useForm<EventFormValues>({
    defaultValues: {
      title: "",
      start: new Date(),
      end: new Date(),
      teamMemberId: "",
      type: "meeting"
    }
  });

  const onSubmit = (values: EventFormValues) => {
    addEvent({
      title: values.title,
      start: values.start,
      end: values.end,
      teamMemberId: values.teamMemberId,
      type: values.type,
      companyId: values.companyId
    });

    toast({
      title: "Evento adicionado",
      description: "O evento foi adicionado com sucesso ao calendário."
    });

    setIsEventDialogOpen(false);
    form.reset();
  };

  const handleAddEventClick = (day: Date) => {
    setDate(day);
    
    // Set the default start and end date
    const startOfDay = new Date(day);
    startOfDay.setHours(9, 0, 0, 0);
    
    const endOfDay = new Date(day);
    endOfDay.setHours(10, 0, 0, 0);
    
    form.setValue("start", startOfDay);
    form.setValue("end", endOfDay);
    
    setIsEventDialogOpen(true);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEventToDelete(eventId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteEvent = () => {
    if (eventToDelete) {
      deleteEvent(eventToDelete);
      setEventToDelete(null);
      setIsDeleteDialogOpen(false);
      
      toast({
        title: "Evento excluído",
        description: "O evento foi removido com sucesso do calendário."
      });
    }
  };

  // Group events by date
  const eventsByDate = React.useMemo(() => {
    const grouped: { [key: string]: CalendarEvent[] } = {};
    
    events.forEach(event => {
      const dateKey = format(new Date(event.start), "yyyy-MM-dd");
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(event);
    });
    
    return grouped;
  }, [events]);

  // Get event type color
  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "meeting": return "bg-blue-100 border-blue-300 text-blue-800";
      case "deadline": return "bg-red-100 border-red-300 text-red-800";
      case "follow-up": return "bg-green-100 border-green-300 text-green-800";
      default: return "bg-gray-100 border-gray-300 text-gray-800";
    }
  };

  // Find team member name by ID
  const getTeamMemberName = (id: string) => {
    const member = teamMembers.find(m => m.id === id);
    return member ? member.name : "Não atribuído";
  };

  // Find company name by ID
  const getCompanyName = (id?: string) => {
    if (!id) return "";
    const company = companies.find(c => c.id === id);
    return company ? company.name : "";
  };

  // Get team member initials for avatar
  const getTeamMemberInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Get team member details by ID
  const getTeamMemberDetails = (id: string): TeamMember | undefined => {
    return teamMembers.find(m => m.id === id);
  };

  // Format time for input
  const formatTimeForInput = (date: Date) => {
    return format(new Date(date), "HH:mm");
  };

  // Parse time input
  const parseTimeInput = (timeString: string, baseDate: Date) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date(baseDate);
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Calendário</h1>
        <p className="text-muted-foreground">
          Gerencie eventos e compromissos relacionados às empresas.
        </p>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Calendário de Eventos</CardTitle>
          <Button 
            className="bg-atria-red hover:bg-atria-red/90"
            onClick={() => handleAddEventClick(new Date())}
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Evento
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/2">
              <CalendarComponent 
                mode="single" 
                selected={date}
                onSelect={setDate}
                className="rounded-md border shadow p-4 pointer-events-auto"
                components={{
                  DayContent: (props) => {
                    // We need to use the date prop rather than day which doesn't exist
                    const dateKey = format(props.date, "yyyy-MM-dd");
                    const dayEvents = eventsByDate[dateKey] || [];
                    const hasEvents = dayEvents.length > 0;
                    
                    return (
                      <div className="relative w-full h-full">
                        <div>{format(props.date, "d")}</div>
                        {hasEvents && (
                          <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-atria-red" />
                          </div>
                        )}
                      </div>
                    );
                  }
                }}
              />

              <div className="mt-4">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleAddEventClick(date || new Date())}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Evento em {date ? format(date, "dd/MM/yyyy") : "Hoje"}
                </Button>
              </div>
            </div>
            
            <div className="md:w-1/2 space-y-4">
              <h3 className="font-medium text-lg">
                Eventos para {date ? format(date, "dd 'de' MMMM, yyyy") : "Hoje"}
              </h3>
              
              {date && eventsByDate[format(date, "yyyy-MM-dd")] ? (
                eventsByDate[format(date, "yyyy-MM-dd")].map((event) => {
                  const teamMember = getTeamMemberDetails(event.teamMemberId);
                  return (
                    <div 
                      key={event.id} 
                      className={`border rounded-md p-3 ${getEventTypeColor(event.type)}`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{event.title}</h4>
                          <p className="text-sm">
                            {format(new Date(event.start), "HH:mm")} - {format(new Date(event.end), "HH:mm")}
                          </p>
                          <div className="flex items-center mt-2 gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs bg-gray-200 text-gray-700">
                                {teamMember ? getTeamMemberInitials(teamMember.name) : "?"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="text-sm">
                              <span className="font-medium">{getTeamMemberName(event.teamMemberId)}</span>
                              {teamMember && <span className="text-xs text-muted-foreground ml-2">({teamMember.role})</span>}
                            </div>
                          </div>
                          {event.companyId && (
                            <p className="text-sm mt-1">Empresa: {getCompanyName(event.companyId)}</p>
                          )}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8 text-gray-500 hover:text-red-500 hover:bg-red-50"
                          onClick={() => handleDeleteEvent(event.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-8 text-muted-foreground border rounded-md">
                  Nenhum evento para esta data.
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Event Dialog */}
      <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Evento</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título do Evento</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Reunião com cliente" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="start"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hora de Início</FormLabel>
                      <FormControl>
                        <Input 
                          type="time" 
                          value={formatTimeForInput(field.value)}
                          onChange={(e) => {
                            const baseDate = date || new Date();
                            field.onChange(parseTimeInput(e.target.value, baseDate));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="end"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hora de Término</FormLabel>
                      <FormControl>
                        <Input 
                          type="time" 
                          value={formatTimeForInput(field.value)}
                          onChange={(e) => {
                            const baseDate = date || new Date();
                            field.onChange(parseTimeInput(e.target.value, baseDate));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="teamMemberId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Responsável</FormLabel>
                    <Select 
                      value={field.value} 
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um responsável" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {teamMembers.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs bg-gray-200 text-gray-700">
                                  {getTeamMemberInitials(member.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <span>{member.name}</span>
                                <span className="text-xs text-muted-foreground ml-2">({member.role})</span>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Evento</FormLabel>
                    <Select 
                      value={field.value} 
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo de evento" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="meeting">Reunião</SelectItem>
                        <SelectItem value="deadline">Prazo</SelectItem>
                        <SelectItem value="follow-up">Follow-up</SelectItem>
                        <SelectItem value="other">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="companyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Empresa (Opcional)</FormLabel>
                    <Select 
                      value={field.value || ""} 
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Associar a uma empresa (opcional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">Nenhuma empresa</SelectItem>
                        {companies.map((company) => (
                          <SelectItem key={company.id} value={company.id}>
                            {company.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEventDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-atria-red hover:bg-atria-red/90">
                  Adicionar Evento
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setEventToDelete(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteEvent}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Calendar;
