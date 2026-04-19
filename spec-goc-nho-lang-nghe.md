# Spec: Góc Nhỏ Lắng Nghe

**Phiên bản:** 1.1 | **Ngày:** 19/04/2026
**Tác giả:** Thầy Phúc
**Mô tả ngắn:** Hệ thống tư vấn tâm lý học đường số hóa — kín đáo, ẩn danh, luôn sẵn sàng 24/7.
**Trường triển khai thực tế:** Trường Phổ thông dân tộc nội trú, Phường Hàm Thắng, tỉnh Lâm Đồng
**Trạng thái:** ✅ MVP đã build xong — Spec v1.1 cập nhật theo giao diện thực tế

---

## 1. Mục tiêu & Người dùng

**Vấn đề cần giải quyết:**
Học sinh không dám bước vào phòng tư vấn tâm lý vì sợ bị nhìn thấy, sợ bị đánh giá, hoặc sợ bị trả thù khi báo cáo bạo lực/cô lập. Dẫn đến các vấn đề tâm lý không được can thiệp kịp thời.

**Người dùng mục tiêu:**

- **Học sinh (user chính):** THPT, 15–18 tuổi, quen dùng điện thoại, cần không gian an toàn để chia sẻ
- **Giáo viên / Chuyên viên tâm lý (admin):** Tiếp nhận, phân loại, phản hồi các thư gửi đến
- **Ban giám hiệu (viewer):** Xem thống kê tổng hợp, không đọc nội dung chi tiết

**Nền tảng:**

- Web app (responsive, tương thích mobile browser) — ưu tiên trước
- PWA (Progressive Web App) để học sinh "cài như app" trên điện thoại mà không cần lên Store

**Ràng buộc:**

- Học sinh KHÔNG cần tạo tài khoản để gửi thư
- Tùy chọn: ẩn danh hoàn toàn HOẶC để lại thông tin liên lạc (email/SĐT) nếu muốn được phản hồi
- Không lưu IP, không theo dõi danh tính người dùng ẩn danh
- Giao diện thân thiện, màu sắc nhẹ nhàng, không gây áp lực
- Phải hoạt động tốt trên 3G/4G (tối ưu tốc độ tải)

---

## 2. Cấu trúc trang (Đã build — cập nhật theo UI thực tế)

### Navigation Bar (đã xác nhận từ UI)

```
Logo "Góc Nhỏ Lắng Nghe" | Trang chủ | Tư vấn AI | Gửi thư | Tra cứu | Cảm nang | Biết ơn | Phụ huynh | Giới thiệu | [Tải app]
```

### Trang chủ — 6 tính năng chính (Grid 3x2)

| # | Card                    | Màu               | Mô tả hiển thị                                                                        |
| - | ----------------------- | ------------------ | ----------------------------------------------------------------------------------------- |
| 1 | 🤖 Phòng Tư Vấn AI   | Đen (nổi bật)   | Trò chuyện an toàn, riêng tư về áp lực học tập, bạn bè hay cảm xúc          |
| 2 | ✉️ Gửi Thư Hỗ Trợ | Trắng             | Báo cáo ẩn danh các vấn đề nghiêm trọng để nhà trường kịp thời can thiệp |
| 3 | 🔍 Tra Cứu Báo Cáo   | Trắng             | Nhập mã theo dõi để xem trạng thái xử lý thư hỗ trợ đã gửi                 |
| 4 | 💗 Hộp Thư Biết Ơn  | Hồng nhạt        | Gửi lời cảm ơn ẩn danh hoặc có tên để lan tỏa năng lượng tích cực         |
| 5 | 📚 Cẩm Nang Tâm Lý   | Xanh mint          | Đọc bài viết, mẹo vặt giúp cân bằng cảm xúc và quản lý thời gian           |
| 6 | 👥 Góc Phụ Huynh      | Xanh dương nhạt | Không gian cho cha mẹ tìm lời khuyên, thấu hiểu tâm lý tuổi dậy thì           |

---

## 3. Luồng người dùng (User Flow — cập nhật theo UI thực tế)

### 3A. Phòng Tư Vấn AI — "Thầy Phúc" (AI Counselor)

