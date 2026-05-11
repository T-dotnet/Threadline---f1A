/**
 * Component Registry — single source of truth for the UI playground.
 *
 * Source code is imported with Vite's ?raw query so every code panel
 * reflects the actual production file, not a duplicated snippet.
 */

import React, { useState } from 'react';
import {
  Plus, ArrowRight, MoreVertical, AlertTriangle, User, Mail,
  Bell, Clock, Check, Download, Filter, Search, Info, X,
} from 'lucide-react';

// ─── Live component imports ───────────────────────────────────────────────────
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { SearchableSelect } from '../ui/SearchableSelect';
import { Textarea } from '../ui/Textarea';
import { Checkbox } from '../ui/Checkbox';
import { Switch } from '../ui/Switch';
import { Label } from '../ui/Label';
import { Modal } from '../ui/Modal';
import { Tabs } from '../ui/Tabs';
import { Avatar } from '../ui/Avatar';
import { Progress } from '../ui/Progress';
import { Skeleton } from '../ui/Skeleton';
import { Separator } from '../ui/Separator';
import { DataPoint } from '../ui/DataPoint';
import { CollapsibleSection } from '../ui/CollapsibleSection';
import { Toast } from '../ui/Toast';
import { Typography } from '../ui/Typography';
import { StatusBadge } from '../shared/StatusBadge';
import { ConfidenceBadge } from '../shared/ConfidenceBadge';
import { FileTypeBadge } from '../shared/FileTypeBadge';
import { SysBadge } from '../shared/SysBadge';
import { SectionHeader } from '../shared/SectionHeader';
import { EmptyState } from '../shared/EmptyState';

// ─── Raw source imports (auto-synced with production files via Vite ?raw) ─────
import ButtonSource from '../ui/Button.tsx?raw';
import BadgeSource from '../ui/Badge.tsx?raw';
import CardSource from '../ui/Card.tsx?raw';
import InputSource from '../ui/Input.tsx?raw';
import SelectSource from '../ui/Select.tsx?raw';
import SearchableSelectSource from '../ui/SearchableSelect.tsx?raw';
import TextareaSource from '../ui/Textarea.tsx?raw';
import CheckboxSource from '../ui/Checkbox.tsx?raw';
import SwitchSource from '../ui/Switch.tsx?raw';
import LabelSource from '../ui/Label.tsx?raw';
import ModalSource from '../ui/Modal.tsx?raw';
import TabsSource from '../ui/Tabs.tsx?raw';
import AvatarSource from '../ui/Avatar.tsx?raw';
import ProgressSource from '../ui/Progress.tsx?raw';
import SkeletonSource from '../ui/Skeleton.tsx?raw';
import SeparatorSource from '../ui/Separator.tsx?raw';
import DataPointSource from '../ui/DataPoint.tsx?raw';
import CollapsibleSectionSource from '../ui/CollapsibleSection.tsx?raw';
import ToastSource from '../ui/Toast.tsx?raw';
import TypographySource from '../ui/Typography.tsx?raw';
import StatusBadgeSource from '../shared/StatusBadge.tsx?raw';
import ConfidenceBadgeSource from '../shared/ConfidenceBadge.tsx?raw';
import FileTypeBadgeSource from '../shared/FileTypeBadge.tsx?raw';
import SysBadgeSource from '../shared/SysBadge.tsx?raw';
import SectionHeaderSource from '../shared/SectionHeader.tsx?raw';
import EmptyStateSource from '../shared/EmptyState.tsx?raw';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ComponentStatus = 'stable' | 'beta' | 'experimental' | 'deprecated';

export type GroupId =
  | 'typography'
  | 'buttons'
  | 'inputs'
  | 'navigation'
  | 'layout'
  | 'overlays'
  | 'feedback'
  | 'data-display'
  | 'badges'
  | 'shared';

export interface PropDef {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description: string;
}

export interface KeyboardInteraction {
  key: string;
  action: string;
}

export interface ComponentEntry {
  id: string;
  name: string;
  group: GroupId;
  description: string;
  tags: string[];
  status: ComponentStatus;
  /** Path relative to project root — shown in the code panel header */
  sourceFile: string;
  /** Full raw source of the component file, auto-synced via Vite ?raw */
  source: string;
  /** Import statement to copy-paste */
  usage: string;
  /** Renders the live component; defined as FC so hooks are allowed */
  Preview: React.FC;
  props: PropDef[];
  usability: string[];
  accessibility: string[];
  keyboard: KeyboardInteraction[];
  relatedComponents: string[];
  antiPatterns: string[];
  notes: string;
}

// ─── Group metadata ───────────────────────────────────────────────────────────

export const GROUPS: Record<GroupId, { label: string; description: string }> = {
  typography:    { label: 'Typography',    description: 'Text styles and information hierarchy' },
  buttons:       { label: 'Buttons',       description: 'Action triggers and CTAs' },
  inputs:        { label: 'Inputs',        description: 'Form controls and data entry' },
  navigation:    { label: 'Navigation',    description: 'Tabs and navigation patterns' },
  layout:        { label: 'Layout',        description: 'Containers and structural components' },
  overlays:      { label: 'Overlays',      description: 'Modals and dialogs' },
  feedback:      { label: 'Feedback',      description: 'Toasts, progress, skeletons' },
  'data-display':{ label: 'Data Display',  description: 'Cards, data points, separators' },
  badges:        { label: 'Badges',        description: 'Labels, tags, status indicators' },
  shared:        { label: 'Shared',        description: 'Domain-specific shared components' },
};

// ─── Registry ─────────────────────────────────────────────────────────────────

