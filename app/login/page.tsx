"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/context/auth-context";
import { Loader2 } from "lucide-react";
import { KodePrepLogo } from "@/components/kodeprep-logo";

export default function LoginPage() {
  const { user, loading, signInWithGoogle, signInWithGithub } = useAuth();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [activeProvider, setActiveProvider] = useState<"google" | "github" | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setActiveProvider("google");
      setErrorMsg("");
      await signInWithGoogle(true);
      router.push("/dashboard");
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg("Google sign-in was cancelled or failed. Please try again.");
    } finally {
      setIsLoading(false);
      setActiveProvider(null);
    }
  };

  const handleGithubLogin = async () => {
    try {
      setIsLoading(true);
      setActiveProvider("github");
      setErrorMsg("");
      await signInWithGithub(true);
      router.push("/dashboard");
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg("GitHub sign-in was cancelled or failed. Please try again.");
    } finally {
      setIsLoading(false);
      setActiveProvider(null);
    }
  };

  if (user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f3f4f6] dark:bg-neutral-950">
        <div className="size-7 rounded-full border-2 border-orange-500/20 border-t-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] dark:bg-neutral-900 flex items-center justify-center transition-colors duration-200">
      <div className="bg-[#f3f4f6] dark:bg-neutral-950 w-screen min-h-screen md:h-screen p-4 sm:p-6 md:p-4 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden border border-neutral-200/50 dark:border-neutral-800/50 gap-4 md:gap-3">
        
        {/* ========================================================================= */}
        {/* LEFT ARTWORK HERO CONTAINER (Ditto Minifolio: rounded-[10px], Sunset Glow) */}
        {/* ========================================================================= */}
        <div className="hidden md:flex md:w-1/2 md:h-full rounded-[10px] bg-neutral-950 text-white p-8 md:p-12 flex-col justify-between relative overflow-hidden select-none z-10">
          
          {/* Sunset Flame Gradient */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, #0a0402 0%, #2b0d02 18%, #c23c0a 42%, #f0821f 60%, #fbc48a 78%, #fdf3e7 94%)",
            }}
          />

          {/* Central Warm Orange Glow */}
          <div className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-orange-500/40 blur-[110px] pointer-events-none" />

          {/* Bottom Ambient White Glow */}
          <div className="absolute left-[15%] bottom-[8%] w-[260px] h-[260px] rounded-full bg-white/15 blur-[100px] pointer-events-none" />

          {/* Stipple / Dot Texture */}
          <div
            className="absolute inset-0 opacity-[0.06] mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
              backgroundSize: "3px 3px",
            }}
          />

          {/* Artwork Top Bar */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="text-[12px] text-white/50 font-medium tracking-tight">@algoryn</span>
            <div className="flex items-center gap-2.5 text-[10px] uppercase tracking-[0.25em] text-white/50 font-medium">
              <span>© 2026</span>
            </div>
          </div>

          {/* Artwork Hero Title */}
          <div className="relative z-10 max-w-md">
            <h2
              className="font-instrument text-4xl lg:text-5xl leading-[1.05] tracking-[-0.035em] text-white !font-normal"
              style={{
                fontFamily: "var(--font-instrument), var(--font-heading), sans-serif",
                fontWeight: 400,
              }}
            >
              Prepare smarter,<br />crack your{" "}
              <span className="italic font-light text-white/90">interviews.</span>
            </h2>
            <p className="mt-4 text-sm text-white/70 font-semibold leading-relaxed max-w-[280px]">
              Master company-specific interview problems with real-time visual progress. Fast, focused, and 100% free.
            </p>
          </div>

          {/* Artwork Bottom Divider */}
          <div className="relative z-10 space-y-3">
            <div className="h-px w-full bg-white/15" />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT LOGIN FORM CONTAINER (Ditto Minifolio: Crisp Rectangular Buttons)    */}
        {/* ========================================================================= */}
        <div className="flex-1 min-h-[calc(100vh-2rem)] md:min-h-0 md:h-full flex flex-col justify-between p-4 sm:p-8 md:p-14 relative z-10">
          
          {/* Top Bar: Brand Logo & Back to workspace */}
          <div className="flex justify-between items-center w-full z-20">
            <KodePrepLogo imageClassName="h-6 sm:h-7" />

            <Link
              href="/"
              className="text-xs text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors font-medium select-none"
            >
              Back to workspace
            </Link>
          </div>

          {/* Form Box in Center */}
          <div className="w-full max-w-[380px] mx-auto my-auto py-8">
            <h1
              className="font-instrument text-3xl sm:text-4xl md:text-[2.25rem] leading-[1.1] tracking-[-0.035em] text-neutral-900 dark:text-white !font-normal"
              style={{
                fontFamily: "var(--font-instrument), var(--font-heading), sans-serif",
                fontWeight: 400,
                letterSpacing: "-0.035em",
                lineHeight: 1.1,
              }}
            >
              Sign in to your workspace
            </h1>
            <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-normal">
              Check your problem-solving progress and streak stats in real time.
            </p>

            {/* Error Message if any */}
            {errorMsg && (
              <div className="mt-4 p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs text-center font-medium">
                {errorMsg}
              </div>
            )}

            {/* Google Login Button: Zero curve, completely rectangular */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="mt-8 sm:mt-10 w-full flex items-center justify-center gap-3 py-3.5 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 font-medium text-sm rounded-none cursor-pointer border border-transparent transition-colors duration-150 disabled:opacity-50 select-none shadow-xs"
            >
              {isLoading && activeProvider === "google" ? (
                <Loader2 className="w-4.5 h-4.5 animate-spin text-amber-500" />
              ) : (
                <svg
                  className="w-4.5 h-4.5 shrink-0"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              Continue with Google
            </button>

            {/* GitHub Login Button: Zero curve, completely rectangular */}
            <button
              type="button"
              onClick={handleGithubLogin}
              disabled={isLoading}
              className="mt-3 w-full flex items-center justify-center gap-3 py-3.5 bg-transparent hover:bg-neutral-200/50 dark:hover:bg-neutral-900 text-neutral-800 dark:text-neutral-200 font-medium text-sm rounded-none cursor-pointer border border-neutral-300 dark:border-neutral-800 transition-colors duration-150 disabled:opacity-50 select-none shadow-xs"
            >
              {isLoading && activeProvider === "github" ? (
                <Loader2 className="w-4.5 h-4.5 animate-spin text-amber-500" />
              ) : (
                <svg className="w-4.5 h-4.5 shrink-0 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              )}
              Continue with GitHub
            </button>
          </div>

          {/* Bottom Copyright */}
          <p className="text-[11px] text-neutral-400 dark:text-neutral-600 text-center select-none pt-4">
            © 2026 Algoryn
          </p>
        </div>

      </div>
    </div>
  );
}
