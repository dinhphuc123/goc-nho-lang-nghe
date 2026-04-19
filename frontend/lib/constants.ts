// ============================================
// CONSTANTS — Góc Nhỏ Lắng Nghe
// ============================================

export const SCHOOL_ID = process.env.NEXT_PUBLIC_SCHOOL_ID ?? 'ptdtnt-hm-lamdong';


// Từ khóa kích hoạt Safety Screen
export const DANGER_KEYWORDS = [
    'tự tử', 'tự vẫn', 'tự làm hại', 'không muốn sống',
    'muốn chết', 'kết thúc cuộc đời', 'chấm dứt tất cả',
    'không còn muốn sống', 'muốn biến mất', 'tuyệt vọng hoàn toàn',
    'cắt tay', 'uống thuốc', 'nhảy xuống', 'treo cổ',
    'không ai thương tôi', 'cuộc sống vô nghĩa',
];

// Từ khóa risk level URGENT
export const URGENT_KEYWORDS = [
    'tự tử', 'tự vẫn', 'muốn chết', 'không muốn sống',
    'làm hại bản thân', 'bị tấn công', 'bạo lực', 'xâm hại',
];

// Từ khóa risk level ATTENTION
export const ATTENTION_KEYWORDS = [
    'buồn', 'lo lắng', 'sợ hãi', 'bắt nạt', 'cô đơn',
    'không có bạn', 'cãi nhau', 'mâu thuẫn', 'áp lực',
    'stress', 'khóc', 'không ngủ được',
];

// Emotion detection
export const EMOTION_MAP: Record<string, string[]> = {
    '😊 Vui vẻ': ['vui', 'hạnh phúc', 'tuyệt vời', 'tốt', 'ổn rồi', 'cảm ơn'],
    '😔 Buồn bã': ['buồn', 'khóc', 'cô đơn', 'thất vọng', 'tủi'],
    '😰 Lo lắng': ['lo', 'sợ', 'hồi hộp', 'lo lắng', 'stress', 'áp lực'],
    '😡 Tức giận': ['tức', 'giận', 'bực', 'ghét', 'chán'],
    '😞 Mệt mỏi': ['mệt', 'kiệt sức', 'không muốn', 'chán nản', 'chán ngán'],
};

// Navigation items
export const NAV_ITEMS = [
    { href: '/', label: 'Trang chủ' },
    { href: '/tu-van-ai', label: 'Tư vấn AI' },
    { href: '/gui-thu', label: 'Gửi thư' },
    { href: '/tra-cuu', label: 'Tra cứu' },
    { href: '/cam-nang', label: 'Cẩm nang' },
    { href: '/biet-on', label: 'Biết ơn' },
    { href: '/phu-huynh', label: 'Phụ huynh' },
    { href: '/gioi-thieu', label: 'Giới thiệu' },
];

// Category labels
export const CATEGORY_LABELS: Record<string, string> = {
    anxiety: 'Lo lắng',
    relationship: 'Quan hệ bạn bè',
    bullying: 'Bạo lực học đường',
    mental_health: 'Sức khỏe tâm thần',
    report: 'Báo cáo sự việc',
    chat: 'Trò chuyện',
};

// Article category labels
export const ARTICLE_CATEGORY_LABELS: Record<string, string> = {
    stress: 'Áp lực học tập',
    relationship: 'Quan hệ bạn bè',
    bullying: 'Bạo lực học đường',
    emotion: 'Cảm xúc & Sức khỏe',
    nutrition: 'Tư vấn Dinh dưỡng',
};

// OpenRouter models — thu lan luot neu model truoc bao loi
export const OPENROUTER_MODEL = 'z-ai/glm-4.5-air:free';
export const OPENROUTER_MODEL_FALLBACKS = [
    'z-ai/glm-4.5-air:free',
    'openai/gpt-oss-120b:free',
    'google/gemma-4-31b-it:free',
    'google/gemma-4-26b-a4b-it:free',
    'meta-llama/llama-4-scout:free',
    'google/gemini-3-flash-preview', // Requires Google credits
];
export const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

