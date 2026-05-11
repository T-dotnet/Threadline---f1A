/**
 * StyleGuide — entry point for the /playground route.
 *
 * Delegates all rendering to PlaygroundShell which provides the full
 * component explorer, design token viewer, and source-linked documentation.
 *
 * The shell renders its own full-page layout (sidebar + main content),
 * so App.tsx must suppress the global Navbar when this route is active.
 * That is already handled by the `isPlayground` guard in App.tsx.
 */

export { PlaygroundShell as StyleGuide } from './PlaygroundShell';
