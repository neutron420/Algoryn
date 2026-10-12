import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn('inline-flex items-center shrink-0 group', className)}>
      <img
        src="/logos/algoryn-logo-light.png"
        alt="Algoryn"
        className="size-full object-contain dark:hidden transition-transform group-hover:scale-105"
      />
      <img
        src="/logos/algoryn-logo-dark.png"
        alt="Algoryn"
        className="size-full object-contain hidden dark:block transition-transform group-hover:scale-105"
      />
    </Link>
  );
}
