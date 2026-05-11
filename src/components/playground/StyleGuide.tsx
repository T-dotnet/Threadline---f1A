/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Plus, 
  Search, 
  Check, 
  AlertTriangle, 
  Info, 
  X,
  FileText,
  Activity,
  User,
  MoreVertical,
  ArrowRight,
  Bell,
  Mail,
  Filter,
  Download,
  Calendar,
  Clock,
  ExternalLink,
  ChevronDown
} from "lucide-react";

// UI Components
import { 
  Button, 
  Badge, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  Typography, 
  Input, 
  Select, 
  Modal,
  Tabs,
  Separator,
  Avatar,
  Progress,
  Skeleton,
  Switch,
  Checkbox,
  DataPoint,
  Label,
  Textarea,
  SearchableSelect,
} from "../ui";

import { CollapsibleSection } from "../ui/CollapsibleSection";
import { Toast } from "../ui/Toast";

// Shared Components
import { StatusBadge } from "../shared/StatusBadge";
import { ConfidenceBadge } from "../shared/ConfidenceBadge";
import { EmptyState } from "../shared/EmptyState";
import { FileTypeBadge } from "../shared/FileTypeBadge";
import { SectionHeader } from "../shared/SectionHeader";
import { SysBadge } from "../shared/SysBadge";

interface ComponentShowcaseProps {
  name: string;
  description: string;
  usage: React.ReactNode;
  code: string;
  usability: string[];
  accessibility: string[];
  implementation: string;
}

