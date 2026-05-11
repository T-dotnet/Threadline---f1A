/**
 * PlaygroundShell — the full UI for the component playground.
 *
 * Sections:
 *   Overview   — grid of all registered components
 *   Tokens     — visual design token reference
 *   ComponentDoc — per-component: Preview | Code | Notes tabs
 */

import React, { useState, useMemo, useCallback, Suspense } from 'react';
import {
  Search, Copy, Check, ChevronRight, Layers, Palette, Box,
  FlaskConical, AlertCircle, ExternalLink, Monitor, Tablet, Smartphone,
  X as XIcon, ArrowLeft,
} from 'lucide-react';
import { REGISTRY, GROUPS, getActiveGroups, type ComponentEntry, type GroupId, type PropDef } from './registry';
import { Typography } from '../ui/Typography';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Separator } from '../ui/Separator';

// ─── Syntax highlighter ───────────────────────────────────────────────────────

function highlight(raw: string): string {
  const KEYWORDS = new Set([
    'import','export','from','const','let','var','function','return','interface',
    'type','extends','implements','default','class','new','if','else','for',
    'while','async','await','void','null','undefined','true','false','as',
    'readonly','keyof','typeof','in','of','switch','case','break','throw',
    'try','catch','finally','static','abstract','declare','namespace',
    'React','useState','useEffect','useCallback','useMemo','useRef',
  ]);
  const TYPES = new Set(['string','number','boolean','any','never','unknown','Record','Array','Partial','Required','Pick','Omit','FC','ReactNode','ReactElement','CSSProperties']);

  const COLOR: Record<string, string> = {
    comment:    '#6b7280',
    string:     '#fbbf24',
    keyword:    '#c084fc',
    type:       '#67e8f9',
    component:  '#34d399',
    identifier: '#94a3b8',
    number:     '#fb923c',
    punct:      '#cbd5e1',
    jsxattr:    '#7dd3fc',
  };

  let result = '';
  let i = 0;
  const c = raw;
  const len = c.length;

  function esc(s: string) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }
  function span(color: string, text: string) {
    return `<span style="color:${color}">${esc(text)}</span>`;
  }

  while (i < len) {
    // Line comment
    if (c[i] === '/' && c[i+1] === '/') {
      const end = c.indexOf('\n', i);
      const tok = end === -1 ? c.slice(i) : c.slice(i, end);
      result += span(COLOR.comment, tok);
      i += tok.length;
      continue;
    }
    // Block comment
    if (c[i] === '/' && c[i+1] === '*') {
      const end = c.indexOf('*/', i);
      const tok = end === -1 ? c.slice(i) : c.slice(i, end + 2);
      result += span(COLOR.comment, tok);
      i += tok.length;
      continue;
    }
    // Template literal
    if (c[i] === '`') {
      let j = i + 1;
      while (j < len && c[j] !== '`') { if (c[j] === '\\') j++; j++; }
      const tok = c.slice(i, j + 1);
      result += span(COLOR.string, tok);
      i = j + 1;
      continue;
    }
    // Double-quote string
    if (c[i] === '"') {
      let j = i + 1;
      while (j < len && c[j] !== '"' && c[j] !== '\n') { if (c[j] === '\\') j++; j++; }
      const tok = c.slice(i, j + 1);
      result += span(COLOR.string, tok);
      i = j + 1;
      continue;
    }
    // Single-quote string
    if (c[i] === "'") {
      let j = i + 1;
      while (j < len && c[j] !== "'" && c[j] !== '\n') { if (c[j] === '\\') j++; j++; }
      const tok = c.slice(i, j + 1);
      result += span(COLOR.string, tok);
      i = j + 1;
      continue;
    }
    // Number
    if (/[0-9]/.test(c[i]) && (i === 0 || !/[a-zA-Z_$]/.test(c[i-1]))) {
      let j = i;
      while (j < len && /[0-9._]/.test(c[j])) j++;
      result += span(COLOR.number, c.slice(i, j));
      i = j;
      continue;
    }
    // Word
    if (/[a-zA-Z_$]/.test(c[i])) {
      let j = i;
      while (j < len && /[a-zA-Z0-9_$]/.test(c[j])) j++;
      const word = c.slice(i, j);
      if (KEYWORDS.has(word))        result += span(COLOR.keyword, word);
      else if (TYPES.has(word))      result += span(COLOR.type, word);
      else if (/^[A-Z]/.test(word)) result += span(COLOR.component, word);
      else                           result += span(COLOR.identifier, word);
      i = j;
      continue;
    }
    // Everything else
    result += esc(c[i]);
    i++;
  }
  return result;
}

