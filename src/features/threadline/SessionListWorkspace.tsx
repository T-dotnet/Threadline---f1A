import React, { useState } from "react";
import { 
  Plus as AddIcon, 
  ChevronRight, 
  Play, 
  SkipBack, 
  Volume2, 
  Maximize, 
  Maximize2, 
  Info, 
  X, 
  Copy, 
  Edit3,
  Search,
  Calendar,
  ArrowLeft as BackArrow,
  Download as DownloadIcon
} from "lucide-react";
import { DIVIDER } from "./constants";
import { SimpleDropdown } from "../../components/common/UIElements";
import { EmptyState } from "../../components/shared/EmptyState";
import { useFeatureFlags } from "../../contexts/FeatureToggleContext";
import { WorkspaceLayout } from "../../components/layout/WorkspaceLayout";

import { MOCK_CLIENT_DATA, MOCK_CLIENTS } from "./mockData";

import { SectionHeader } from "../../components/shared/SectionHeader";
import { StatusBadge } from "../../components/shared/StatusBadge";
import { EntityCard, TabBar, DetailViewLayout } from "./components";
import { 
  Button, 
  Card, 
  Typography, 
  Input, 
  Badge,
  DataPoint
} from "../../components/ui";
import { cn } from "../../lib/utils";
import { CreateSessionModal } from "./modals/CreateSessionModal";

export function SessionListWorkspace({
  selectedSession,
  onSessionSelect,
  onBack,
  subHeaderContent
}: {
  selectedSession: any;
  onSessionSelect: (session: any) => void;
  onBack: () => void;
  subHeaderContent?: React.ReactNode;
}) {
  const { activeClientId } = useFeatureFlags();
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const clientData = activeClientId ? MOCK_CLIENT_DATA[activeClientId] : null;

  const initialSessions = clientData?.sessions?.map((s, idx) => ({
    id: s.id || `#SESSION-${idx + 1}`,
    timestamp: s.date,
    description: s.focus,
    notes: s.notes,
    evidence: s.evidence
  })) || [];

  const [sessions, setSessions] = useState(initialSessions);

  // Sync with mock data when client changes
  React.useEffect(() => {
    setSessions(initialSessions);
  }, [activeClientId]);

  const handleSessionCreate = (sessionInfo: { type: 'new' | 'existing', code?: string }) => {
    const newSession = {
      id: sessionInfo.type === 'existing' ? sessionInfo.code! : `#SESSION-${sessions.length + 1}`,
      timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      description: sessionInfo.type === 'existing' ? `Added Session: ${sessionInfo.code}` : "New Clinical Session",
      notes: "Telehealth session automatically initialized.",
      evidence: []
    };
    
    setSessions([newSession, ...sessions]);
    setIsCreateModalOpen(false);
  };

  if (selectedSession) {
    return <SessionDetail session={selectedSession} onBack={onBack} />;
  }

  const mainContent = (
    <div className="flex flex-col h-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <SimpleDropdown 
          label="Status"
          value={statusFilter}
          options={["All Status", "Completed", "Scheduled", "Draft"]}
          onChange={setStatusFilter}
          width={200}
        />

        <div className="relative w-full md:w-[320px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-disabled" size={18} />
          <Input 
            placeholder="Search sessions..." 
            className="pl-10"
          />
        </div>
      </div>
    
      <div className="flex flex-col gap-5 flex-1">
        {sessions.length === 0 ? (
          <EmptyState 
            icon={Calendar}
            title="No sessions recorded"
            description="This client hasn't had any recorded sessions yet. Start a new session to begin collecting clinical data."
            actionLabel="New Session"
            onAction={() => setIsCreateModalOpen(true)}
            className="py-24"
          />
        ) : (
          sessions.map((s, i) => (
            <EntityCard
              key={s.id}
              title={s.description || 'Session details'}
              metadata={[
                { label: "Session ID", value: <span className="lowercase">{s.id}</span> },
                ...(s.timestamp ? [{ label: "Date", value: s.timestamp }] : []),
                ...(s.notes ? [{ label: "Session Summary", value: s.notes }] : [])
              ]}
              statusBadge={<StatusBadge status="completed" />}
              rightAction={<ChevronRight size={24} className="text-text-secondary" />}
              onClick={() => onSessionSelect(s)}
            />
          ))
        )}
      </div>
      
      <CreateSessionModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSessionCreate={handleSessionCreate}
        clientId={activeClientId}
      />
    </div>
  );

  return (
    <div className="pb-16">
      <WorkspaceLayout 
        singleColumn
        title="Session"
        subtitle="Manage telehealth sessions and generate clinical notes seamlessly."
        headerActions={<Button variant="brand" onClick={() => setIsCreateModalOpen(true)}><AddIcon size={18} /> New Session</Button>}
        subHeaderContent={subHeaderContent}
        mainContent={mainContent}
      />
    </div>
  );
}

