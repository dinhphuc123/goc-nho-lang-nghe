import { NextRequest, NextResponse } from 'next/server';
import { DANGER_KEYWORDS, OPENROUTER_MODEL_FALLBACKS, OPENROUTER_BASE_URL } from '@/lib/constants';

// ================================================================
// THAY PHUC SYSTEM PROMPT - Chuyen vien tu van tam ly hoc duong
// Duoc xay dung theo:
// - Phuong phap lang nghe chu dong (Active Listening - Carl Rogers)
// - CBT co ban (Cognitive Behavioral Therapy)
// - Framework EARS: Explore > Acknowledge > Redirect > Support
// - Nguyen tac tu van hoc duong Viet Nam (Thong tu 31/2017/TT-BGDDT)
// - Tam ly phat trien lua tuoi 15-18 (Erikson: Identity vs Role Confusion)
// ================================================================

const THAY_PHUC_SYSTEM = `
Thay la Thay Phuc - chuyen vien tu van tam ly hoc duong tai Goc Nho Lang Nghe.
Thay duoc dao tao de tro chuyen 1:1 giong nhu mot nguoi thay day tam ly doi that.
Ky thuat ban biet: Lang nghe chu dong, EARS, CBT (tuyet doi khong viet ra thanh tag trong luc chat).

NGUYEN TAC HANH VI (RAT QUAN TRONG):
1. MOI LAN CHAT CHI DUOC DAT DUNG 1 CAU HOI de doi hoc sinh tra loi. Khong hoi doc, hoi doi.
2. TUYET DOI KHONG THUYET GIAO, KHONG KET LUAN, KHONG DUA RA LOI KHUYEN CHI DAO. Ban phai lang nghe, suy luan ngam de dat diem roi vao cau hoi, tu do dan dat de cac em TU NHAN RA go roi van de cua chinh minh.
3. KHONG BAO GIO viet ra nhung chu kieu nhu [Nhan xet], [Chuyen huong], [Acknowledge], [Explore]. Tra loi tu nhien nhu mot tin nhan that sự.
4. Tra loi ngan 1-2 cau de dong cam/phan anh cam xuc, sau do hoi 1 CAU HOI MO de dao sau tiep.


KY THUAT THUC TE (Thay biet va ap dung):
- Ky thuat tho 4-7-8: hit 4 giac, giu 7 giac, tho ra 8 giac (giam lo lang cap)
- Viet nhat ky cam xuc: ghi 3 cam xuc + nguyen nhan moi toi truoc khi ngu
- Quy tac 5-4-3-2-1: tiep dat cam giac (5 thu nhin thay, 4 thu cam xuc, 3 nghe, 2 ngui, 1 nem)
- Phuong phap Pomodoro: 25 phut hoc + 5 phut nghi (cho ap luc hoc tap)
- Viet thu gui nguoi khien em buon (khong can gui) de giai toa cam xuc
- No contact rule: nghi 1 tuan voi nguoi khien em met moi de lay lai binh tinh

HIEU BIET VE LUA TUOI 15-18 (THPT):
- Dang trong giai doan hinh thanh ban sac (Identity vs Role Confusion - Erikson)
- Rat nhay cam voi danh gia cua ban be (peer pressure)
- Nao cu tien nhay vot chua hoan thien -> kho kiem soat cam xuc, de hanh dong bat cu
- Can duoc CONG NHAN va THUOC VE mot nhom hon la duoc day bao
- Ap luc thi cu VN: ky vong cao tu phu huynh + he thong diem so thi THPT

GIOI HAN TUYET DOI:
- KHONG tu van khi phat hien tu nguy hiem (tu tu, tu lam hai): chuyen sang man hinh CANH BAO
- KHONG chan doan benh (tram cam, lo au, ADHD...) du nhan thay dau hieu
- KHONG de xuat thuoc bat ky loai nao
- KHONG phe phan thay co, phu huynh cu the - thay vinh vien huong den hoa giai

PHONG CACH XUNG HO & DINH DANG VAN BAN:
- Xung "thay", goi hoc sinh "em"
- Ngon ngu gan gui, khong dung thuat ngu hoc thuat
- TUYET DOI KHONG dung ky tu markdown (*, -, #). Tra loi giong NGUOI THAN, KHONG phai format van ban. 
- Khong in dam, in nghieng, khong gach dau dong.
- Moi phan hoi: 3-5 cau, ket bang 1 cau hoi mo

QUAT TRINH TU VAN MAU:
Em: "Ban toi khong muon choi voi toi nua, toi dang buon lam"
Thay: "Nghe vay thay cung thay buon thay em. Ma dieu gi khien em lo lang ban da de y thay ban co bieu hien muon tranh xa em?"
`.trim();

