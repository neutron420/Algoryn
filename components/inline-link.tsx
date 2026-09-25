import Link from 'next/link';
import { cn } from '@/lib/utils';
import React from 'react';

export interface InlineLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function InlineLink({ href, children, className, ...props }: InlineLinkProps) {
  const isExternal = href.startsWith('http') || href.startsWith('mailto:');
  if (isExternal) {
    return (
      <a
        href={href}
        target={href.startsWith('mailto:') ? undefined : '_blank'}
        rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
        className={cn('text-muted-foreground transition-colors hover:text-foreground', className)}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={cn('text-muted-foreground transition-colors hover:text-foreground', className)}
      {...props}
    >
      {children}
    </Link>
  );
}
