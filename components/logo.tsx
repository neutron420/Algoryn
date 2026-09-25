import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn('inline-flex items-center shrink-0 group', className)}>
      <img
        src="/logos/algorynlog.png"
        alt="Algoryn"
        className="size-full object-contain transition-transform group-hover:scale-105"
      />
    </Link>
  );
}
