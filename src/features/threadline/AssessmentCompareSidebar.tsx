import React, { useState } from "react";
import { History, ChevronRight, ChevronLeft, Calendar, User, Info } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useFeatureFlags } from "../../contexts/FeatureToggleContext";
import { MOCK_ASSESSMENTS } from "./mockData";
import { Typography, Badge } from "../../components/ui";

// SCOPE NOTE: If longitudinal comparison is out of scope, remove this component and document the limitation in the IFU

export function AssessmentCompareSidebar() {
  const { flags, activeAssessmentId } = useFeatureFlags();
  const [isOpen, setIsOpen] = useState(false);

  if (!flags.FEATURE_PRIOR_ASSESSMENT_COMPARE || !activeAssessmentId) return null;

  // For demo, we consider all assessments except the active one as "prior"
  const priorAssessments = MOCK_ASSESSMENTS.filter((_, idx) => String(idx) !== activeAssessmentId);

  if (priorAssessments.length === 0) return null;

  return (
    <div className="fixed right-0 top-16 bottom-0 z-[100] flex pointer-events-none">
      {/* Toggle Button */}
      <div className="flex flex-col justify-start pt-[120px] h-full">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-green-700 text-white border-none rounded-l-lg py-4 px-2 cursor-pointer shadow-[-2px_0_8px_rgba(0,0,0,0.1)] pointer-events-auto flex flex-col items-center gap-3 transition-all"
        >
          {isOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          <div className="writing-vertical text-xs font-semibold text-white uppercase tracking-widest whitespace-nowrap" style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}>
            Prior Assessments
          </div>
          <History size={18} color="white" />
        </button>
      </div>

      {/* Sidebar Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-[360px] bg-white border-l border-divider shadow-[-4px_0_16px_rgba(0,0,0,0.05)] flex flex-col pointer-events-auto"
          >
            <div className="px-6 py-5 border-b border-divider flex items-center gap-3">
              <History size={20} className="text-green-700" />
              <Typography variant="h3" className="m-0 text-text-primary">Assessment History</Typography>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              <div className="flex flex-col gap-5">
                {priorAssessments.map((assessment, i) => (
                  <div key={i} className="relative p-4 rounded-xl border border-divider bg-white transition-transform duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-text-secondary uppercase">
                        <Calendar size={13} />
                        {assessment.subtitle.split(' • ')[0]}
                      </div>
                      <Badge variant={assessment.status.toLowerCase() === 'completed' ? 'success' : 'soft'}>
                        {assessment.status.toLowerCase() === 'completed' ? 'Formulated' : 'Deferred'}
                      </Badge>
                    </div>
                    
                    <div className="text-sm font-semibold text-green-700 mb-2">
                      {assessment.title}
                    </div>

                    <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-text-secondary uppercase mb-3">
                      <User size={13} />
                      Assessed by: {assessment.subtitle.split(' • ')[1]}
                    </div>

                    <div className="pt-3 border-t border-dashed border-divider flex items-start gap-2 mt-1">
                      <Info size={14} className="text-text-secondary mt-0.5" />
                      <div className="text-[13px] text-text-primary leading-relaxed italic">
                        Conclusion: Symptoms aligned with {assessment.title} guidelines. Recommended follow-up in 3 months.
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 border-t border-divider bg-slate-50">
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-text-secondary uppercase">
                <Info size={14} />
                <span>Quick-access archive for longitudinal support</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