// ─── CopyButton ───────────────────────────────────────────────────────────────

function CopyButton({ text, className = '' }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [text]);
  return (
    <button
      onClick={handleCopy}
      title="Copy to clipboard"
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${copied ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-slate-400 hover:bg-white/20 hover:text-white'} ${className}`}
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, string> = {
  stable:       'bg-emerald-100 text-emerald-700',
  beta:         'bg-sky-100 text-sky-700',
  experimental: 'bg-amber-100 text-amber-700',
  deprecated:   'bg-red-100 text-red-700',
};

function StatusPill({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[status] ?? 'bg-slate-100 text-slate-600'}`}>
      {status === 'deprecated' && <AlertCircle size={10} />}
      {status === 'experimental' && <FlaskConical size={10} />}
      {status}
    </span>
  );
}

// ─── Viewport widths ──────────────────────────────────────────────────────────

type Viewport = 'desktop' | 'tablet' | 'mobile';
const VIEWPORTS: { id: Viewport; label: string; icon: React.ReactNode; width: string }[] = [
  { id: 'desktop', label: 'Desktop', icon: <Monitor size={14} />, width: '100%' },
  { id: 'tablet',  label: 'Tablet',  icon: <Tablet  size={14} />, width: '768px' },
  { id: 'mobile',  label: 'Mobile',  icon: <Smartphone size={14} />, width: '375px' },
];

// ─── Props table ──────────────────────────────────────────────────────────────

function PropsTable({ props }: { props: PropDef[] }) {
  if (!props.length) return <Typography variant="body-sm" className="text-slate-400 italic">No props documented.</Typography>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="text-left py-2 pr-4 font-bold text-slate-500 uppercase tracking-wider text-[10px] w-32">Prop</th>
            <th className="text-left py-2 pr-4 font-bold text-slate-500 uppercase tracking-wider text-[10px] w-48">Type</th>
            <th className="text-left py-2 pr-4 font-bold text-slate-500 uppercase tracking-wider text-[10px] w-24">Default</th>
            <th className="text-left py-2 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Description</th>
          </tr>
        </thead>
        <tbody>
          {props.map(p => (
            <tr key={p.name} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
              <td className="py-2.5 pr-4 align-top">
                <code className="font-mono text-[11px] text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded">
                  {p.name}{p.required && <span className="text-red-500 ml-0.5">*</span>}
                </code>
              </td>
              <td className="py-2.5 pr-4 align-top">
                <code className="font-mono text-[10px] text-purple-700 break-all leading-relaxed">{p.type}</code>
              </td>
              <td className="py-2.5 pr-4 align-top">
                {p.default
                  ? <code className="font-mono text-[10px] text-emerald-700">{p.default}</code>
                  : <span className="text-slate-300">—</span>}
              </td>
              <td className="py-2.5 align-top text-slate-600 leading-relaxed">{p.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-[10px] text-slate-400 mt-2"><span className="text-red-500">*</span> required</p>
    </div>
  );
}

// ─── ComponentDoc ─────────────────────────────────────────────────────────────

type DocTab = 'preview' | 'code' | 'notes';

function ComponentDoc({ entry }: { entry: ComponentEntry }) {
  const [tab, setTab] = useState<DocTab>('preview');
  const [viewport, setViewport] = useState<Viewport>('desktop');
  const highlighted = useMemo(() => highlight(entry.source), [entry.source]);
  const vw = VIEWPORTS.find(v => v.id === viewport)!;
  const { Preview } = entry;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-1">
            <div className="flex items-center gap-3 flex-wrap">
              <Typography variant="h2" className="text-3xl">{entry.name}</Typography>
              <StatusPill status={entry.status} />
            </div>
            <div className="flex items-center gap-2">
              <code className="text-[11px] text-slate-400 font-mono bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                {entry.sourceFile}
              </code>
              <a
                href={`/src/${entry.sourceFile.replace('src/', '')}`}
                className="text-slate-400 hover:text-slate-600 transition-colors"
                title="Open source file"
              >
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {entry.tags.map(t => (
              <span key={t} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full font-medium">
                {t}
              </span>
            ))}
          </div>
        </div>
        <Typography variant="body" className="text-slate-600 max-w-3xl leading-relaxed">
          {entry.description}
        </Typography>
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-0 border-b border-slate-200">
        {(['preview', 'code', 'notes'] as DocTab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2.5 text-sm font-medium capitalize transition-all border-b-2 -mb-px ${
              tab === t
                ? 'text-primary border-primary'
                : 'text-slate-500 border-transparent hover:text-slate-700'
            }`}
          >
            {t === 'code' ? 'Source Code' : t === 'notes' ? 'Docs & Notes' : 'Preview'}
          </button>
        ))}
        {tab === 'preview' && (
          <div className="ml-auto flex items-center gap-1 pb-1">
            {VIEWPORTS.map(v => (
              <button
                key={v.id}
                onClick={() => setViewport(v.id)}
                title={v.label}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                  viewport === v.id
                    ? 'bg-primary text-white'
                    : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                }`}
              >
                {v.icon}
                <span className="hidden sm:inline">{v.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Preview tab */}
      {tab === 'preview' && (
        <div className="space-y-3">
          <div className="flex justify-center transition-all duration-300">
            <div
              style={{ width: vw.width, maxWidth: '100%', transition: 'width 0.25s ease' }}
              className="w-full"
            >
              <div className="min-h-[280px] flex items-center justify-center bg-white rounded-2xl border border-slate-200 shadow-sm p-10 relative overflow-hidden">
                {/* Dot grid background */}
                <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_60%,transparent_100%)] opacity-50 pointer-events-none" />
                <div className="relative z-10 w-full flex items-center justify-center">
                  <Suspense fallback={<div className="text-slate-400 text-sm">Loading…</div>}>
                    <Preview />
                  </Suspense>
                </div>
              </div>
              {viewport !== 'desktop' && (
                <div className="text-center mt-2">
                  <span className="text-[10px] text-slate-400 font-medium">{vw.width} viewport</span>
                </div>
              )}
            </div>
          </div>
          {/* Import snippet */}
          <div className="flex items-center justify-between bg-slate-900 rounded-xl px-5 py-3">
            <code className="text-[11px] text-slate-300 font-mono truncate flex-1 mr-4">{entry.usage}</code>
            <CopyButton text={entry.usage} />
          </div>
        </div>
      )}

      {/* Code tab */}
      {tab === 'code' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-slate-800 rounded-t-xl px-4 py-2.5">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400 opacity-70" />
                <div className="w-3 h-3 rounded-full bg-yellow-400 opacity-70" />
                <div className="w-3 h-3 rounded-full bg-green-400 opacity-70" />
              </div>
              <code className="text-[11px] text-slate-400 ml-2 font-mono">{entry.sourceFile}</code>
            </div>
            <CopyButton text={entry.source} />
          </div>
          <div className="bg-[#0f172a] rounded-b-xl overflow-hidden border border-slate-800 border-t-0 -mt-1">
            <pre
              className="p-6 text-[11.5px] leading-[1.8] overflow-auto max-h-[600px] font-mono"
              dangerouslySetInnerHTML={{ __html: highlighted }}
            />
          </div>
          <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <span className="text-emerald-500">●</span>
            Source is imported directly from the production file via Vite <code className="font-mono text-xs bg-slate-100 px-1 rounded">?raw</code> — always in sync.
          </p>
        </div>
      )}

      {/* Notes tab */}
      {tab === 'notes' && (
        <div className="space-y-8">
          {/* Props */}
          <div className="space-y-3">
            <Typography variant="h3" className="text-lg">Props</Typography>
            <PropsTable props={entry.props} />
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Usability */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <Typography variant="label-micro" className="text-emerald-700">Usability Guidelines</Typography>
              </div>
              <ul className="space-y-2">
                {entry.usability.map((note, i) => (
                  <li key={i} className="text-xs text-slate-600 flex gap-2 leading-relaxed">
                    <span className="text-emerald-400 shrink-0 mt-1">▸</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Accessibility */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-sky-400" />
                <Typography variant="label-micro" className="text-sky-700">Accessibility</Typography>
              </div>
              <ul className="space-y-2">
                {entry.accessibility.map((note, i) => (
                  <li key={i} className="text-xs text-slate-600 flex gap-2 leading-relaxed">
                    <span className="text-sky-400 shrink-0 mt-1">▸</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {entry.keyboard.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <Typography variant="h3" className="text-base">Keyboard Interactions</Typography>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {entry.keyboard.map((k, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <kbd className="shrink-0 mt-px px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono font-bold text-slate-700 shadow-sm whitespace-nowrap">
                        {k.key}
                      </kbd>
                      <span className="text-xs text-slate-600 leading-relaxed">{k.action}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {entry.antiPatterns.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <Typography variant="label-micro" className="text-red-700">Anti-Patterns</Typography>
                </div>
                <ul className="space-y-2">
                  {entry.antiPatterns.map((note, i) => (
                    <li key={i} className="text-xs text-slate-600 flex gap-2 leading-relaxed">
                      <span className="text-red-400 shrink-0 mt-1">✕</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {(entry.relatedComponents.length > 0 || entry.notes) && (
            <>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {entry.relatedComponents.length > 0 && (
                  <div className="space-y-3">
                    <Typography variant="label-micro" className="text-slate-500">Related Components</Typography>
                    <div className="flex flex-wrap gap-2">
                      {entry.relatedComponents.map(r => (
                        <span key={r} className="text-xs px-3 py-1 bg-slate-100 text-slate-600 rounded-full border border-slate-200 hover:bg-slate-200 transition-colors cursor-default">
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {entry.notes && (
                  <div className="space-y-2">
                    <Typography variant="label-micro" className="text-slate-500">Implementation Notes</Typography>
                    <Typography variant="body-sm" className="text-slate-500 italic leading-relaxed">
                      {entry.notes}
                    </Typography>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Design Tokens Page ───────────────────────────────────────────────────────

const TOKENS = {
  colors: [
    { name: '--color-primary', value: '#06302c', label: 'Primary', description: 'Brand teal — main action color' },
    { name: '--color-primary-light', value: '#e8f0ef', label: 'Primary Light', description: 'Tinted primary surface' },
    { name: '--color-success', value: '#388e3c', label: 'Success', description: 'Positive outcomes and completions' },
    { name: '--color-success-mid', value: '#8bc34a', label: 'Success Mid', description: 'Intermediate success state' },
    { name: '--color-success-light', value: '#ecf2eb', label: 'Success Light', description: 'Success background surface' },
    { name: '--color-info', value: '#03a9f4', label: 'Info', description: 'Informational indicators' },
    { name: '--color-info-light', value: '#e9f2f9', label: 'Info Light', description: 'Info background surface' },
    { name: '--color-error', value: '#f44336', label: 'Error', description: 'Errors and critical states' },
    { name: '--color-error-light', value: '#ffd9e8', label: 'Error Light', description: 'Error background surface' },
    { name: '--color-warning', value: '#ff9800', label: 'Warning', description: 'Warnings and cautions' },
    { name: '--color-gray-muted', value: '#b0adad', label: 'Gray Muted', description: 'Disabled text and decorative elements' },
    { name: '--color-gray-light', value: '#f0efef', label: 'Gray Light', description: 'Subtle backgrounds' },
    { name: '--color-text-primary', value: '#0f172a', label: 'Text Primary', description: 'Primary readable text' },
    { name: '--color-text-secondary', value: 'rgba(15,23,42,0.6)', label: 'Text Secondary', description: 'Supporting and metadata text' },
    { name: '--color-divider', value: 'rgba(0,0,0,0.12)', label: 'Divider', description: 'Borders and separators' },
    { name: '--color-workspace-bg', value: '#fcfcfc', label: 'Workspace BG', description: 'Main page background' },
    { name: '--color-surface', value: '#ffffff', label: 'Surface', description: 'Card and modal surfaces' },
    { name: '--color-avatar-bg', value: '#e4e0dc', label: 'Avatar BG', description: 'Fallback avatar background' },
  ],
  typography: [
    { name: '--font-sans', value: 'Poppins', description: 'UI text, labels, body copy' },
    { name: '--font-serif', value: 'Frank Ruhl Libre', description: 'h1 and h2 display headings' },
    { name: '--font-mono', value: 'JetBrains Mono', description: 'Code, IDs, technical labels' },
  ],
  spacing: [
    { token: '1', px: '4px' }, { token: '2', px: '8px' }, { token: '3', px: '12px' },
    { token: '4', px: '16px' }, { token: '5', px: '20px' }, { token: '6', px: '24px' },
    { token: '8', px: '32px' }, { token: '10', px: '40px' }, { token: '12', px: '48px' },
    { token: '16', px: '64px' }, { token: '20', px: '80px' }, { token: '24', px: '96px' },
  ],
  radius: [
    { token: 'rounded', value: '4px' }, { token: 'rounded-md', value: '6px' },
    { token: 'rounded-lg', value: '8px' }, { token: 'rounded-xl', value: '12px' },
    { token: 'rounded-2xl', value: '16px' }, { token: 'rounded-3xl', value: '24px' },
    { token: 'rounded-full', value: '9999px' },
  ],
  shadows: [
    { token: 'shadow-sm', value: '0 1px 2px rgba(0,0,0,0.05)' },
    { token: 'shadow', value: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)' },
    { token: 'shadow-md', value: '0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06)' },
    { token: 'shadow-lg', value: '0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)' },
    { token: 'shadow-xl', value: '0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)' },
    { token: 'shadow-2xl', value: '0 25px 50px rgba(0,0,0,0.25)' },
  ],
  zIndex: [
    { token: 'z-0', value: '0', usage: 'Default stacking' },
    { token: 'z-10', value: '10', usage: 'Dropdowns, popovers' },
    { token: 'z-50', value: '50', usage: 'Navigation bar' },
    { token: 'z-[100]', value: '100', usage: 'Debug menu' },
    { token: 'z-[1000]', value: '1000', usage: 'Modals' },
    { token: 'z-[2000]', value: '2000', usage: 'Toasts, top-level overlays' },
  ],
  motion: [
    { name: 'Modal spring', value: 'type: "spring", damping: 25, stiffness: 300', usage: 'Modal enter/exit' },
    { name: 'Switch spring', value: 'type: "spring", stiffness: 500, damping: 30', usage: 'Switch thumb position' },
    { name: 'Progress ease', value: 'duration: 0.5, ease: "easeOut"', usage: 'Progress bar fill' },
    { name: 'Route fade', value: 'duration: 0.2, opacity + y: 10', usage: 'Page transitions' },
  ],
};

function ColorSwatch({ color }: { color: typeof TOKENS.colors[0] }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(color.value); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  return (
    <div
      className="group cursor-pointer rounded-xl overflow-hidden border border-slate-200 hover:shadow-md transition-all hover:-translate-y-0.5"
      onClick={copy}
      title={`Click to copy: ${color.value}`}
    >
      <div className="h-16 w-full" style={{ backgroundColor: color.value }} />
      <div className="p-3 bg-white space-y-0.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-800">{color.label}</span>
          {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} className="text-slate-300 group-hover:text-slate-500 transition-colors" />}
        </div>
        <code className="text-[10px] text-slate-400 font-mono block truncate">{color.value}</code>
        <p className="text-[10px] text-slate-400 leading-tight">{color.description}</p>
      </div>
    </div>
  );
}

function TokensPage() {
  return (
    <div className="space-y-14">
      <div>
        <Typography variant="h2" className="text-3xl mb-1">Design Tokens</Typography>
        <Typography variant="sub" className="text-slate-500">
          All tokens are defined in <code className="font-mono text-xs bg-slate-100 px-1 rounded">src/index.css</code> using Tailwind 4's <code className="font-mono text-xs bg-slate-100 px-1 rounded">@theme</code> block.
        </Typography>
      </div>

      {/* Colors */}
      <section className="space-y-4">
        <Typography variant="h3">Colors</Typography>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {TOKENS.colors.map(c => <ColorSwatch key={c.name} color={c} />)}
        </div>
      </section>

      {/* Typography */}
      <section className="space-y-4">
        <Typography variant="h3">Type Families</Typography>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {TOKENS.typography.map(t => (
            <div key={t.name} className="p-5 border border-slate-200 rounded-xl bg-white space-y-2">
              <p className="text-2xl text-slate-800" style={{ fontFamily: t.value }}>Aa Bb Cc 123</p>
              <code className="text-[10px] text-slate-400 font-mono block">{t.name}</code>
              <p className="text-xs font-semibold text-slate-700">{t.value}</p>
              <p className="text-[11px] text-slate-400">{t.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Spacing */}
      <section className="space-y-4">
        <Typography variant="h3">Spacing Scale</Typography>
        <div className="space-y-2">
          {TOKENS.spacing.map(s => (
            <div key={s.token} className="flex items-center gap-4">
              <code className="text-[11px] font-mono text-slate-400 w-12 shrink-0">p-{s.token}</code>
              <div className="h-4 bg-primary/80 rounded" style={{ width: s.px }} />
              <span className="text-xs text-slate-500">{s.px}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Border Radius */}
      <section className="space-y-4">
        <Typography variant="h3">Border Radius</Typography>
        <div className="flex flex-wrap gap-4">
          {TOKENS.radius.map(r => (
            <div key={r.token} className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 bg-primary/15 border-2 border-primary/30" style={{ borderRadius: r.value }} />
              <code className="text-[10px] font-mono text-slate-500 text-center">{r.token}</code>
              <span className="text-[10px] text-slate-400">{r.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Shadows */}
      <section className="space-y-4">
        <Typography variant="h3">Shadows</Typography>
        <div className="flex flex-wrap gap-6">
          {TOKENS.shadows.map(s => (
            <div key={s.token} className="flex flex-col items-center gap-3">
              <div className="w-20 h-14 bg-white rounded-xl" style={{ boxShadow: s.value }} />
              <code className="text-[10px] font-mono text-slate-500">{s.token}</code>
            </div>
          ))}
        </div>
      </section>

      {/* Z-Index */}
      <section className="space-y-4">
        <Typography variant="h3">Z-Index Scale</Typography>
        <div className="overflow-x-auto">
          <table className="text-xs w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 pr-6 text-[10px] font-bold uppercase tracking-wider text-slate-500">Token</th>
                <th className="text-left py-2 pr-6 text-[10px] font-bold uppercase tracking-wider text-slate-500">Value</th>
                <th className="text-left py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">Usage</th>
              </tr>
            </thead>
            <tbody>
              {TOKENS.zIndex.map(z => (
                <tr key={z.token} className="border-b border-slate-100 last:border-0">
                  <td className="py-2 pr-6"><code className="font-mono text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">{z.token}</code></td>
                  <td className="py-2 pr-6 font-mono text-slate-600">{z.value}</td>
                  <td className="py-2 text-slate-500">{z.usage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Motion */}
      <section className="space-y-4">
        <Typography variant="h3">Motion & Animations</Typography>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TOKENS.motion.map(m => (
            <div key={m.name} className="p-4 border border-slate-200 rounded-xl bg-white space-y-2">
              <p className="text-xs font-semibold text-slate-700">{m.name}</p>
              <code className="text-[10px] font-mono text-purple-600 block">{m.value}</code>
              <p className="text-[11px] text-slate-400">{m.usage}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ─── Overview Page ────────────────────────────────────────────────────────────

function OverviewPage({ onSelect }: { onSelect: (id: string) => void }) {
  const activeGroups = getActiveGroups();
  return (
    <div className="space-y-12">
      <div>
        <Typography variant="h2" className="text-3xl mb-1">Component Explorer</Typography>
        <Typography variant="sub" className="text-slate-500 max-w-2xl">
          {REGISTRY.length} components across {activeGroups.length} categories. All previews render real production components.
          Source code is auto-linked from the actual files via Vite <code className="font-mono text-xs bg-slate-100 px-1 rounded">?raw</code> imports.
        </Typography>
      </div>
      {activeGroups.map(groupId => {
        const entries = REGISTRY.filter(e => e.group === groupId);
        const group = GROUPS[groupId];
        return (
          <section key={groupId} className="space-y-4">
            <div className="flex items-baseline gap-3">
              <Typography variant="h3">{group.label}</Typography>
              <span className="text-xs text-slate-400">{group.description}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {entries.map(e => (
                <button
                  key={e.id}
                  onClick={() => onSelect(e.id)}
                  className="text-left p-4 border border-slate-200 rounded-xl bg-white hover:border-primary/40 hover:shadow-md transition-all group hover:-translate-y-0.5 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-semibold text-slate-800 group-hover:text-primary transition-colors">{e.name}</span>
                    <StatusPill status={e.status} />
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{e.description}</p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {e.tags.slice(0, 3).map(t => (
                      <span key={t} className="text-[9px] px-1.5 py-0.5 bg-slate-100 text-slate-400 rounded font-medium">{t}</span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({
  activeId,
  onSelect,
  searchQuery,
  onSearchChange,
  isMobileOpen,
  onMobileClose,
}: {
  activeId: string | null;
  onSelect: (id: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}) {
  const activeGroups = getActiveGroups();

  const filteredRegistry = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    return REGISTRY.filter(e =>
      e.name.toLowerCase().includes(q) ||
      e.tags.some(t => t.includes(q)) ||
      e.description.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleSelect = (id: string) => {
    onSelect(id);
    onMobileClose();
  };

  return (
    <>

      <aside className={`
        w-64 shrink-0 bg-white border-r border-slate-200 flex flex-col overflow-y-auto
        ${isMobileOpen ? 'flex' : 'hidden lg:flex'}
      `}>
        {/* Branding */}
        <div className="px-5 py-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <Layers size={14} className="text-white" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-800 leading-none">UI Playground</div>
                <div className="text-[10px] text-slate-400 font-medium mt-0.5">Threadline Design System</div>
              </div>
            </div>
            <button onClick={onMobileClose} className="lg:hidden p-1 text-slate-400 hover:text-slate-600">
              <XIcon size={16} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-3 py-3 shrink-0 border-b border-slate-100">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search components…"
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 text-slate-700 placeholder:text-slate-400"
            />
            {searchQuery && (
              <button onClick={() => onSearchChange('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <XIcon size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2 px-2">
          {filteredRegistry ? (
            /* Search results */
            <div className="space-y-0.5">
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {filteredRegistry.length} result{filteredRegistry.length !== 1 ? 's' : ''}
              </div>
              {filteredRegistry.length === 0 && (
                <div className="px-3 py-4 text-xs text-slate-400 text-center">No components found</div>
              )}
              {filteredRegistry.map(e => (
                <NavItem key={e.id} entry={e} active={activeId === e.id} onSelect={handleSelect} />
              ))}
            </div>
          ) : (
            /* Full tree */
            <>
              <NavSpecial id="overview" label="Overview" icon={<Box size={13} />} active={activeId === 'overview'} onSelect={handleSelect} />
              <NavSpecial id="tokens" label="Design Tokens" icon={<Palette size={13} />} active={activeId === 'tokens'} onSelect={handleSelect} />
              <div className="my-2 mx-2 border-t border-slate-100" />
              {activeGroups.map(groupId => {
                const entries = REGISTRY.filter(e => e.group === groupId);
                const group = GROUPS[groupId];
                return (
                  <div key={groupId} className="mb-1">
                    <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {group.label}
                    </div>
                    {entries.map(e => (
                      <NavItem key={e.id} entry={e} active={activeId === e.id} onSelect={handleSelect} />
                    ))}
                  </div>
                );
              })}
            </>
          )}
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-slate-100 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[10px] text-slate-400">{REGISTRY.length} components registered</span>
          </div>
        </div>
      </aside>
    </>
  );
}

function NavSpecial({ id, label, icon, active, onSelect }: { id: string; label: string; icon: React.ReactNode; active: boolean; onSelect: (id: string) => void }) {
  return (
    <button
      onClick={() => onSelect(id)}
      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
        active ? 'bg-primary/10 text-primary font-semibold' : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      <span className={active ? 'text-primary' : 'text-slate-400'}>{icon}</span>
      {label}
    </button>
  );
}

function NavItem({ entry, active, onSelect }: { entry: ComponentEntry; active: boolean; onSelect: (id: string) => void }) {
  return (
    <button
      onClick={() => onSelect(entry.id)}
      className={`w-full flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
        active ? 'bg-primary/10 text-primary font-semibold' : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      <span className="truncate">{entry.name}</span>
      {entry.status !== 'stable' && <StatusPill status={entry.status} />}
    </button>
  );
}

// ─── PlaygroundShell ──────────────────────────────────────────────────────────

export function PlaygroundShell() {
  const [activeId, setActiveId] = useState<string>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeEntry = useMemo(
    () => REGISTRY.find(e => e.id === activeId) ?? null,
    [activeId]
  );

  return (
    <div className="flex bg-[#f8f9fa]" style={{ height: '100dvh', overflow: 'hidden' }}>
      <Sidebar
        activeId={activeId}
        onSelect={setActiveId}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isMobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main content — scrolls independently */}
      <div className="flex-1 min-w-0 overflow-y-auto flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-10 shrink-0 bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 py-3 flex items-center gap-4">
          <button
            onClick={() => setMobileOpen(v => !v)}
            className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
          >
            <Layers size={18} />
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-slate-500 min-w-0">
            <button onClick={() => setActiveId('overview')} className="hover:text-primary transition-colors font-medium shrink-0">
              Playground
            </button>
            {activeId !== 'overview' && (
              <>
                <ChevronRight size={14} className="shrink-0" />
                {activeId === 'tokens' ? (
                  <span className="text-slate-700 font-medium">Design Tokens</span>
                ) : activeEntry ? (
                  <>
                    <span className="text-slate-400 hidden sm:inline">{GROUPS[activeEntry.group]?.label}</span>
                    <ChevronRight size={14} className="shrink-0 hidden sm:block" />
                    <span className="text-slate-700 font-medium truncate">{activeEntry.name}</span>
                  </>
                ) : null}
              </>
            )}
          </div>

          {/* Quick search on desktop */}
          <div className="ml-auto hidden md:flex items-center gap-3">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Jump to component…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => { if (searchQuery) setActiveId('overview'); }}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white w-48 text-slate-700 placeholder:text-slate-400"
              />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="px-6 md:px-10 py-8 max-w-5xl mx-auto">
          {activeId === 'overview' && (
            <OverviewPage onSelect={setActiveId} />
          )}
          {activeId === 'tokens' && (
            <TokensPage />
          )}
          {activeEntry && activeId !== 'overview' && activeId !== 'tokens' && (
            <ComponentDoc entry={activeEntry} />
          )}
        </main>
      </div>
    </div>
  );
}