export const REGISTRY: ComponentEntry[] = [

  // ── TYPOGRAPHY ──────────────────────────────────────────────────────────────
  {
    id: 'typography',
    name: 'Typography',
    group: 'typography',
    description: 'Semantic text component establishing the visual hierarchy. Serif headings for display, sans-serif for interactive UI, monospace for technical labels.',
    tags: ['text', 'heading', 'font', 'hierarchy', 'label'],
    status: 'stable',
    sourceFile: 'src/components/ui/Typography.tsx',
    source: TypographySource,
    usage: "import { Typography } from '@/components/ui/Typography';",
    Preview: function TypographyPreview() {
      return (
        <div className="space-y-4 w-full max-w-md text-left">
          <Typography variant="h1">h1 — Main Display Heading</Typography>
          <Typography variant="h2">h2 — Section Page Heading</Typography>
          <Typography variant="h3">h3 — Component Level Title</Typography>
          <Typography variant="body">body — Regular body text for clinical notes and descriptions.</Typography>
          <Typography variant="body-sm">body-sm — Secondary supporting copy and metadata.</Typography>
          <Typography variant="sub">sub — Subtitle and page descriptors.</Typography>
          <Typography variant="label-micro">LABEL-MICRO — STATUS TAGS</Typography>
          <Typography variant="mono-label">mono-label — ID-12345 / code references</Typography>
          <Typography variant="infotext">infotext — Contextual callout or annotation copy.</Typography>
        </div>
      );
    },
    props: [
      { name: 'variant', type: "'h1'|'h2'|'h3'|'body'|'body-sm'|'label-micro'|'mono-label'|'infotext'|'sub'", default: "'body'", description: 'Controls the rendered text style and default HTML element' },
      { name: 'as', type: 'React.ElementType', description: 'Override the underlying HTML element without changing styles' },
      { name: 'className', type: 'string', description: 'Additional Tailwind utility classes' },
    ],
    usability: [
      'Use h1 once per page — it is the page-level title only.',
      'h2 for major workspace sections, h3 for card or component-level titles.',
      'sub variant is the preferred subtitle/description; body for prose.',
      'label-micro for all uppercase metadata chips and status annotations.',
      'mono-label for IDs, codes, and technical reference values.',
    ],
    accessibility: [
      'h1/h2/h3 variants render semantic heading elements by default.',
      'Use the as prop when you need a different element without changing visuals.',
      'Maintain logical heading order — never jump from h1 to h3.',
      'All variants pass WCAG AA contrast on white backgrounds.',
    ],
    keyboard: [],
    relatedComponents: ['SectionHeader', 'DataPoint'],
    antiPatterns: [
      'Do not skip heading levels — h1 → h3 with no h2 breaks screen-reader structure.',
      'Do not use h1 inside cards or sidebars — use h3 or CardTitle.',
      'Do not use label-micro for readable body copy — it is intended for compact metadata only.',
    ],
    notes: 'h1/h2 use Frank Ruhl Libre (serif). h3 and body variants use Poppins (sans-serif). mono-label uses JetBrains Mono.',
  },

  // ── BUTTON ───────────────────────────────────────────────────────────────────
  {
    id: 'button',
    name: 'Button',
    group: 'buttons',
    description: 'Primary interaction component for all triggers, form submissions, and navigational actions. Supports six visual variants, four sizes, loading state, and optional icon placement.',
    tags: ['interactive', 'form', 'action', 'cta', 'primitive'],
    status: 'stable',
    sourceFile: 'src/components/ui/Button.tsx',
    source: ButtonSource,
    usage: "import { Button } from '@/components/ui/Button';",
    Preview: function ButtonPreview() {
      const [loading, setLoading] = useState(false);
      return (
        <div className="flex flex-wrap gap-4 items-center justify-center">
          <Button variant="brand" icon={<Plus size={16} />}>Create Report</Button>
          <Button variant="outline" iconRight={<ArrowRight size={16} />}>View Details</Button>
          <Button variant="ghost" size="icon"><MoreVertical size={20} /></Button>
          <Button variant="danger" size="sm">Delete</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="primary" loading={loading} onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 2000); }}>
            {loading ? 'Loading…' : 'Click to load'}
          </Button>
        </div>
      );
    },
    props: [
      { name: 'variant', type: "'primary'|'secondary'|'outline'|'ghost'|'brand'|'danger'", default: "'primary'", description: 'Visual style variant' },
      { name: 'size', type: "'sm'|'md'|'lg'|'icon'", default: "'md'", description: 'Controls padding and font size' },
      { name: 'loading', type: 'boolean', default: 'false', description: 'Replaces content with a spinner and prevents interaction' },
      { name: 'icon', type: 'React.ReactNode', description: 'Icon rendered to the left of the label' },
      { name: 'iconRight', type: 'React.ReactNode', description: 'Icon rendered to the right of the label' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the button' },
      { name: 'onClick', type: '(e: MouseEvent) => void', description: 'Click handler' },
    ],
    usability: [
      'Use brand for the single primary CTA — maximum one per visible region.',
      'Icon placement convention: creation icons (Plus) on the left, directional icons (Arrow) on the right.',
      'size="icon" produces a square touch-target for icon-only actions.',
      'Prefer outline or ghost for secondary actions adjacent to a brand button.',
      'Use loading prop when the action triggers an async operation.',
    ],
    accessibility: [
      'Minimum 44×44px touch target via padding on all non-icon sizes.',
      'Focus-visible ring using the brand color for keyboard-only navigation.',
      'disabled and loading props prevent pointer events and reduce opacity to 50%.',
      'loading state should update aria-label to communicate busy state.',
    ],
    keyboard: [
      { key: 'Enter / Space', action: 'Activates the button' },
      { key: 'Tab', action: 'Moves focus forward' },
      { key: 'Shift+Tab', action: 'Moves focus backward' },
    ],
    relatedComponents: ['Badge', 'Modal'],
    antiPatterns: [
      'Do not use danger variant for soft delete — only for irreversible destructive actions.',
      'Do not render more than one brand button in a single visible region.',
      'Do not place text labels inside size="icon" buttons.',
    ],
    notes: 'Uses React.forwardRef for composability. Extends all native HTMLButtonElement attributes.',
  },

  // ── AVATAR ───────────────────────────────────────────────────────────────────
  {
    id: 'avatar',
    name: 'Avatar',
    group: 'shared',
    description: 'Circular user or patient identity image with graceful fallback to initials when no image is available.',
    tags: ['user', 'profile', 'image', 'identity'],
    status: 'stable',
    sourceFile: 'src/components/ui/Avatar.tsx',
    source: AvatarSource,
    usage: "import { Avatar } from '@/components/ui/Avatar';",
    Preview: function AvatarPreview() {
      return (
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <Avatar size="xl" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=128&h=128&fit=crop" alt="Jane Doe" />
            <Typography variant="label-micro">xl</Typography>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Avatar size="lg" fallback="JD" />
            <Typography variant="label-micro">lg</Typography>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Avatar size="md" fallback="AB" />
            <Typography variant="label-micro">md</Typography>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Avatar size="sm" fallback="X" />
            <Typography variant="label-micro">sm</Typography>
          </div>
        </div>
      );
    },
    props: [
      { name: 'src', type: 'string', description: 'Image URL; omit to show fallback initials' },
      { name: 'alt', type: 'string', description: 'Alt text for the image; first character used as fallback initial' },
      { name: 'fallback', type: 'string', description: 'Text displayed when no src is provided (typically initials)' },
      { name: 'size', type: "'sm'|'md'|'lg'|'xl'", default: "'md'", description: 'Controls diameter: sm=32, md=40, lg=48, xl=64px' },
    ],
    usability: [
      'Always provide fallback initials — src images may fail to load.',
      'Pair with a visible name label for accessibility in complex UIs.',
    ],
    accessibility: [
      'Provide alt text for images used as user identifiers.',
      'Fallback initials use sufficient contrast on the slate-100 background.',
    ],
    keyboard: [],
    relatedComponents: ['DataPoint'],
    antiPatterns: ['Do not use Avatar as a clickable button without an accessible label.'],
    notes: 'Uses forwardRef. The fallback char is derived from alt prop if fallback is not explicitly set.',
  },

  // ── BADGE ────────────────────────────────────────────────────────────────────
  {
    id: 'badge',
    name: 'Badge',
    group: 'badges',
    description: 'Compact inline label for categorization, status, and metadata. Built with CVA for exhaustive, type-safe variant management.',
    tags: ['label', 'status', 'metadata', 'tag', 'cva'],
    status: 'stable',
    sourceFile: 'src/components/ui/Badge.tsx',
    source: BadgeSource,
    usage: "import { Badge } from '@/components/ui/Badge';",
    Preview: function BadgePreview() {
      return (
        <div className="flex flex-wrap gap-3 justify-center">
          <Badge variant="brand">Brand</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="error"><div className="flex items-center gap-1"><AlertTriangle size={11} />Error</div></Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="info">Info</Badge>
          <Badge variant="soft">Soft</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="ghost">Ghost</Badge>
          <Badge variant="default">Default</Badge>
        </div>
      );
    },
    props: [
      { name: 'variant', type: "'default'|'brand'|'success'|'info'|'error'|'warning'|'soft'|'outline'|'ghost'", default: "'default'", description: 'Semantic color variant' },
      { name: 'className', type: 'string', description: 'Additional Tailwind classes' },
      { name: 'onClick', type: '() => void', description: 'Makes the badge interactive/clickable' },
    ],
    usability: [
      'Use semantic variants — success for completions, error for failures, warning for attention.',
      'Limit to 3 badges per row to avoid visual noise.',
      'Compose children with icons for additional context.',
    ],
    accessibility: [
      'All variants meet WCAG AA contrast requirements.',
      'Add aria-label when the badge contains only an icon.',
      'Do not convey critical meaning through color alone.',
    ],
    keyboard: [],
    relatedComponents: ['StatusBadge', 'ConfidenceBadge', 'FileTypeBadge', 'SysBadge'],
    antiPatterns: [
      'Do not use as a button unless onClick is provided and an aria-label is set.',
    ],
    notes: 'Uses class-variance-authority (CVA). The badgeVariants function is also exported for composing custom badge-like elements.',
  },

  // ── CARD ─────────────────────────────────────────────────────────────────────
  {
    id: 'card',
    name: 'Card',
    group: 'data-display',
    description: 'Elevated surface for grouping related content. Compound component with Header, Title, Description, Content, and Footer sub-components.',
    tags: ['container', 'surface', 'layout', 'compound'],
    status: 'stable',
    sourceFile: 'src/components/ui/Card.tsx',
    source: CardSource,
    usage: "import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';",
    Preview: function CardPreview() {
      return (
        <div className="w-full max-w-sm space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Session Recap</CardTitle>
              <CardDescription>#112 — May 10, 2026</CardDescription>
            </CardHeader>
            <CardContent>
              <Typography variant="body-sm">Transcript analysis complete. 4 insights generated from 47-minute session.</Typography>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm">View</Button>
              <Button variant="brand" size="sm" className="ml-auto">Open</Button>
            </CardFooter>
          </Card>
          <Card variant="outline">
            <CardContent className="pt-6">
              <Typography variant="body-sm">Outline variant — for secondary or supplementary content.</Typography>
            </CardContent>
          </Card>
        </div>
      );
    },
    props: [
      { name: 'variant', type: "'default'|'glass'|'outline'", default: "'default'", description: "default: elevated with shadow; glass: backdrop-blur surface; outline: border-only, no fill" },
      { name: 'className', type: 'string', description: 'Additional Tailwind classes' },
    ],
    usability: [
      'Use CardHeader for title + metadata, CardContent for the main body.',
      'CardFooter is intended for action buttons — aligns children to the left.',
      'glass variant requires a blurred or image background to be visible.',
      'outline variant is ideal for nested or secondary content blocks.',
    ],
    accessibility: [
      'Provides logical document grouping for related content.',
      'Pair CardTitle with semantic heading elements when the card is a standalone section.',
    ],
    keyboard: [],
    relatedComponents: ['DataPoint', 'Separator', 'CollapsibleSection'],
    antiPatterns: [
      'Do not nest Card components — use Separator or whitespace between related groups.',
    ],
    notes: 'All sub-components use forwardRef. CardFooter items default to left-aligned — add ml-auto to push trailing actions to the right.',
  },

  // ── INPUT ────────────────────────────────────────────────────────────────────
  {
    id: 'input',
    name: 'Input',
    group: 'inputs',
    description: 'Single-line text entry field. Thin wrapper around the native input element with consistent Threadline styling.',
    tags: ['form', 'text', 'entry', 'control', 'primitive'],
    status: 'stable',
    sourceFile: 'src/components/ui/Input.tsx',
    source: InputSource,
    usage: "import { Input } from '@/components/ui/Input';",
    Preview: function InputPreview() {
      const [val, setVal] = useState('');
      return (
        <div className="w-full max-w-sm space-y-4">
          <div className="space-y-1">
            <Label htmlFor="demo-name">Full Name</Label>
            <Input id="demo-name" placeholder="Jane Doe" value={val} onChange={e => setVal(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="demo-email">Email</Label>
            <Input id="demo-email" placeholder="email@example.com" type="email" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="demo-dis">Disabled field</Label>
            <Input id="demo-dis" placeholder="Read-only value" disabled />
          </div>
        </div>
      );
    },
    props: [
      { name: 'type', type: 'string', default: "'text'", description: 'HTML input type (text, email, password, number, etc.)' },
      { name: 'placeholder', type: 'string', description: 'Placeholder text shown when empty' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Prevents interaction and reduces opacity' },
      { name: 'className', type: 'string', description: 'Additional Tailwind classes' },
    ],
    usability: [
      'Always pair with a Label — do not rely on placeholder as the only label.',
      'Use the htmlFor/id pair to link Label and Input.',
      'Stack Label above Input with a space-y-1 gap for clean alignment.',
    ],
    accessibility: [
      'Pair with Label component via htmlFor + id for screen-reader association.',
      'Focus ring uses brand color for keyboard navigation.',
      'disabled prop sets aria-disabled and prevents pointer events.',
    ],
    keyboard: [
      { key: 'Tab', action: 'Focuses the input' },
      { key: 'Shift+Tab', action: 'Moves focus to previous element' },
    ],
    relatedComponents: ['Label', 'Textarea', 'Select', 'SearchableSelect'],
    antiPatterns: [
      'Do not use placeholder as the sole label — it disappears on focus.',
    ],
    notes: 'Bare wrapper around native input — does not include a label or icon slot. Pair explicitly with Label.',
  },

  // ── LABEL ────────────────────────────────────────────────────────────────────
  {
    id: 'label',
    name: 'Label',
    group: 'inputs',
    description: 'Accessible form label that links to a control via htmlFor. Lightweight wrapper around the native label element.',
    tags: ['form', 'accessibility', 'input', 'label'],
    status: 'stable',
    sourceFile: 'src/components/ui/Label.tsx',
    source: LabelSource,
    usage: "import { Label } from '@/components/ui/Label';",
    Preview: function LabelPreview() {
      return (
        <div className="space-y-3 w-full max-w-xs">
          <div className="flex items-center gap-2">
            <Checkbox id="cb-demo" />
            <Label htmlFor="cb-demo">I acknowledge clinical protocols</Label>
          </div>
          <div className="space-y-1">
            <Label htmlFor="inp-demo">Session Date</Label>
            <Input id="inp-demo" type="date" />
          </div>
        </div>
      );
    },
    props: [
      { name: 'htmlFor', type: 'string', description: 'ID of the form element this label is associated with' },
      { name: 'className', type: 'string', description: 'Additional Tailwind classes' },
    ],
    usability: [
      'Always provide htmlFor to associate the label with its control.',
      'Clicking the label should focus or activate the associated input.',
    ],
    accessibility: [
      'htmlFor creates a programmatic association read by screen readers.',
      'Required for Checkbox, Switch, and Input to be fully accessible.',
    ],
    keyboard: [],
    relatedComponents: ['Input', 'Checkbox', 'Switch', 'Textarea'],
    antiPatterns: [],
    notes: 'Renders a native <label> element with styled text. Required for accessible form design.',
  },

  // ── TEXTAREA ─────────────────────────────────────────────────────────────────
  {
    id: 'textarea',
    name: 'Textarea',
    group: 'inputs',
    description: 'Multi-line text entry for long-form content such as clinical notes and observations.',
    tags: ['form', 'text', 'multi-line', 'notes'],
    status: 'stable',
    sourceFile: 'src/components/ui/Textarea.tsx',
    source: TextareaSource,
    usage: "import { Textarea } from '@/components/ui/Textarea';",
    Preview: function TextareaPreview() {
      return (
        <div className="w-full max-w-md space-y-1">
          <Label htmlFor="ta-demo">Clinical Observations</Label>
          <Textarea id="ta-demo" placeholder="Enter detailed notes here…" rows={4} />
        </div>
      );
    },
    props: [
      { name: 'rows', type: 'number', default: '3 (min-h-[80px] CSS)', description: 'Visible row height; CSS min-height enforces a minimum' },
      { name: 'placeholder', type: 'string', description: 'Placeholder text' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Prevents interaction' },
      { name: 'className', type: 'string', description: 'Additional Tailwind classes' },
    ],
    usability: [
      'Set rows to match expected content volume.',
      'User-resizable by default; add resize-none to prevent resizing.',
      'Matches Input styling for visual form consistency.',
    ],
    accessibility: [
      'Pair with Label via htmlFor + id.',
      'Focus ring uses brand color.',
    ],
    keyboard: [
      { key: 'Tab', action: 'Focuses the textarea' },
      { key: 'Enter', action: 'Inserts a newline' },
    ],
    relatedComponents: ['Input', 'Label'],
    antiPatterns: ['Do not use for single-line values — use Input.'],
    notes: 'Thin wrapper around native textarea. No label slot — pair explicitly with Label.',
  },

  // ── SELECT ───────────────────────────────────────────────────────────────────
  {
    id: 'select',
    name: 'Select',
    group: 'inputs',
    description: 'Standard dropdown for choosing from a predefined list of options.',
    tags: ['form', 'dropdown', 'select', 'choice'],
    status: 'stable',
    sourceFile: 'src/components/ui/Select.tsx',
    source: SelectSource,
    usage: "import { Select } from '@/components/ui/Select';",
    Preview: function SelectPreview() {
      return (
        <div className="w-full max-w-sm">
          <Select label="Assessment Type">
            <option value="">Select type…</option>
            <option value="initial">Initial Assessment</option>
            <option value="follow-up">Follow-up Session</option>
            <option value="discharge">Discharge Review</option>
          </Select>
        </div>
      );
    },
    props: [
      { name: 'label', type: 'string', description: 'Floating label above the select control' },
      { name: 'className', type: 'string', description: 'Additional Tailwind classes' },
    ],
    usability: [
      'Use for lists of 4+ predefined options.',
      'For fewer than 4 options, consider radio buttons.',
      'For searchable lists, use SearchableSelect.',
    ],
    accessibility: [
      'Uses native select for maximum browser and AT compatibility.',
      'Keyboard-navigable with arrow keys natively.',
    ],
    keyboard: [
      { key: 'Arrow Up/Down', action: 'Cycles through options' },
      { key: 'Enter / Space', action: 'Opens the dropdown' },
    ],
    relatedComponents: ['SearchableSelect', 'Input'],
    antiPatterns: ['Do not use for binary toggle choices — use Switch instead.'],
    notes: 'Wraps native select. The chevron icon is CSS-positioned and pointer-events-none.',
  },

  // ── SEARCHABLE SELECT ────────────────────────────────────────────────────────
  {
    id: 'searchable-select',
    name: 'SearchableSelect',
    group: 'inputs',
    description: 'Filterable dropdown with real-time search — ideal for large datasets where the user cannot easily scan all options.',
    tags: ['form', 'dropdown', 'search', 'filter', 'combobox'],
    status: 'stable',
    sourceFile: 'src/components/ui/SearchableSelect.tsx',
    source: SearchableSelectSource,
    usage: "import { SearchableSelect } from '@/components/ui/SearchableSelect';",
    Preview: function SearchableSelectPreview() {
      const [val, setVal] = useState('');
      return (
        <div className="w-full max-w-sm">
          <SearchableSelect
            label="Facility"
            options={[
              { value: 'st-jude', label: 'St. Jude Medical Center' },
              { value: 'gen-hosp', label: 'General Hospital' },
              { value: 'north', label: 'North Clinic' },
              { value: 'south', label: 'South Campus' },
            ]}
            value={val}
            onChange={setVal}
            placeholder="Search facilities…"
          />
        </div>
      );
    },
    props: [
      { name: 'options', type: 'Array<{ value: string; label: string }>', required: true, description: 'The option list to filter and display' },
      { name: 'value', type: 'string', description: 'Controlled selected value' },
      { name: 'onChange', type: '(value: string) => void', description: 'Called when an option is selected' },
      { name: 'label', type: 'string', description: 'Floating label above the control' },
      { name: 'placeholder', type: 'string', description: 'Placeholder text shown when no value is selected' },
    ],
    usability: [
      'Real-time filtering as the user types.',
      'Best for datasets of 10+ options.',
    ],
    accessibility: [
      'Implements an accessible listbox/combobox pattern.',
      'Keyboard navigable with arrow keys and Enter to confirm.',
    ],
    keyboard: [
      { key: 'Arrow Up/Down', action: 'Navigate filtered options' },
      { key: 'Enter', action: 'Select focused option' },
      { key: 'Escape', action: 'Close the dropdown' },
    ],
    relatedComponents: ['Select', 'Input'],
    antiPatterns: ['Do not use when the list has fewer than 5 options — use Select instead.'],
    notes: 'Located at src/components/ui/SearchableSelect.tsx.',
  },

  // ── CHECKBOX ─────────────────────────────────────────────────────────────────
  {
    id: 'checkbox',
    name: 'Checkbox',
    group: 'inputs',
    description: 'Standard selection control for multi-option lists and acknowledgment flows.',
    tags: ['form', 'selection', 'boolean', 'toggle'],
    status: 'stable',
    sourceFile: 'src/components/ui/Checkbox.tsx',
    source: CheckboxSource,
    usage: "import { Checkbox } from '@/components/ui/Checkbox';",
    Preview: function CheckboxPreview() {
      const [a, setA] = useState(true);
      const [b, setB] = useState(false);
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Checkbox id="chk-a" checked={a} onCheckedChange={setA} />
            <Label htmlFor="chk-a">I acknowledge clinical protocols</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="chk-b" checked={b} onCheckedChange={setB} />
            <Label htmlFor="chk-b">Enable risk flagging</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="chk-dis" disabled />
            <Label htmlFor="chk-dis" className="opacity-50">Disabled option</Label>
          </div>
        </div>
      );
    },
    props: [
      { name: 'checked', type: 'boolean', description: 'Controlled checked state' },
      { name: 'onCheckedChange', type: '(checked: boolean) => void', description: 'Called when the checkbox is toggled' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Prevents interaction' },
      { name: 'id', type: 'string', description: 'For linking with a Label via htmlFor' },
    ],
    usability: [
      'Always pair with a Label for clickability and context.',
      'Use for multi-select — for single binary choices use Switch.',
    ],
    accessibility: [
      'Uses role="checkbox" and aria-checked.',
      'Keyboard-activatable with Space.',
      'Label must be associated via htmlFor/id.',
    ],
    keyboard: [
      { key: 'Space', action: 'Toggles checked state' },
      { key: 'Tab', action: 'Moves focus to next control' },
    ],
    relatedComponents: ['Switch', 'Label'],
    antiPatterns: ['Do not use for a single on/off preference — use Switch.'],
    notes: 'Custom-styled hidden input[type=checkbox] with an animated checkmark.',
  },

  // ── SWITCH ───────────────────────────────────────────────────────────────────
  {
    id: 'switch',
    name: 'Switch',
    group: 'inputs',
    description: 'Toggle component for binary settings. Animated pill-track with spring-physics thumb.',
    tags: ['form', 'toggle', 'boolean', 'setting'],
    status: 'stable',
    sourceFile: 'src/components/ui/Switch.tsx',
    source: SwitchSource,
    usage: "import { Switch } from '@/components/ui/Switch';",
    Preview: function SwitchPreview() {
      const [on, setOn] = useState(true);
      const [off, setOff] = useState(false);
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Switch id="sw-on" checked={on} onCheckedChange={setOn} />
            <Label htmlFor="sw-on">{on ? 'Active' : 'Inactive'}</Label>
          </div>
          <div className="flex items-center gap-3">
            <Switch id="sw-off" checked={off} onCheckedChange={setOff} />
            <Label htmlFor="sw-off">{off ? 'Enabled' : 'Disabled'}</Label>
          </div>
          <div className="flex items-center gap-3">
            <Switch checked disabled />
            <Label className="opacity-50">Locked on</Label>
          </div>
        </div>
      );
    },
    props: [
      { name: 'checked', type: 'boolean', default: 'false', description: 'Controlled ON/OFF state' },
      { name: 'onCheckedChange', type: '(checked: boolean) => void', description: 'Called when the toggle state changes' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Prevents interaction' },
    ],
    usability: [
      'Use for binary on/off settings that take immediate effect.',
      'Pair with a descriptive Label explaining what toggling does.',
      'Spring animation provides tactile visual feedback.',
    ],
    accessibility: [
      'Uses role="switch" and aria-checked for screen reader support.',
      'Space and Enter activate the toggle.',
      'Focus ring on keyboard navigation.',
    ],
    keyboard: [
      { key: 'Space / Enter', action: 'Toggles the switch' },
      { key: 'Tab', action: 'Moves focus forward' },
    ],
    relatedComponents: ['Checkbox', 'Label'],
    antiPatterns: ['Do not use Switch for multi-select lists — use Checkbox.'],
    notes: 'Thumb animation uses Framer Motion spring (stiffness: 500, damping: 30).',
  },

  // ── TABS ─────────────────────────────────────────────────────────────────────
  {
    id: 'tabs',
    name: 'Tabs',
    group: 'navigation',
    description: 'Section-based navigation for switching between content views within a single workspace.',
    tags: ['navigation', 'section', 'view-switch'],
    status: 'stable',
    sourceFile: 'src/components/ui/Tabs.tsx',
    source: TabsSource,
    usage: "import { Tabs } from '@/components/ui/Tabs';",
    Preview: function TabsPreview() {
      const [active, setActive] = useState('Analysis');
      return (
        <div className="w-full max-w-md">
          <Tabs tabs={['Analysis', 'Evidence', 'Protocol']} active={active} onSelect={setActive} />
          <div className="p-6 border border-divider border-t-0 rounded-b-xl bg-slate-50">
            <Typography variant="body-sm">Viewing: <strong>{active}</strong> workspace.</Typography>
          </div>
        </div>
      );
    },
    props: [
      { name: 'tabs', type: 'string[]', required: true, description: 'Array of tab label strings' },
      { name: 'active', type: 'string', required: true, description: 'The currently active tab label' },
      { name: 'onSelect', type: '(tab: string) => void', required: true, description: 'Called when a tab is clicked' },
      { name: 'className', type: 'string', description: 'Additional Tailwind classes' },
    ],
    usability: [
      'Tab labels must be concise — avoid full sentences.',
      'Show the active state with a border-b indicator (built-in).',
      'Limit to 5 tabs maximum before considering an alternative navigation pattern.',
    ],
    accessibility: [
      'Renders as accessible tab buttons.',
      'Active state conveyed via color and border-b — not color alone.',
    ],
    keyboard: [
      { key: 'Tab', action: 'Moves focus to the active tab button' },
      { key: 'Enter / Space', action: 'Activates the focused tab' },
    ],
    relatedComponents: ['CollapsibleSection'],
    antiPatterns: ['Do not use Tabs for wizard/multi-step flows — use a stepper.'],
    notes: 'Simple button array. Tab content rendering is controlled externally.',
  },

  // ── MODAL ────────────────────────────────────────────────────────────────────
  {
    id: 'modal',
    name: 'Modal',
    group: 'overlays',
    description: 'Spring-animated overlay for focused tasks, confirmations, and detail views. Backdrop blur draws attention to the modal content.',
    tags: ['dialog', 'overlay', 'popup', 'focus'],
    status: 'stable',
    sourceFile: 'src/components/ui/Modal.tsx',
    source: ModalSource,
    usage: "import { Modal } from '@/components/ui/Modal';",
    Preview: function ModalPreview() {
      const [open, setOpen] = useState(false);
      return (
        <div>
          <Button variant="outline" onClick={() => setOpen(true)}>Open Modal</Button>
          <Modal
            isOpen={open}
            onClose={() => setOpen(false)}
            title="Session Confirmation"
            footer={
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                <Button variant="brand" onClick={() => setOpen(false)}>Confirm</Button>
              </div>
            }
          >
            <div className="space-y-3">
              <Typography variant="body">Review the session details before confirming. This action will initiate the analysis pipeline.</Typography>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 flex gap-2">
                <Info size={16} className="text-blue-600 shrink-0 mt-0.5" />
                <Typography variant="body-sm" className="text-blue-700">Analysis typically completes in 2–3 minutes.</Typography>
              </div>
            </div>
          </Modal>
        </div>
      );
    },
    props: [
      { name: 'isOpen', type: 'boolean', required: true, description: 'Controls visibility' },
      { name: 'onClose', type: '() => void', required: true, description: 'Called when backdrop is clicked or the × button is pressed' },
      { name: 'title', type: 'string', description: 'Modal header title; omit to hide the header' },
      { name: 'footer', type: 'React.ReactNode', description: 'Footer slot — typically contains action buttons' },
      { name: 'width', type: 'number | string', default: '520', description: 'Maximum width in pixels or any CSS width value' },
      { name: 'className', type: 'string', description: 'Additional classes for the modal panel' },
    ],
    usability: [
      'Use for focused tasks that require confirmation or detailed input.',
      'Always provide an onClose handler — never trap users.',
      'Keep modal content concise; complex flows should be full-page routes.',
      'Footer is right-aligned — primary action on the right.',
    ],
    accessibility: [
      'Escape key closes the modal via the backdrop click handler.',
      'Focus should be trapped inside the modal while open.',
      'Backdrop click dismisses the modal.',
      'Announce modal title via aria-labelledby.',
    ],
    keyboard: [
      { key: 'Escape', action: 'Closes the modal (via backdrop click)' },
      { key: 'Tab', action: 'Cycles focus through modal interactive elements' },
    ],
    relatedComponents: ['Button'],
    antiPatterns: [
      'Do not use Modal for simple confirmation with a single action — use a toast or inline validation.',
      'Do not nest modals.',
    ],
    notes: 'Uses AnimatePresence + spring physics (damping: 25, stiffness: 300). Renders into the DOM at the call site — uses z-[1000].',
  },

  // ── TOAST ────────────────────────────────────────────────────────────────────
  {
    id: 'toast',
    name: 'Toast',
    group: 'feedback',
    description: 'Temporary bottom-docked notification for confirming completed actions.',
    tags: ['notification', 'feedback', 'status', 'transient'],
    status: 'stable',
    sourceFile: 'src/components/ui/Toast.tsx',
    source: ToastSource,
    usage: "import { Toast } from '@/components/ui/Toast';",
    Preview: function ToastPreview() {
      const [visible, setVisible] = useState(false);
      const trigger = () => {
        setVisible(true);
        setTimeout(() => setVisible(false), 3000);
      };
      return (
        <div className="relative" style={{ minHeight: 80 }}>
          <Button variant="outline" onClick={trigger} disabled={visible}>
            {visible ? 'Notification shown…' : 'Trigger notification'}
          </Button>
          <Toast message="Action completed successfully!" visible={visible} />
        </div>
      );
    },
    props: [
      { name: 'message', type: 'string', required: true, description: 'The notification message text' },
      { name: 'visible', type: 'boolean', required: true, description: 'Controls visibility — component animates in/out' },
    ],
    usability: [
      'Auto-dismiss after 3 seconds by clearing visible in a setTimeout.',
      'Best for confirming CRUD completions — not for errors.',
      'Keep messages short and action-specific.',
    ],
    accessibility: [
      'Add aria-live="polite" to the Toast container in a future iteration.',
      'The entrance animation draws visual attention.',
    ],
    keyboard: [],
    relatedComponents: ['Modal', 'Progress'],
    antiPatterns: [
      'Do not use Toast for errors — use inline validation or a Modal instead.',
      'Do not stack multiple Toasts — only one should be visible at a time.',
    ],
    notes: 'Fixed-positioned at bottom-10. Uses AnimatePresence for enter/exit. Bottom-center aligned at left-[55%].',
  },

  // ── PROGRESS ─────────────────────────────────────────────────────────────────
  {
    id: 'progress',
    name: 'Progress',
    group: 'feedback',
    description: 'Animated bar indicating task completion percentage. Transitions smoothly between values.',
    tags: ['loading', 'completion', 'feedback', 'status'],
    status: 'stable',
    sourceFile: 'src/components/ui/Progress.tsx',
    source: ProgressSource,
    usage: "import { Progress } from '@/components/ui/Progress';",
    Preview: function ProgressPreview() {
      const [val, setVal] = useState(60);
      return (
        <div className="w-full max-w-sm space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span>Processing Results</span>
              <span>{val}%</span>
            </div>
            <Progress value={val} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span>Analysis Complete</span>
              <span>100%</span>
            </div>
            <Progress value={100} color="#388e3c" />
          </div>
          <div className="flex gap-2 mt-2">
            <Button size="sm" variant="ghost" onClick={() => setVal(Math.max(0, val - 10))}>-10</Button>
            <Button size="sm" variant="ghost" onClick={() => setVal(Math.min(100, val + 10))}>+10</Button>
          </div>
        </div>
      );
    },
    props: [
      { name: 'value', type: 'number', default: '0', description: 'Current progress (0–max)' },
      { name: 'max', type: 'number', default: '100', description: 'Maximum value' },
      { name: 'color', type: 'string', default: "'#06302c'", description: 'Fill color (any valid CSS color)' },
      { name: 'className', type: 'string', description: 'Additional Tailwind classes' },
    ],
    usability: [
      'Always show a numeric percentage alongside the bar.',
      'Change color to success (#388e3c) at completion.',
    ],
    accessibility: [
      'Add aria-valuenow, aria-valuemin, aria-valuemax attributes for screen readers.',
      'Combine with a visible label for context.',
    ],
    keyboard: [],
    relatedComponents: ['Skeleton', 'Toast'],
    antiPatterns: ['Do not use for indeterminate loading — use Skeleton instead.'],
    notes: 'Fill uses motion/react for a smooth width animation (duration: 0.5s, easeOut).',
  },

  // ── SKELETON ─────────────────────────────────────────────────────────────────
  {
    id: 'skeleton',
    name: 'Skeleton',
    group: 'feedback',
    description: 'Animated loading placeholder that mirrors the shape of the final content to reduce perceived layout shift.',
    tags: ['loading', 'placeholder', 'feedback'],
    status: 'stable',
    sourceFile: 'src/components/ui/Skeleton.tsx',
    source: SkeletonSource,
    usage: "import { Skeleton } from '@/components/ui/Skeleton';",
    Preview: function SkeletonPreview() {
      return (
        <div className="w-full max-w-sm space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
          <Skeleton className="h-32 w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
            <Skeleton className="h-3 w-4/6" />
          </div>
        </div>
      );
    },
    props: [
      { name: 'className', type: 'string', description: 'Controls shape — set h-, w-, and rounded- classes to match the final content' },
    ],
    usability: [
      'Shape the skeleton to closely match the final loaded content.',
      'Use rounded-full for avatar placeholders.',
      'Compose multiple Skeletons to replicate complex layouts.',
    ],
    accessibility: [
      'Hidden from screen readers (decorative).',
      'Do not use aria-busy on the skeleton — add it to the parent container.',
    ],
    keyboard: [],
    relatedComponents: ['Progress', 'Avatar'],
    antiPatterns: ['Do not use Skeleton for percentage-known operations — use Progress.'],
    notes: 'Uses Tailwind animate-pulse. No built-in size — entirely controlled via className.',
  },

  // ── SEPARATOR ────────────────────────────────────────────────────────────────
  {
    id: 'separator',
    name: 'Separator',
    group: 'layout',
    description: 'Subtle horizontal rule for visually grouping related content sections.',
    tags: ['divider', 'layout', 'rule'],
    status: 'stable',
    sourceFile: 'src/components/ui/Separator.tsx',
    source: SeparatorSource,
    usage: "import { Separator } from '@/components/ui/Separator';",
    Preview: function SeparatorPreview() {
      return (
        <div className="w-full max-w-sm space-y-4">
          <Typography variant="body">Upper Section Content</Typography>
          <Separator />
          <Typography variant="body">Lower Section Content</Typography>
          <Separator className="my-2" />
          <Typography variant="body-sm" className="text-slate-400">Footer note</Typography>
        </div>
      );
    },
    props: [
      { name: 'className', type: 'string', description: 'Additional Tailwind classes — use my-N to control spacing' },
    ],
    usability: [
      'Use margin utilities (my-4, my-6) rather than wrapper padding for spacing.',
      'Prefer whitespace gaps first — only add a Separator when visual grouping is critical.',
    ],
    accessibility: [
      'Rendered as a decorative element — ignored by screen readers.',
    ],
    keyboard: [],
    relatedComponents: ['Card', 'CollapsibleSection'],
    antiPatterns: [],
    notes: 'Thin 1px rule using bg-divider. No border — uses background color.',
  },

  // ── DATA POINT ───────────────────────────────────────────────────────────────
  {
    id: 'data-point',
    name: 'DataPoint',
    group: 'data-display',
    description: 'A labeled key-value pair for metadata panels and detail views.',
    tags: ['data', 'metadata', 'key-value', 'display'],
    status: 'stable',
    sourceFile: 'src/components/ui/DataPoint.tsx',
    source: DataPointSource,
    usage: "import { DataPoint } from '@/components/ui/DataPoint';",
    Preview: function DataPointPreview() {
      return (
        <div className="flex flex-wrap gap-10">
          <DataPoint label="Risk Factor" value={<Badge variant="error">High</Badge>} />
          <DataPoint label="Last Updated" value="May 10, 2026" />
          <DataPoint label="Confidence" value={<ConfidenceBadge confidence="high" />} />
          <DataPoint label="Status" value={<StatusBadge status="completed" />} />
        </div>
      );
    },
    props: [
      { name: 'label', type: 'string', required: true, description: 'Short uppercase metadata label' },
      { name: 'value', type: 'React.ReactNode', required: true, description: 'The value — can be a string, Badge, or any React node' },
      { name: 'className', type: 'string', description: 'Additional Tailwind classes' },
    ],
    usability: [
      'Arrange DataPoints in a horizontal flex row with gap-8 or gap-10 for readability.',
      'Values can be React nodes — compose with Badge, StatusBadge, or ConfidenceBadge.',
    ],
    accessibility: [
      'Label text is visually muted (uppercase, reduced opacity) but descriptive.',
    ],
    keyboard: [],
    relatedComponents: ['Card', 'Typography', 'Badge'],
    antiPatterns: ['Do not use for editable fields — use Input with Label.'],
    notes: 'Label is 10px uppercase bold. Value is 14px semibold slate-900.',
  },

  // ── COLLAPSIBLE SECTION ──────────────────────────────────────────────────────
  {
    id: 'collapsible-section',
    name: 'CollapsibleSection',
    group: 'layout',
    description: 'Expandable container to manage vertical space for secondary or hierarchical content.',
    tags: ['accordion', 'collapse', 'expand', 'container'],
    status: 'stable',
    sourceFile: 'src/components/ui/CollapsibleSection.tsx',
    source: CollapsibleSectionSource,
    usage: "import { CollapsibleSection } from '@/components/ui/CollapsibleSection';",
    Preview: function CollapsibleSectionPreview() {
      return (
        <div className="w-full max-w-md space-y-2">
          <CollapsibleSection title="Transcript History" indicatorColor="#06302c">
            <div className="space-y-2 py-2">
              <Typography variant="body-sm">The patient arrived early and appeared alert.</Typography>
              <Separator />
              <Typography variant="body-sm">Initial intake confirmed previous records.</Typography>
            </div>
          </CollapsibleSection>
          <CollapsibleSection title="Additional Notes" defaultOpen={false}>
            <Typography variant="body-sm">Hidden content revealed on expand.</Typography>
          </CollapsibleSection>
        </div>
      );
    },
    props: [
      { name: 'title', type: 'string', required: true, description: 'Header label for the collapsible section' },
      { name: 'defaultOpen', type: 'boolean', default: 'true', description: 'Whether the section starts expanded' },
      { name: 'noCollapse', type: 'boolean', default: 'false', description: 'Permanently expands and hides the toggle' },
      { name: 'indicatorColor', type: 'string', description: 'Color of the dot indicator on the left' },
      { name: 'headerAction', type: 'React.ReactNode', description: 'Optional action element in the header (e.g. a button)' },
      { name: 'bg', type: 'string', default: "'bg-white'", description: 'Tailwind background utility' },
    ],
    usability: [
      'Default to open for primary sections, closed for supplementary content.',
      'Use headerAction slot for contextual actions (add, filter).',
    ],
    accessibility: [
      'Toggle trigger is a button element — keyboard accessible.',
      'Chevron icon communicates open/closed state.',
    ],
    keyboard: [
      { key: 'Enter / Space', action: 'Toggles open/closed' },
    ],
    relatedComponents: ['Card', 'Separator'],
    antiPatterns: [],
    notes: 'Manages open state internally. The dot indicator changes color based on open state or indicatorColor override.',
  },

  // ── STATUS BADGE ─────────────────────────────────────────────────────────────
  {
    id: 'status-badge',
    name: 'StatusBadge',
    group: 'shared',
    description: 'Domain-aware status indicator for clinical and workflow states. Encapsulates color + icon + label mapping for all app status values.',
    tags: ['status', 'workflow', 'clinical', 'badge', 'domain'],
    status: 'stable',
    sourceFile: 'src/components/shared/StatusBadge.tsx',
    source: StatusBadgeSource,
    usage: "import { StatusBadge } from '@/components/shared/StatusBadge';",
    Preview: function StatusBadgePreview() {
      const statuses = ['approved', 'in-progress', 'missing', 'completed', 'uploaded', 'conflicts-unresolved', 'new', 'deprecated', 'draft', 'optional', 'clinician'];
      return (
        <div className="flex flex-wrap gap-2">
          {statuses.map(s => <StatusBadge key={s} status={s} />)}
        </div>
      );
    },
    props: [
      { name: 'status', type: 'string', required: true, description: 'Status key — one of the STATUS_META keys defined in the component' },
      { name: 'label', type: 'string', description: 'Override the default label text' },
      { name: 'showIcon', type: 'boolean', default: 'true', description: 'Whether to show the status icon' },
      { name: 'className', type: 'string', description: 'Additional Tailwind classes' },
      { name: 'onClick', type: '() => void', description: 'Makes the badge clickable (adds cursor-pointer)' },
    ],
    usability: [
      'Status strings are normalized — spaces and case are handled automatically.',
      'Encapsulates all domain status logic in one place — do not inline status colors.',
    ],
    accessibility: [
      'Icons provide redundancy for color-blind users.',
      'All text labels are explicit — not icon-only.',
    ],
    keyboard: [],
    relatedComponents: ['Badge', 'ConfidenceBadge'],
    antiPatterns: ['Do not hardcode status colors inline — always use StatusBadge for domain statuses.'],
    notes: 'Status is normalized via .toLowerCase().replace(/\\s+/g, \'-\'). Unknown statuses fall back to not-started.',
  },

  // ── CONFIDENCE BADGE ─────────────────────────────────────────────────────────
  {
    id: 'confidence-badge',
    name: 'ConfidenceBadge',
    group: 'shared',
    description: 'AI precision indicator for transcript analysis and hypothesis mapping. Maps high/medium/low confidence levels to semantic Badge variants.',
    tags: ['confidence', 'ai', 'clinical', 'badge', 'domain'],
    status: 'stable',
    sourceFile: 'src/components/shared/ConfidenceBadge.tsx',
    source: ConfidenceBadgeSource,
    usage: "import { ConfidenceBadge, mapScoreToConfidence } from '@/components/shared/ConfidenceBadge';",
    Preview: function ConfidenceBadgePreview() {
      return (
        <div className="flex gap-4 flex-wrap">
          <ConfidenceBadge confidence="high" />
          <ConfidenceBadge confidence="medium" />
          <ConfidenceBadge confidence="low" />
        </div>
      );
    },
    props: [
      { name: 'confidence', type: "'high'|'medium'|'low'", required: true, description: 'Confidence level to display' },
      { name: 'showIcon', type: 'boolean', default: 'true', description: 'Whether to show the status icon' },
      { name: 'className', type: 'string', description: 'Additional Tailwind classes' },
    ],
    usability: [
      'Use mapScoreToConfidence(score) to convert numeric scores (0–1) to the level enum.',
      'Always show ConfidenceBadge alongside AI-generated content.',
    ],
    accessibility: [
      'Icon + text label ensures meaning is not conveyed by color alone.',
    ],
    keyboard: [],
    relatedComponents: ['StatusBadge', 'Badge'],
    antiPatterns: ['Do not use ConfidenceBadge for non-AI sources.'],
    notes: 'Regulatory note: display standard is the test basis for Scenario S9-B (RISK-009). Do not change without updating the test protocol.',
  },

  // ── FILE TYPE BADGE ──────────────────────────────────────────────────────────
  {
    id: 'file-type-badge',
    name: 'FileTypeBadge',
    group: 'shared',
    description: 'Context-aware document type indicator that maps file extensions to appropriate icons.',
    tags: ['file', 'document', 'badge', 'type', 'icon'],
    status: 'stable',
    sourceFile: 'src/components/shared/FileTypeBadge.tsx',
    source: FileTypeBadgeSource,
    usage: "import { FileTypeBadge } from '@/components/shared/FileTypeBadge';",
    Preview: function FileTypeBadgePreview() {
      return (
        <div className="flex gap-6 flex-wrap items-center">
          <FileTypeBadge type="PDF" />
          <FileTypeBadge type="CSV" />
          <FileTypeBadge type="Docs" />
          <FileTypeBadge type="DOCX" />
          <FileTypeBadge type="XLS" />
        </div>
      );
    },
    props: [
      { name: 'type', type: 'string', required: true, description: 'File extension or type label (PDF, CSV, Docs, etc.)' },
      { name: 'showIcon', type: 'boolean', default: 'true', description: 'Whether to show the file icon' },
      { name: 'className', type: 'string', description: 'Additional Tailwind classes' },
    ],
    usability: [
      'Labels are always uppercase for consistency.',
      'Automatically selects an appropriate Lucide icon for the type.',
    ],
    accessibility: ['Consistent iconography improves document identification at a glance.'],
    keyboard: [],
    relatedComponents: ['Badge', 'StatusBadge'],
    antiPatterns: [],
    notes: 'Type string is normalized to lowercase before icon selection.',
  },

  // ── SYS BADGE ────────────────────────────────────────────────────────────────
  {
    id: 'sys-badge',
    name: 'SysBadge',
    group: 'shared',
    description: 'System classification badge for clinical guidelines (DSM-5-TR, ICD-11). Renders with system-specific color coding.',
    tags: ['clinical', 'system', 'guideline', 'badge', 'domain'],
    status: 'stable',
    sourceFile: 'src/components/shared/SysBadge.tsx',
    source: SysBadgeSource,
    usage: "import { SysBadge } from '@/components/shared/SysBadge';",
    Preview: function SysBadgePreview() {
      return (
        <div className="flex gap-4 flex-wrap">
          <SysBadge system="DSM-5-TR" />
          <SysBadge system="ICD-11" />
        </div>
      );
    },
    props: [
      { name: 'system', type: 'string', required: true, description: 'Clinical guideline system name (DSM-5-TR, ICD-11)' },
      { name: 'className', type: 'string', description: 'Additional Tailwind classes' },
    ],
    usability: ['Always display SysBadge adjacent to guideline references for source clarity.'],
    accessibility: ['Text label ensures meaning is not lost without color.'],
    keyboard: [],
    relatedComponents: ['Badge', 'FileTypeBadge'],
    antiPatterns: [],
    notes: 'Colors are defined in GUIDELINE_COLORS in src/constants.ts.',
  },

  // ── EMPTY STATE ──────────────────────────────────────────────────────────────
  {
    id: 'empty-state',
    name: 'EmptyState',
    group: 'feedback',
    description: 'Centered placeholder UI for empty lists and zero-data states. Always includes a path forward via an action button.',
    tags: ['empty', 'placeholder', 'zero-state', 'feedback'],
    status: 'stable',
    sourceFile: 'src/components/shared/EmptyState.tsx',
    source: EmptyStateSource,
    usage: "import { EmptyState } from '@/components/shared/EmptyState';",
    Preview: function EmptyStatePreview() {
      return (
        <EmptyState
          icon={Mail}
          title="No Pending Reports"
          description="Reports will appear once clinical analysis is finalised for the active session."
          actionLabel="Go to Sessions"
          onAction={() => {}}
        />
      );
    },
    props: [
      { name: 'icon', type: 'LucideIcon', required: true, description: 'Lucide icon component to display' },
      { name: 'title', type: 'string', required: true, description: 'Primary empty state heading' },
      { name: 'description', type: 'string', required: true, description: 'Supporting description explaining why the state is empty' },
      { name: 'actionLabel', type: 'string', description: 'CTA button label — omit to hide the button' },
      { name: 'onAction', type: '() => void', description: 'Called when the action button is clicked' },
    ],
    usability: [
      'Always provide a path forward — include actionLabel + onAction.',
      'Description should explain the cause AND what to do next.',
      'Use icons that relate to the expected content type.',
    ],
    accessibility: [
      'Large icons (32px) improve visibility for low-vision users.',
      'Action button meets touch target requirements.',
    ],
    keyboard: [],
    relatedComponents: ['Button', 'Typography'],
    antiPatterns: [
      'Do not use EmptyState for errors — use inline error messages instead.',
      'Do not omit onAction — zero-state views should always offer a next step.',
    ],
    notes: 'Renders a dashed border container with centered content. Full-width by default.',
  },

  // ── SECTION HEADER ───────────────────────────────────────────────────────────
  {
    id: 'section-header',
    name: 'SectionHeader',
    group: 'layout',
    description: 'Standardised page and section header with title, subtitle, and an optional actions slot.',
    tags: ['layout', 'header', 'title', 'navigation'],
    status: 'stable',
    sourceFile: 'src/components/shared/SectionHeader.tsx',
    source: SectionHeaderSource,
    usage: "import { SectionHeader } from '@/components/shared/SectionHeader';",
    Preview: function SectionHeaderPreview() {
      return (
        <div className="w-full">
          <SectionHeader
            title="Page Title"
            subtitle="A brief contextual description of the current workspace or feature."
            actions={
              <div className="flex gap-2">
                <Button size="sm" variant="outline" icon={<Download size={14} />}>Export</Button>
                <Button variant="brand" size="sm" icon={<Plus size={14} />}>Create</Button>
              </div>
            }
          />
          <Separator />
          <SectionHeader title="Section Title" subtitle="Smaller section heading" small />
        </div>
      );
    },
    props: [
      { name: 'title', type: 'string', required: true, description: 'Main heading text' },
      { name: 'subtitle', type: 'React.ReactNode', description: 'Supporting text below the title' },
      { name: 'actions', type: 'React.ReactNode', description: 'Right-aligned action buttons' },
      { name: 'small', type: 'boolean', default: 'false', description: "Uses h3 + sans-serif font instead of h2 + serif" },
    ],
    usability: [
      'Use at the top of each workspace page.',
      'small prop switches to a compact section-level header.',
      'Actions slot supports responsive alignment (flex-col on mobile).',
    ],
    accessibility: [
      'Renders semantic heading elements (h2 by default).',
      'Maintain heading hierarchy — only one h2 per section.',
    ],
    keyboard: [],
    relatedComponents: ['Typography', 'Button'],
    antiPatterns: [
      'Do not use SectionHeader inside Cards — use CardTitle instead.',
    ],
    notes: 'Default title font is Frank Ruhl Libre (5xl serif). small variant uses 2xl sans-serif.',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns all registry entries grouped by GroupId */
export function getGroupedRegistry(): Record<GroupId, ComponentEntry[]> {
  const result = {} as Record<GroupId, ComponentEntry[]>;
  for (const id of Object.keys(GROUPS) as GroupId[]) {
    result[id] = REGISTRY.filter(e => e.group === id);
  }
  return result;
}

/** Returns groups that have at least one component */
export function getActiveGroups(): GroupId[] {
  return (Object.keys(GROUPS) as GroupId[]).filter(
    id => REGISTRY.some(e => e.group === id)
  );
}