export function SessionDetail({ session, onBack }: { session: any, onBack: () => void }) {
  const { activeClientId } = useFeatureFlags();
  const clientMeta = activeClientId ? MOCK_CLIENTS.find(c => c.id === activeClientId) : null;
  const [activeTab, setActiveTab] = useState("Context");
  const [activeNoteTab, setActiveNoteTab] = useState("Referral Note");

  return (
    <DetailViewLayout
      onBack={onBack}
      backLabel="Back to Sessions"
      title={session.description || 'Session Details'}
      subtitle={
        <Typography variant="code" className="text-[13px] text-text-secondary">
          {session.id}{session.timestamp ? ` • ${session.timestamp}` : ''}
        </Typography>
      }
      headerBadges={
        <>
          <StatusBadge status="completed" />
          <Badge variant="soft" className="bg-amber-100 text-amber-800 border-none font-bold text-[10px] uppercase tracking-wider">
            1 Alert
          </Badge>
        </>
      }
      headerActions={
        <Button variant="brand" className="shrink-0">
          <DownloadIcon size={18} /> Download Session Info
        </Button>
      }
      metaBanner={[
        { label: "Date of Birth", value: "17 Dec 2001 (24y)" },
        { label: "Clinician", value: "Dr. Marcus Thorne" },
        { label: "Duration", value: "45 minutes" },
      ]}
    >
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Left Column: Video & Info */}
        <div className="flex flex-col gap-6">
          {/* Video Player */}
          <div className="bg-slate-200 rounded-xl overflow-hidden relative aspect-video shadow-inner group">
            {/* Video Header */}
            <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/20 to-transparent flex justify-between items-center text-white z-10">
              <span className="text-sm font-medium drop-shadow-md">
                {clientMeta?.name || "Client"} #{clientMeta?.id || ""}
              </span>
              <Info size={16} className="opacity-80 hover:opacity-100 cursor-pointer transition-opacity" />
            </div>

            {/* Video Placeholder */}
            <div className="absolute inset-0 flex gap-0.5 p-0.5">
               <div className="flex-1 bg-slate-400 relative overflow-hidden group/view">
                  <img 
                     src="https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=600&auto=format&fit=crop" 
                     alt="Clinician" 
                     className="w-full h-full object-cover transition-transform duration-500 group-hover/view:scale-105" 
                  />
                  <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">Clinician</div>
               </div>
               <div className="flex-1 bg-slate-500 relative overflow-hidden group/view">
                  <img 
                     src="https://images.unsplash.com/photo-1543132220-3ce99c5ae93c?q=80&w=600&auto=format&fit=crop" 
                     alt="Client" 
                     className="w-full h-full object-cover transition-transform duration-500 group-hover/view:scale-105" 
                  />
                  <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">Client</div>
               </div>
            </div>

            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <div className="w-16 h-12 bg-black/70 hover:bg-black/80 rounded-xl flex items-center justify-center text-white shadow-xl transition-all scale-100 active:scale-95 pointer-events-auto cursor-pointer">
                  <Play size={24} fill="currentColor" />
               </div>
            </div>

            {/* Video Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent p-4 text-white">
              <div className="h-1 bg-white/30 rounded-full mb-3 relative overflow-hidden cursor-pointer group/progress">
                 <div className="absolute left-0 top-0 bottom-0 w-[35%] bg-primary shadow-[0_0_8px_rgba(6,48,44,0.8)]" />
                 <div className="absolute left-[35%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md transition-transform scale-0 group-hover/progress:scale-100" />
              </div>
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-5">
                    <Play size={18} fill="currentColor" className="cursor-pointer hover:text-primary transition-colors" />
                    <SkipBack size={18} className="cursor-pointer hover:text-primary transition-colors" />
                    <Volume2 size={18} className="cursor-pointer hover:text-primary transition-colors" />
                    <span className="text-xs font-medium tabular-nums shadow-sm">5:07 / 15:28</span>
                 </div>
                 <div className="flex items-center gap-5">
                    <span className="text-[10px] font-bold border border-white/40 px-1 py-0 rounded-sm opacity-80">HD</span>
                    <Maximize className="cursor-pointer hover:text-primary transition-colors" size={18} />
                 </div>
              </div>
            </div>
          </div>

          {/* Tabs and Content */}
          <div className="flex flex-col gap-4">
            <div className="px-1">
              <TabBar 
                tabs={["Transcript", "Context"]} 
                active={activeTab} 
                onSelect={setActiveTab} 
              />
            </div>

            <div className="bg-white border border-divider rounded-2xl flex flex-col shadow-sm overflow-hidden min-h-[400px]">
              <div className="p-8 flex-1 overflow-y-auto">
                {activeTab === "Context" && (
                  <div className="space-y-4">
                    <div>
                      <Typography variant="h3" className="text-lg font-serif">Context</Typography>
                      <Typography variant="body-sm" className="text-text-secondary italic">Clinician observations and context</Typography>
                    </div>
                    
                    <Typography variant="body" className="text-text-primary leading-relaxed text-[15px]">
                       When clinicians conduct tests, they meticulously document the results to ensure accuracy and clarity. 
                       This process involves typing detailed observations, measurements, and any relevant notes that may assist 
                       in diagnosis and treatment planning. It's essential for maintaining a comprehensive record that can 
                       be referenced in future consultations.
                    </Typography>
                  </div>
                )}



                {activeTab === "Transcript" && (
                  <div className="space-y-4">
                     <div className="flex items-center gap-2 mb-2">
                       <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                       <Typography variant="label-micro" className="text-text-secondary">AI Transcription Active</Typography>
                     </div>
                     <div className="space-y-6">
                        <div className="flex gap-4">
                           <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-[10px] font-bold">MT</div>
                           <div className="space-y-1">
                              <Typography variant="label-micro" className="text-text-secondary">Dr. Marcus Thorne • 00:15</Typography>
                              <Typography variant="body-sm">Good morning, Maria. How have you been feeling since our last session?</Typography>
                           </div>
                        </div>
                        <div className="flex gap-4">
                           <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0 text-[10px] font-bold">MS</div>
                           <div className="space-y-1">
                              <Typography variant="label-micro" className="text-text-secondary">Maria Santos • 00:22</Typography>
                              <Typography variant="body-sm">Honestly, Marcus, the pain hasn't really let up. It's making it very difficult to stay focused at my desk.</Typography>
                           </div>
                        </div>
                     </div>
                  </div>
                )}
              </div>


              {/* Footer buttons */}
              <div className="px-6 py-4 border-t border-divider bg-slate-50/30 flex justify-end gap-3">
                 <Button variant="outline" size="sm">
                  <Copy size={16} /> Copy
                 </Button>
                 <Button variant="outline" size="sm">
                  <Edit3 size={16} /> Edit
                 </Button>
              </div>
            </div>
          </div>
        </div>

          {/* Right Column: Notes */}
          <div className="border border-divider rounded-2xl bg-white p-8 flex flex-col gap-6 shadow-sm min-h-[700px]">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="space-y-6 flex-1">
                 <Button variant="outline" size="sm" className="gap-2 px-4 border-slate-200">
                    <Maximize2 size={16} /> Go To Full Screen
                 </Button>
                 <div className="space-y-1">
                    <Typography variant="h1" className="text-2xl font-serif">Notes</Typography>
                    <Typography variant="body-sm" className="text-text-secondary">Clinical notes and documentation for this session</Typography>
                 </div>
              </div>
              <Button variant="brand" className="shrink-0 gap-2">
                <AddIcon size={18} /> Create Note
              </Button>
            </div>

            {/* Note selection tabs */}
            <div className="flex flex-col gap-4 flex-1">
              <div className="px-1">
                <TabBar 
                  tabs={["Referral Note", "Progress Note", "Risk Assessment", "Evidence"]} 
                  active={activeNoteTab} 
                  onSelect={setActiveNoteTab} 
                />
              </div>

              {/* Note Content Area */}
              <div className="border border-divider rounded-xl flex-1 p-8 relative overflow-y-auto bg-slate-50/10 hover:border-primary/20 transition-colors group">
                 {activeNoteTab === "Referral Note" && (
                   <div className="space-y-6">
                    <div className="space-y-2">
                       <Typography variant="label-micro" className="text-text-secondary">Reason For Referral</Typography>
                       <Typography variant="body" className="text-text-primary leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
                        The Client Is Being Referred For Further Evaluation Due To Persistent Lower Back Pain That Has Not Improved With Initial Management.
                       </Typography>
                    </div>

                    <div className="space-y-2">
                       <Typography variant="label-micro" className="text-text-secondary">Summary</Typography>
                       <Typography variant="body" className="text-text-primary leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
                        Maria Reports Ongoing Pain For 3 Weeks, Rated 6/10. No Red Flags Noted. Basic Assessment Completed, And Initial Interventions Provided. Further Assessment By A Specialist Is Recommended.
                       </Typography>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <Typography variant="label-micro" className="text-text-secondary">Referred To</Typography>
                         <div className="flex items-center gap-2">
                           <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">JR</div>
                           <Typography variant="body" className="font-medium text-primary">Dr. John Reyes</Typography>
                         </div>
                         <Typography variant="label-micro" className="text-slate-400 normal-case font-normal -mt-1 ml-10">Orthopedic Specialist</Typography>
                      </div>

                      <div className="space-y-2">
                         <Typography variant="label-micro" className="text-text-secondary">Referred By</Typography>
                         <div className="flex items-center gap-2">
                           <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">AC</div>
                           <Typography variant="body" className="font-medium">NP Anna Dela Cruz</Typography>
                         </div>
                      </div>
                    </div>
                   </div>
                 )}

                 {activeNoteTab === "Progress Note" && (
                   <div className="space-y-6">
                    <div className="space-y-2">
                       <Typography variant="label-micro" className="text-text-secondary">Session Observations</Typography>
                       <Typography variant="body" className="text-text-primary leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
                        Client appeared engaged but noted increased discomfort during prolonged sitting. Affect was congruent with reported pain levels.
                       </Typography>
                    </div>

                    <div className="space-y-2">
                       <Typography variant="label-micro" className="text-text-secondary">Clinical Findings</Typography>
                       <Typography variant="body" className="text-text-primary leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
                        Range of motion remains limited in lumbar extension. Muscle guarding noted in the right paraspinal region. No neurological deficits identified during this session.
                       </Typography>
                    </div>

                    <div className="space-y-2">
                       <Typography variant="label-micro" className="text-text-secondary">Intervention Provided</Typography>
                       <Typography variant="body" className="text-text-primary leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
                        Gentle stabilization exercises and education on ergonomic adjustments for work-from-home setup.
                       </Typography>
                    </div>
                   </div>
                 )}

                 {activeNoteTab === "Risk Assessment" && (
                   <div className="space-y-6">
                    <div className="flex items-center justify-between bg-slate-50 p-4 rounded-lg border border-slate-200">
                      <div>
                        <Typography variant="label-micro" className="text-text-secondary">Overall Risk Level</Typography>
                        <Typography variant="body" className="font-bold text-text-primary">Low / Stable</Typography>
                      </div>
                      <Badge variant="soft" className="bg-green-100 text-green-800 border-none px-4">Minimal Risk</Badge>
                    </div>

                    <div className="space-y-2">
                       <Typography variant="label-micro" className="text-text-secondary">Key Risk Indicators</Typography>
                       <Typography variant="body" className="text-text-primary leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
                        No expressed intent of self-harm or harm to others. Client maintains good social supports and is future-oriented regarding rehabilitation.
                       </Typography>
                    </div>

                    <div className="space-y-2">
                       <Typography variant="label-micro" className="text-text-secondary">Protective Factors</Typography>
                       <Typography variant="body" className="text-text-primary leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
                        Strong therapeutic alliance, consistent attendance, and adherence to prescribed home exercise program.
                       </Typography>
                    </div>
                   </div>
                 )}

                 {activeNoteTab === "Evidence" && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <Typography variant="h3" className="text-lg font-serif">Evidence & Aspects</Typography>
                        <Typography variant="body-sm" className="text-text-secondary italic">Grouped by diagnostic framework and tagged by evidence type</Typography>
                      </div>
                      <Badge variant="soft" className="bg-primary/10 text-primary border-none px-3">
                        {session.evidence?.length || 0} Snippets
                      </Badge>
                    </div>
                    
                    <div className="space-y-8">
                      {session.evidence ? (
                        Object.entries(
                          session.evidence.reduce((acc: any, curr: any) => {
                            if (!acc[curr.framework]) acc[curr.framework] = [];
                            acc[curr.framework].push(curr);
                            return acc;
                          }, {})
                        ).map(([framework, evidenceItems]: [string, any]) => (
                          <div key={framework} className="space-y-4">
                            <div className="flex items-center gap-3">
                              <div className="h-px flex-1 bg-divider" />
                              <Typography variant="label-micro" className="text-text-disabled uppercase font-bold tracking-widest px-2">
                                {framework}
                              </Typography>
                              <div className="h-px flex-1 bg-divider" />
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                              {evidenceItems.map((evidence: any) => (
                                <div key={evidence.id} className="p-5 bg-white border border-divider rounded-xl space-y-3 hover:border-primary/30 transition-all shadow-sm relative overflow-hidden group">
                                  <div className={cn(
                                    "absolute top-0 left-0 w-1 h-full",
                                    evidence.type === 'verbatim' ? "bg-info" : "bg-success-mid"
                                  )} />
                                  
                                  <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                      <StatusBadge 
                                        status={evidence.type === 'verbatim' ? 'processing' : 'completed'} 
                                        label={evidence.type} 
                                        showIcon={false}
                                        className={evidence.type === 'verbatim' ? "bg-blue-100 text-slate-900 border-0" : "bg-emerald-100 text-slate-900 border-0"}
                                      />
                                      <Typography variant="label-micro" className="text-text-disabled font-bold">{evidence.timestamp}</Typography>
                                    </div>
                                    <div className="flex gap-2">
                                      {evidence.tags?.map((tag: string) => (
                                        <Badge key={tag} variant="soft" className="text-[9px] px-1.5 py-0 bg-gray-100 text-text-secondary border-none uppercase">
                                          {tag}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                  
                                  <Typography variant="body" className={cn(
                                    "text-text-primary leading-relaxed",
                                    evidence.type === 'verbatim' ? "italic font-serif text-[17px]" : "font-sans text-[15px]"
                                  )}>
                                    {evidence.type === 'verbatim' ? `"${evidence.text}"` : evidence.text}
                                  </Typography>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-divider">
                          <Typography variant="body-sm" className="text-text-disabled uppercase font-bold">No evidence data found for this session</Typography>
                        </div>
                      )}
                    </div>
                  </div>
                 )}

               {/* Custom scrollbar indicator */}

               <div className="absolute top-2 bottom-2 right-1.5 w-1 bg-slate-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Note Footer buttons */}
            <div className="flex justify-end gap-3">
               <Button variant="outline" className="px-8 border-slate-200">Reset</Button>
               <Button variant="brand" className="px-8">Save</Button>
            </div>
          </div>
        </div>
      </div>
    </DetailViewLayout>
  );
}
