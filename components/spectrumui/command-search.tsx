"use client";

import * as React from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CornerDownLeft,
  Search,
  SearchX,
} from "lucide-react";

import { cn } from "@/lib/utils";

import { useTypewriter } from "@/components/spectrumui/use-typewriter";

export interface CommandSearchItem {
  id?: string | number;
  label: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  slug?: string;
  value?: string;
  onSelect?: () => void;
}

export interface CommandSearchGroup {
  label: string;
  items: CommandSearchItem[];
}

export interface CommandSearchProps {
  /** Static or controlled text for the search field. */
  query?: string;
  /** Callback when query changes. */
  onQueryChange?: (query: string) => void;
  /** Queries the palette types out and live-filters by when input is empty. */
  queries?: string[];
  /** Type the queries automatically and filter results as they type. */
  autoType?: boolean;
  placeholder?: string;
  /** Grouped results rendered below the search field. */
  groups?: CommandSearchGroup[];
  /** Called with the item when a row is clicked or Enter is pressed. */
  onSelect?: (item: CommandSearchItem) => void;
  /** Fixed height of the palette. Content overflows are clipped like a real palette. */
  height?: number | string;
  className?: string;
  /** Whether to allow real interactive typing with an input element. Default true. */
  interactive?: boolean;
  /** Auto-focus the search input on mount. Default true. */
  autoFocus?: boolean;
  /** Called when Escape is pressed or close action triggered. */
  onClose?: () => void;
}

const DEFAULT_QUERIES = ["anim", "chart", "dialog", "side"];

const DEFAULT_GROUPS: CommandSearchGroup[] = [
  {
    label: "Pages",
    items: [
      { label: "Animated Drawer" },
      { label: "Docs" },
      { label: "Components" },
      { label: "Blocks" },
      { label: "Charts" },
      { label: "Directory" },
      { label: "Create" },
    ],
  },
  {
    label: "Components",
    items: [
      { label: "Accordion" },
      { label: "Alert" },
      { label: "Alert Dialog" },
      { label: "Animated Beam" },
      { label: "Avatar" },
      { label: "Badge" },
      { label: "Breadcrumb" },
      { label: "Button" },
      { label: "Calendar" },
      { label: "Card" },
      { label: "Carousel" },
      { label: "Chart" },
      { label: "Checkbox" },
      { label: "Combobox" },
      { label: "Command" },
      { label: "Dialog" },
      { label: "Drawer" },
      { label: "Dropdown Menu" },
      { label: "Input" },
      { label: "Navigation Menu" },
      { label: "Popover" },
      { label: "Select" },
      { label: "Sidebar" },
      { label: "Table" },
      { label: "Tabs" },
      { label: "Tooltip" },
    ],
  },
];

const ROW_SPRING = { type: "spring", stiffness: 420, damping: 34 } as const;

