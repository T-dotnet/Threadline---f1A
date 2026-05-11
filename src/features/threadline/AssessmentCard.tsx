import React from 'react';
import { FileText, Calendar, Share2, Link as LinkIcon, Check } from 'lucide-react';
import { useFeatureFlags } from "../../contexts/FeatureToggleContext";
import { StatusBadge } from '../../components/shared/StatusBadge';
import { EntityCard } from './EntityCard';
import { Button } from '../../components/ui/Button';
import { BRAND, TEXT_PRIMARY, TEXT_SECONDARY, TEXT_DISABLED, DIVIDER } from './constants';

export interface AssessmentCardProps {
  title: string;
  subtitle: string;
  status: string;
  onViewResult: () => void;
  onShare?: () => void;
  key?: React.Key;
  date?: string;
  description?: string;
  notes?: string;
  overallImpression?: string;
  score?: string;
  percentile?: string;
  descriptor?: string;
}

export function AssessmentCard({ 
  title, 
  subtitle, 
  status, 
  onViewResult, 
  onShare,
  date, 
  description, 
  notes,
  overallImpression,
  score,
  percentile,
  descriptor
}: AssessmentCardProps) {
  const { flags } = useFeatureFlags();
  const [copied, setCopied] = React.useState(false);
  const joinLink = "https://telehealth.threadline.com.au/join/{sessionId}?token=...";

  return (
    <EntityCard
      title={title}
      summary={subtitle}
      statusBadge={<StatusBadge status={status as any} />}
      hoverable={true}
      metadata={[
        ...(overallImpression ? [{ label: "Overall Impression", value: <span className="text-[#06302c] font-normal">{overallImpression}</span> }] : []),
        ...(score ? [{ label: "Relevance score", value: score }] : []),
        ...(percentile ? [{ label: "Percentile", value: percentile }] : []),
        ...(descriptor ? [{ label: "Descriptor", value: descriptor }] : [])
      ]}
      rightAction={
        status.toLowerCase() !== 'completed' ? (
          <div className="flex items-center gap-3">
            {(status.toLowerCase() !== 'not-started' && status.toLowerCase() !== 'not started') && (
              <>
                <span className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">Session Access</span>
                <div className="bg-slate-50 border border-slate-200 rounded-lg flex items-center px-2.5 py-1.5 gap-2 shadow-sm">
                  <LinkIcon size={14} className="text-slate-400" />
                  <span className="text-xs text-slate-500 max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap font-mono">
                    {joinLink}
                  </span>
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      setCopied(true); 
                      navigator.clipboard.writeText(joinLink);
                      setTimeout(() => setCopied(false), 1500); 
                    }} 
                    className={`text-xs font-bold px-1.5 py-0.5 rounded transition-colors duration-200 ${
                      copied ? "bg-green-50 text-green-600" : "text-[#06302c] hover:bg-slate-100"
                    }`}
                  >
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              </>
            )}
            {status.toLowerCase() === 'not-started' || status.toLowerCase() === 'not started' ? (
              <Button 
                variant="outline"
                size="sm"
                onClick={(e) => { 
                  e.stopPropagation(); 
                  if (onShare) {
                    onShare();
                  } else {
                    const link = `https://portal.threadline.com.au/assessment/${title.toLowerCase().replace(/\s+/g, '-')}`;
                    navigator.clipboard.writeText(link);
                    alert("Link copied to clipboard for sharing with client");
                  }
                }}
                className="text-[#06302c] border-[#06302c] hover:bg-[#06302c]/5 whitespace-nowrap"
              >
                <Share2 size={16} /> Share
              </Button>
            ) : (
              <Button 
                variant="outline" 
                size="sm"
                onClick={(e) => { e.stopPropagation(); onViewResult(); }} 
                className="text-[#06302c] border-[#06302c] hover:bg-[#06302c]/5 whitespace-nowrap"
              >
                View Workspace
              </Button>
            )}
          </div>
        ) : (
          <Button 
            variant="outline"
            size="sm"
            onClick={(e) => { e.stopPropagation(); onViewResult(); }} 
            className="text-[#06302c] border-[#06302c] hover:bg-[#06302c]/5 whitespace-nowrap"
          >
            View Workspace
          </Button>
        )
      }
      onClick={onViewResult}
    >
      {flags.FEATURE_ASSESSMENT_DETAILS && (description || notes) && (
        <div className="border-t border-slate-100 pt-4 flex flex-col gap-3">
          {description && (
            <div className="flex gap-2 items-start">
              <FileText size={16} className="text-slate-400 mt-0.5" />
              <div className="text-sm text-slate-900 leading-relaxed">
                {description}
              </div>
            </div>
          )}
          {notes && (
            <div className="flex gap-2 items-start">
              <Calendar size={16} className="text-slate-400 mt-0.5" />
              <div className="text-sm text-slate-500 leading-relaxed">
                <span className="font-semibold text-slate-900">Clinical Notes: </span>{notes}
              </div>
            </div>
          )}
        </div>
      )}
    </EntityCard>
  );
}
