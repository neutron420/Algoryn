"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Search, Star } from "lucide-react";
import { CompanyLogo } from "@/components/company-logo";
import { useTargetCompanies } from "@/lib/hooks/use-target-companies";
import { useTypewriter } from "@/components/spectrumui/use-typewriter";
import {
  CommandSearch,
  CommandSearchGroup,
  CommandSearchItem,
} from "@/components/spectrumui/command-search";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export interface NavbarCompanyItem {
  id: number;
  name: string;
  slug: string;
  problemCount: number;
}

interface NavbarSearchProps {
  companies: NavbarCompanyItem[];
  currentCompanySlug?: string;
}

export function NavbarSearch({ companies, currentCompanySlug }: NavbarSearchProps) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const { targets } = useTargetCompanies();

  // Keyboard shortcut Ctrl/Cmd + K
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelect = (slug: string) => {
    setOpen(false);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("company-switch-start", { detail: slug }));
    }
    router.push(`/dashboard?company=${slug}`);
  };

  // Typewriter queries generated dynamically from top companies
  const typewriterQueries = React.useMemo(() => {
    if (!companies || companies.length === 0) {
      return ["Google", "Meta", "Amazon", "Uber", "Apple", "Netflix", "Microsoft"];
    }
    return companies.slice(0, 8).map((c) => c.name);
  }, [companies]);

  const { text: typedText } = useTypewriter(typewriterQueries, {
    typeMs: 120,
    deleteMs: 60,
    holdMs: 2200,
    gapMs: 800,
    enabled: !open,
  });

  // Split into pinned targets and other companies for the CommandSearch palette
  const groups: CommandSearchGroup[] = React.useMemo(() => {
    const targetSet = new Set(targets.map((t) => t.toLowerCase()));
    const targetItems: CommandSearchItem[] = [];
    const otherItems: CommandSearchItem[] = [];

    companies.forEach((company) => {
      const isTarget = targetSet.has(company.slug.toLowerCase());
      const isCurrent = company.slug === currentCompanySlug;

      const item: CommandSearchItem = {
        id: company.id,
        label: company.name,
        slug: company.slug,
        value: `${company.name} ${company.slug}`,
        icon: (
          <CompanyLogo
            name={company.name}
            className="size-5 rounded-md text-[10px] shrink-0 shadow-2xs"
          />
        ),
        badge: (
          <div className="flex items-center gap-1.5">
            {isTarget && (
              <Star className="size-3.5 text-amber-500 fill-amber-400 shrink-0" />
            )}
            {isCurrent && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium hidden sm:inline">
                Active
              </span>
            )}
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-secondary text-muted-foreground font-mono">
              {company.problemCount} Qs
            </span>
          </div>
        ),
      };

      if (isTarget) {
        targetItems.push(item);
      } else {
        otherItems.push(item);
      }
    });

    const list: CommandSearchGroup[] = [];
    if (targetItems.length > 0) {
      list.push({
        label: "Target Companies",
        items: targetItems,
      });
    }
    list.push({
      label: targetItems.length > 0 ? "All Companies" : "Companies",
      items: otherItems,
    });

    return list;
  }, [companies, targets, currentCompanySlug]);

  return (
    <>
      {/* Spectrum UI Navbar Search Trigger Bar */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search companies"
        className="group relative flex h-8.5 sm:h-9 items-center gap-2.5 rounded-lg border border-border/80 bg-muted/40 hover:bg-muted/70 hover:border-primary/40 px-3 transition-all duration-150 cursor-pointer text-muted-foreground text-xs shadow-2xs hover:shadow-xs w-[170px] xs:w-[200px] sm:w-[240px] md:w-[280px] min-w-0"
      >
        <Search className="size-3.5 sm:size-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
        <div className="flex min-w-0 flex-1 items-center overflow-hidden text-left font-normal text-xs">
          <span className="truncate text-muted-foreground/80 group-hover:text-foreground transition-colors">
            Search <span className="font-medium text-foreground">{typedText || "companies"}</span>
          </span>
          <motion.span
            aria-hidden
            className="ml-0.5 h-3.5 w-[1.5px] shrink-0 rounded-full bg-primary"
            animate={{ opacity: [1, 1, 0, 0] }}
            transition={{ duration: 1.1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
          />
        </div>
        <kbd className="hidden sm:inline-flex shrink-0 ml-auto items-center text-[10px] text-muted-foreground font-mono bg-background/80 border border-border/80 px-1.5 py-0.5 rounded shadow-2xs group-hover:border-primary/30 group-hover:text-foreground transition-colors pointer-events-none">
          ⌘K
        </kbd>
      </button>

      {/* Spectrum UI Command Search Dialog Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className="top-14 sm:top-24 sm:-translate-y-0 max-w-xl p-0 border-border rounded-[16px] overflow-hidden shadow-2xl bg-card"
        >
          <DialogHeader className="sr-only">
            <DialogTitle>Search Companies</DialogTitle>
            <DialogDescription>
              Quickly find and switch between target and top companies
            </DialogDescription>
          </DialogHeader>

          <CommandSearch
            queries={typewriterQueries}
            placeholder="Search companies by name or slug..."
            groups={groups}
            height={440}
            onSelect={(item) => handleSelect(item.slug || item.label.toLowerCase())}
            onClose={() => setOpen(false)}
            autoFocus={true}
            interactive={true}
            className="border-0 shadow-none drop-shadow-none rounded-[16px]"
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
