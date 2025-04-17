
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCompany, CalendarEvent, TeamMember } from "@/context/CompanyContext";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isToday, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  PlusCircle, 
  Clock, 
  Building2,
  Users, 
  ArrowUpRight,
  Clock10 
} from "lucide-react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Tipo para filtros de membro da equipe
type TeamFilter = string | 'all';

const Calendar = () => {
  const { events, teamMembers, companies, filterCompaniesByTeamMember } = useCompany();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTeamMember, setSelectedTeamMember] = useState<TeamFilter>('all');
  
  // Obter dias da semana atual
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  // Filtrar eventos por membro da equipe
  const filteredEvents = selectedTeamMember === 'all'
    ? events
    : events.filter(event => event.teamMemberId === selectedTeamMember);
  
  // Obter empresas do membro selecionado
  const teamCompanies = selectedTeamMember === 'all'
    ? []
    : filterCompaniesByTeamMember(selectedTeamMember);
  
  // Navegar para a semana anterior
  const previousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };
  
  // Navegar para a próxima semana
  const nextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };
  
  // Obter cor de fundo do evento baseado no tipo
  const getEventColor = (type: string) => {
    switch(type) {
      case 'meeting':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'deadline':
        return 'bg-red-100 border-red-300 text-red-800';
      case 'follow-up':
        return 'bg-green-100 border-green-300 text-green-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };
  
  // Obter eventos para um dia específico
  const getEventsForDay = (day: Date) => {
    return filteredEvents.filter(event => isSameDay(new Date(event.start), day));
  };
  
  // Formatar horário do evento
  const formatEventTime = (date: Date) => {
    return format(new Date(date), 'HH:mm', { locale: ptBR });
  };
  
  // Obter detalhes da empresa para um evento
  const getCompanyDetails = (companyId?: string) => {
    if (!companyId) return null;
    return companies.find(company => company.id === companyId);
  };
  
  // Renderizar ícone de membro da equipe
  const renderTeamMemberAvatar = (member: TeamMember) => {
    return (
      <Avatar className={`h-10 w-10 border-2 ${selectedTeamMember === member.id ? 'border-atria-red' : 'border-transparent'}`}>
        <AvatarFallback className={`${selectedTeamMember === member.id ? 'bg-atria-red text-white' : 'bg-muted'}`}>
          {member.avatar}
        </AvatarFallback>
      </Avatar>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Calendário</h1>
          <p className="text-muted-foreground">
            Gerencie reuniões e acompanhe eventos importantes da equipe.
          </p>
        </div>
        <Button className="bg-atria-red hover:bg-atria-red/90 self-start">
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Evento
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar do calendário */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center text-base font-medium">
              <Users className="mr-2 h-4 w-4" /> Membros da Equipe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                <Avatar 
                  className={`h-10 w-10 border-2 ${selectedTeamMember === 'all' ? 'border-atria-red' : 'border-transparent'} cursor-pointer`}
                  onClick={() => setSelectedTeamMember('all')}
                >
                  <AvatarFallback className={`${selectedTeamMember === 'all' ? 'bg-atria-red text-white' : 'bg-muted'}`}>
                    ALL
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col justify-center cursor-pointer" onClick={() => setSelectedTeamMember('all')}>
                  <span className="text-sm font-medium">Toda a Equipe</span>
                  <span className="text-xs text-muted-foreground">Ver Todos</span>
                </div>
              </div>
              
              <div className="border-t pt-3 space-y-3">
                {teamMembers.map(member => (
                  <div 
                    key={member.id} 
                    className="flex gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded transition-colors"
                    onClick={() => setSelectedTeamMember(member.id)}
                  >
                    {renderTeamMemberAvatar(member)}
                    <div className="flex flex-col justify-center">
                      <span className="text-sm font-medium">{member.name}</span>
                      <span className="text-xs text-muted-foreground">{member.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conteúdo principal */}
        <div className="lg:col-span-3 space-y-6">
          {/* Cabeçalho do calendário */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <CalendarIcon className="mr-2 h-5 w-5 text-muted-foreground" />
                  <h3 className="font-medium">
                    {format(weekStart, 'dd MMM', { locale: ptBR })} - {format(weekEnd, 'dd MMM yyyy', { locale: ptBR })}
                  </h3>
                </div>
                <div className="flex gap-1">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={previousWeek}
                    className="h-8 w-8"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setCurrentDate(new Date())}
                    className="h-8"
                  >
                    Hoje
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={nextWeek}
                    className="h-8 w-8"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Visualização de calendário semanal */}
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day, index) => (
              <div key={index} className="flex flex-col min-h-[500px]">
                <div className={cn(
                  "text-center mb-2 p-2 rounded-md font-medium",
                  isToday(day) ? "bg-atria-red text-white" : "bg-muted"
                )}>
                  <div className="text-xs uppercase">{format(day, 'EEE', { locale: ptBR })}</div>
                  <div>{format(day, 'dd')}</div>
                </div>
                <div className="flex-1 bg-card border rounded-md p-2 overflow-y-auto space-y-2">
                  {getEventsForDay(day).length === 0 ? (
                    <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                      Sem eventos
                    </div>
                  ) : (
                    getEventsForDay(day).map(event => {
                      const company = getCompanyDetails(event.companyId);
                      const teamMember = teamMembers.find(m => m.id === event.teamMemberId);
                      
                      return (
                        <div 
                          key={event.id}
                          className={`p-2 border rounded-md cursor-pointer text-xs ${getEventColor(event.type)}`}
                          onClick={() => {
                            if (event.companyId) {
                              navigate(`/company/${event.companyId}`);
                            }
                          }}
                        >
                          <div className="font-medium truncate">{event.title}</div>
                          <div className="flex items-center mt-1 gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{formatEventTime(event.start)}</span>
                          </div>
                          {company && (
                            <div className="flex items-center mt-1 gap-1">
                              <Building2 className="h-3 w-3" />
                              <span className="truncate">{company.name}</span>
                            </div>
                          )}
                          {teamMember && (
                            <div className="flex items-center mt-1 gap-1 text-muted-foreground">
                              <span className="truncate">{teamMember.name}</span>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Portfólio do membro selecionado */}
          {selectedTeamMember !== 'all' && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-base font-medium">
                  Portfólio do Membro
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="companies">
                  <TabsList className="mb-4">
                    <TabsTrigger value="companies">Empresas</TabsTrigger>
                    <TabsTrigger value="events">Eventos</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="companies">
                    {teamCompanies.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        Nenhuma empresa atribuída a este membro
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {teamCompanies.map(company => (
                          <div 
                            key={company.id}
                            className="p-3 bg-card border rounded-md hover:shadow-sm cursor-pointer flex justify-between items-center"
                            onClick={() => navigate(`/company/${company.id}`)}
                          >
                            <div>
                              <div className="font-medium">{company.name}</div>
                              <div className="text-sm text-muted-foreground flex items-center gap-2">
                                <span>{company.segment}</span>
                                <span className={`
                                  px-2 py-0.5 rounded-full text-xs
                                  ${company.status === 'investida' ? 'bg-green-100 text-green-800' : ''}
                                  ${company.status === 'diligence' ? 'bg-blue-100 text-blue-800' : ''}
                                  ${company.status === 'reunido' ? 'bg-yellow-100 text-yellow-800' : ''}
                                  ${company.status === 'agendado' ? 'bg-purple-100 text-purple-800' : ''}
                                  ${company.status === 'prospect' ? 'bg-gray-100 text-gray-800' : ''}
                                `}>
                                  {company.status === 'investida' && 'Investida'}
                                  {company.status === 'diligence' && 'Due Diligence'}
                                  {company.status === 'reunido' && 'Reunião Feita'}
                                  {company.status === 'agendado' && 'Reunião Agendada'}
                                  {company.status === 'prospect' && 'Prospect'}
                                </span>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <ArrowUpRight className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="events">
                    {filteredEvents.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        Nenhum evento agendado para este membro
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {filteredEvents.map(event => {
                          const company = getCompanyDetails(event.companyId);
                          return (
                            <div 
                              key={event.id}
                              className={`p-3 border rounded-md cursor-pointer ${getEventColor(event.type)}`}
                              onClick={() => {
                                if (event.companyId) {
                                  navigate(`/company/${event.companyId}`);
                                }
                              }}
                            >
                              <div className="font-medium">{event.title}</div>
                              <div className="flex items-center gap-2 text-sm mt-1">
                                <span className="flex items-center">
                                  <Clock10 className="h-3.5 w-3.5 mr-1" />
                                  {format(new Date(event.start), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                                </span>
                                {company && (
                                  <span className="flex items-center">
                                    <Building2 className="h-3.5 w-3.5 mr-1" />
                                    {company.name}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
