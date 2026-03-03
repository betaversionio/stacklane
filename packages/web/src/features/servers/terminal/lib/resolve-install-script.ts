import type { InstallableApp } from "./app-catalog.types";
import { appCatalogMap } from "./app-catalog";

/**
 * Build the effective shell script for a single app entry.
 *
 * - If `scripts` is provided, generates `if apt-get … elif dnf … elif yum … fi`.
 *   `yum` is auto-derived from `dnf` when omitted (replaces "sudo dnf" → "sudo yum").
 *   `script` is used as the `else` fallback for unrecognised distros.
 * - If only `script` is provided, it's used as-is (curl / docker / binary download).
 * - If `check` is provided, the install block is wrapped in a skip-if-exists guard.
 */
function buildAppScript(app: InstallableApp): string {
  let install: string;

  if (app.scripts) {
    const { apt, dnf, yum } = app.scripts;
    // Auto-derive yum from dnf by swapping the binary name
    const yumCmd = yum ?? dnf?.replace(/\bsudo dnf\b/g, "sudo yum");

    const branches: string[] = [];
    if (apt) branches.push(`command -v apt-get &>/dev/null; then ${apt}`);
    if (dnf) branches.push(`command -v dnf &>/dev/null; then ${dnf}`);
    if (yumCmd && yumCmd !== dnf)
      branches.push(`command -v yum &>/dev/null; then ${yumCmd}`);

    if (branches.length > 0) {
      // First branch gets "if", the rest get "elif"
      install = "if " + branches[0];
      for (let i = 1; i < branches.length; i++) {
        install += "; elif " + branches[i];
      }
      if (app.script) install += `; else ${app.script}`;
      install += "; fi";
    } else {
      install = app.script;
    }
  } else {
    install = app.script;
  }

  if (app.check && install) {
    return `if ${app.check} &>/dev/null; then true; else ${install}; fi`;
  }

  return install;
}

/**
 * Resolves the full install script for an app, including dependency scripts.
 * Dependencies are resolved depth-first with circular-dependency protection.
 */
export function resolveInstallScript(
  app: InstallableApp,
  formValues: Record<string, string>,
): string {
  const visited = new Set<string>();
  const parts: string[] = [];

  function resolve(current: InstallableApp) {
    if (visited.has(current.id)) return;
    visited.add(current.id);

    // Resolve dependencies first (depth-first)
    for (const depId of current.dependencies) {
      const dep = appCatalogMap.get(depId);
      if (dep) resolve(dep);
    }

    const built = buildAppScript(current);
    if (built) parts.push(built);
  }

  resolve(app);

  let script = parts.join(" && ");

  // Replace {{var}} placeholders with escaped form values
  script = script.replace(/\{\{(\w+)\}\}/g, (_match, key: string) => {
    const value = formValues[key] ?? "";
    // Escape single quotes in values to prevent shell injection
    return value.replace(/'/g, "'\\''");
  });

  return script;
}