function Caret() {
  return (
    <motion.span
      aria-hidden
      className="ml-[2px] h-[18px] w-[1.5px] shrink-0 rounded-full bg-foreground"
      animate={{ opacity: [1, 1, 0, 0] }}
      transition={{ duration: 1.1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
    />
  );
}

export function CommandSearch({
  query,
  onQueryChange,
  queries,
  autoType = true,
  placeholder = "Search…",
  groups = DEFAULT_GROUPS,
  onSelect,
  height = 420,
  className,
  interactive = true,
  autoFocus = true,
  onClose,
}: CommandSearchProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const inView = useInView(rootRef, { margin: "-10% 0px" });

  const [internalQuery, setInternalQuery] = React.useState(query ?? "");
  const isControlled = query !== undefined;
  const currentQuery = isControlled ? query : internalQuery;

  const { text: typed } = useTypewriter(queries ?? DEFAULT_QUERIES, {
    typeMs: 140,
    deleteMs: 70,
    holdMs: 2400,
    gapMs: 800,
    enabled: autoType && inView && !currentQuery,
  });

  const displayQuery = currentQuery || (autoType ? typed : "");
  const needle = currentQuery
    ? currentQuery.trim().toLowerCase()
    : autoType
    ? typed.trim().toLowerCase()
    : "";

  const filteredGroups = React.useMemo(
    () =>
      groups
        .map((group) => ({
          ...group,
          items: needle
            ? group.items.filter((item) => {
                const labelMatch = item.label.toLowerCase().includes(needle);
                const valMatch = item.value?.toLowerCase().includes(needle);
                const slugMatch = item.slug?.toLowerCase().includes(needle);
                return labelMatch || valMatch || slugMatch;
              })
            : group.items,
        }))
        .filter((group) => group.items.length > 0),
    [groups, needle],
  );

  const flatItems = React.useMemo(
    () => filteredGroups.flatMap((group) => group.items),
    [filteredGroups],
  );

  // The highlight tracks item identity (label), never a numeric index, so it
  // stays correct while rows animate in and out. When the hovered row is
  // filtered away it falls back to the first visible row — no state resets.
  const [hoveredLabel, setHoveredLabel] = React.useState<string | null>(null);
  const visibleLabels = React.useMemo(
    () => new Set(flatItems.map((i) => i.label)),
    [flatItems],
  );
  const activeLabel =
    hoveredLabel && visibleLabels.has(hoveredLabel)
      ? hoveredLabel
      : flatItems[0]?.label ?? null;

  // The highlight is ONE persistent element positioned in the list container,
  // re-measured from the DOM whenever the active row or the filter changes.
  const rowRefs = React.useRef(new Map<string, HTMLButtonElement>());
  const [pillY, setPillY] = React.useState<number | null>(null);

  React.useLayoutEffect(() => {
    const row = activeLabel ? rowRefs.current.get(activeLabel) : undefined;
    const next = row ? row.offsetTop : null;
    setPillY((prev) => (prev === next ? prev : next));
  }, [activeLabel, filteredGroups]);

  const handleSelect = React.useCallback(
    (item: CommandSearchItem) => {
      item.onSelect?.();
      onSelect?.(item);
    },
    [onSelect],
  );

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement | HTMLInputElement>) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose?.();
        return;
      }

      if (flatItems.length === 0) return;

      const currentIndex = Math.max(
        0,
        flatItems.findIndex((item) => item.label === activeLabel),
      );

      if (event.key === "ArrowDown") {
        event.preventDefault();
        const next = flatItems[(currentIndex + 1) % flatItems.length];
        if (next) {
          setHoveredLabel(next.label);
          rowRefs.current.get(next.label)?.scrollIntoView({ block: "nearest" });
        }
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        const prev =
          flatItems[(currentIndex - 1 + flatItems.length) % flatItems.length];
        if (prev) {
          setHoveredLabel(prev.label);
          rowRefs.current.get(prev.label)?.scrollIntoView({ block: "nearest" });
        }
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        const selected = flatItems[currentIndex] ?? flatItems[0];
        if (selected) handleSelect(selected);
      }
    },
    [activeLabel, flatItems, handleSelect, onClose],
  );

  const activeOptionId = activeLabel
    ? `command-search-option-${activeLabel.replace(/\s+/g, "-").toLowerCase()}`
    : undefined;

  return (
    <div
      ref={rootRef}
      tabIndex={interactive ? -1 : 0}
      role="listbox"
      aria-label="Command search"
      aria-activedescendant={activeOptionId}
      onKeyDown={interactive ? undefined : handleKeyDown}
      className={cn(
        "relative flex w-full flex-col overflow-hidden rounded-[14px] bg-card p-2 pb-11 outline-hidden",
        "border border-border shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_0_0_1px_rgba(10,10,10,0.05)]",
        "dark:bg-neutral-950 dark:shadow-[0_1px_3px_0_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.12)]",
        className,
      )}
      style={{ height }}
    >
      {/* Search field */}
      <div className="flex h-10 shrink-0 items-center gap-2.5 rounded-lg border border-border bg-neutral-100/70 px-3 transition-colors focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 dark:bg-neutral-900/60">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <div className="relative flex min-w-0 flex-1 items-center font-inter text-sm">
          {interactive ? (
            <input
              ref={inputRef}
              autoFocus={autoFocus}
              type="text"
              value={currentQuery}
              onChange={(e) => {
                const val = e.target.value;
                if (!isControlled) setInternalQuery(val);
                onQueryChange?.(val);
              }}
              onKeyDown={handleKeyDown}
              placeholder={
                autoType && typed && !currentQuery
                  ? `Search ${typed}...`
                  : placeholder
              }
              className="w-full bg-transparent text-sm font-medium text-foreground outline-hidden placeholder:text-muted-foreground/60"
            />
          ) : (
            <div className="flex min-w-0 flex-1 items-center text-foreground">
              <span className="whitespace-pre">{displayQuery}</span>
              <Caret />
              {!displayQuery ? (
                <span className="ml-1 truncate text-muted-foreground/60">
                  {placeholder}
                </span>
              ) : null}
            </div>
          )}
        </div>
        {currentQuery ? (
          <button
            type="button"
            onClick={() => {
              if (!isControlled) setInternalQuery("");
              onQueryChange?.("");
              inputRef.current?.focus();
            }}
            className="flex h-5 w-5 items-center justify-center rounded-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground text-xs transition-colors cursor-pointer"
            title="Clear search"
          >
            ✕
          </button>
        ) : (
          <kbd className="hidden sm:inline-flex text-[10px] text-muted-foreground font-mono bg-muted/70 border border-border px-1.5 py-0.5 rounded pointer-events-none">
            ESC
          </kbd>
        )}
      </div>

      {/* Results — filtering is instant; highlight pill glides smoothly */}
      <div
        className="relative flex-1 overflow-y-auto overflow-x-hidden pt-1"
        onMouseLeave={() => setHoveredLabel(null)}
      >
        <motion.span
          aria-hidden
          initial={false}
          animate={{
            y: pillY ?? 0,
            opacity: pillY === null ? 0 : 1,
          }}
          transition={{ type: "spring", stiffness: 420, damping: 36 }}
          className="pointer-events-none absolute inset-x-1 top-0 h-10 rounded-lg bg-neutral-200/60 dark:bg-neutral-800/70"
        />

        {filteredGroups.map((group) => (
          <div key={group.label} className="mb-2">
            <p className="px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {group.label}
            </p>
            {group.items.map((item) => {
              const active = item.label === activeLabel;
              return (
                <motion.button
                  key={`${group.label}-${item.label}`}
                  id={`command-search-option-${item.label.replace(/\s+/g, "-").toLowerCase()}`}
                  ref={(el) => {
                    if (el) rowRefs.current.set(item.label, el);
                    else rowRefs.current.delete(item.label);
                  }}
                  type="button"
                  role="option"
                  aria-selected={active}
                  tabIndex={-1}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setHoveredLabel(item.label)}
                  onFocus={() => setHoveredLabel(item.label)}
                  whileTap={{ scale: 0.985 }}
                  className="relative flex h-10 w-full items-center justify-between rounded-lg px-3 text-left outline-hidden cursor-pointer select-none"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <motion.span
                      animate={{ x: active ? 2 : 0 }}
                      transition={ROW_SPRING}
                      className="shrink-0 text-muted-foreground [&_svg]:h-4 [&_svg]:w-4"
                    >
                      {item.icon ?? <ArrowRight className="h-4 w-4" />}
                    </motion.span>
                    <span
                      className={cn(
                        "truncate text-sm font-medium leading-5 transition-colors duration-150",
                        active
                          ? "text-neutral-900 dark:text-neutral-100 font-semibold"
                          : "text-neutral-700 dark:text-neutral-300",
                      )}
                    >
                      <Highlighted label={item.label} needle={needle} />
                    </span>
                  </span>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    {item.badge}
                    <CornerDownLeft
                      className={cn(
                        "h-3.5 w-3.5 transition-opacity duration-150 hidden sm:inline",
                        active
                          ? "text-foreground opacity-90"
                          : "text-muted-foreground opacity-30",
                      )}
                    />
                  </div>
                </motion.button>
              );
            })}
          </div>
        ))}

        <AnimatePresence>
          {filteredGroups.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="flex flex-col items-center gap-2 pt-12 text-center"
            >
              <SearchX className="h-6 w-6 text-muted-foreground/60" />
              <p className="text-sm text-muted-foreground">
                No results for&nbsp;
                <span className="font-medium text-foreground">
                  “{displayQuery}”
                </span>
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Footer hints */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex h-11 items-center gap-2 rounded-b-[14px] border-t border-border bg-neutral-50 px-4 dark:bg-neutral-900/70">
        <kbd className="flex h-[22px] w-[22px] items-center justify-center rounded-md border border-border bg-white dark:bg-neutral-900 shadow-2xs">
          <ArrowUp className="h-3 w-3 text-muted-foreground" />
        </kbd>
        <kbd className="flex h-[22px] w-[22px] items-center justify-center rounded-md border border-border bg-white dark:bg-neutral-900 shadow-2xs">
          <ArrowDown className="h-3 w-3 text-muted-foreground" />
        </kbd>
        <span className="font-inter text-xs font-medium text-[#71717a] dark:text-neutral-400">
          Navigate
        </span>
        <kbd className="ml-2 flex h-[22px] w-[22px] items-center justify-center rounded-md border border-border bg-white dark:bg-neutral-900 shadow-2xs">
          <CornerDownLeft className="h-3 w-3 text-muted-foreground" />
        </kbd>
        <span className="font-inter text-xs font-medium text-[#71717a] dark:text-neutral-400">
          Select
        </span>

        {onClose && (
          <div className="ml-auto flex items-center gap-1.5">
            <kbd className="flex h-[22px] px-1.5 items-center justify-center rounded-md border border-border bg-white dark:bg-neutral-900 shadow-2xs text-[10px] font-mono text-muted-foreground">
              ESC
            </kbd>
            <span className="font-inter text-xs font-medium text-[#71717a] dark:text-neutral-400">
              Close
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function Highlighted({ label, needle }: { label: string; needle: string }) {
  if (!needle) return <>{label}</>;
  const start = label.toLowerCase().indexOf(needle);
  if (start === -1) return <>{label}</>;
  const end = start + needle.length;
  return (
    <>
      {label.slice(0, start)}
      <span className="rounded-[3px] bg-amber-200/60 dark:bg-amber-400/25 px-0.5 text-amber-950 dark:text-amber-200 font-semibold">
        {label.slice(start, end)}
      </span>
      {label.slice(end)}
    </>
  );
}
