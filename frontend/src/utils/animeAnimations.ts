import { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';

/**
 * Anime.js v4 Fluid Animation Engine for Carthage Fitness Club
 * Pure luxury motion inspired by https://animejs.com/documentation
 */

export const animateEntrance = (
  targets: string | Element | Element[] | NodeListOf<Element>,
  options: {
    delay?: number;
    staggerDelay?: number;
    duration?: number;
    translateY?: number;
    ease?: string;
  } = {}
) => {
  const {
    delay = 0,
    staggerDelay = 50,
    duration = 750,
    translateY = 20,
    ease = 'outExpo',
  } = options;

  try {
    return animate(targets, {
      opacity: [0, 1],
      translateY: [translateY, 0],
      duration,
      ease,
      delay: stagger(staggerDelay, { start: delay }),
    });
  } catch (err) {
    console.warn('Anime.js entrance animation error:', err);
  }
};

export const animateElevation = (
  target: Element | null,
  isElevated: boolean,
  options: { translateY?: number; duration?: number } = {}
) => {
  if (!target) return;
  const { translateY = -4, duration = 300 } = options;
  try {
    return animate(target, {
      translateY: isElevated ? translateY : 0,
      duration,
      ease: 'outCubic',
    });
  } catch (err) {
    console.warn('Anime.js elevation error:', err);
  }
};

export const animateCounter = (
  from: number,
  to: number,
  onUpdate: (current: number) => void,
  options: { duration?: number; ease?: string } = {}
) => {
  const { duration = 1000, ease = 'outExpo' } = options;
  const state = { value: from };
  try {
    return animate(state, {
      value: to,
      duration,
      ease,
      onUpdate: () => {
        onUpdate(state.value);
      },
    });
  } catch {
    onUpdate(to);
  }
};

export const animatePulse = (target: Element | null) => {
  if (!target) return;
  try {
    return animate(target, {
      scale: [1, 1.03, 1],
      duration: 600,
      ease: 'outQuad',
    });
  } catch (err) {
    console.warn('Anime.js pulse error:', err);
  }
};

/**
 * React Hook to trigger staggered fluid entrance with Anime.js v4
 */
export const useAnimeEntrance = <T extends HTMLElement = HTMLDivElement>(
  selector = '.anime-item',
  deps: unknown[] = []
) => {
  const containerRef = useRef<T>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const items = containerRef.current.querySelectorAll(selector);
    if (items.length > 0) {
      animateEntrance(items, {
        staggerDelay: 45,
        translateY: 18,
        duration: 700,
        ease: 'outExpo',
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return containerRef;
};
