import React from "react";
import { useSearchParams } from "react-router-dom";
import { BRAND, TEXT_PRIMARY, TEXT_SECONDARY, TYPE_SCALE } from "./constants";
import { Modal } from "../../components/ui/Modal";
import { X, ChevronDown } from "lucide-react";

export function GlobalModals() {
  const [searchParams, setSearchParams] = useSearchParams();
  const modalType = searchParams.get("modal");
  
  const closeModal = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("modal");
    newParams.delete("itemId");
    setSearchParams(newParams);
  };

  if (!modalType) return null;

  const mockItem = { 
    type: 'evidence', 
    label: 'Behavioural pattern', 
    impact: 'Moderate' 
  };

  return (
    <>
      <ModifyModal isOpen={modalType === "modify"} onClose={closeModal} item={mockItem} />
      <SkipNextStepModal isOpen={modalType === "skip"} onClose={closeModal} item={mockItem} onConfirm={() => console.log("Confirmed skip")} />
      <CognitiveLoopModal isOpen={modalType === "cognitive_loop"} onClose={closeModal} />
    </>
  );
}

export function ModifyModal({ isOpen, onClose, item }: { isOpen: boolean, onClose: () => void, item: any }) {
  if (!item) return null;
  const isCriteria = item.type === 'criteria';
  const isNextStep = item.type === 'nextstep';
  const isEvidence = !isCriteria && !isNextStep;

  const title = isNextStep ? "Modify Next Step" : isCriteria ? "Modify Criteria" : "Modify Evidence";

  const footer = (
    <>
      <button 
        onClick={onClose} 
        className="px-6 py-2.5 text-[#06302c] font-semibold hover:bg-gray-100 rounded-md transition-colors"
      >
        {isEvidence ? "Discard" : "Cancel"}
      </button>
      <button 
        onClick={onClose}
        className="px-6 py-2.5 bg-[#06302c] text-white font-semibold rounded-md shadow-md hover:opacity-90 transition-all"
      >
        {isEvidence ? "Save Correction" : "Save Changes"}
      </button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} footer={footer} width={520}>
      <div className="flex flex-col gap-8">
        {isEvidence ? (
          <>
            <div className="relative w-full">
              <div className="border border-gray-300 rounded px-3 flex items-center relative">
                <select 
                  defaultValue={item.label}
                  className="w-full border-none bg-transparent py-4 text-base text-gray-900 appearance-none outline-none cursor-pointer z-10"
                >
                  <option value={item.label}>{item.label}</option>
                  <option value="Behavioural pattern">Behavioural pattern</option>
                  <option value="Mood Symptom">Mood Symptom</option>
                  <option value="Assessment Result">Assessment Result</option>
                  <option value="Other">Other</option>
                </select>
                <ChevronDown size={18} className="absolute right-3 text-gray-500 pointer-events-none" />
              </div>
              <div className="absolute -top-2 left-3 bg-white px-1 z-20">
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Evidence Type</p>
              </div>
            </div>
            
            <div className="relative w-full">
              <div className="border border-gray-300 rounded p-3">
                <textarea 
                  defaultValue="I mostly just go to work and come home."
                  className="w-full border-none outline-none text-base text-gray-900 resize-none min-h-[48px] bg-transparent"
                />
              </div>
              <div className="absolute -top-2 left-3 bg-white px-1 z-20">
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Evidence text</p>
              </div>
            </div>
          </>
        ) : (
          <div className="relative w-full">
            <div className="border border-gray-300 rounded p-4 bg-gray-100 text-base text-gray-500">
              {item.label}
            </div>
            <div className="absolute -top-2 left-3 bg-white px-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                {isNextStep ? "Next step name:" : "Criterion Name:"}
              </p>
            </div>
          </div>
        )}

        <div>
          <div className="text-lg font-medium text-[#06302c] mb-4">
            {isEvidence ? "This evidence will be mapped to :" : isNextStep ? "Target level :" : "Suggested Status :"}
          </div>

          <div className="relative w-full">
            <div className="border border-gray-300 rounded px-4 py-3 flex justify-between items-center min-h-[56px]">
              <div className="flex flex-wrap gap-2">
                {isEvidence ? (
                  ["Reduced activity", "Social withdrawal"].map(tag => (
                    <div key={tag} className="bg-sky-50 text-sky-600 px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 border border-sky-100">
                      {tag}
                      <button className="w-4 h-4 rounded-full bg-sky-500 flex items-center justify-center text-white text-[10px]">✕</button>
                    </div>
                  ))
                ) : isNextStep ? (
                   <div className="bg-sky-50 text-sky-600 px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 border border-sky-100">
                     {item.impact}
                     <button className="w-4 h-4 rounded-full bg-sky-500 flex items-center justify-center text-white text-[10px]">✕</button>
                   </div>
                ) : (
                   <div className="bg-red-50 text-red-500 px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 border border-red-100">
                     Not Supported
                     <button className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-white text-[10px]">✕</button>
                   </div>
                )}
              </div>
              <div className="flex items-center gap-3 text-gray-400 shrink-0">
                 <button className="hover:text-gray-600 transition-colors">
                   {isEvidence ? (
                     <X size={18} strokeWidth={2.5} />
                   ) : (
                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                       <path d="M3 12h14M13 8l4 4-4 4"/><path d="M21 12h-4"/><path d="M10 8L6 12l4 4"/>
                     </svg>
                   )}
                 </button>
                 {!isEvidence && <div className="h-6 w-px bg-gray-200" />}
                 <button className="hover:text-gray-600 transition-colors">
                   <ChevronDown size={20} strokeWidth={2.5} />
                 </button>
              </div>
            </div>
            <div className="absolute -top-2 left-3 bg-white px-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                {isEvidence ? "Correct mapping" : isNextStep ? "Impact setting" : "Correct mapping"}
              </p>
            </div>
          </div>
        </div>

        <div className="relative w-full">
          <div className="border border-gray-300 rounded p-3">
            <textarea 
              placeholder="Type here..."
              defaultValue={!isEvidence && !isNextStep ? "No clear evidence in current transcript snippet" : ""}
              className="w-full border-none outline-none text-base text-gray-900 resize-none min-h-[120px] bg-transparent"
            />
          </div>
          <div className="absolute -top-2 left-3 bg-white px-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
              {isEvidence ? "Why does this map differently?" : isNextStep ? "Rationale/Additional notes" : "Reason Evidence"}
            </p>
          </div>
          {isEvidence && (
            <div className="mt-2 text-[11px] font-bold uppercase tracking-wider text-gray-500">
              Reason (optional)
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

export function SkipNextStepModal({ isOpen, onClose, item, onConfirm }: { isOpen: boolean, onClose: () => void, item: any, onConfirm: () => void }) {
  if (!item) return null;
  const footer = (
    <>
      <button 
        onClick={onClose} 
        className="px-6 py-2.5 text-[#06302c] font-semibold hover:bg-gray-100 rounded-md transition-colors"
      >
        Cancel
      </button>
      <button 
        onClick={() => {
          onConfirm();
          onClose();
        }}
        className="px-6 py-2.5 bg-[#06302c] text-white font-semibold rounded-md shadow-md hover:opacity-90 transition-all"
      >
        Skip Step
      </button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Skip Next Step" footer={footer} width={520}>
      <div className="flex flex-col gap-8">
        <div className="relative w-full">
          <div className="border border-gray-300 rounded p-4 bg-gray-100 text-base text-gray-500">
            {item?.label}
          </div>
          <div className="absolute -top-2 left-3 bg-white px-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Next step name:</p>
          </div>
        </div>

        <div>
          <div className="text-lg font-medium text-[#06302c] mb-4">Target level :</div>
          <div className="relative w-full">
            <div className="border border-gray-300 rounded px-4 py-3 flex justify-between items-center min-h-[56px]">
              <div className="flex flex-wrap gap-2">
                <div className="bg-sky-50 text-sky-600 px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 border border-sky-100">
                  {item?.impact}
                  <button className="w-4 h-4 rounded-full bg-sky-500 flex items-center justify-center text-white text-[10px]">✕</button>
                </div>
              </div>
            </div>
            <div className="absolute -top-2 left-3 bg-white px-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Impact setting</p>
            </div>
          </div>
        </div>

        <div className="relative w-full">
          <div className="border border-gray-300 rounded p-3">
            <textarea 
              placeholder="Type here..."
              className="w-full border-none outline-none text-base text-gray-900 resize-none min-h-[120px] bg-transparent"
            />
          </div>
          <div className="absolute -top-2 left-3 bg-white px-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Why are you skipping this next step?</p>
          </div>
          <div className="mt-2 text-[11px] font-bold uppercase tracking-wider text-gray-500">Reason (optional)</div>
        </div>
      </div>
    </Modal>
  );
}

export function CognitiveLoopModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const footer = (
    <button 
      onClick={onClose}
      className="px-8 py-2.5 bg-[#06302c] text-white font-semibold rounded-md shadow-md hover:opacity-90 transition-all"
    >
      Close
    </button>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="The Cognitive Loop" footer={footer} width={640}>
      <div className="flex flex-col gap-6">
        <p className="text-[15px] text-gray-600 leading-relaxed">
          The Cognitive Loop is a structured sequential process designed to guide clinical reasoning and ensure thorough evaluation of diagnostic evidence.
        </p>

        <div className="flex flex-col gap-5">
          {[
            { step: 1, label: "Initial Evidence Collection", desc: "Gathering and documenting raw clinical observations and data points." },
            { step: 2, label: "Feature Extraction", desc: "Identifying key clinical features and patterns from the collected evidence." },
            { step: 3, label: "Criterion Mapping", desc: "Mapping clinical features to formal diagnostic criteria from established guidelines." },
            { step: 4, label: "Uncertainty Analysis", desc: "Reviewing mapping confidence and identifying gaps or contradictions in evidence." },
            { step: 5, label: "Refinement & Next Steps", desc: "Defining specific actions to resolve clinical uncertainty or gather missing data." },
            { step: 6, label: "Clinical Formulation", desc: "Finalising the working impression based on the validated evidence chain." }
          ].map(s => (
            <div key={s.step} className="flex gap-4">
              <div className="w-7 h-7 rounded-full bg-[#06302c] text-white flex items-center justify-center text-sm font-bold shrink-0">
                {s.step}
              </div>
              <div>
                <div className="text-[15px] font-semibold text-gray-900 mb-1">{s.label}</div>
                <div className="text-sm text-gray-600 leading-relaxed">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