```
1. Học sinh vào "Tư vấn AI" từ menu hoặc card trang chủ
2. Màn hình "Chọn Danh Tính":
   - [👻 Tiếp tục ẩn danh] → Hệ thống tự sinh "Học sinh ẩn danh #XXXX"
   - [👤 Để lại tên & lớp] → Nhập tên + lớp
3. Vào giao diện chat với Thầy Phúc (AI)
   - Header: tên AI + subtitle mô tả
   - Hiện gợi ý chủ đề nhanh (chip buttons)
   - Ô nhập tin nhắn + nút Gửi
4. AI phát hiện nội dung nguy hiểm (tự làm hại, tuyệt vọng):
   → CHUYỂN sang màn hình "CẢNH BÁO AN TOÀN" (modal đỏ):
      - "Cô Minh nhận thấy em đang trải qua một cảm xúc rất khó khăn..."
      - "Trí tuệ nhân tạo không được phép tư vấn trong tình huống này"
      - [📞 Gọi ngay 111] (nút đỏ, nổi bật)
      - [✉️ Gửi thư cho thầy cô] (nút vàng)
      - [🏠 Về trang chủ] (nút trắng)
```

> ⚠️ **Quan trọng:** Cảnh báo an toàn (màn hình 7) là tính năng bảo vệ cốt lõi — KHÔNG được bỏ qua hay tắt.
> AI phải từ chối tiếp tục tư vấn và chuyển hướng sang hỗ trợ người thật.

### 3B. Gửi Thư Hỗ Trợ (Hòm thư ẩn danh)

```
1. Vào "Gửi thư" từ menu
2. (Tùy chọn) Chọn danh tính: ẩn danh #XXXX hoặc để lại tên & lớp
3. Header thư hiển thị: "Danh tính: Học sinh ẩn danh #XXXX • Cảm xúc: [tự động detect]"
4. Banner bảo mật: "Mọi thông tin em gửi ở đây sẽ được bảo mật. Sau khi gửi, em sẽ nhận được một Mã theo dõi..."
5. Ô text lớn: placeholder "Em hãy kể lại sự việc ở đây nhé..."
6. Nút "✈️ Gửi thư hỗ trợ"
7. Nhận mã theo dõi sau khi gửi
```

### 3C. Hộp Thư Biết Ơn

```
1. Vào "Biết ơn" từ menu
2. Form gồm 3 trường:
   - "Gửi đến ai?" (bắt buộc) — placeholder: "VD: Cô Lan dạy Toán, Bạn Minh lớp 10A1..."
   - "Lời nhắn của em" (bắt buộc) — placeholder: "Em muốn cảm ơn vì điều gì..."
   - "Người gửi" (không bắt buộc) — placeholder: "Tên của em (hoặc để trống nếu muốn ẩn danh)"
3. Nút hồng: "✈️ Gửi đi yêu thương"
```

### 3D. Góc Phụ Huynh (AI tư vấn cho cha mẹ)

```
1. Vào "Phụ huynh" từ menu
2. Giao diện chat AI riêng:
   - Header: "Góc Phụ Huynh — Đồng hành cùng cha mẹ thấu hiểu tâm lý tuổi teen"
   - Tin nhắn mở đầu từ AI: "Chào anh/chị. Đây là Góc Phụ Huynh..."
   - Gợi ý chủ đề nhanh:
     + "Con tôi dạo này hay cáu gắt và đóng cửa phòng, tôi nên làm gì?"
     + "Làm sao để khuyên con bớt chơi game mà không xảy ra cãi vã?"
     + "Tôi muốn hiểu thêm về tâm lý tuổi dậy thì của các cháu..."
     + "Con tôi đang gặp áp lực điểm số nhưng cháu không chịu chia sẻ..."
3. Ô nhập: "Nhập câu hỏi của anh/chị..." + nút Gửi
```

### 3E. Tra Cứu Báo Cáo

```
1. Vào "Tra cứu" từ menu
2. Nhập mã theo dõi 6 ký tự
3. Hiển thị trạng thái + phản hồi từ thầy cô (nếu có)
```

---

## 3. Cấu trúc dữ liệu (Data Schema)

### Bảng Letters (Thư gửi đến)

| Trường      | Kiểu              | Mô tả                                                           |
| ------------- | ------------------ | ----------------------------------------------------------------- |
| id            | string (UUID)      | Mã định danh duy nhất                                         |
| tracking_code | string (6 ký tự) | Mã học sinh dùng để tra cứu                                 |
| category      | enum               | anxiety / relationship / bullying / mental_health / report / chat |
| content       | text               | Nội dung thư                                                    |
| contact_info  | string (nullable)  | Email hoặc SĐT nếu học sinh để lại                         |
| is_anonymous  | boolean            | true nếu ẩn danh                                                |
| risk_level    | enum               | normal / attention / urgent                                       |
| ai_flags      | array              | Danh sách từ khóa nguy hiểm phát hiện được               |
| status        | enum               | pending / in_progress / resolved                                  |
| created_at    | datetime           | Thời điểm gửi                                                 |
| school_id     | string             | Mã trường (hỗ trợ đa trường sau này)                     |

