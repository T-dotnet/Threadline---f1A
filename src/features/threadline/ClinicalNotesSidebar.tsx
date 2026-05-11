import React, { useState } from "react";
import { StickyNote, ChevronRight, ChevronLeft, Calendar, Plus, MessageSquare, Link as LinkIcon, Save } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useFeatureFlags } from "../../contexts/FeatureToggleContext";
import { MOCK_CLIENT_DATA } from "./mockData";
import { Typography, Badge, Button } from "../../components/ui";

interface ClinicalNote {
  id: string;
  date: string;
  content: string;
  sessionId?: string;
  type: 'session' | 'standalone';
}

export function ClinicalNotesSidebar() {
  const { activeAssessmentId } = useFeatureFlags();
  const [isOpen, setIsOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState("");
  
  // Use clientId "125566" as default for the demo assessment view if not specified
  const clientId = "125566";
  const clientData = MOCK_CLIENT_DATA[clientId];
  
  const [standaloneNotes, setStandaloneNotes] = useState<ClinicalNote[]>([]);

  if (!clientData) return null;

  // Convert sessions to notes
  const sessionNotes: ClinicalNote[] = clientData.sessions.map((s, idx) => ({
    id: `session-note-${idx}`,
    date: s.date,
    content: s.notes,
    sessionId: String(idx),
    type: 'session'
  }));

  const allNotes = [...sessionNotes, ...standaloneNotes].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleSaveNote = () => {
    if (!newNoteContent.trim()) return;
    
    const newNote: ClinicalNote = {
      id: `standalone-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      content: newNoteContent,
      type: 'standalone'
    };
    
    setStandaloneNotes([newNote, ...standaloneNotes]);
    setNewNoteContent("");
    setIsAdding(false);
  };

  return (
    <div className="fixed right-0 top-16 bottom-0 z-[101] flex pointer-events-none">
      {/* Toggle Button */}
      <div className="flex flex-col justify-start pt-[360px] h-full transform-none">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-indigo-600 text-white border-none rounded-l-lg py-4 px-2 cursor-pointer shadow-[-2px_0_8px_rgba(0,0,0,0.1)] pointer-events-auto flex flex-col items-center gap-3 transition-all"
        >
          {isOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          <div className="writing-vertical text-xs font-semibold text-white uppercase tracking-widest whitespace-nowrap" style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}>
            Clinical Notes
          </div>
          <StickyNote size={18} />
        </button>
      </div>

      {/* Sidebar Content */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-[360px] bg-white border-l border-divider shadow-[-4px_0_16px_rgba(0,0,0,0.05)] flex flex-col pointer-events-auto"
          >
            <div className="px-6 py-5 border-b border-divider flex items-center justify-between">
              <div className="flex items-center gap-3">
                <StickyNote size={20} className="text-indigo-600" />
                <Typography variant="h3" className="m-0 text-text-primary">Clinical Notes</Typography>
              </div>
              <button 
                onClick={() => setIsAdding(!isAdding)}
                className={`border-none rounded-md px-2.5 py-1.5 cursor-pointer text-xs font-semibold flex items-center gap-1 transition-colors ${isAdding ? "bg-red-100 text-red-500" : "bg-indigo-50 text-indigo-600"}`}
              >
                {isAdding ? "Cancel" : <><Plus size={14} /> New Note</>}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              <AnimatePresence>
                {isAdding && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6 overflow-hidden"
                  >
                    <div className="p-4 rounded-xl border-[1.5px] border-indigo-600 bg-slate-50 shadow-md">
                      <div className="text-xs font-bold text-indigo-600 mb-3 uppercase tracking-widest">
                         New Clinical Entry
                      </div>
                      <textarea 
                        value={newNoteContent}
                        onChange={(e) => setNewNoteContent(e.target.value)}
                        placeholder="Type clinical observation or summary..."
                        className="w-full min-h-[120px] border-none bg-transparent text-sm leading-relaxed outline-none resize-y text-text-primary font-sans"
                        autoFocus
                      />
                      <div className="flex justify-end gap-3 mt-3 pt-3 border-t border-divider">
                        <Button 
                          variant="outline"
                          onClick={() => setIsAdding(false)}
                          className="h-9 px-4 text-[13px]"
                        >
                          Cancel
                        </Button>
                        <Button 
                          variant="brand"
                          onClick={handleSaveNote}
                          className="h-9 px-4 text-[13px] bg-indigo-600 hover:bg-indigo-700 border-none"
                          icon={<Save size={14} />}
                        >
                          Save Note
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex flex-col gap-5">
                {allNotes.map((note) => (
                  <div key={note.id} className={`relative p-4 rounded-xl border border-divider transition-transform duration-200 ${note.type === 'session' ? 'bg-white' : 'bg-indigo-50/50'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-text-secondary uppercase">
                        <Calendar size={13} />
                        {note.date}
                      </div>
                      <Badge variant="default" className={note.type === 'session' ? 'bg-slate-100 text-slate-600' : 'bg-indigo-100 text-indigo-700'}>
                        {note.type === 'session' ? 'Session Linked' : 'Stand-alone'}
                      </Badge>
                    </div>
                    
                    <div className={`text-sm leading-relaxed text-text-primary ${note.type === 'session' ? 'mb-3' : 'mb-0'}`}>
                      {note.content}
                    </div>

                    {note.type === 'session' && (
                      <div className="flex items-center gap-2 pt-3 border-t border-dashed border-divider mt-1">
                        <LinkIcon size={12} className="text-indigo-500" />
                        <span className="text-[11px] font-semibold text-indigo-500">
                          Linked to Session: {clientData.sessions[parseInt(note.sessionId!)].focus}
                        </span>
                        <ChevronRight size={12} className="text-indigo-500" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 border-t border-divider bg-slate-50">
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-text-secondary uppercase">
                <MessageSquare size={14} />
                <span>Quick-access notes for evaluation support</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
