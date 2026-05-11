import * as React from "react";
import { cn } from "../../lib/utils";

interface DataPointProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: React.ReactNode;
  className?: string;
  key?: React.Key;
}

export function DataPoint({ label, value, className }: DataPointProps) {
  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      <div 
        className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap opacity-50" 
        style={{ color: "#0F172A" }}
      >
        {label}
      </div>
      <div className="text-sm font-medium text-slate-900 whitespace-nowrap">
        {value}
      </div>
    </div>
  );
}
