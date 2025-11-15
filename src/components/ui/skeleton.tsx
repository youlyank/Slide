'use client'

import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse',
        'bg-gray-200 dark:bg-gray-700',
        'rounded-md',
        className
      )}
    />
  )
}

interface SlideSkeletonProps {
  className?: string
}

export function SlideSkeleton({ className = '' }: SlideSkeletonProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <Skeleton className="h-8 w-full mb-4" />
      <Skeleton className="h-32 w-full" />
    </div>
  )
}

interface TextSkeletonProps {
  lines?: number
  className?: string
}

export function TextSkeleton({ lines = 3, className = '' }: TextSkeletonProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className="h-4 w-full" />
      ))}
    </div>
  )
}

export function CardSkeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={cn('rounded-lg border border-gray-200 dark:border-gray-700 p-6', className)}>
      <Skeleton className="h-6 w-1/2 mb-4" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <Skeleton className="h-20 w-full" />
    </div>
  )
}