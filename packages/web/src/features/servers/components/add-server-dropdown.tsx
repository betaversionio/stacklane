import { Add, CloudConnection, DocumentUpload, Setting2 } from "iconsax-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useConnectionDialog } from "./connection-dialog-context";
import type { CloudProvider } from "./provider-dialog";

interface ProviderMenuItemProps {
  provider: CloudProvider;
  iconSlug: string;
  label: string;
  onClick: (provider: CloudProvider) => void;
}

function ProviderMenuItem({ provider, iconSlug, label, onClick }: ProviderMenuItemProps) {
  return (
    <DropdownMenuItem onClick={() => onClick(provider)}>
      <img
        src={`https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/${iconSlug}.svg`}
        alt={label}
        className="w-4 h-4 mr-2 opacity-70 dark:invert dark:brightness-0"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
          const fallback = e.currentTarget.nextElementSibling;
          if (fallback) (fallback as HTMLElement).style.display = 'block';
        }}
      />
      <CloudConnection size={16} color="currentColor" className="mr-2 hidden" />
      {label}
    </DropdownMenuItem>
  );
}

const CLOUD_PROVIDERS = [
  { provider: "aws" as const, iconSlug: "amazonaws", label: "Amazon Web Services (AWS)" },
  { provider: "gcp" as const, iconSlug: "googlecloud", label: "Google Cloud Platform (GCP)" },
  { provider: "azure" as const, iconSlug: "microsoftazure", label: "Microsoft Azure" },
  { provider: "digitalocean" as const, iconSlug: "digitalocean", label: "DigitalOcean" },
  { provider: "linode" as const, iconSlug: "linode", label: "Linode (Akamai)" },
  { provider: "hetzner" as const, iconSlug: "hetzner", label: "Hetzner Cloud" },
  { provider: "vultr" as const, iconSlug: "vultr", label: "Vultr" },
];

export function AddServerDropdown() {
  const { openAddDialog, openCloudProviderConnect, openSSHConfigImport } = useConnectionDialog();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          <Add size={18} color="currentColor" />
          Add Server
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Add New Server</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={openAddDialog}>
          <Setting2 size={16} color="currentColor" className="mr-2" />
          Manual Configuration
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Quick Connect
        </DropdownMenuLabel>

        {CLOUD_PROVIDERS.map((item) => (
          <ProviderMenuItem
            key={item.provider}
            provider={item.provider}
            iconSlug={item.iconSlug}
            label={item.label}
            onClick={openCloudProviderConnect}
          />
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={openSSHConfigImport}>
          <DocumentUpload size={16} color="currentColor" className="mr-2" />
          Import SSH Config
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
