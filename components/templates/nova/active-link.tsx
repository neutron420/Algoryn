import Link from 'next/link';
import React from 'react';
import { cn } from '@/lib/utils';

export interface ActiveLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
}

export function ActiveLink({ href, children, className, external }: ActiveLinkProps) {
  const isExternal = external || href.startsWith('http') || href.startsWith('mailto:');
  
  if (isExternal) {
    return (
      <a
        href={href}
        target={href.startsWith('mailto:') ? undefined : '_blank'}
        rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
        className={cn('inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground', className)}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={cn('inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground', className)}
    >
      {children}
    </Link>
  );
}

export default ActiveLink;
