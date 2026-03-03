import { useState } from "react";
import { ArrowLeft, AlertTriangle, Download, Package } from "lucide-react";
import type { InstallableApp } from "../lib/app-catalog.types";
import { appCatalogMap } from "../lib/app-catalog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

function AppIcon({ src, name }: { src: string; name: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="h-10 w-10 flex items-center justify-center rounded-md bg-muted shrink-0">
        <Package className="h-5 w-5 text-muted-foreground" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      className="h-10 w-10 rounded-md shrink-0"
      onError={() => setFailed(true)}
    />
  );
}

interface AppInstallFormProps {
  app: InstallableApp;
  onBack: () => void;
  onInstall: (app: InstallableApp, values: Record<string, string>) => void;
}

export function AppInstallForm({ app, onBack, onInstall }: AppInstallFormProps) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {};
    for (const field of app.fields) {
      if (field.defaultValue) defaults[field.id] = field.defaultValue;
    }
    return defaults;
  });

  const allRequiredFilled = app.fields
    .filter((f) => f.required)
    .every((f) => values[f.id]?.trim());

  const depNames = app.dependencies
    .map((id) => appCatalogMap.get(id)?.name ?? id)
    .filter(Boolean);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <Button variant="ghost" size="icon-sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium">Install App</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* App info */}
        <div className="flex items-start gap-3">
          <AppIcon src={app.iconUrl} name={app.name} />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium">{app.name}</h3>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                {app.category}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {app.description}
            </p>
          </div>
        </div>

        {/* Dependency warning */}
        {depNames.length > 0 && (
          <div className="flex items-start gap-2 rounded-md border border-yellow-500/30 bg-yellow-500/5 p-3">
            <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
            <div className="text-xs text-yellow-500">
              <span className="font-medium">Requires:</span>{" "}
              {depNames.join(", ")}. Dependencies will be installed
              automatically if not already present.
            </div>
          </div>
        )}

        {/* Form fields */}
        {app.fields.length > 0 && (
          <div className="space-y-3">
            {app.fields.map((field) => (
              <div key={field.id} className="space-y-1.5">
                <Label htmlFor={field.id} className="text-xs">
                  {field.label}
                  {field.required && (
                    <span className="text-destructive ml-0.5">*</span>
                  )}
                </Label>
                {field.description && (
                  <p className="text-[11px] text-muted-foreground">
                    {field.description}
                  </p>
                )}

                {field.type === "select" ? (
                  <Select
                    value={values[field.id] ?? ""}
                    onValueChange={(v) =>
                      setValues((prev) => ({ ...prev, [field.id]: v }))
                    }
                  >
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder={field.placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : field.type === "password" ? (
                  <PasswordInput
                    id={field.id}
                    className="h-9 text-sm"
                    placeholder={field.placeholder}
                    value={values[field.id] ?? ""}
                    onChange={(e) =>
                      setValues((prev) => ({
                        ...prev,
                        [field.id]: e.target.value,
                      }))
                    }
                  />
                ) : (
                  <Input
                    id={field.id}
                    type={field.type === "number" ? "number" : "text"}
                    className="h-9 text-sm"
                    placeholder={field.placeholder}
                    value={values[field.id] ?? ""}
                    onChange={(e) =>
                      setValues((prev) => ({
                        ...prev,
                        [field.id]: e.target.value,
                      }))
                    }
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Install button */}
      <div className="p-4 border-t border-border">
        <Button
          className="w-full"
          disabled={!allRequiredFilled}
          onClick={() => onInstall(app, values)}
        >
          <Download className="h-4 w-4 mr-2" />
          Install {app.name}
        </Button>
      </div>
    </div>
  );
}
