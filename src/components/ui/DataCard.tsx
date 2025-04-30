
import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DataCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  info?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  valueClassName?: string;
  responsible?: string;
  pipelineStatus?: string;
  finalScore?: number | null;
  scoreColor?: "green" | "orange" | "red" | null;
  status?: string;
}

export function DataCard({
  title,
  value,
  icon,
  info,
  trend,
  className,
  valueClassName,
  responsible,
  pipelineStatus,
  finalScore,
  scoreColor,
  status,
  ...props
}: DataCardProps) {
  const getScoreColorClass = (color: string | null | undefined) => {
    switch (color) {
      case "green": return "bg-green-500";
      case "orange": return "bg-orange-500";
      case "red": return "bg-red-500";
      default: return "bg-gray-300";
    }
  };

  const getPipelineStatusLabel = (status: string | null | undefined) => {
    switch (status) {
      case "prospect": return "Prospect";
      case "meeting_scheduled": return "Reunião Agendada";
      case "meeting_done": return "Reunião Feita";
      case "due_diligence": return "Due Diligence";
      case "invested": return "Investida";
      default: return "Não definido";
    }
  };
  
  const getStatusLabel = (status: string | null | undefined) => {
    switch (status) {
      case "approved": return "Aprovada";
      case "evaluating": return "Em Avaliação";
      case "not_approved": return "Não Aprovada";
      default: return "Em Avaliação";
    }
  };

  const getStatusColor = (status: string | null | undefined) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-800";
      case "evaluating": return "bg-yellow-100 text-yellow-800";
      case "not_approved": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className={cn("overflow-hidden", className)} {...props}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          {scoreColor && (
            <div className={cn("w-3 h-3 rounded-full", getScoreColorClass(scoreColor))}></div>
          )}
          <CardTitle className="text-sm font-medium flex gap-1 items-center">
            {title}
            {info && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-xs">{info}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </CardTitle>
        </div>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className={cn("text-xl font-bold", valueClassName)}>{value}</div>
            {trend && (
              <div
                className={cn(
                  "text-xs font-medium flex items-center",
                  trend.isPositive ? "text-green-500" : "text-red-500"
                )}
              >
                {trend.isPositive ? "+" : "-"}
                {trend.value}%
              </div>
            )}
          </div>

          {(responsible || pipelineStatus || status || finalScore !== undefined) && (
            <div className="pt-2 border-t border-border/50 space-y-2">
              {responsible && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Responsável:</span>
                  <span>{responsible}</span>
                </div>
              )}
              
              {pipelineStatus && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Pipeline:</span>
                  <span>{getPipelineStatusLabel(pipelineStatus)}</span>
                </div>
              )}
              
              {finalScore !== undefined && finalScore !== null && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Nota:</span>
                  <span className="font-medium">{finalScore.toFixed(1)}</span>
                </div>
              )}
              
              {status && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Status:</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(status)}`}>
                    {getStatusLabel(status)}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default DataCard;
