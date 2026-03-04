import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CloudConnection, TickCircle, CloseCircle } from "iconsax-react";
import type { CloudProviderType, CloudProviderCredentialInput } from "@stacklane/shared";
import {
  useTestCloudConnection,
  useCreateCloudProvider,
} from "../hooks/use-cloud-providers";
import { CustomDialog } from "@/components/ui/custom-dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const awsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  provider: z.literal("aws"),
  awsAccessKeyId: z.string().min(1, "Access Key ID is required"),
  awsSecretAccessKey: z.string().min(1, "Secret Access Key is required"),
  awsRegion: z.string().min(1, "Region is required"),
});

const digitaloceanSchema = z.object({
  name: z.string().min(1, "Name is required"),
  provider: z.literal("digitalocean"),
  digitaloceanToken: z.string().min(1, "API Token is required"),
});

type AWSFormValues = z.infer<typeof awsSchema>;
type DigitalOceanFormValues = z.infer<typeof digitaloceanSchema>;
type FormValues = AWSFormValues | DigitalOceanFormValues;

const providerInfo: Record<CloudProviderType, { name: string; docs: string }> = {
  aws: {
    name: "Amazon Web Services",
    docs: "Create an IAM user with EC2 and S3 read permissions",
  },
  gcp: {
    name: "Google Cloud Platform",
    docs: "Create a service account with Compute Engine and Storage permissions",
  },
  azure: {
    name: "Microsoft Azure",
    docs: "Create an App Registration with VM and Storage permissions",
  },
  digitalocean: {
    name: "DigitalOcean",
    docs: "Generate a Personal Access Token with read scope",
  },
  linode: {
    name: "Linode",
    docs: "Create a Personal Access Token with Linodes and Object Storage read-only access",
  },
  hetzner: {
    name: "Hetzner Cloud",
    docs: "Generate an API token from the Hetzner Cloud Console",
  },
  vultr: {
    name: "Vultr",
    docs: "Create an API key from the Vultr account settings",
  },
};

interface CloudProviderConnectDialogProps {
  open: boolean;
  onClose: () => void;
  provider: CloudProviderType | null;
  onSuccess?: (credentialId: string) => void;
}

