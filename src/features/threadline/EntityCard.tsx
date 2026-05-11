import React from 'react';
import { BRAND, TEXT_PRIMARY, TEXT_SECONDARY } from './constants';
import { DataPoint } from '../../components/ui';

export interface EntityCardProps {
  key?: React.Key;
  title: string;
  statusBadge?: React.ReactNode;
  metadata?: { label: string; value: React.ReactNode }[];
  summary?: React.ReactNode;
  rightAction?: React.ReactNode;
  onClick?: () => void;
  children?: React.ReactNode;
  hoverable?: boolean;
}

export function EntityCard({
  title,
  statusBadge,
  metadata = [],
  summary,
  rightAction,
  onClick,
  children,
  hoverable = true,
}: EntityCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  
  return (
    <div 
      onClick={onClick}
      className={`bg-white border rounded-2xl overflow-hidden shadow-sm transition-all duration-200 flex flex-col ${
        isHovered && hoverable && onClick ? "border-[#06302c]" : "border-slate-100"
      } ${hoverable && onClick ? "cursor-pointer" : "cursor-default"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-6 md:p-7 flex flex-col">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <div className={`flex flex-col items-start gap-2 ${metadata.length || summary || statusBadge ? "mb-1.5" : "mb-0"}`}>
              <h3 className={`text-xl font-semibold m-0 tracking-tight transition-colors ${onClick ? "text-primary hover:underline" : "text-slate-900"}`}>
                {title}
              </h3>
              {statusBadge}
            </div>
            
            {metadata.length > 0 && (
              <div className="flex items-start gap-8 flex-wrap mt-4">
                {metadata.map((m, i) => (
                  <DataPoint key={i} label={m.label} value={m.value} />
                ))}
              </div>
            )}
            
            {summary && (
              <div className="text-sm text-slate-500 leading-relaxed mt-3">
                {summary}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3 shrink-0">
            {rightAction}
          </div>
        </div>
        {children && <div className="mt-5">{children}</div>}
      </div>
    </div>
  );
}
