import React, { useState } from "react";
import { 
  Search,
  ChevronDown,
  ClipboardCheck
} from "lucide-react";
import { DIVIDER, TYPE_SCALE, TEXT_PRIMARY, TEXT_SECONDARY, h1Style, subStyle } from "./constants";
import { MOCK_CLIENTS, MOCK_CLIENT_DATA } from "./mockData";
import { Button, Card, Typography } from "../../components/ui";
import { StatusBadge } from "../../components/shared/StatusBadge";
import { WorkspaceLayout } from "../../components/layout/WorkspaceLayout";
import { ShareAssessmentModal } from "./modals/ShareAssessmentModal";
import { StartAssessmentModal } from "./modals/StartAssessmentModal";
import { AssessmentResultScreen } from "./AssessmentResultScreen";
import { Share2 } from "lucide-react";

export function MainAssessmentListWorkspace() {
  const [search, setSearch] = useState("");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isStartAssessmentModalOpen, setIsStartAssessmentModalOpen] = useState(false);
  const [sharingAssessmentTitle, setSharingAssessmentTitle] = useState("");
  const [selectedAssessment, setSelectedAssessment] = useState<any | null>(null);

  const allAssessments = MOCK_CLIENTS.flatMap(client => {
    const clientData = MOCK_CLIENT_DATA[client.id] || { assessments: [] };
    return clientData.assessments.map(assessment => ({
      ...assessment,
      clientName: client.name,
      clientId: client.id,
      leadClinician: client.clinicians[0]
    }));
  });

  const filtered = allAssessments.filter(a => 
    a.clientName.toLowerCase().includes(search.toLowerCase()) || 
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.leadClinician.toLowerCase().includes(search.toLowerCase())
  );

  const mainContent = (
    <div className="flex flex-col h-full">
      {/* Table Controls (Search) */}
      <div className="flex justify-end p-6">
        <div className="relative w-[320px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-disabled" size={18} />
          <input 
            type="text" 
            placeholder="Search by Clients, Clinicians, or Assessments" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-10 pr-4 border border-divider rounded bg-white text-sm outline-none"
          />
        </div>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto flex-1">
        <div className="grid grid-cols-[1.5fr_1fr_0.8fr_1fr_0.6fr] px-6 py-4 border-b border-divider bg-slate-50 text-[13px] font-semibold text-text-secondary">
          <div className="flex items-center gap-1">Assessment Title <ChevronDown size={14} /></div>
          <div className="flex items-center gap-1">Client</div>
          <div className="flex items-center gap-1">Status</div>
          <div className="flex items-center gap-1">Lead Clinician</div>
          <div className="text-right">Action</div>
        </div>

        {filtered.map((assessment, i) => {
          return (
            <div key={i} className={`grid grid-cols-[1.5fr_1fr_0.8fr_1fr_0.6fr] p-6 items-center ${i < filtered.length - 1 ? 'border-b border-divider' : ''}`}>
              <div>
                <Typography 
                  variant="body" 
                  className="font-bold text-sm text-text-primary hover:underline cursor-pointer"
                  onClick={() => setSelectedAssessment(assessment)}
                >
                  {assessment.title}
                </Typography>
                {assessment.date && (
                  <div className="text-xs text-text-secondary mt-1">{assessment.date}</div>
                )}
              </div>
              <div>
                <div className="text-sm text-text-primary">{assessment.clientName}</div>
                <div className="text-xs text-text-secondary">#{assessment.clientId}</div>
              </div>
              <div>
                <StatusBadge status={assessment.status.toLowerCase() as any} />
              </div>
              <div className="flex flex-col items-start gap-2">
                <StatusBadge status="clinician" label={assessment.leadClinician} className="normal-case" />
              </div>
              <div className="text-right flex items-center justify-end gap-3">
                {(assessment.status.toLowerCase() === 'not-started' || assessment.status.toLowerCase() === 'not started') && (
                  <button 
                    onClick={() => {
                      setSharingAssessmentTitle(assessment.title);
                      setIsShareModalOpen(true);
                    }}
                    className="text-primary bg-transparent border-none text-sm font-semibold cursor-pointer flex items-center gap-1 hover:underline"
                  >
                    <Share2 size={14} /> Share
                  </button>
                )}
                <button 
                  className="text-[#4caf50] bg-transparent border-none text-sm font-semibold cursor-pointer hover:underline"
                  onClick={() => setSelectedAssessment(assessment)}
                >
                  Manage
                </button>
              </div>
            </div>
          );
        })}
      </div>
      
      <ShareAssessmentModal 
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        assessmentTitle={sharingAssessmentTitle}
      />

      <StartAssessmentModal 
        isOpen={isStartAssessmentModalOpen}
        onClose={() => setIsStartAssessmentModalOpen(false)}
        onStart={(assessment) => {
          console.log("Starting assessment:", assessment);
        }}
      />

      {/* Pagination Footer */}
      <div className="px-6 py-5 border-t border-divider flex justify-end items-center gap-4 text-[13px] text-text-secondary">
          <div>Rows per page: <span className="text-text-primary font-medium">10</span> <ChevronDown size={14} className="inline align-middle ml-1" /></div>
          <div className="text-text-primary">1-10 of {filtered.length}</div>
          <div className="flex gap-4">
              <button className="bg-transparent border-none cursor-pointer text-text-secondary disabled:opacity-50" disabled>{"<"}</button>
              <button className="bg-transparent border-none cursor-pointer text-text-secondary">{">"}</button>
          </div>
      </div>
    </div>
  );

  if (selectedAssessment) {
    return (
      <div className="p-8">
        <AssessmentResultScreen 
          clientId={selectedAssessment.clientId} 
          onBack={() => setSelectedAssessment(null)} 
        />
      </div>
    );
  }

  return (
    <div className="pb-16">
      <WorkspaceLayout 
        singleColumn
        contentClassName="p-0"
        title="Assessments"
        small={false}
        subtitle="Track and manage diagnostic assessments for all clients."
        headerActions={
          <Button 
            icon={<ClipboardCheck size={18} />} 
            onClick={() => setIsStartAssessmentModalOpen(true)}
          >
            Start New Assessment
          </Button>
        }
        mainContent={mainContent}
      />
    </div>
  );
}
