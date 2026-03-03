export type AppCategory =
  | "Web Server"
  | "Database"
  | "Runtime"
  | "DevTools"
  | "Security"
  | "Container"
  | "Self-Hosted Apps"
  | "Monitoring"
  | "Automation"
  | "AI / ML";

interface BaseField {
  id: string;
  label: string;
  description?: string;
  required?: boolean;
  defaultValue?: string;
  placeholder?: string;
}

interface TextField extends BaseField {
  type: "text";
}

interface PasswordField extends BaseField {
  type: "password";
}

interface NumberField extends BaseField {
  type: "number";
}

interface SelectField extends BaseField {
  type: "select";
  options: { label: string; value: string }[];
}

export type AppField = TextField | PasswordField | NumberField | SelectField;

export interface InstallableApp {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  category: AppCategory;
  fields: AppField[];
  dependencies: string[];
  /** Universal install script (curl, docker, binary download). Fallback when no distro matches scripts. */
  script: string;
  /** Per-distro install scripts. The resolver generates distro-detection shell code. */
  scripts?: {
    /** Debian, Ubuntu */
    apt?: string;
    /** RHEL 8+, Fedora, Amazon Linux 2023+ */
    dnf?: string;
    /** CentOS 7, Amazon Linux 2 (auto-derived from dnf if omitted) */
    yum?: string;
  };
  /** Shell command to check if already installed. Skips install when this exits 0. */
  check?: string;
}
