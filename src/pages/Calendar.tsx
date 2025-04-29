
import React, { useState } from "react";
import { format, startOfWeek, addDays, startOfMonth, endOfMonth, isSameDay, isSameMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, FolderOpen, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCompany, CalendarEvent } from "@/context/CompanyContext";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

const Calendar = () => {
  const { events, companies, teamMembers } = useCompany();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedView, setSelectedView] = useState<"month" | "week" | "day">("month");
  const [selectedTeamMember, setSelectedTeamMember] = useState<string | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState(false);

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
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Calendar;
