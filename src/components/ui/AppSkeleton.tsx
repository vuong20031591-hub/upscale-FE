
import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Props for Skeleton component.
 */
interface SkeletonProps {
  /** Width of skeleton (CSS value or preset) */
  width?: string | 'full' | 'half' | 'quarter';
  
  /** Height of skeleton (CSS value or preset) */
  height?: string | 'sm' | 'md' | 'lg' | 'xl';
  
  /** Shape of skeleton */
  shape?: 'rectangle' | 'circle' | 'rounded';
  
  /** Additional CSS classes */
  className?: string;
  
  /** Number of lines (for text skeleton) */
  lines?: number;
  
  /** Animation type */
  animation?: 'pulse' | 'wave' | 'none';
}

/**
 * Skeleton Component
 * 
 * Loading placeholder component với animation.
 * 
 * Features:
 * - Multiple shapes: rectangle, circle, rounded
 * - Preset sizes for common use cases
 * - Multiple lines support for text skeletons
 * - Pulse and wave animations
 * - Dark mode support
 * - Fully customizable with className
 * 
 * @example Basic usage
 * ```tsx
 * <Skeleton width="full" height="md" />
 * ```
 * 
 * @example Circle avatar
 * ```tsx
 * <Skeleton shape="circle" width="64px" height="64px" />
 * ```
 * 
 * @example Text lines
 * ```tsx
 * <Skeleton lines={3} />
 * ```
 * 
 * Requirements: 7.5
 */
export function Skeleton({
  width = 'full',
  height = 'md',
  shape = 'rounded',
  className,
  lines,
  animation = 'pulse',
}: SkeletonProps) {
  // Width presets
  const widthClasses = {
    full: 'w-full',
    half: 'w-1/2',
    quarter: 'w-1/4',
  };

  // Height presets
  const heightClasses = {
    sm: 'h-4',
    md: 'h-6',
    lg: 'h-8',
    xl: 'h-12',
  };

  // Shape classes
  const shapeClasses = {
    rectangle: 'rounded-none',
    circle: 'rounded-full',
    rounded: 'rounded-lg',
  };

  // Animation classes
  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 bg-[length:200%_100%]',
    none: '',
  };

  // Get width class
  const widthClass = typeof width === 'string' && width in widthClasses
    ? widthClasses[width as keyof typeof widthClasses]
    : '';

  // Get height class
  const heightClass = typeof height === 'string' && height in heightClasses
    ? heightClasses[height as keyof typeof heightClasses]
    : '';

  // Base skeleton classes
  const baseClasses = cn(
    'bg-slate-200 dark:bg-slate-700',
    shapeClasses[shape],
    animationClasses[animation],
    widthClass,
    heightClass,
    className
  );

  // Custom inline styles for non-preset values
  const style: React.CSSProperties = {
    ...(typeof width === 'string' && !(width in widthClasses) ? { width } : {}),
    ...(typeof height === 'string' && !(height in heightClasses) ? { height } : {}),
  };

  // Render multiple lines if specified
  if (lines && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              baseClasses,
              // Last line is shorter
              index === lines - 1 && 'w-3/4'
            )}
            style={style}
          />
        ))}
      </div>
    );
  }

  // Single skeleton
  return <div className={baseClasses} style={style} />;
}

/**
 * SkeletonImage Component
 * 
 * Skeleton loader specifically for images with aspect ratio.
 * 
 * @example
 * ```tsx
 * <SkeletonImage aspectRatio="square" />
 * <SkeletonImage aspectRatio="video" />
 * ```
 */
interface SkeletonImageProps {
  /** Aspect ratio preset */
  aspectRatio?: 'square' | 'video' | 'portrait' | 'landscape';
  
  /** Additional CSS classes */
  className?: string;
  
  /** Animation type */
  animation?: 'pulse' | 'wave' | 'none';
}

export function SkeletonImage({
  aspectRatio = 'square',
  className,
  animation = 'pulse',
}: SkeletonImageProps) {
  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]',
  };

  return (
    <Skeleton
      width="full"
      height="full"
      shape="rounded"
      animation={animation}
      className={cn(aspectRatioClasses[aspectRatio], className)}
    />
  );
}

/**
 * SkeletonText Component
 * 
 * Skeleton loader for text content with multiple lines.
 * 
 * @example
 * ```tsx
 * <SkeletonText lines={3} />
 * ```
 */
interface SkeletonTextProps {
  /** Number of text lines */
  lines?: number;
  
  /** Additional CSS classes */
  className?: string;
}

export function SkeletonText({ lines = 3, className }: SkeletonTextProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          width={index === lines - 1 ? '75%' : 'full'}
          height="sm"
          shape="rounded"
        />
      ))}
    </div>
  );
}

/**
 * SkeletonCard Component
 * 
 * Skeleton loader for card-like content.
 * 
 * @example
 * ```tsx
 * <SkeletonCard />
 * ```
 */
interface SkeletonCardProps {
  /** Show image skeleton */
  showImage?: boolean;
  
  /** Number of text lines */
  lines?: number;
  
  /** Additional CSS classes */
  className?: string;
}

export function SkeletonCard({
  showImage = true,
  lines = 3,
  className,
}: SkeletonCardProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {showImage && <SkeletonImage aspectRatio="video" />}
      <div className="space-y-2">
        <Skeleton width="75%" height="lg" />
        <SkeletonText lines={lines} />
      </div>
    </div>
  );
}