### Bảng Responses (Phản hồi)

| Trường         | Kiểu         | Mô tả                                       |
| ---------------- | ------------- | --------------------------------------------- |
| id               | string (UUID) | Mã định danh                               |
| letter_id        | string        | FK → Letters                                 |
| admin_id         | string        | FK → Admins                                  |
| content          | text          | Nội dung phản hồi                          |
| is_internal_note | boolean       | true = ghi chú nội bộ, false = gửi cho HS |
| created_at       | datetime      | Thời điểm gửi                             |

### Bảng Admins (Giáo viên / Quản trị viên)

| Trường      | Kiểu         | Mô tả                              |
| ------------- | ------------- | ------------------------------------ |
| id            | string (UUID) | Mã định danh                      |
| email         | string        | Email đăng nhập                   |
| full_name     | string        | Họ tên hiển thị                  |
| role          | enum          | counselor / admin / viewer           |
| school_id     | string        | Mã trường                         |
| notify_urgent | boolean       | Nhận email ngay khi có thư khẩn  |
| notify_daily  | boolean       | Nhận tóm tắt hàng ngày          |
| is_active     | boolean       | Tài khoản còn hoạt động không |

### Bảng GratitudeLetters (Hộp Thư Biết Ơn)

| Trường    | Kiểu             | Mô tả                                    |
| ----------- | ----------------- | ------------------------------------------ |
| id          | string (UUID)     | Mã định danh                            |
| recipient   | string            | Gửi đến ai (VD: "Cô Lan dạy Toán")   |
| message     | text              | Lời nhắn                                 |
| sender_name | string (nullable) | Tên người gửi (nullable nếu ẩn danh) |
| created_at  | datetime          | Thời điểm gửi                          |
| school_id   | string            | Mã trường                               |

### Bảng Resources (Tài nguyên hỗ trợ)

| Trường     | Kiểu             | Mô tả                                         |
| ------------ | ----------------- | ----------------------------------------------- |
| id           | number            | Mã định danh                                 |
| title        | string            | Tên tài nguyên                               |
| description  | string            | Mô tả ngắn                                   |
| url          | string (nullable) | Đường dẫn bài viết / video                |
| phone        | string (nullable) | Số điện thoại (VD: 111)                     |
| category     | enum              | Phân loại tương ứng với chủ đề thư    |
| is_emergency | boolean           | Hiện ưu tiên khi phát hiện nội dung khẩn |

---

## 4. Tình huống ngoại lệ (Edge Cases)

| Tình huống                                     | Xử lý                                                                   |
| ------------------------------------------------ | ------------------------------------------------------------------------- |
| Học sinh gửi thư trùng lặp trong 5 phút    | Hỏi xác nhận "Bạn vừa gửi thư tương tự, gửi tiếp không?"     |
| Nội dung có từ khóa tự làm hại bản thân | Hiện popup quan tâm + số 111, KHÔNG chặn gửi thư                   |
| Học sinh nhập mã theo dõi sai                | Báo lỗi nhẹ nhàng "Mã không tồn tại, thử lại nhé"              |
| Admin quên mật khẩu                           | Reset qua email trường                                                  |
| Mất mạng khi đang gửi thư                   | Lưu nháp local, hỏi "Gửi lại khi có mạng không?"                  |
| Nội dung quá ngắn (< 10 ký tự)              | Gợi ý nhẹ "Bạn muốn kể thêm không? Góc Nhỏ đang lắng nghe..." |
| Admin không phản hồi sau 48 giờ              | Gửi nhắc nhở email tự động                                          |
| Thư có nội dung spam / test                   | Admin có thể đánh dấu "Bỏ qua" và xóa khỏi hàng đợi           |
| Học sinh gửi từ thiết bị công cộng        | Không lưu cookie, không auto-fill thông tin nhạy cảm                |

---

## 5. Tính năng AI tích hợp

### 5A. AI Persona — "Thầy Phúc"

