// Animation Presets for SpendX
// Reusable animation configurations for consistent micro-interactions

import { Easing } from 'react-native-reanimated';

// Spring Animation Configs
export const SpringPresets = {
    // Gentle spring for subtle movements
    gentle: {
        damping: 20,
        stiffness: 100,
        mass: 1,
    },
    // Bouncy spring for playful interactions
    bouncy: {
        damping: 10,
        stiffness: 150,
        mass: 0.8,
    },
    // Snappy spring for quick responsive feedback
    snappy: {
        damping: 15,
        stiffness: 400,
        mass: 0.5,
    },
    // Stiff spring for immediate response
    stiff: {
        damping: 20,
        stiffness: 600,
        mass: 0.5,
    },
    // Soft spring for smooth transitions
    soft: {
        damping: 25,
        stiffness: 80,
        mass: 1.2,
    },
    // Modal spring for overlays
    modal: {
        damping: 25,
        stiffness: 200,
        mass: 1,
    },
};

// Timing Animation Configs
export const TimingPresets = {
    // Fast fade for quick state changes
    fade: {
        duration: 150,
        easing: Easing.inOut(Easing.ease),
    },
    // Standard transition for most animations
    standard: {
        duration: 250,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
    },
    // Emphasized enter animation
    enter: {
        duration: 300,
        easing: Easing.bezier(0, 0, 0.2, 1),
    },
    // Emphasized exit animation
    exit: {
        duration: 200,
        easing: Easing.bezier(0.4, 0, 1, 1),
    },
    // Slow animation for dramatic effect
    slow: {
        duration: 500,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
    },
    // Bounce easing for playful animations
    bounce: {
        duration: 400,
        easing: Easing.bezier(0.34, 1.56, 0.64, 1),
    },
};

// Button Animation Values
export const ButtonAnimations = {
    // Scale when pressed
    pressedScale: 0.96,
    // Scale when hovered (web)
    hoveredScale: 1.02,
    // Opacity when pressed
    pressedOpacity: 0.9,
    // Duration for press feedback
    pressDuration: 100,
};

// Card Animation Values
export const CardAnimations = {
    // Lift amount on hover
    hoverLift: -4,
    // Scale on press
    pressScale: 0.98,
    // Entrance animation offset
    entranceOffset: 30,
    // Stagger delay between cards
    staggerDelay: 50,
};

// Page Transition Values
export const PageTransitions = {
    // Slide right-to-left
    slideLeft: {
        entering: { translateX: 300, opacity: 0 },
        entered: { translateX: 0, opacity: 1 },
        exiting: { translateX: -100, opacity: 0 },
    },
    // Fade with slight scale
    fadeScale: {
        entering: { opacity: 0, scale: 0.95 },
        entered: { opacity: 1, scale: 1 },
        exiting: { opacity: 0, scale: 1.05 },
    },
    // Fade only
    fade: {
        entering: { opacity: 0 },
        entered: { opacity: 1 },
        exiting: { opacity: 0 },
    },
    // Slide up (for modals)
    slideUp: {
        entering: { translateY: 100, opacity: 0 },
        entered: { translateY: 0, opacity: 1 },
        exiting: { translateY: 50, opacity: 0 },
    },
};

// List Item Animations
export const ListAnimations = {
    // Stagger delay between items
    staggerDelay: 30,
    // Entrance offset from bottom
    entranceOffset: 20,
    // Swipe threshold for actions
    swipeThreshold: 80,
    // Swipe action reveal distance
    swipeRevealDistance: 100,
};

// Chart Animation Values
export const ChartAnimations = {
    // Duration for chart data transitions
    dataDuration: 750,
    // Delay before chart starts animating
    startDelay: 200,
    // Duration for pie chart sections
    pieSliceDuration: 500,
    // Duration for bar growth
    barGrowthDuration: 600,
};

// Typing Animation (for AI chat)
export const TypingAnimation = {
    // Delay between characters
    charDelay: 30,
    // Delay between words
    wordDelay: 100,
    // Bounce interval for thinking dots
    dotInterval: 400,
    // Number of thinking dots
    dotCount: 3,
};

// Skeleton Loading Animation
export const SkeletonAnimation = {
    // Shimmer animation duration
    shimmerDuration: 1500,
    // Base color
    baseColor: 'rgba(0, 0, 0, 0.05)',
    // Highlight color
    highlightColor: 'rgba(0, 0, 0, 0.1)',
};

// Number Counter Animation
export const CounterAnimation = {
    // Duration for counting animation
    duration: 1000,
    // Easing for smooth counting
    easing: Easing.out(Easing.cubic),
    // Delay before counting starts
    startDelay: 200,
};

// FAB (Floating Action Button) Animations
export const FABAnimations = {
    // Scale when pressed
    pressScale: 0.9,
    // Rotate when opening menu
    openRotation: 45,
    // Duration for menu items stagger
    menuStaggerDelay: 50,
    // Distance for menu items
    menuItemOffset: 60,
};

// Tab Bar Animations
export const TabBarAnimations = {
    // Duration for tab switch
    switchDuration: 200,
    // Scale for active tab icon
    activeScale: 1.1,
    // Indicator slide duration
    indicatorDuration: 250,
};

// Pull to Refresh
export const PullToRefresh = {
    // Threshold to trigger refresh
    threshold: 80,
    // Max pull distance
    maxPull: 150,
    // Spinner rotation duration
    spinnerDuration: 750,
};

// Export all animation presets
export const Animations = {
    spring: SpringPresets,
    timing: TimingPresets,
    button: ButtonAnimations,
    card: CardAnimations,
    page: PageTransitions,
    list: ListAnimations,
    chart: ChartAnimations,
    typing: TypingAnimation,
    skeleton: SkeletonAnimation,
    counter: CounterAnimation,
    fab: FABAnimations,
    tabBar: TabBarAnimations,
    pullToRefresh: PullToRefresh,
};
