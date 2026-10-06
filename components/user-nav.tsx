"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/context/auth-context";
import { LogOut, Phone, User, Edit3 } from "lucide-react";
import Link from "next/link";
import { TextureButton } from "@/components/ui/texture-button";
import { VerifiedBadge } from "@/components/ui/verified-badge";

export function UserNav() {
  const { user, loading, signOut } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="size-8 rounded-full bg-muted/60 animate-pulse border border-border shrink-0" />
    );
  }

  if (!user) {
    return (
      <Link href="/login" className="shrink-0 inline-block">
        <TextureButton
          size="sm"
          className="shadow-2xs font-semibold"
        >
          Login
        </TextureButton>
      </Link>
    );
  }

  // User is logged in
  const displayName =
    user.displayName ||
    user.email?.split("@")[0] ||
    user.phoneNumber ||
    "User";

  const identifier = user.email || user.phoneNumber || "";

  return (
    <div ref={menuRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setIsDropdownOpen((prev) => !prev)}
        className="flex items-center gap-1.5 p-0.5 rounded-full border border-border/80 hover:border-primary/50 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40"
        title={displayName}
      >
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={displayName}
            referrerPolicy="no-referrer"
            className="size-7 sm:size-8 rounded-full object-cover"
          />
        ) : (
          <div className="size-7 sm:size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase">
            {user.phoneNumber ? (
              <Phone className="size-3.5" />
            ) : (
              displayName.charAt(0)
            )}
          </div>
        )}
      </button>

      {/* Profile Dropdown */}
      {isDropdownOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border bg-popover text-popover-foreground shadow-xl z-50 p-1.5 animate-in fade-in-50 zoom-in-95 duration-150">
          {/* User Info Header */}
          <div className="px-3 py-2 border-b border-border/60">
            <div className="flex items-center gap-1.5 min-w-0">
              <p className="text-xs font-bold text-foreground truncate">
                {displayName}
              </p>
              <VerifiedBadge className="size-3.5 shrink-0" />
              <span className="text-[9.5px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 leading-none shrink-0">
                Pro
              </span>
            </div>
            {identifier && (
              <p className="text-[11px] text-muted-foreground truncate font-mono mt-0.5">
                {identifier}
              </p>
            )}
          </div>


          {/* Navigation Links */}
          <div className="py-1">
            <Link
              href="/dashboard/profile"
              onClick={() => setIsDropdownOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-foreground/90 hover:text-foreground hover:bg-muted/70 transition-colors font-medium group"
            >
              <User className="size-3.5 text-blue-500 group-hover:scale-110 transition-transform shrink-0" />
              <span>My Profile</span>
            </Link>
            <Link
              href="/dashboard/profile/edit"
              onClick={() => setIsDropdownOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-foreground/90 hover:text-foreground hover:bg-muted/70 transition-colors font-medium group"
            >
              <Edit3 className="size-3.5 text-muted-foreground group-hover:scale-110 transition-transform shrink-0" />
              <span>Edit Profile</span>
            </Link>
          </div>

          {/* Sign Out Button */}
          <div className="pt-1 border-t border-border/60">
            <button
              type="button"
              onClick={async () => {
                setIsDropdownOpen(false);
                await signOut();
              }}
              className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer text-left font-medium"
            >
              <LogOut className="size-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