const ComponentShowcase = ({ 
  name, 
  description, 
  usage, 
  code, 
  usability, 
  accessibility, 
  implementation 
}: ComponentShowcaseProps) => {
  return (
    <div className="space-y-6 scroll-mt-32" id={name.toLowerCase().replace(/\s+/g, '-')}>
      <div className="flex items-baseline justify-between border-b border-divider pb-2">
        <Typography variant="h3">{name}</Typography>
        <code className="text-[10px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded uppercase tracking-wider">
          {name.includes('Badge') || name.includes('State') || name.includes('Header') || name.includes('Sys') ? 'Shared' : 'UI'} Component
        </code>
      </div>
      
      <Typography variant="body" className="text-slate-600 max-w-3xl leading-relaxed">{description}</Typography>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Visual Preview */}
        <div className="space-y-3">
          <Typography variant="label-micro" className="text-slate-400 uppercase tracking-widest text-[10px]">Visualisation</Typography>
          <div className="min-h-[240px] flex items-center justify-center bg-white rounded-2xl border border-slate-100 shadow-sm p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40"></div>
            <div className="relative z-10 w-full flex items-center justify-center">
              {usage}
            </div>
          </div>
        </div>

        {/* Code Snippet */}
        <div className="space-y-3">
          <Typography variant="label-micro" className="text-slate-400 uppercase tracking-widest text-[10px]">Implementation Code</Typography>
          <div className="relative group">
            <pre className="p-5 bg-[#0f172a] text-slate-300 rounded-2xl text-[11px] leading-relaxed overflow-x-auto font-mono max-h-[240px] border border-slate-800">
              <code>{code}</code>
            </pre>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-2">
        <div className="space-y-3 p-4 bg-emerald-50/30 rounded-xl border border-emerald-100/50">
          <Typography variant="label-micro" className="text-emerald-700 uppercase tracking-widest text-[10px] font-bold">Usability Notes</Typography>
          <ul className="space-y-2">
            {usability.map((note, i) => (
              <li key={i} className="text-xs text-slate-600 flex gap-2 leading-relaxed">
                <span className="text-emerald-500 font-bold shrink-0 mt-0.5">•</span> <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-3 p-4 bg-blue-50/30 rounded-xl border border-blue-100/50">
          <Typography variant="label-micro" className="text-blue-700 uppercase tracking-widest text-[10px] font-bold">Accessibility</Typography>
          <ul className="space-y-2">
            {accessibility.map((note, i) => (
              <li key={i} className="text-xs text-slate-600 flex gap-2 leading-relaxed">
                <span className="text-blue-500 font-bold shrink-0 mt-0.5">•</span> <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
          <Typography variant="label-micro" className="text-slate-400 uppercase tracking-widest text-[10px] font-bold">Internal Reference</Typography>
          <Typography variant="body-sm" className="text-slate-600 italic leading-relaxed">
            {implementation}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export function StyleGuide() {
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [activeTab, setActiveTab] = useState("Analytics");
  const [searchValue, setSearchValue] = useState("");

  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const navSections = [
    { label: "Primitives", id: "button" },
    { label: "Typography", id: "typography" },
    { label: "Badges", id: "badge" },
    { label: "Form Controls", id: "input" },
    { label: "Feedback", id: "modal" },
    { label: "Data Display", id: "datapoint" },
    { label: "Layout", id: "card" },
  ];

  return (
    <div className="pb-24">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-divider mb-12">
        <div className="py-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <Typography variant="h1">Design System</Typography>
              <Typography variant="sub" className="text-slate-500 max-w-2xl">
                The visual language and component library for Threadline. Built for clinical precision and research integrity.
              </Typography>
            </div>
          </div>
          
          <nav className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-none">
            {navSections.map((item) => (
              <a 
                key={item.id} 
                href={`#${item.id}`}
                className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-[#06302c] hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <div className="space-y-32">
        {/* PRIMITIVES */}
        <section className="space-y-16">
          <SectionHeader 
            title="Primitives" 
            subtitle="Base interaction and layout components that form the building blocks of the UI."
          />
          
          <div className="space-y-24">
            <ComponentShowcase 
              name="Button"
              description="Primary interaction component for triggers, submissions and navigation."
              usage={
                <div className="flex flex-wrap gap-4 items-center justify-center">
                  <Button variant="brand" icon={<Plus size={16} />}>Create Report</Button>
                  <Button variant="outline" iconRight={<ArrowRight size={16} />}>View Details</Button>
                  <Button variant="ghost" size="icon"><MoreVertical size={20} /></Button>
                  <Button variant="error" size="sm">Delete</Button>
                </div>
              }
              code={`<Button variant="brand" icon={<Plus size={16} />}>Label</Button>\n<Button variant="outline" size="sm">Label</Button>`}
              usability={["Icon placement should follow standard patterns (plus/add on left, arrow/forward on right).", "Use size='icon' for square buttons."]}
              accessibility={["Ensures 44px touch target.", "Includes focus states for keyboard-only users."]}
              implementation="Variants: brand, outline, ghost, info, error, success, warning."
            />

            <ComponentShowcase 
              name="Avatar"
              description="Visual representation of a user or patient profile."
              usage={
                <div className="flex gap-4 items-center">
                  <Avatar size="lg" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=128&h=128&fit=crop" />
                  <Avatar size="md" />
                  <Avatar size="sm" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop" />
                </div>
              }
              code={`<Avatar src={url} size="lg" />\n<Avatar size="md" /> {/* Fallback to icon */}`}
              usability={["Sizes include sm (32px), md (40px), lg (56px).", "Smooth fallback to user icon if URL is missing."]}
              accessibility={["Includes alt text for screen readers.", "Distinct circle shape provides immediate mental model."]}
              implementation="Uses rounded-full clipping and object-cover positioning."
            />

            <ComponentShowcase 
              name="Separator"
              description="A subtle visual divider to group related content."
              usage={
                <div className="w-full max-w-sm space-y-4">
                  <Typography variant="body">Upper Section Content</Typography>
                  <Separator />
                  <Typography variant="body">Lower Section Content</Typography>
                </div>
              }
              code={`<Separator />\n<Separator className="my-8" />`}
              usability={["Defaults to 1px height.", "Use margin utilities to increase spacing."]}
              accessibility={["Correctly ignored by screen readers if decorative."]}
              implementation="Thin bg-divider utility class."
            />
          </div>
        </section>

        {/* TYPOGRAPHY */}
        <section className="space-y-16">
          <SectionHeader 
            title="Typography" 
            subtitle="Hierarchy established through purpose-built font pairings."
          />
          
          <ComponentShowcase 
            name="Typography"
            description="Our information hierarchy. Serif for big headings, Sans for interactive UI."
            usage={
              <div className="space-y-6 w-full max-w-lg">
                <Typography variant="h1">Main Display Heading</Typography>
                <Typography variant="h2">Section Page Heading</Typography>
                <Typography variant="h3">Component Level Title</Typography>
                <Typography variant="body">Regular body text for clinical notes and descriptions.</Typography>
                <Typography variant="label-micro">STATUS UPDATE</Typography>
              </div>
            }
            code={`<Typography variant="h1">Header</Typography>\n<Typography variant="body">Paragraph</Typography>`}
            usability={["H1 is for main page titles only.", "H3 is best for card titles."]}
            accessibility={["Strict contrast ratio adherence.", "Semantic heading levels."]}
            implementation="Supports variants: h1, h2, h3, body, body-sm, caption, label-micro."
          />
        </section>

        {/* BADGES */}
        <section className="space-y-16">
          <SectionHeader 
            title="Badges & Metadata" 
            subtitle="Compact markers for categorization and status updates."
          />
          
          <div className="space-y-24">
            <ComponentShowcase 
              name="Badge"
              description="Base badge component with multiple semantic variants."
              usage={
                <div className="flex flex-wrap gap-3">
                  <Badge variant="brand">Primary</Badge>
                  <Badge variant="success">Positive</Badge>
                  <Badge variant="error">
                    <div className="flex items-center gap-1">
                      <AlertTriangle size={12} />
                      Critical
                    </div>
                  </Badge>
                  <Badge variant="soft">Metadata</Badge>
                </div>
              }
              code={`<Badge variant="success">Success</Badge>\n<Badge variant="error"><AlertTriangle size={12}/> Error</Badge>`}
              usability={["Ideal for counts, types, or tags.", "Allows optional icon prop for extra context."]}
              accessibility={["High contrast colors for readibility."]}
              implementation="Standard variants mapping to Tailwind utility classes."
            />

            <ComponentShowcase 
              name="StatusBadge"
              description="High-level clinical status indicator."
              usage={
                <div className="flex flex-wrap gap-4">
                  <StatusBadge status="approved" />
                  <StatusBadge status="in-progress" />
                  <StatusBadge status="missing" />
                  <StatusBadge status="evidence" />
                </div>
              }
              code={`<StatusBadge status="approved" />`}
              usability={["Encapsulates domain logic for status coloring and icons."]}
              accessibility={["Icons provide redundancy for color-blind users."]}
              implementation="Configs defined within StatusBadge.tsx."
            />

            <ComponentShowcase 
              name="ConfidenceBadge"
              description="AI precision indicator for transcript analysis."
              usage={
                <div className="flex gap-4">
                  <ConfidenceBadge confidence="high" />
                  <ConfidenceBadge confidence="low" />
                </div>
              }
              code={`<ConfidenceBadge confidence="high" />`}
              usability={["Maps to 'high' (Success), 'medium' (Info), and 'low' (Error)."]}
              accessibility={["Explicit text labels (e.g. 'Low Confidence')."]}
              implementation="Accepts 'confidence' enum."
            />

            <ComponentShowcase 
              name="FileTypeBadge"
              description="Context-aware icon for document types (PDF, DOCX, CSV)."
              usage={
                <div className="flex gap-6">
                  <FileTypeBadge type="PDF" />
                  <FileTypeBadge type="CSV" />
                  <FileTypeBadge type="Docs" />
                </div>
              }
              code={`<FileTypeBadge type="PDF" />`}
              usability={["Automatically selects relevant Lucide icon.", "Labels are always uppercase for uniformity."]}
              accessibility={["Consistent iconography for document identification."]}
              implementation="Simple mapper function from extension to Icon."
            />
          </div>
        </section>

        {/* FORM ELEMENTS */}
        <section className="space-y-16">
          <SectionHeader 
            title="Form Controls" 
            subtitle="Standard and complex inputs for data capture."
          />
          
          <div className="space-y-24">
            <ComponentShowcase 
              name="Input"
              description="Text entry with integrated Label and Icon support."
              usage={<div className="w-full max-w-sm"><Input label="Full Name" placeholder="Jane Doe" icon={<User size={16} />} /></div>}
              code={`<Input label="Name" icon={<User size={16} />} />`}
              usability={["Label is integrated to prevent layout shift.", "Support for left-aligned icons."]}
              accessibility={["Automatically pairs ID/Label.", "Clear active focus border."]}
              implementation="Wraps native input with Tailwind styling."
            />

            <ComponentShowcase 
              name="Textarea"
              description="Multi-line text entry for long-form notes and observations."
              usage={<div className="w-full max-w-md"><Textarea label="Clinical Observations" placeholder="Type notes here..." rows={4} /></div>}
              code={`<Textarea label="Notes" rows={4} />`}
              usability={["Resizeable by default.", "Matches standard Input styling."]}
              accessibility={["Focus-indicator for tab-navigation."]}
              implementation="Extension of native textarea element."
            />

            <ComponentShowcase 
              name="Switch"
              description="Toggle component for binary settings (ON/OFF)."
              usage={
                <div className="flex items-center gap-12">
                  <div className="flex items-center gap-3">
                    <Switch checked />
                    <Label>Active</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch />
                    <Label>Inactive</Label>
                  </div>
                </div>
              }
              code={`<Switch checked={value} onCheckedChange={setValue} />`}
              usability={["Smooth CSS animations for state transitions.", "Immediate visual feedback."]}
              accessibility={["Keyboard toggleable via Space/Enter.", "WCAG high-contrast focus rings."]}
              implementation="Uses hidden checkbox with custom animated span."
            />

            <ComponentShowcase 
              name="Checkbox"
              description="Standard selection control for lists and acknowledgments."
              usage={
                <div className="flex items-center gap-3">
                  <Checkbox checked />
                  <Label>I acknowledge clinical protocols</Label>
                </div>
              }
              code={`<Checkbox checked={checked} />`}
              usability={["Clear checkmark icon when selected.", "Matches brand color system."]}
              accessibility={["Labels must be paired for clickability."]}
              implementation="Custom styled hidden input[type=checkbox]."
            />

            <ComponentShowcase 
              name="SearchableSelect"
              description="Input with filtering dropdown for large datasets."
              usage={
                <div className="w-full max-w-sm">
                  <SearchableSelect 
                    label="Facility" 
                    options={[
                      { value: 'st-jude', label: 'St. Jude' },
                      { value: 'gen-hosp', label: 'General Hospital' },
                      { value: 'north', label: 'North Clinic' }
                    ]} 
                    value={searchValue}
                    onChange={setSearchValue}
                    placeholder="Search..."
                  />
                </div>
              }
              code={`<SearchableSelect options={[{value: 'a', label: 'A'}]} />`}
              usability={["Real-time filtering as you type.", "Click to select or Enter to confirm."]}
              accessibility={["Accessible listbox pattern."]}
              implementation="Located in src/components/ui/SearchableSelect.tsx."
            />
          </div>
        </section>

        {/* FEEDBACK */}
        <section className="space-y-16">
          <SectionHeader 
            title="Feedback & Overlays" 
            subtitle="Components that communicate state and guide the user."
          />
          
          <div className="space-y-24">
            <ComponentShowcase 
              name="Modal"
              description="Central overlay for focused tasks or confirmation."
              usage={<Button variant="outline" onClick={() => setShowModal(true)}>Open Modal</Button>}
              code={`<Modal title="Header" isOpen={true}>Content</Modal>`}
              usability={["Includes a title, body, and footer action section.", "Backdrop blur focusing user attention."]}
              accessibility={["Escape to close.", "Focus trapping inside the layer."]}
              implementation="Uses React portals to render above all other UI."
            />

            <ComponentShowcase 
              name="Toast"
              description="A temporary, bottom-docked notification."
              usage={<Button variant="outline" onClick={triggerToast}>Trigger Notification</Button>}
              code={`<Toast message="Success" visible={true} />`}
              usability={["Auto-dismisses after 3 seconds.", "Ideal for successful CRUD actions."]}
              accessibility={["Animated entrance to draw visual attention."]}
              implementation="Animated with 'motion/react'."
            />

            <ComponentShowcase 
              name="Progress"
              description="Visual bar indicating task completion percentage."
              usage={
                <div className="w-full max-w-sm space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span>Processing Results</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} />
                </div>
              }
              code={`<Progress value={75} />`}
              usability={["Use for uploads or data crunching.", "Primary brand color for progress bar."]}
              accessibility={["ARIA-valuenow attributes included."]}
              implementation="Dual-layer div with width-based filling."
            />

            <ComponentShowcase 
              name="Skeleton"
              description="Static placeholder to reduce layout shift during loading."
              usage={
                <div className="flex items-center gap-4 w-full max-w-sm">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              }
              code={`<Skeleton className="h-4 w-full" />`}
              usability={["Pulse animation gives 'system-working' feedback.", "Matches the geometric shape of the final UI."]}
              accessibility={["Hidden from screen readers."]}
              implementation="Background animation utility."
            />
          </div>
        </section>

        {/* DATA DISPLAY */}
        <section className="space-y-16">
          <SectionHeader 
            title="Data Display" 
            subtitle="Layout patterns for complex information."
          />
          
          <div className="space-y-24">
            <ComponentShowcase 
              name="DataPoint"
              description="A labeled value pair for metadata display."
              usage={
                <div className="flex gap-12">
                  <DataPoint label="Risk Factor" value={<Badge variant="error">High</Badge>} />
                  <DataPoint label="Last Update" value="Jan 12, 2026" />
                </div>
              }
              code={`<DataPoint label="Name" value="Value" />`}
              usability={["Grid-aligned label-value structure.", "Responsive for mobile stack."]}
              accessibility={["Consistent labeling for screen reading."]}
              implementation="Column-based flex layout."
            />

            <ComponentShowcase 
              name="Tabs"
              description="Section based navigation for switching content views."
              usage={
                <div className="w-full max-w-md">
                  <Tabs 
                    tabs={['Analysis', 'Evidence', 'Protocol']} 
                    active={activeTab} 
                    onSelect={setActiveTab} 
                  />
                  <div className="p-8 border border-divider border-t-0 rounded-b-xl bg-slate-50">
                    <Typography variant="body-sm">Currently viewing {activeTab} workspace.</Typography>
                  </div>
                </div>
              }
              code={`<Tabs tabs={['A', 'B']} active={'A'} onSelect={fn} />`}
              usability={["Hover and active indicator lines.", "Text-only minimalist tabs."]}
              accessibility={["Accessible tablist role behavior."]}
              implementation="Simple button array with border-b indicators."
            />

            <ComponentShowcase 
              name="Card"
              description="Elevated container for grouping related content blocks."
              usage={
                <Card className="w-full max-w-md">
                  <CardHeader>
                    <CardTitle>Session Recap</CardTitle>
                    <CardDescription>#112 - May 10, 2026</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Typography variant="body-sm">Transcript analysis complete. 4 insights generated.</Typography>
                  </CardContent>
                </Card>
              }
              code={`<Card>\n  <CardHeader>...</CardHeader>\n  <CardContent>...</CardContent>\n</Card>`}
              usability={["Standard padding and corner radius (xl).", "CardHeader separates metadata from main body."]}
              accessibility={["Logical flow for grouped content."]}
              implementation="Compound component using CardHeader, CardTitle, etc."
            />

            <ComponentShowcase 
              name="EmptyState"
              description="Call-to-action for missing data."
              usage={
                <EmptyState 
                  icon={Mail}
                  title="No Pending Reports"
                  description="Reports will appear once clinical analysis is finalised."
                  actionLabel="Go to Inbox"
                  onAction={() => {}}
                />
              }
              code={`<EmptyState icon={Mail} title="Empty" />`}
              usability={["Centered visual focus.", "Always includes a path forward (onAction)."]}
              accessibility={["Large icons help low-vision users."]}
              implementation="Standard full-width layout."
            />
          </div>
        </section>

        {/* LAYOUT */}
        <section className="space-y-16">
          <SectionHeader 
            title="Complex Layouts" 
            subtitle="Managed containers for hierarchical data."
          />
          
          <div className="space-y-24">
            <ComponentShowcase 
              name="CollapsibleSection"
              description="Expandable container to manage vertical space."
              usage={
                <div className="w-full max-w-lg">
                  <CollapsibleSection title="Transcript History" indicatorColor="#06302c">
                    <div className="space-y-2 py-2">
                       <Typography variant="body-sm">The patient arrived early and appeared alert.</Typography>
                       <Separator />
                       <Typography variant="body-sm">Initial intake assessment confirmed previous records.</Typography>
                    </div>
                  </CollapsibleSection>
                </div>
              }
              code={`<CollapsibleSection title="Expandable" bg="bg-slate-50">Content</CollapsibleSection>`}
              usability={["Left-side vertical dot for status indication.", "Chevron toggle for clear state feedback."]}
              accessibility={["Button trigger for keyboard expand/collapse."]}
              implementation="Uses internal state for open/closed."
            />

            <ComponentShowcase 
              name="SectionHeader"
              description="Standardised major page header component."
              usage={
                <SectionHeader 
                  title="Page Title" 
                  subtitle="A brief contextual description of the current workspace or feature."
                  actions={<div className="flex gap-2"><Button size="sm">Export</Button><Button variant="brand" size="sm">Create</Button></div>}
                />
              }
              code={`<SectionHeader title="Title" subtitle="Desc" actions={<Btns/>} />`}
              usability={["Supports responsive action alignment.", "Switches title font between Serif (Page) and Sans (Section)."]}
              accessibility={["Maintains semantic header hierarchy."]}
              implementation="Flexible flex-col sm:flex-row layout."
            />
          </div>
        </section>
      </div>

      <Toast message="Action performed successfully!" visible={showToast} />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Component Preview Modal"
        footer={
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="brand" onClick={() => setShowModal(false)}>Confirm Action</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Typography variant="body">
            This is a preview of the system modal. It is designed to be focused and clean, using the brand color for primary actions.
          </Typography>
          <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-100 flex gap-3">
            <Info className="text-blue-600 shrink-0" size={18} />
            <Typography variant="body-sm" className="italic text-blue-700">
              Important diagnostic information can be highlighted here using an info box.
            </Typography>
          </div>
        </div>
      </Modal>
    </div>
  );
}
