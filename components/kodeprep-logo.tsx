import Link from "next/link";

export interface KodePrepLogoProps {
  className?: string;
  imageClassName?: string;
}

export function KodePrepLogo({ className, imageClassName }: KodePrepLogoProps) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center group select-none shrink-0 ${className ?? ""}`}
    >
      <img
        src="/logos/algoryn-logo-light.png"
        alt="Algoryn"
        className={`h-6 sm:h-7 w-auto object-contain object-left dark:hidden group-hover:scale-105 transition-transform ${imageClassName ?? ""}`}
      />
      <img
        src="/logos/algoryn-logo-dark.png"
        alt="Algoryn"
        className={`h-6 sm:h-7 w-auto object-contain object-left hidden dark:block group-hover:scale-105 transition-transform ${imageClassName ?? ""}`}
      />
    </Link>
  );
}

export function KodePrepLogoIcon({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center group select-none shrink-0 ${className ?? ""}`}
    >
      <img
        src="/logos/algoryn-logo-light.png"
        alt="Algoryn Icon"
        className={`h-5.5 sm:h-6 w-auto object-contain object-left dark:hidden group-hover:scale-105 transition-transform ${className ?? ""}`}
      />
      <img
        src="/logos/algoryn-logo-dark.png"
        alt="Algoryn Icon"
        className={`h-5.5 sm:h-6 w-auto object-contain object-left hidden dark:block group-hover:scale-105 transition-transform ${className ?? ""}`}
      />
    </Link>
  );
}