- **Tên nhân vật:** Thầy Phúc
- **Vai trò:** Chuyên viên tư vấn tâm lý AI, thân thiện, ấm áp, dùng ngôn ngữ gần gũi với học sinh
- **Giới hạn bắt buộc:** KHÔNG tư vấn khi phát hiện nội dung nguy hiểm — phải chuyển sang màn hình Cảnh Báo An Toàn
- **Scope cho học sinh:** Áp lực học tập, quan hệ bạn bè/gia đình, cảm xúc cá nhân
- **Scope cho phụ huynh:** Tâm lý tuổi teen, giao tiếp với con, quản lý xung đột

### 5B. Màn hình Cảnh Báo An Toàn (Safety Screen — BẮT BUỘC)

Kích hoạt khi AI phát hiện từ khóa: tự tử, tự làm hại, không muốn sống, chấm dứt, kết thúc tất cả...

**Giao diện (đã xác nhận từ UI thực tế):**

- Nền đỏ tối
- Icon ⚠️ màu đỏ
- Tiêu đề: "CẢNH BÁO AN TOÀN"
- Nội dung: "Thầy Phúc nhận thấy em đang trải qua một cảm xúc rất khó khăn và có những suy nghĩ gây hại cho bản thân. Trí tuệ nhân tạo không được phép tư vấn trong tình huống này."
- "Xin em hãy dừng lại, hít thở sâu và gọi ngay cho **Tổng đài Quốc gia Bảo vệ Trẻ em 111** (miễn phí 24/7)..."
- **[📞 Gọi ngay 111]** — nút đỏ lớn, ưu tiên cao nhất
- **[✉️ Gửi thư cho thầy cô]** — nút vàng
- **[🏠 Về trang chủ]** — nút trắng

### 5C. Các tính năng AI khác

- **Phát hiện cảm xúc tự động:** Từ nội dung chat → hiển thị "Cảm xúc: Vui vẻ / Lo lắng / Buồn bã..." trên header
- **Phân loại mức độ thư:** normal 🟢 / attention 🟡 / urgent 🔴 cho admin dashboard
- **Gợi ý chủ đề nhanh:** Chip buttons gợi ý câu hỏi phổ biến trước khi học sinh/phụ huynh gõ

---

## 8. Design System (Đã xác nhận từ UI thực tế)

### Màu sắc

| Vị trí                     | Màu                                          |
| ---------------------------- | --------------------------------------------- |
| Card nổi bật (Tư vấn AI) | `#1a1a2e` (đen xanh đậm)                 |
| Card Biết ơn               | Hồng nhạt `#fce4ec`                       |
| Card Cẩm nang               | Xanh mint `#e8f5e9`                         |
| Card Phụ huynh              | Xanh dương nhạt `#e3f2fd`                |
| Nút chính                  | Đen `#1a1a2e` hoặc màu tương ứng card |
| Nút Biết ơn               | Hồng `#e91e8c`                             |
| Cảnh báo an toàn          | Đỏ đậm `#b71c1c`                        |
| Nút 111                     | Đỏ tươi `#d32f2f`                       |

### Typography

- Font chính: Serif (tiêu đề) + Sans-serif (nội dung)
- Tiêu đề trang chủ: Bold, cỡ lớn, có phần *in nghiêng* (Học Đường)
- Ngôn ngữ: Thân thiện, gần gũi, xưng hô "em/thầy cô/anh chị"

### Layout

- Navigation: Horizontal top bar + nút "Tải app" góc phải
- Hero section: 2 cột (text trái + illustration phải)
- Feature grid: 3 cột × 2 hàng (responsive về 1-2 cột trên mobile)
- Cards: Bo tròn góc, padding rộng, shadow nhẹ

---

## 9. Admin Dashboard — Đặc tả chi tiết

### 9A. Sidebar navigation

| Mục            | Badge     | Ghi chú                    |
| --------------- | --------- | --------------------------- |
| Thư khẩn cấp | Số đỏ  | Ưu tiên hiện đầu tiên |
| Cần chú ý    | Số vàng |                             |
| Bình thường  | —        |                             |
| Biết ơn đến | —        | Xem thư Hộp Biết Ơn     |
| Thống kê      | —        | Biểu đồ tổng hợp       |
| Tài khoản GV  | —        | Chỉ super-admin            |
| Cẩm nang       | —        | Quản lý bài viết        |

### 9B. Metric cards (4 chỉ số chính)

- Thư hôm nay (số tuyệt đối + so sánh hôm qua)
- Thư khẩn cấp (màu đỏ, cần xử lý ngay)
- Chưa phản hồi quá 48 giờ
- Đã giải quyết trong tháng

### 9C. Biểu đồ thư theo ngày

