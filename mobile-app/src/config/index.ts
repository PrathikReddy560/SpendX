// Config Barrel Export
export { Colors, getColors } from './colors';
export {
    Typography,
    Spacing,
    BorderRadius,
    Shadows,
    Duration,
    Breakpoints,
    ZIndex,
    IconSizes,
    ButtonConfig,
    InputConfig,
    CardConfig,
    AvatarSizes,
    Theme,
} from './theme';
export {
    SpringPresets,
    TimingPresets,
    ButtonAnimations,
    CardAnimations,
    PageTransitions,
    ListAnimations,
    ChartAnimations,
    TypingAnimation,
    SkeletonAnimation,
    CounterAnimation,
    FABAnimations,
    TabBarAnimations,
    PullToRefresh,
    Animations,
} from './animations';
export {
    API_BASE_URL,
    API_TIMEOUT,
    PAGINATION,
    Endpoints,
    Categories,
} from './api';

// Re-export types
export type {
    LoginRequest,
    SignupRequest,
    TransactionRequest,
    ChatRequest,
    AuthResponse,
    UserProfile,
    Transaction,
    TransactionSummary,
    CategoryBreakdown,
    BudgetData,
    BudgetCategory,
    AIInsight,
    AIPrediction,
    ChatMessage,
    APIError,
} from './api';