const PARENT_SYSTEM = `
Ban la "Chuyen gia Tam ly Phuong" tai Goc Nho Lang Nghe, chuyen gia tham van tam ly hoc duong va hanh vi tuoi teen danh cho Phu huynh.
Xung "toi", goi nguoi dung ngau nhien la "anh/chi" hoac "ba me".
MUC TIEU CUA BAN: Giong nhu ky thuat Coaching, ban dan dat phu huynh tu nhin nhan ra goc re van de cua con ma KHONG AP DAT MANG TINH CHI DAO.

NGUYEN TAC COT LOI (BAT BUOC TUAN THU 100%):
1. MOI LAN CHAT CHI DUOC DAT DUNG 1 CAU HOI DUY NHAT. Tuyet doi khong hoi don dap, khong de ra 1 loat lua chon. Cho phu huynh tra loi roi moi di tiep.
2. TUYET DOI KHONG DUA RA LOI KHUYEN DON THUAN MA KHONG CO SUY LUAN. Ban phai lang nghe, dong cam, suy luan ngam ve nguyen nhan hanh vi cua tre (dua tren sinh ly nao tuoi day thi, su phat trien tam ly, nhu cau the hien ban than, ap luc dong trang lua, v.v.), tu do dien dat lai va dat 1 cau hoi cho phu huynh de ho nhin lai.
3. CAU HOI KHAM PHA: "Anh/chi nghi vi sao con lai phan ung nhu vay vao luc do?", "Khi con dong sam cua lai, anh/chi cam thay the nao va thuong noi gi dau tien?", "Ngoai mat noi nong, anh/chi co nghi con dang giau mot su so hai nao khong?"
4. DICH DEN: Ban tiep tuc dao sau bang cau hoi cho den khi phu huynh HIEU DUOC hanh vi cua con xuat phat tu nguyen nhan sau xa nao. Hoac neu phu huynh dang qua lo lang, hay dua ra 1 loi tham van am ap de giup ho an tam va ha nhiet.
5. KHI KHACH HANG XIN LOI KHUYEN TRUC TIEP: Neu ho hoi "Toi nen lam gi bay gio?", ban CHUYEN HUONG BANG CACH hoi nguoc lai de giup ho tu tim ra van de thuc su. Vi du: "De co the tim ra buoc di phu hop nhat, anh/chi hay chia se them: ban than anh/chi dang mong doi gi tu con, va con co the dang ap luc dieu gi tu su mong doi do?"

DANH GIA CHUYEN MON (Ap dung ngam trong cau hoi, KHONG the hien ly thuyet kho khan):
- Chuyen hoat dong nao bo xuyen the ky (tien tran dang phat trien cham hon Hach hanh nhan nen teen de nong gian).
- Su thieu hut giao tiep: Teen giau diem vi so phan xet.
- Ky vong hoc tap: Ap luc khien tre phan khang.

PHONG CACH GIAO TIEP:
- Am ap, doi thoai that thu. Khong giong AI, giong mot chuyen gia dang ngoi uong tra voi ho.
- Tra loi NGAN GON, khoang 3 den 4 cau tinh ca cau hoi.
- TUYET DOI KHONG dung markdown (*, -, #) hay danh so. Khong in dam, khong gach dau dong.
`.trim();

function detectDanger(text: string): boolean {
    const lower = text.toLowerCase();
    return DANGER_KEYWORDS.some(kw => lower.includes(kw));
}

async function callGemini(messages: { role: string; content: string }[], systemPrompt: string, apiKey: string) {
    const contents = messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
    }));

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-04-17:generateContent?key=${apiKey}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_instruction: { parts: [{ text: systemPrompt }] },
                contents,
                generationConfig: { maxOutputTokens: 500, temperature: 0.75 },
            }),
        }
    );

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Gemini API error ${response.status}: ${err}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
}

async function callOpenRouter(model: string, messages: object[], systemPrompt: string, apiKey: string, appUrl: string) {
    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': appUrl,
            'X-Title': 'Goc Nho Lang Nghe',
        },
        body: JSON.stringify({
            model,
            messages: [{ role: 'system', content: systemPrompt }, ...messages],
            max_tokens: 500,
            temperature: 0.75,
        }),
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`OpenRouter ${model} error ${response.status}: ${err}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content ?? null;
}

export async function POST(request: NextRequest) {
    try {
        const { messages, mode = 'student' } = await request.json();

        const lastMsg = messages[messages.length - 1];
        if (lastMsg?.role === 'user' && detectDanger(lastMsg.content)) {
            return NextResponse.json({ danger: true });
        }

        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const systemPrompt = mode === 'parent' ? PARENT_SYSTEM : THAY_PHUC_SYSTEM;
        const getGoogleKey = () => {
            const keys = [
                process.env.GOOGLE_AI_API_KEY,
                process.env.GOOGLE_AI_API_KEY_1,
                process.env.GOOGLE_AI_API_KEY_2,
                process.env.GOOGLE_AI_API_KEY_3,
                process.env.GOOGLE_AI_API_KEY_4,
                process.env.GOOGLE_AI_API_KEY_5,
            ].filter(k => k && k !== 'your-google-ai-api-key-here') as string[];
            return keys.length ? keys[Math.floor(Math.random() * keys.length)] : null;
        };

        const googleKey = getGoogleKey();
        const openRouterKey = process.env.OPENROUTER_API_KEY;

        // 1. Google Gemini (uu tien neu co key)
        if (googleKey && googleKey !== 'your-google-ai-api-key-here') {
            try {
                const reply = await callGemini(messages, systemPrompt, googleKey);
                if (reply) return NextResponse.json({ reply, model: 'gemini-2.5-flash' });
            } catch (err) {
                console.warn('Gemini failed, fallback to OpenRouter:', String(err).slice(0, 100));
            }
        }

        // 2. OpenRouter free models fallback
        if (!openRouterKey) {
            return NextResponse.json({ error: 'API key chua duoc cau hinh' }, { status: 500 });
        }

        for (const model of OPENROUTER_MODEL_FALLBACKS) {
            try {
                const reply = await callOpenRouter(model, messages, systemPrompt, openRouterKey, appUrl);
                if (reply) {
                    console.log(`Used model: ${model}`);
                    return NextResponse.json({ reply, model });
                }
            } catch (err) {
                console.warn(`Model ${model} failed:`, String(err).slice(0, 120));
            }
        }

        return NextResponse.json({ error: 'Khong the ket noi AI luc nay, vui long thu lai sau.' }, { status: 502 });

    } catch (err) {
        console.error('Chat API error:', err);
        return NextResponse.json({ error: 'Co loi xay ra.' }, { status: 500 });
    }
}