- Bar chart 7 cột (Thứ 2 → Chủ nhật)
- Cột hôm nay highlight đậm hơn
- Không cần thư viện ngoài — dùng CSS flexbox

### 9D. Danh sách thư

- Filter: Tất cả / Khẩn cấp / Chờ xử lý
- Mỗi thư hiện: badge mức độ, mã ID, lớp/ẩn danh, giờ gửi, preview 1 dòng, chấm trạng thái
- Bấm vào thư → mở panel chi tiết bên phải (hoặc trang riêng)
- **Quy tắc màu badge:**
  - Khẩn cấp: nền đỏ nhạt, chữ đỏ đậm
  - Cần chú ý: nền vàng nhạt, chữ vàng đậm
  - Bình thường: nền xanh lá nhạt, chữ xanh đậm
- **Quy tắc chấm trạng thái:**
  - Đỏ = Chờ xử lý
  - Vàng = Đang xử lý
  - Xanh = Đã giải quyết

### 9E. Panel chi tiết thư (khi bấm vào)

```
- Tiêu đề: Mã thư + mức độ + thời gian
- Nội dung đầy đủ
- Thông tin liên lạc (nếu học sinh để lại)
- Ô ghi chú nội bộ (chỉ admin thấy)
- Ô phản hồi gửi học sinh
- Nút: [Đánh dấu khẩn] [Chuyển tiếp] [Đã xử lý]
```

---

## 10. Cẩm nang Tâm lý — Đặc tả chi tiết (AI soạn nháp)

### 10A. Tổng quan luồng tạo bài

```
Admin nhập topic/gợi ý
        ↓
Claude API soạn nháp (system prompt chuyên biệt)
        ↓
Admin xem nháp trong editor
        ↓
Chỉnh sửa / bổ sung / duyệt
        ↓
[Lưu nháp] hoặc [Xuất bản]
        ↓
Hiện ngay trên trang Cẩm nang cho học sinh
```

### 10B. API Call — Soạn bài Cẩm nang

```javascript
const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    system: `Bạn là chuyên gia tâm lý học đường Việt Nam.
Viết bài Cẩm nang Tâm lý cho học sinh THCS/THPT.

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

Chỉ trả về JSON, không kèm markdown backticks hay giải thích thêm.`,
    messages: [{
      role: "user",
      content: `Chủ đề: ${category}
Gợi ý tiêu đề từ admin: ${titleHint}
Đối tượng: Học sinh ${schoolLevel}`
    }]
  })
});

const data = await response.json();
const text = data.content[0].text;
const article = JSON.parse(text); // { title, summary, content }
```

### 10C. System Prompt theo từng chủ đề

| Chủ đề               | Bổ sung vào system prompt                                                                                      |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Áp lực học tập      | "Nhấn mạnh: học tập bền vững quan trọng hơn điểm số tức thời"                                       |
| Quan hệ bạn bè       | "Nhấn mạnh: kỹ năng giao tiếp, đặt ranh giới lành mạnh"                                                |
| Bạo lực học đường | "QUAN TRỌNG: luôn khuyến khích báo cáo người lớn tin cậy. Không khuyến khích tự xử lý bạo lực" |
| Cảm xúc & sức khỏe  | "Nhấn mạnh: cảm xúc tiêu cực là bình thường. Không chẩn đoán bệnh tâm lý"                       |

### 10D. Giao diện Admin — Màn hình soạn bài

```
┌─────────────────────────────────────────────┐
│  Tạo bài Cẩm nang mới                       │
├─────────────────────────────────────────────┤
│  Chủ đề: [dropdown 4 chủ đề]                │
│  Gợi ý tiêu đề: [text input]                │
│  Đối tượng: [THCS / THPT / Tất cả]          │
│                                             │
│  [✨ AI soạn nháp]                           │
├─────────────────────────────────────────────┤
│  ⟳ Đang soạn...  (spinner khi gọi API)      │
├─────────────────────────────────────────────┤
│  Tiêu đề:  [editable — AI điền sẵn]         │
│  Tóm tắt:  [editable — AI điền sẵn]         │
│  Nội dung: [rich text editor — AI điền sẵn] │
│                                             │
│  [Soạn lại]    [Lưu nháp]   [Xuất bản]     │
└─────────────────────────────────────────────┘
```

### 10E. Giao diện học sinh (đọc bài)

