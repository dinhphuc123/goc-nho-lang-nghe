import { NextRequest, NextResponse } from 'next/server';
import { OPENROUTER_MODEL_FALLBACKS, OPENROUTER_BASE_URL, ARTICLE_CATEGORY_LABELS } from '@/lib/constants';

// System prompt theo Spec 10B + 10C
function buildSystemPrompt(category: string): string {
    const categoryExtras: Record<string, string> = {
        stress: 'Nhấn mạnh: học tập bền vững quan trọng hơn điểm số tức thời.',
        relationship: 'Nhấn mạnh: kỹ năng giao tiếp, đặt ranh giới lành mạnh.',
        bullying: 'QUAN TRỌNG: luôn khuyến khích báo cáo người lớn tin cậy. Không khuyến khích tự xử lý bạo lực.',
        emotion: 'Nhấn mạnh: cảm xúc tiêu cực là bình thường. Không chẩn đoán bệnh tâm lý.',
    };

    return `Bạn là chuyên gia tâm lý học đường Việt Nam.
Viết bài Cẩm nang Tâm lý cho học sinh THCS/THPT.

${categoryExtras[category] ?? ''}

YÊU CẦU ĐỊNH DẠNG — trả về JSON với cấu trúc sau:
{
  "title": "Tiêu đề bài (hấp dẫn, đặt câu hỏi hoặc dùng con số)",
  "summary": "Mô tả 1-2 câu cho trang danh sách",
  "content": "Nội dung đầy đủ dạng Markdown"
}

YÊU CẦU NỘI DUNG:
- Ngôn ngữ: thân thiện, gần gũi, xưng "bạn" với học sinh
- Độ dài: 400-600 từ
- Cấu trúc: Mở đầu bằng tình huống thực tế → 3-5 gợi ý cụ thể → Kết thúc tích cực
- Tránh: từ ngữ học thuật khô khan, lý thuyết trừu tượng
- Bắt buộc: có ít nhất 1 kỹ thuật thực hành ngay được (VD: kỹ thuật thở, viết nhật ký...)
- KHÔNG nhắc đến thuốc, liều lượng, hay chỉ định y tế
- Cuối bài: 1 câu khuyến khích tìm đến Góc Nhỏ Lắng Nghe nếu cần thêm hỗ trợ

Chỉ trả về JSON hợp lệ với 3 key: title, summary, content.`;
}

// Hàm gọi OpenRouter
async function fetchOpenRouter(prompt: string, userMessage: string, apiKey: string) {
    for (const model of OPENROUTER_MODEL_FALLBACKS) {
        try {
            console.log("Trying OpenRouter Fallback:", model);
            const res = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: model,
                    messages: [
                        { role: 'system', content: prompt },
                        { role: 'user', content: userMessage }
                    ],
                    max_tokens: 1500,
                    temperature: 0.8,
                    response_format: { type: 'json_object' }
                }),
                signal: AbortSignal.timeout(10000)
            });

            if (res.ok) {
                const data = await res.json();
                return data.choices?.[0]?.message?.content;
            }
        } catch {
            continue;
        }
    }
    return null;
}

export async function POST(request: NextRequest) {
    try {
        const { category, titleHint, target = 'all' } = await request.json();

        if (!category || !['stress', 'relationship', 'bullying', 'emotion'].includes(category)) {
            return NextResponse.json({ error: 'Chủ đề không hợp lệ.' }, { status: 400 });
        }

        const targetLabel =
            target === 'thcs' ? 'THCS (11-15 tuổi)' :
                target === 'thpt' ? 'THPT (15-18 tuổi)' : 'THCS và THPT';

        const userMessage = `Chủ đề: ${ARTICLE_CATEGORY_LABELS[category]}\n` +
            `Gợi ý tiêu đề từ admin: ${titleHint ?? 'Tự đặt tiêu đề phù hợp'}\n` +
            `Đối tượng: Học sinh ${targetLabel}`;

        const geminiKey = process.env.GOOGLE_AI_API_KEY;
        const openRouterKey = process.env.OPENROUTER_API_KEY;

        let rawText = '';

        if (geminiKey && geminiKey !== 'your-google-ai-api-key-here') {
            try {
                console.log("Trying Google Gemini API...");
                const response = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-04-17:generateContent?key=${geminiKey}`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            system_instruction: { parts: [{ text: buildSystemPrompt(category) }] },
                            contents: [{ role: 'user', parts: [{ text: userMessage }] }],
                            generationConfig: { maxOutputTokens: 1500, temperature: 0.8, responseMimeType: 'application/json' },
                        }),
                    }
                );

                if (!response.ok) throw new Error(await response.text());

                const responseData = await response.json();
                rawText = responseData.candidates?.[0]?.content?.parts?.[0]?.text || '';
            } catch (err) {
                console.error('Gemini Generate Error:', err);
                if (openRouterKey) rawText = await fetchOpenRouter(buildSystemPrompt(category), userMessage, openRouterKey) || '';
            }
        } else if (openRouterKey) {
            rawText = await fetchOpenRouter(buildSystemPrompt(category), userMessage, openRouterKey) || '';
        }

        if (!rawText) {
            return NextResponse.json({ error: 'AI đang bận, thử lại sau nhé.' }, { status: 502 });
        }

        let article;
        try {
            const cleaned = rawText.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();
            article = JSON.parse(cleaned);
        } catch {
            return NextResponse.json({
                title: 'Lỗi định dạng — vui lòng soạn lại',
                summary: '',
                content: rawText,
                parseError: true,
            });
        }

        return NextResponse.json({ ...article, parseError: false });
    } catch (err) {
        console.error('Handbooks generate error:', err);
        return NextResponse.json({ error: 'Có lỗi xảy ra.' }, { status: 500 });
    }
}
