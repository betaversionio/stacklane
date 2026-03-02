import type { ReactNode } from "react";
import { HambergerMenu } from "iconsax-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/layout/sidebar/sidebar-context";
import { HeaderActions } from "@/components/layout/header-actions";

export function PageHeader({ children }: { children?: ReactNode }) {
  const { setMobileOpen } = useSidebar();

  return (
    <header className="flex items-center justify-between h-14 px-6 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <HambergerMenu size={20} color="currentColor" />
        </Button>
        {children}
      </div>
      <HeaderActions />
    </header>
  );
}