export function CloudProviderConnectDialog({
  open,
  onClose,
  provider,
  onSuccess,
}: CloudProviderConnectDialogProps) {
  const [step, setStep] = useState<"info" | "form">("info");
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const testMutation = useTestCloudConnection();
  const createMutation = useCreateCloudProvider();

  const getSchema = () => {
    if (provider === "aws") return awsSchema;
    if (provider === "digitalocean") return digitaloceanSchema;
    return awsSchema; // fallback
  };

  const {
    register,
    handleSubmit,
    control,
    reset,
    getValues,
    trigger,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(getSchema()),
    defaultValues: {
      name: "",
      provider: provider || "aws",
    } as any,
  });

  const handleClose = () => {
    setStep("info");
    setTestResult(null);
    reset();
    onClose();
  };

  const handleTestConnection = async () => {
    const valid = await trigger();
    if (!valid) return;

    setTestResult(null);
    const data = getValues();

    testMutation.mutate(
      {
        provider: data.provider,
        credentials: data,
      },
      {
        onSuccess: (res) => {
          if (res.data) {
            setTestResult({
              success: res.data.success,
              message: res.data.message,
            });
          }
        },
        onError: () => {
          setTestResult({ success: false, message: "Connection test failed" });
        },
      }
    );
  };

  const onSubmit = handleSubmit((data) => {
    const input: CloudProviderCredentialInput = data as any;

    createMutation.mutate(input, {
      onSuccess: (res) => {
        if (res.data) {
          handleClose();
          onSuccess?.(res.data.id);
        }
      },
    });
  });

  if (!provider) return null;

  const info = providerInfo[provider];

  if (step === "info") {
    return (
      <CustomDialog
        open={open}
        onOpenChange={(v) => !v && handleClose()}
        title={`Connect to ${info.name}`}
        footer={
          <div className="flex w-full justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={() => setStep("form")}>Continue</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
            <CloudConnection size={24} color="currentColor" className="text-primary mt-0.5" />
            <div className="space-y-2 flex-1">
              <h3 className="font-semibold">Connect Your Cloud Account</h3>
              <p className="text-sm text-muted-foreground">
                Connect your {info.name} account to automatically discover and import your
                servers and storage.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <h4 className="text-sm font-medium">What you'll get:</h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                <li>Automatic discovery of all compute instances (EC2, VMs, Droplets)</li>
                <li>Automatic discovery of storage buckets (S3, Spaces)</li>
                <li>One-click import of selected resources</li>
                <li>Keep your infrastructure in sync</li>
              </ul>
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-medium">What you'll need:</h4>
              <p className="text-sm text-muted-foreground">{info.docs}</p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <p className="text-sm text-blue-600 dark:text-blue-400">
              💡 <strong>Secure:</strong> Your credentials are stored locally and never leave
              your machine. They're only used to communicate directly with your cloud provider.
            </p>
          </div>
        </div>
      </CustomDialog>
    );
  }

  return (
    <CustomDialog
      open={open}
      onOpenChange={(v) => !v && handleClose()}
      title={`Connect ${info.name}`}
      footer={
        <form onSubmit={onSubmit} className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleTestConnection}
              isLoading={testMutation.isPending}
            >
              Test Connection
            </Button>
            {testResult && (
              <span
                className={`flex items-center gap-1 text-xs ${
                  testResult.success ? "text-emerald-500" : "text-destructive"
                }`}
              >
                {testResult.success ? (
                  <TickCircle size={14} color="currentColor" />
                ) : (
                  <CloseCircle size={14} color="currentColor" />
                )}
                {testResult.message}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setStep("info")}>
              Back
            </Button>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" isLoading={createMutation.isPending}>
              Connect & Discover
            </Button>
          </div>
        </form>
      }
    >
      <FieldGroup>
        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor="name">Account Name</FieldLabel>
          <Input
            id="name"
            placeholder={`My ${info.name} Account`}
            {...register("name")}
          />
          <FieldError errors={[errors.name]} />
          <p className="text-xs text-muted-foreground mt-1">
            A friendly name to identify this account
          </p>
        </Field>

        {provider === "aws" && (
          <>
            <Field data-invalid={!!(errors as any).awsAccessKeyId}>
              <FieldLabel htmlFor="awsAccessKeyId">AWS Access Key ID</FieldLabel>
              <Input
                id="awsAccessKeyId"
                placeholder="AKIAIOSFODNN7EXAMPLE"
                {...register("awsAccessKeyId")}
              />
              <FieldError errors={[(errors as any).awsAccessKeyId]} />
            </Field>

            <Field data-invalid={!!(errors as any).awsSecretAccessKey}>
              <FieldLabel htmlFor="awsSecretAccessKey">AWS Secret Access Key</FieldLabel>
              <Input
                id="awsSecretAccessKey"
                type="password"
                placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
                {...register("awsSecretAccessKey")}
              />
              <FieldError errors={[(errors as any).awsSecretAccessKey]} />
            </Field>

            <Field data-invalid={!!(errors as any).awsRegion}>
              <FieldLabel htmlFor="awsRegion">Default Region</FieldLabel>
              <Input
                id="awsRegion"
                placeholder="us-east-1"
                {...register("awsRegion")}
              />
              <FieldError errors={[(errors as any).awsRegion]} />
              <p className="text-xs text-muted-foreground mt-1">
                Will discover resources in all regions, but this is the default
              </p>
            </Field>
          </>
        )}

        {provider === "digitalocean" && (
          <Field data-invalid={!!(errors as any).digitaloceanToken}>
            <FieldLabel htmlFor="digitaloceanToken">Personal Access Token</FieldLabel>
            <Textarea
              id="digitaloceanToken"
              placeholder="dop_v1_..."
              className="font-mono text-sm"
              {...register("digitaloceanToken")}
            />
            <FieldError errors={[(errors as any).digitaloceanToken]} />
            <p className="text-xs text-muted-foreground mt-1">
              Generate from: API → Tokens/Keys → Personal Access Tokens
            </p>
          </Field>
        )}
      </FieldGroup>
    </CustomDialog>
  );
}
