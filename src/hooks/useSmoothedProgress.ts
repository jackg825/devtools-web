'use client'

import { useRef, useSyncExternalStore, useCallback, useEffect } from 'react'

/**
 * Easing function for smooth deceleration
 */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

/**
 * Hook that smoothly interpolates progress values using requestAnimationFrame.
 * Prevents jarring jumps when progress callbacks are sparse.
 *
 * @param targetProgress - The actual progress value (0-100)
 * @param duration - Animation duration in ms (default: 400)
 * @returns Smoothed progress value for display
 */
export function useSmoothedProgress(
  targetProgress: number,
  duration: number = 400
): number {
  const displayProgressRef = useRef(0)
  const animationRef = useRef<number | null>(null)
  const startProgressRef = useRef(0)
  const startTimeRef = useRef(0)
  const subscribersRef = useRef(new Set<() => void>())

  const subscribe = useCallback((callback: () => void) => {
    subscribersRef.current.add(callback)
    return () => subscribersRef.current.delete(callback)
  }, [])

  const getSnapshot = useCallback(() => displayProgressRef.current, [])

  const notifySubscribers = useCallback(() => {
    subscribersRef.current.forEach((callback) => callback())
  }, [])

  // Handle animation in effect to comply with React Compiler rules
  useEffect(() => {
    // Cancel any ongoing animation
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }

    // Reset when target goes to 0
    if (targetProgress === 0) {
      displayProgressRef.current = 0
      startProgressRef.current = 0
      notifySubscribers()
      return
    }

    // Don't animate backwards
    if (targetProgress <= displayProgressRef.current) {
      return
    }

    // Start animation
    startProgressRef.current = displayProgressRef.current
    startTimeRef.current = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)
      const eased = easeOutCubic(progress)

      displayProgressRef.current =
        startProgressRef.current + (targetProgress - startProgressRef.current) * eased
      notifySubscribers()

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        animationRef.current = null
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
    }
  }, [targetProgress, duration, notifySubscribers])

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}
