// Enables importing `.astro` components in plain TypeScript contexts
// (e.g. `tsc`, typescript-eslint, editors without the Astro language server
// active for a given file) without the "Cannot find module './X.astro' or its
// corresponding type declarations" error.
//
// The Astro language server (VS Code extension / `astro check`) provides richer
// per-file types for `.astro` imports on its own; this is only a fallback so that
// generic TypeScript tooling can resolve the `.astro` module extension.
declare module '*.astro' {
  import type { AstroComponentFactory } from 'astro/runtime/server';

  const Component: AstroComponentFactory;

  export default Component;
}
