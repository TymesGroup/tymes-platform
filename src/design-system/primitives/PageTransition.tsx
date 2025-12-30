/**
 * PageTransition Component
 *
 * Subtle fade + slide animation for page transitions.
 * Automatically respects user's prefers-reduced-motion setting.
 * Use with React Router or similar for smooth page changes.
 *
 * @component
 * @example
 * // Basic page transition
 * <PageTransition transitionKey={location.pathname}>
 *   <Routes>
 *     <Route path="/" element={<Home />} />
 *     <Route path="/about" element={<About />} />
 *   </Routes>
 * </PageTransition>
 *
 * @example
 * // With custom duration
 * <PageTransition transitionKey={currentTab} duration={300}>
 *   {renderTabContent()}
 * </PageTransition>
 */

import React, { useEffect, useState } from 'react';
import { useReducedMotion } from '../../lib/hooks/useReducedMotion';

export interface PageTransitionProps {
  /** Content to animate */
  children: React.ReactNode;
  /**
   * Unique key to trigger animation on change.
   * When this value changes, content fades out and back in.
   */
  transitionKey?: string;
  /**
   * Total animation duration in milliseconds.
   * Fade out takes half, fade in takes half.
   * @default 200
   */
  duration?: number;
  /** Additional CSS classes for the container */
  className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  transitionKey,
  duration = 200,
  className = '',
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);
  const [currentKey, setCurrentKey] = useState(transitionKey);

  useEffect(() => {
    if (transitionKey !== currentKey) {
      // Fade out
      setIsVisible(false);

      const timeout = setTimeout(
        () => {
          setCurrentKey(transitionKey);
          setIsVisible(true);
        },
        prefersReducedMotion ? 0 : duration / 2
      );

      return () => clearTimeout(timeout);
    } else {
      // Initial mount
      setIsVisible(true);
    }
  }, [transitionKey, currentKey, duration, prefersReducedMotion]);

  // Skip animation if user prefers reduced motion
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
        transition: `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`,
      }}
    >
      {children}
    </div>
  );
};

/**
 * FadeIn Component
 *
 * Simple fade-in animation on mount.
 * Useful for staggered list animations or revealing content.
 * Respects user's prefers-reduced-motion setting.
 *
 * @component
 * @example
 * // Basic fade in
 * <FadeIn>
 *   <Card>Content appears with fade</Card>
 * </FadeIn>
 *
 * @example
 * // Staggered list animation
 * {items.map((item, index) => (
 *   <FadeIn key={item.id} delay={index * 50}>
 *     <ListItem item={item} />
 *   </FadeIn>
 * ))}
 *
 * @example
 * // Slow fade with custom duration
 * <FadeIn duration={500} delay={200}>
 *   <HeroSection />
 * </FadeIn>
 */
export interface FadeInProps {
  /** Content to animate */
  children: React.ReactNode;
  /**
   * Delay before animation starts in milliseconds.
   * Useful for staggered animations.
   * @default 0
   */
  delay?: number;
  /**
   * Animation duration in milliseconds.
   * @default 200
   */
  duration?: number;
  /** Additional CSS classes for the container */
  className?: string;
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  duration = 200,
  className = '',
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timeout);
  }, [delay]);

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transition: `opacity ${duration}ms ease-out`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

/**
 * SlideIn Component
 *
 * Slide-in animation from specified direction on mount.
 * Combines opacity fade with directional movement.
 * Respects user's prefers-reduced-motion setting.
 *
 * @component
 * @example
 * // Slide up (default)
 * <SlideIn>
 *   <Card>Slides up into view</Card>
 * </SlideIn>
 *
 * @example
 * // Slide from right
 * <SlideIn direction="right" distance={24}>
 *   <Sidebar />
 * </SlideIn>
 *
 * @example
 * // Slide down with delay
 * <SlideIn direction="down" delay={100}>
 *   <DropdownMenu />
 * </SlideIn>
 *
 * @example
 * // Staggered cards from left
 * {cards.map((card, i) => (
 *   <SlideIn key={card.id} direction="left" delay={i * 75}>
 *     <FeatureCard {...card} />
 *   </SlideIn>
 * ))}
 */
export interface SlideInProps {
  /** Content to animate */
  children: React.ReactNode;
  /**
   * Direction from which content slides in
   * - `up`: Slides from below (default)
   * - `down`: Slides from above
   * - `left`: Slides from right
   * - `right`: Slides from left
   * @default 'up'
   */
  direction?: 'up' | 'down' | 'left' | 'right';
  /**
   * Delay before animation starts in milliseconds.
   * @default 0
   */
  delay?: number;
  /**
   * Animation duration in milliseconds.
   * @default 200
   */
  duration?: number;
  /**
   * Distance to travel in pixels.
   * @default 16
   */
  distance?: number;
  /** Additional CSS classes for the container */
  className?: string;
}

export const SlideIn: React.FC<SlideInProps> = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 200,
  distance = 16,
  className = '',
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timeout);
  }, [delay]);

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const getTransform = () => {
    if (isVisible) return 'translate(0, 0)';

    switch (direction) {
      case 'up':
        return `translateY(${distance}px)`;
      case 'down':
        return `translateY(-${distance}px)`;
      case 'left':
        return `translateX(${distance}px)`;
      case 'right':
        return `translateX(-${distance}px)`;
      default:
        return 'translate(0, 0)';
    }
  };

  return (
    <div
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`,
      }}
    >
      {children}
    </div>
  );
};

export default PageTransition;