- Danh sách bài theo 4 chủ đề, filter bằng tab
- Mỗi card: tag màu, tiêu đề, tóm tắt 2 dòng, ngày đăng
- Bấm vào → trang đọc bài đầy đủ (markdown render)
- Cuối mỗi bài: banner "Cần chia sẻ thêm? → Góc Nhỏ Lắng Nghe luôn sẵn sàng"

### 10F. Bảng dữ liệu — Articles

| Trường     | Kiểu           | Mô tả                                    |
| ------------ | --------------- | ------------------------------------------ |
| id           | UUID            | Mã định danh                            |
| title        | string          | Tiêu đề bài                            |
| summary      | string          | Tóm tắt 1-2 câu                         |
| content      | text (Markdown) | Nội dung đầy đủ                       |
| category     | enum            | stress / relationship / bullying / emotion |
| target       | enum            | thcs / thpt / all                          |
| status       | enum            | draft / published                          |
| ai_generated | boolean         | true nếu AI soạn nháp                   |
| author_id    | UUID FK         | Admin duyệt bài                          |
| published_at | datetime        | Ngày xuất bản                           |
| school_id    | string          | Mã trường                               |

### 10G. Màu sắc tag chủ đề

| Chủ đề               | CSS class    | Màu nền | Màu chữ |
| ----------------------- | ------------ | --------- | --------- |
| Áp lực học tập      | tag-stress   | #eaf3de   | #3b6d11   |
| Quan hệ bạn bè       | tag-relation | #e6f1fb   | #185fa5   |
| Bạo lực học đường | tag-bully    | #fcebeb   | #a32d2d   |
| Cảm xúc & sức khỏe  | tag-emotion  | #faeeda   | #854f0b   |

### 10H. Edge Cases — Cẩm nang AI

| Tình huống                              | Xử lý                                                           |
| ----------------------------------------- | ----------------------------------------------------------------- |
| AI trả về JSON sai định dạng         | Parse lỗi → hiện raw text trong editor, admin tự format       |
| Nội dung AI chứa thông tin nguy hiểm  | Admin phát hiện khi duyệt → xóa/sửa trước khi xuất bản  |
| API timeout (>15 giây)                   | Hiện thông báo "Đang bận, thử lại sau" + giữ nguyên form |
| Admin xuất bản nhầm                    | Nút "Gỡ xuống" → chuyển về draft ngay lập tức             |
| Học sinh báo nội dung không phù hợp | Nút "Báo cáo bài viết" → thông báo đến admin            |

---

## 11. Ngoài phạm vi — Phiên bản 1.0 (Out of Scope)

- ❌ Chat realtime (live chat) — phức tạp, để phiên bản 2.0
- ❌ Ứng dụng native iOS/Android riêng biệt (dùng PWA thay thế)
- ❌ Tích hợp hệ thống quản lý học sinh (SIS) của trường
- ❌ Đa ngôn ngữ (chỉ tiếng Việt)
- ❌ Video call tư vấn
- ❌ Quản lý nhiều trường cùng lúc (multi-tenant) — có thể mở rộng sau
- ❌ Thanh toán / gói Premium

---

## 7. Tech Stack đề xuất (cho AI coder)

> **Lưu ý:** Đây là gợi ý. Có thể thay đổi tùy vào AI tool/platform sử dụng.

| Thành phần      | Đề xuất                              |
| ----------------- | --------------------------------------- |
| Frontend          | Next.js (React) + Tailwind CSS          |
| Backend           | Supabase (database + auth + realtime)   |
| AI phân tích    | Claude API (claude-haiku cho tốc độ) |
| Email thông báo | Resend hoặc SendGrid                   |
| Deploy            | Vercel (free tier đủ dùng)           |
| PWA               | next-pwa plugin                         |

---

## 8. Cách dùng file Spec này

1. **Lưu file này** lại máy tính (`spec-goc-nho-lang-nghe.md`)
2. **Khi nhờ AI code**, luôn đính kèm file này kèm theo prompt:
   > *"Dựa trên Spec đính kèm, hãy xây dựng [tính năng cụ thể]..."*
   >
3. **Khi AI làm sai**, đừng giải thích lại — hãy nói:
   > *"Kiểm tra lại mục [X] trong Spec, bạn đang làm không đúng yêu cầu"*
   >
4. **Khi cập nhật Spec**, ghi rõ phiên bản mới (1.1, 1.2...) và thông báo cho AI

---

*💙 "Mỗi thư gửi đến là một học sinh đang dũng cảm lên tiếng — hệ thống này là cách chúng ta đáp lại sự dũng cảm đó."*
