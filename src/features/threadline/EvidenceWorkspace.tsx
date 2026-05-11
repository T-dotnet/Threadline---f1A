/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import { 
  ArrowLeft, 
  RotateCcw, 
  AlertTriangle, 
  AlertCircle, 
  Edit3, 
  ExternalLink, 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  Info,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  FileText,
  BookOpen,
  Tag,
  Maximize2,
  Minimize2,
  ArrowRight,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// UI Components
import { 
  Button, 
  Badge, 
  Card, 
  Typography, 
  Input, 
  Modal 
} from "../../components/ui";
import { StatusBadge } from "../../components/shared/StatusBadge";
import { ConfidenceBadge, mapScoreToConfidence } from "../../components/shared/ConfidenceBadge";
import { SectionHeader } from "../../components/shared/SectionHeader";
import { WorkspaceContainer } from "../../components/layout/WorkspaceContainer";
import { WorkspaceLayout } from "../../components/layout/WorkspaceLayout";
import { cn } from "../../lib/utils";
import { ProgressBanner } from "./components/ProgressBanner";

// Context & Domain
import { useFeatureFlags } from "../../contexts/FeatureToggleContext";
import { useWorkspaceAlerts } from "../../contexts/WorkspaceAlertsContext";
import { MOCK_EVIDENCE_ITEMS, MOCK_CLIENT_DATA, MOCK_ASSESSMENTS } from "./mockData";
import { FEATURE_CONFIDENCE_THRESHOLD as CONFIDENCE_THRESHOLD } from "./constants";

// Sub-components
import { AssessmentGate } from "./AssessmentGate";
import { ReviewItem } from "./ReviewItem";
import { ModifyModal, SkipNextStepModal } from "./Modals";
import { ConflictResolutionModal } from "./modals/ConflictResolutionModal";
import { EntityCard } from "./components";

import { EvidenceWorkspaceCTAs } from "./EvidenceWorkspaceCTAs";

export function EvidenceWorkspace({ 
  onViewProfile, 
  onNavigateToAssessments,
  onNavigateToDocuments,
  onNavigateToSession,
  onUnlockReport,
  clientId = "125566"
}: { 
  onViewProfile?: () => void, 
  onNavigateToAssessments?: () => void,
  onNavigateToDocuments?: () => void,
  onNavigateToSession?: (session: any) => void,
  onUnlockReport?: () => void,
  clientId?: string
}) {
  const { flags } = useFeatureFlags();
  const { setAcceptedMappings, conflicts } = useWorkspaceAlerts();

  const clientData = (MOCK_CLIENT_DATA as any)[clientId];
  const sessions = clientData?.sessions || [];
  
  const [activeSessionId, setActiveSessionId] = useState<string | null>(sessions[0]?.id || null);
  const [activeItemLabel, setActiveItemLabel] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<'session' | 'criteria' | 'nextstep' | 'assessment' | 'document'>('session');
  
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isModifyOpen, setIsModifyOpen] = useState(false);
  const [isSkipOpen, setIsSkipOpen] = useState(false);
  const [isConflictModalOpen, setIsConflictModalOpen] = useState(false);
  const [hasSkippedConflicts, setHasSkippedConflicts] = useState(false);
  const [deferredItems, setDeferredItems] = useState<string[]>([]);
  const [acceptedItems, setAcceptedItems] = useState<string[]>([]);
  const [rejectedItems, setRejectedItems] = useState<Record<string, string>>({});

  const [activeAction, setActiveAction] = useState<'accept' | 'reject' | 'modify' | 'defer' | null>(null);
  const [rationale, setRationale] = useState("");
  const rationaleRef = useRef<HTMLTextAreaElement>(null);

  // Derived data
  const currentSession = sessions.find((s: any) => s.id === activeSessionId);
  const criteriaItems = MOCK_EVIDENCE_ITEMS.filter(i => i.type === 'criteria');
  const nextStepItems = MOCK_EVIDENCE_ITEMS.filter(i => i.type === 'nextstep');
  const assessmentItems = MOCK_EVIDENCE_ITEMS.filter(i => i.type === 'assessment');
  const documentItems = MOCK_EVIDENCE_ITEMS.filter(i => i.type === 'document');

  React.useEffect(() => {
    if (clientData?.allAccepted) {
      const allRequired = [
        ...sessions.map((s:any) => s.id),
        ...criteriaItems.map(i => i.label),
        ...assessmentItems.map(i => i.label),
        ...documentItems.map(i => i.label)
      ];
      setAcceptedItems(allRequired);
      
      // Also sync mappings for analysis
      const mappings = [
        ...criteriaItems.map(i => ({ id: i.label, label: i.label, confidence: parseFloat(i.score) || 0 })),
        ...assessmentItems.map(i => ({ id: i.label, label: i.label, confidence: parseFloat(i.score) || 0 })),
        ...documentItems.map(i => ({ id: i.label, label: i.label, confidence: parseFloat(i.score) || 0 }))
      ];
      setAcceptedMappings(mappings);
    } else {
      setAcceptedItems([]);
      setAcceptedMappings([]);
    }
  }, [clientId, clientData?.allAccepted, sessions.length, criteriaItems.length, assessmentItems.length, documentItems.length, setAcceptedMappings]);
  
  const currentList = activeType === 'session' ? [] : (
    activeType === 'criteria' ? criteriaItems : (
      activeType === 'assessment' ? assessmentItems : (
        activeType === 'document' ? documentItems : nextStepItems
      )
    )
  );

  const currentItem = activeType === 'session' ? null : currentList.find(i => i.label === activeItemLabel) || null;

  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);

  const requiredItems = [
    ...sessions.map((s:any) => s.id),
    ...criteriaItems.map(i => i.label),
    ...assessmentItems.map(i => i.label),
    ...documentItems.map(i => i.label)
  ];
  const totalRequiredItems = requiredItems.length;

  const currentRequiredProgress = requiredItems.filter(id => 
    acceptedItems.includes(id) || !!rejectedItems[id]
  ).length;

  const isAllRequiredReviewed = currentRequiredProgress === totalRequiredItems;

  const isCriteria = activeType === 'criteria';
  const isNextStep = activeType === 'nextstep';
  const isAssessment = activeType === 'assessment';
  const isDocument = activeType === 'document';
  const itemConfidence = currentItem ? parseFloat(currentItem.score) : 0;
  const activeId = activeType === 'session' ? activeSessionId : activeItemLabel;

  const requiresRationale = (action: 'accept' | 'reject' | 'modify' | 'defer') => {
    if (action === 'reject') return true;
    return false;
  };

  const handleActionClick = (action: 'accept' | 'reject' | 'modify' | 'defer') => {
    if (requiresRationale(action)) {
      setActiveAction(action);
      setRationale("");
      setTimeout(() => rationaleRef.current?.focus(), 50);
    } else {
      if (action === 'accept') handleAccept();
      if (action === 'modify') setIsModifyOpen(true);
      if (action === 'defer') handleDefer();
    }
  };

  const commitAction = () => {
    if (activeAction === 'accept') handleAccept();
    else if (activeAction === 'reject') {
        const id = activeType === 'session' ? activeSessionId : activeItemLabel;
        if (id) {
          setRejectedItems({ ...rejectedItems, [id]: rationale });
          autoAdvance();
        }
    } else if (activeAction === 'defer') handleDefer();
    
    setActiveAction(null);
    setRationale("");
  };

  const autoAdvance = () => {
    const id = activeType === 'session' ? activeSessionId : activeItemLabel;
    if (!id) return;

    setTimeout(() => {
      if (activeType === 'session') {
        const currentIndex = sessions.findIndex((s: any) => s.id === activeSessionId);
        const nextSession = sessions.slice(currentIndex + 1).find((s: any) => 
          !acceptedItems.includes(s.id) && 
          !rejectedItems[s.id] && 
          !deferredItems.includes(s.id)
        ) || sessions[currentIndex + 1] || null;
        
        if (nextSession) {
          setActiveSessionId(nextSession.id);
        } else {
          // Move to criteria if no more sessions
          if (criteriaItems.length > 0) {
            setActiveType('criteria');
            setActiveItemLabel(criteriaItems[0].label);
            setActiveSessionId(null);
          }
        }
      } else {
        const currentIndex = currentList.findIndex(i => i.label === activeItemLabel);
        
        const nextItem = currentList.slice(currentIndex + 1).find(i => 
          !acceptedItems.includes(i.label) && 
          !rejectedItems[i.label] && 
          !deferredItems.includes(i.label)
        ) || currentList[currentIndex + 1] || null;
        
        if (nextItem) {
          setActiveItemLabel(nextItem.label);
        } else if (activeType === 'criteria' && assessmentItems.length > 0) {
          setActiveType('assessment');
          setActiveItemLabel(assessmentItems[0].label);
        } else if (activeType === 'assessment' && documentItems.length > 0) {
          setActiveType('document');
          setActiveItemLabel(documentItems[0].label);
        } else if (activeType === 'document' && nextStepItems.length > 0) {
          setActiveType('nextstep');
          setActiveItemLabel(nextStepItems[0].label);
        }
      }
    }, 1500);
  };

  const handleDefer = () => {
    const id = activeType === 'session' ? activeSessionId : activeItemLabel;
    if (id && !deferredItems.includes(id)) {
        setDeferredItems([...deferredItems, id]);
        autoAdvance();
    }
  };

  const handleRestore = (label: string) => {
    setDeferredItems(deferredItems.filter(l => l !== label));
    if (activeType === 'session') setActiveSessionId(label);
    else setActiveItemLabel(label);
  };

  const handleUndoAccept = () => {
    const id = activeType === 'session' ? activeSessionId : activeItemLabel;
    if (!id) return;
    setAcceptedItems(prev => prev.filter(l => l !== id));
    if (activeType !== 'session') {
      setAcceptedMappings((prev: any[]) => prev.filter(m => m.id !== id));
    }
  };

  const handleUndoReject = () => {
    const id = activeType === 'session' ? activeSessionId : activeItemLabel;
    if (!id) return;
    setRejectedItems(prev => {
       const copy = { ...prev };
       delete copy[id];
       return copy;
    });
  };

  const handleAccept = () => {
    const id = activeType === 'session' ? activeSessionId : activeItemLabel;
    if (!id) return;
    
    if (!acceptedItems.includes(id)) {
      setAcceptedItems(prev => [...prev, id]);
    }
    
    if (activeType !== 'session' && activeItemLabel) {
      setAcceptedMappings((prev: any[]) => {
        if (prev.find(m => m.id === activeItemLabel)) return prev;
        return [...prev, { id: activeItemLabel, label: activeItemLabel, confidence: itemConfidence || 0 }];
      });
    }

    autoAdvance();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-gray-50/50">
      <div className="p-6 border-b border-divider flex items-center justify-between">
        {!isSidebarCollapsed && <Typography variant="h3">Review Queue</Typography>}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className={cn("h-8 w-8 text-text-secondary", isSidebarCollapsed && "mx-auto")}
          title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>
      
      {!isSidebarCollapsed && (
        <div className="flex-1 overflow-y-auto">
          {/* Evidence Category */}
          <ReviewCategory 
            title={`Evidence (${sessions.length + assessmentItems.length + documentItems.length})`}
            items={[
              ...sessions.map((s: any) => ({ label: s.focus || "Clinical Snapshot", score: "0.95", type: "session", id: s.id, hasConflict: s.hasConflict })),
              ...assessmentItems,
              ...documentItems
            ]}
            activeType={activeType}
            activeItemLabel={activeType === 'session' ? activeSessionId : activeItemLabel}
            deferredItems={deferredItems}
            acceptedItems={acceptedItems}
            rejectedItems={rejectedItems}
            onSelect={(id, type) => {
              if (type === 'session') {
                setActiveSessionId(id);
              } else {
                setActiveItemLabel(id);
                setActiveSessionId(null);
              }
              setActiveType(type);
            }}
          />

          {/* Criteria Category */}
          <ReviewCategory 
            title={`Diagnostic Criteria (${criteriaItems.length})`}
            items={criteriaItems}
            activeType={activeType}
            activeItemLabel={activeItemLabel}
            deferredItems={deferredItems}
            acceptedItems={acceptedItems}
            rejectedItems={rejectedItems}
            onSelect={(id, type) => {
              setActiveItemLabel(id);
              setActiveType('criteria');
              setActiveSessionId(null);
            }}
          />

          {/* Next Steps Category */}
          <ReviewCategory 
            title={`Follow-up & Next Steps (${nextStepItems.length})`}
            items={nextStepItems}
            activeType={activeType}
            activeItemLabel={activeItemLabel}
            deferredItems={deferredItems}
            acceptedItems={acceptedItems}
            rejectedItems={rejectedItems}
            onSelect={(id, type) => {
              setActiveItemLabel(id);
              setActiveType('nextstep');
              setActiveSessionId(null);
            }}
          />

          {/* Deferred Items Category */}
          {deferredItems.length > 0 && (
            <div>
              <div className="px-6 py-3 bg-orange-50 border-y border-orange-100">
                <Typography variant="label-micro" className="text-orange-700 uppercase font-bold">
                  Deferred Review ({deferredItems.length})
                </Typography>
              </div>
              {deferredItems.map(id => {
                // Try to find the item in sessions, criteria, assessments, documents or next steps
                const session = sessions.find((s: any) => s.id === id);
                const criteria = criteriaItems.find(i => i.label === id);
                const assessment = assessmentItems.find(i => i.label === id);
                const document = documentItems.find(i => i.label === id);
                const nextStep = nextStepItems.find(i => i.label === id);
                
                if (session) {
                  return (
                    <ReviewItem 
                      key={id}
                      label={session.focus || "Clinical"} 
                      score="0.95" 
                      type="session"
                      active={activeType === 'session' && activeSessionId === id} 
                      deferred={true} 
                      noStrike={true}
                      accepted={acceptedItems.includes(id)}
                      rejected={!!rejectedItems[id]}
                      onClick={() => {
                        setActiveSessionId(id);
                        setActiveType('session');
                        setActiveItemLabel(null);
                      }} 
                    />
                  );
                }
                
                const item = criteria || assessment || document || nextStep;
                if (item) {
                  return (
                    <ReviewItem 
                      key={id}
                      label={item.label} 
                      score={item.score} 
                      type={item.type}
                      active={(activeType === 'criteria' || activeType === 'assessment' || activeType === 'document' || activeType === 'nextstep') && activeItemLabel === id} 
                      deferred={true} 
                      noStrike={true}
                      accepted={acceptedItems.includes(id)}
                      rejected={!!rejectedItems[id]}
                      onClick={() => {
                        setActiveItemLabel(item.label);
                        setActiveType(item.type as any);
                        setActiveSessionId(null);
                      }} 
                    />
                  );
                }
                return null;
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );

  const mainContent = (
    <div className="flex flex-col h-full bg-workspace-bg overflow-hidden relative">
      <ModifyModal isOpen={isModifyOpen} onClose={() => setIsModifyOpen(false)} item={currentItem} />
      <SkipNextStepModal isOpen={isSkipOpen} onClose={() => setIsSkipOpen(false)} item={currentItem} onConfirm={handleAccept} />

      {/* Detail Head */}
      <div className="px-8 py-5 border-b border-divider bg-white flex justify-between items-center shrink-0">
        <div className="flex items-center gap-8">
            <Step label="Sessions" num={1} active={activeType === 'session'} />
            <div className="w-10 h-px bg-divider" />
            <Step label="Findings Review" num={2} active={activeType === 'criteria' || activeType === 'assessment' || activeType === 'document'} />
            <div className="w-10 h-px bg-divider" />
            <Step label="Clinical Plan" num={3} active={activeType === 'nextstep'} />
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-gray-50/30">
        <AnimatePresence mode="wait">
            <motion.div
                key={activeSessionId || activeItemLabel}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
            >
                {activeType === 'session' ? (
                  <div className="space-y-8">
                    <div className="flex justify-between items-end border-b border-divider pb-6">
                      <div className="space-y-1">
                        <Typography variant="label-micro" className="text-text-disabled uppercase tracking-[0.2em] font-bold">Clinical Session Profile</Typography>
                        <Typography variant="h3" className="font-serif text-2xl">{currentSession?.focus || "Anxiety Management"}</Typography>
                        <div className="flex items-center gap-3 mt-1">
                          <Typography variant="body-sm" className="text-text-secondary font-medium">
                            <span className="lowercase">{currentSession?.id}</span> • {currentSession?.date}
                          </Typography>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant="success" className="h-7 gap-2 px-3 bg-white border-success/20 text-success-dark">
                            <div className="w-2 h-2 rounded-full bg-success shrink-0" />
                            <span className="font-semibold tracking-tight">High Relevance</span>
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {currentSession?.evidence?.length ? (
                        currentSession.evidence.map((snippet: any) => (
                          <EntityCard 
                            key={snippet.id} 
                            title={snippet.type === 'verbatim' ? `"${snippet.text}"` : snippet.text}
                            statusBadge={
                              <StatusBadge 
                                status={snippet.type === 'verbatim' ? 'processing' : 'completed'} 
                                label={snippet.type} 
                                showIcon={false}
                                className={snippet.type === 'verbatim' ? "bg-blue-100 text-slate-900 border-0" : "bg-emerald-100 text-slate-900 border-0"}
                              />
                            }
                            metadata={[
                              { 
                                label: "Timestamp", 
                                value: <MetadataValue icon={Clock} text={snippet.timestamp} /> 
                              },
                              { 
                                label: "Tags", 
                                value: <MetadataValue icon={Tag} text={snippet.tags?.join(", ") || ""} /> 
                              },
                              { 
                                label: "Framework", 
                                value: <MetadataValue icon={BookOpen} text={snippet.framework} /> 
                              }
                            ]}
                            rightAction={
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-[#06302c] border-[#06302c] hover:bg-[#06302c]/5 whitespace-nowrap h-8"
                                onClick={() => onNavigateToSession && currentSession ? onNavigateToSession(currentSession) : undefined}
                              >
                                <ExternalLink size={12} className="mr-1.5" /> Jump to Spot
                              </Button>
                            }
                            summary={null}
                          />
                        ))
                      ) : (
                        <div className="py-20 text-center bg-white border border-dashed border-divider rounded-2xl">
                          <Typography variant="body" className="text-text-disabled italic">No snippets found for this session</Typography>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-end border-b border-divider pb-6">
                        <div className="space-y-1">
                            <Typography variant="label-micro" className="text-text-disabled uppercase tracking-[0.2em] font-bold">
                                {isCriteria ? "Criterion Name" : (isAssessment ? "Assessment Type" : (isDocument ? "Document Type" : `${currentItem?.type} type`))}
                            </Typography>
                            <Typography variant="h3" className="font-serif text-2xl">{activeItemLabel}</Typography>
                            <div className="flex items-center gap-3 mt-1">
                                <Typography variant="body-sm" className="text-text-secondary font-medium">
                                    <span className="lowercase">idx-29491</span> • Apr 21, 2024
                                </Typography>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            {isCriteria || isAssessment || isDocument ? (
                               <Badge variant="success" className="h-7 gap-2 px-3 bg-white border-success/20 text-success-dark">
                                   <div className="w-2 h-2 rounded-full bg-success shrink-0" />
                                   <span className="font-semibold tracking-tight">
                                     {isCriteria ? "High Certainty" : "High Relevance"}
                                   </span>
                               </Badge>
                            ) : (
                               <ConfidenceBadge 
                                    confidence={mapScoreToConfidence(itemConfidence)} 
                                    className="h-auto py-0.5"
                               />
                            )}
                        </div>
                    </div>

                    {currentItem?.hasConflict && (
                       <div className="p-4 bg-[#fef2f2] border border-[#fecaca] rounded-lg flex items-start gap-3">
                           <AlertTriangle size={20} className="shrink-0 text-[#ef4444] mt-0.5" />
                           <div className="space-y-1">
                               <Typography variant="body" className="font-semibold text-[#991b1b]">Unresolved Conflict</Typography>
                               <Typography variant="body-sm" className="text-[#991b1b]/90">
                                   This finding conflicts with other recorded evidence. Please review carefully before accepting.
                               </Typography>
                           </div>
                       </div>
                    )}

                    {isAssessment ? (() => {
                        const assessmentDetail = MOCK_ASSESSMENTS.find(a => activeItemLabel?.includes(a.title.split(' ')[0])) || MOCK_ASSESSMENTS[0];
                        return (
                            <EntityCard
                                title={assessmentDetail.title}
                                summary={assessmentDetail.description}
                                hoverable={false}
                                metadata={[
                                    ...(assessmentDetail.score ? [{
                                        label: "Score / Result",
                                        value: `${assessmentDetail.score}${assessmentDetail.descriptor ? ` - ${assessmentDetail.descriptor}` : ''}`
                                    }] : []),
                                    ...(assessmentDetail.overallImpression ? [{
                                        label: "Overall Impression",
                                        value: assessmentDetail.overallImpression
                                    }] : []),
                                    ...(assessmentDetail.percentile ? [{
                                        label: "Percentile",
                                        value: assessmentDetail.percentile
                                    }] : [])
                                ]}
                            />
                        );
                    })() : (
                    <Card className="p-8 space-y-8 bg-white">
                        {isNextStep ? (
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <Typography variant="label-micro">Suggested clinical focus</Typography>
                                    <div className="p-4 bg-gray-50 rounded-xl border border-divider text-lg italic text-text-primary">
                                        "{currentItem?.label}"
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <Typography variant="label-micro">Expected impact</Typography>
                                        <Badge variant="brand" className="px-4 py-1">{ (currentItem as any)?.impact || "High information gain" }</Badge>
                                    </div>
                                    <div className="space-y-2">
                                        <Typography variant="label-micro">Rationale</Typography>
                                        <Typography variant="body-sm" className="text-text-secondary">Resolves ambiguity for this specific topic.</Typography>
                                    </div>
                                </div>
                            </div>
                        ) : isCriteria ? (
                            <div className="space-y-10">
                                <div className="space-y-4">
                                    <Typography variant="label-micro" className="text-text-disabled uppercase font-medium">Suggested Status</Typography>
                                    <Badge variant="success" className="bg-success-light/30 text-success-dark border-none px-4 py-1 h-auto text-sm font-bold">
                                        Supported
                                    </Badge>
                                </div>

                                <div className="space-y-4">
                                    <Typography variant="label-micro" className="text-text-disabled uppercase font-medium">Supporting Evidence</Typography>
                                    <div className="grid grid-cols-1 gap-4">
                                        {(activeItemLabel === "Depressed mood" ? [
                                            { type: 'verbatim', text: "I feel low most days.", timestamp: "08:12", framework: "DSM-5", tags: ["Mood"] },
                                            { type: 'observation', text: "PHQ-9 score = 14", timestamp: "Context", framework: "Assessment", tags: ["Clinical"] }
                                        ] : [
                                            { type: 'observation', text: "Mapping based on consistent clinical presentations", timestamp: "Context", framework: "Clinical Reasoning", tags: ["Inference"] },
                                            { type: 'verbatim', text: "Patient report confirms symptom frequency", timestamp: "12:45", framework: "Patient Report", tags: ["Frequency"] }
                                        ]).map((evidence, idx) => (
                                            <EntityCard 
                                                key={idx} 
                                                title={evidence.type === 'verbatim' ? `"${evidence.text}"` : evidence.text}
                                                statusBadge={
                                                  <StatusBadge 
                                                    status={evidence.type === 'verbatim' ? 'processing' : 'completed'} 
                                                    label={evidence.type} 
                                                    showIcon={false}
                                                    className={evidence.type === 'verbatim' ? "bg-blue-100 text-slate-900 border-0" : "bg-emerald-100 text-slate-900 border-0"}
                                                  />
                                                }
                                                metadata={[
                                                  { 
                                                    label: "Source", 
                                                    value: <MetadataValue icon={Clock} text={evidence.timestamp} /> 
                                                  },
                                                  { 
                                                    label: "Tags", 
                                                    value: <MetadataValue icon={Tag} text={evidence.tags?.join(", ") || ""} /> 
                                                  },
                                                  { 
                                                    label: "Framework", 
                                                    value: <MetadataValue icon={BookOpen} text={evidence.framework} /> 
                                                  }
                                                ]}
                                                summary={null}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </Card>
                    )}
                  </>
                )}

                {/* Inline Rationale Flow */}
                <AnimatePresence>
                    {activeAction && activeAction !== 'reject' && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-primary/5 border-2 border-primary/20 p-8 rounded-2xl space-y-6"
                        >
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "p-2 rounded-full",
                                    activeAction === 'accept' ? 'bg-success/20 text-success' : 'bg-error/20 text-error'
                                )}>
                                    {activeAction === 'accept' ? <ThumbsUp size={20} /> : <ThumbsDown size={20} />}
                                </div>
                                <Typography variant="h3">Reason for {activeAction.charAt(0).toUpperCase() + activeAction.slice(1)}</Typography>
                            </div>
                            
                            <div className="space-y-4">
                                <textarea 
                                    ref={rationaleRef}
                                    value={rationale}
                                    onChange={(e) => setRationale(e.target.value)}
                                    placeholder="Provide justification for this mapping decision..."
                                    className="w-full bg-white border border-divider rounded-xl p-4 min-h-[120px] focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                                <div className="flex justify-end gap-3">
                                    <Button variant="ghost" onClick={() => setActiveAction(null)}>Cancel</Button>
                                    <Button variant="brand" onClick={commitAction} disabled={!rationale.trim()}>
                                        Commit {activeAction}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Actions */}
      <div className="p-8 border-t border-divider bg-gray-50/50 flex flex-col gap-6 shrink-0 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)]">
        <div className="w-full flex flex-wrap gap-4">
          {(!activeItemLabel && !activeSessionId) ? (
            <div className="w-full p-4 text-center bg-gray-100/50 rounded-xl border border-divider">
               <Typography variant="body-sm" className="text-text-disabled font-bold italic">Select an item from the review queue to begin assessment</Typography>
            </div>
          ) : (activeId && acceptedItems.includes(activeId)) ? (
              <div className="w-full bg-success-light/30 border border-success/10 p-4 rounded-xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                      <CheckCircle2 className="text-success" size={20} />
                      <Typography variant="body-sm" className="text-success-dark font-bold">
                          {activeType === 'session' ? 'Session accepted successfully.' : 'Mapping accepted successfully.'}
                      </Typography>
                  </div>
                  <Button variant="ghost" size="xs" onClick={handleUndoAccept} className="text-success-dark hover:bg-success/10 border border-success/20">Undo Accept</Button>
              </div>
          ) : (activeId && rejectedItems[activeId]) ? (
              <div className="w-full bg-error-light/30 border border-error/10 p-4 rounded-xl flex items-start justify-between gap-3">
                  <div className="space-y-2">
                      <div className="flex items-center gap-3">
                          <XCircle className="text-error" size={20} />
                          <Typography variant="body-sm" className="text-error-dark font-bold">{activeType === 'session' ? 'Session rejected' : 'Evidence rejected'}</Typography>
                      </div>
                      <Typography variant="body-sm" className="text-error-dark/80 pl-8">Reason: {rejectedItems[activeId]}</Typography>
                  </div>
                  <Button variant="ghost" size="xs" onClick={handleUndoReject} className="text-error-dark hover:bg-error/10 border border-error/20">Undo Reject</Button>
              </div>
          ) : (activeId && deferredItems.includes(activeId)) ? (
              <div className="w-full bg-orange-50 border border-orange-500/10 p-4 rounded-xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                      <Clock className="text-orange-600" size={20} />
                      <Typography variant="body-sm" className="text-orange-700 font-bold">{activeType === 'session' ? 'Session deferred' : 'Evidence deferred'}</Typography>
                  </div>
                  <Button variant="ghost" size="xs" onClick={() => handleRestore(activeId)} className="text-orange-700 hover:bg-orange-100 border border-orange-200">Undo Defer</Button>
              </div>
          ) : activeAction === 'reject' ? (
              <div className="w-full flex justify-between items-center gap-4">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {(activeType === 'session' ? [
                          "Insufficient data",
                          "Unreliable transcript",
                          "Duplicate session"
                      ] : [
                          "Wrong criterion",
                          "Not diagnostic evidence",
                          "Too weak"
                      ]).map(reason => (
                          <Button
                              key={reason}
                              variant="outline"
                              onClick={() => {
                                  if (activeId) {
                                      setRejectedItems({ ...rejectedItems, [activeId]: reason });
                                      autoAdvance();
                                      setActiveAction(null);
                                  }
                              }}
                              className="py-6 whitespace-normal h-auto text-center font-bold border-error/30 text-error-dark hover:bg-error-light/10 hover:border-error w-full shadow-sm"
                          >
                              {reason}
                          </Button>
                      ))}
                  </div>
                  <Button 
                      variant="ghost" 
                      className="flex-shrink-0 h-full py-6 text-text-secondary hover:bg-gray-100/50 hover:text-text-primary px-6 border border-transparent font-bold"
                      onClick={() => setActiveAction(null)}
                  >
                      <XCircle size={20} className="mr-2 text-error/60" /> Cancel
                  </Button>
              </div>
          ) : (
              <EvidenceWorkspaceCTAs 
                  type={activeType}
                  disabled={activeAction !== null}
                  onAccept={() => handleActionClick('accept')}
                  onReject={() => handleActionClick('reject')}
                  onModify={() => handleActionClick('modify')}
                  onDefer={() => handleActionClick('defer')}
                  onSkip={() => setIsSkipOpen(true)}
              />
          )}
        </div>
      </div>
    </div>
  );

  const workspaceContainer = (
    <WorkspaceContainer
      sidebarWidth={isSidebarCollapsed ? 64 : 320}
      sidebarContent={sidebarContent}
      mainContent={mainContent}
      height={isFullScreen ? "100%" : "800px"}
    />
  );

  const progressBanner = (
    <ProgressBanner
      title="Evidence Review"
      subtitle="Review all extracted evidence to unlock the report analysis"
      current={currentRequiredProgress}
      total={totalRequiredItems}
      progressLabel="Items Reviewed"
      actionLabel="See analysis"
      actionIcon={ArrowRight}
      onAction={() => {
        if (flags.FEATURE_CONFLICT_RESOLUTION_GATE && conflicts.length > 0 && !hasSkippedConflicts) {
          setIsConflictModalOpen(true);
        } else {
          setIsAnalysisModalOpen(true);
        }
      }}
      isActionActive={isAllRequiredReviewed}
      className="mb-6 mx-0"
    />
  );

  const analysisModal = (
    <Modal
      isOpen={isAnalysisModalOpen}
      onClose={() => setIsAnalysisModalOpen(false)}
      title="Clinical Analysis"
      width={720}
    >
      <div className="space-y-6">
        <Typography variant="body" className="text-text-secondary">
          Review the generated analysis before unlocking the final report.
        </Typography>

        <div className="max-h-[50vh] overflow-y-auto pr-2">
          <Card className="divide-y divide-divider p-0 overflow-hidden border-none shadow-none">
              {[
                  { id: 1, title: "Initial Evidence Summary", sub: "Core observations from sessions and collateral", items: ["Assessment Data", "Session Insights", "Document Collateral"] },
                  { id: 2, title: "Symptom Patterns", sub: "Whole Mind Snapshot & Observed Themes", items: ["Symptom Clusters", "Functional Impact"] },
                  { id: 3, title: "Working Impression", sub: "Provisional status based on combined signals", items: ["Working Impression (Likely Social Anxiety)", "Differential Considerations"] },
                  { id: 4, title: "Clarity Roadmap", sub: "Next steps to resolve uncertainty", items: ["Suggested Diagnostic Actions", "Information Gaps"] },
              ].map(step => (
                  <div key={step.id} className="p-4 sm:p-6 flex gap-4 sm:gap-6 hover:bg-gray-50/50 transition-colors">
                      <div className="w-8 h-8 rounded-full border-2 border-divider flex items-center justify-center font-bold text-text-disabled shrink-0 bg-white">
                          {step.id}
                      </div>
                      <div className="flex-1 space-y-4">
                          <div className="space-y-1">
                              <Typography variant="h3">{step.title}</Typography>
                              <Typography variant="body-sm" className="text-text-secondary">{step.sub}</Typography>
                          </div>
                          <div className="flex flex-col gap-2">
                              {step.items.map(item => (
                                  <div key={item} className="flex items-center justify-between p-3 bg-white border border-divider rounded-lg shadow-sm group cursor-pointer hover:border-primary/30 transition-all">
                                      <Typography variant="body" className="font-medium text-sm text-text-primary leading-tight">{item}</Typography>
                                      <ChevronDown size={14} className="text-text-disabled group-hover:text-primary transition-colors" />
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
              ))}
          </Card>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-divider">
          <Button variant="secondary" onClick={() => setIsAnalysisModalOpen(false)}>
             Back to Evidence
          </Button>
          <Button variant="brand" onClick={() => {
             setIsAnalysisModalOpen(false);
             if (onUnlockReport) onUnlockReport();
          }}>
             Accept & Unlock Report
          </Button>
        </div>
      </div>
    </Modal>
  );

  if (isFullScreen) {
    return (
      <AssessmentGate onNavigateToAssessments={onNavigateToAssessments || (() => {})}>
        <div className="fixed inset-0 z-50 bg-workspace-bg flex flex-col items-center">
           <div className="w-full bg-white border-b border-divider shrink-0 flex justify-center">
              <div className="w-full max-w-[1400px] flex justify-between items-center p-4">
                <Typography variant="h3">Evidence Workspace</Typography>
                <Button variant="ghost" onClick={() => setIsFullScreen(false)}>
                   <Minimize2 size={18} className="mr-2" /> Exit Focus Mode
                </Button>
              </div>
           </div>
           <div className="flex-1 w-full flex flex-col max-w-[1400px] px-4 md:px-8 py-6 overflow-hidden">
              {progressBanner}
              {workspaceContainer}
           </div>
        </div>
        {analysisModal}
      </AssessmentGate>
    );
  }

  return (
    <AssessmentGate onNavigateToAssessments={onNavigateToAssessments || (() => {})}>
      <WorkspaceLayout
        title="Evidence Workspace"
        subtitle="Review extracted evidence, assess diagnostic criteria, and identify next steps"
        headerActions={
          <Button variant="secondary" onClick={() => setIsFullScreen(true)}>
             <Maximize2 size={18} className="mr-2" /> Focus Mode
          </Button>
        }
        subHeaderContent={progressBanner}
        sidebarWidth={isSidebarCollapsed ? 64 : 320}
        sidebarContent={sidebarContent}
        mainContent={mainContent}
        height="800px"
      />
      {analysisModal}
      <ConflictResolutionModal 
        isOpen={isConflictModalOpen} 
        conflicts={conflicts} 
        onResolve={() => setIsConflictModalOpen(false)}
        onSkip={() => {
          setHasSkippedConflicts(true);
          setIsConflictModalOpen(false);
          setIsAnalysisModalOpen(true);
        }}
      />
    </AssessmentGate>
  );
}

function MetadataValue({ icon: Icon, text }: { icon: React.ElementType, text: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon size={12} className="text-slate-400" />
      <span className="text-[#06302c] font-normal">{text}</span>
    </div>
  );
}

function Step({ label, num, active }: { label: string, num: number, active: boolean }) {
    return (
        <div className="flex items-center gap-3">
            <div className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-colors shadow-sm",
                active ? "bg-primary text-white scale-110" : "bg-gray-100 text-text-disabled"
            )}>
                {num}
            </div>
            <Typography variant="body-sm" className={cn("font-bold", active ? "text-primary" : "text-text-disabled")}>
                {label}
            </Typography>
        </div>
    );
}

interface ReviewCategoryProps {
  title: string;
  items: any[];
  activeType: string;
  activeItemLabel: string | null;
  deferredItems: string[];
  acceptedItems: string[];
  rejectedItems: Record<string, string>;
  onSelect: (id: string, type: string) => void;
}

function ReviewCategory({
  title,
  items,
  activeType,
  activeItemLabel,
  deferredItems,
  acceptedItems,
  rejectedItems,
  onSelect
}: ReviewCategoryProps) {
  if (items.length === 0) return null;
  return (
    <div>
      <div className="px-6 py-3 bg-gray-100/50 border-y border-divider">
        <Typography variant="label-micro" className="text-text-disabled uppercase">
          {title}
        </Typography>
      </div>
      {items.map((item) => {
        const id = item.id || item.label;
        const isActive = activeType === item.type && activeItemLabel === id;
          
        return (
          <ReviewItem 
            key={id}
            label={item.label} 
            score={item.score} 
            type={item.type}
            active={isActive} 
            deferred={deferredItems.includes(id)} 
            accepted={acceptedItems.includes(id)}
            rejected={!!rejectedItems[id]}
            hasConflict={item.hasConflict}
            onClick={() => onSelect(id, item.type)} 
          />
        );
      })}
    </div>
  );
}

