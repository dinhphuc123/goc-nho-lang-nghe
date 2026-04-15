# 🧠 CLAUDE.md — Vibe Coding Config
> Stack: React · Flutter · Python · ExpressJS · NodeJS · PostgreSQL · MongoDB · Supabase

---

## 📐 PROJECT ARCHITECTURE

```
project-root/
├── backend/
│   ├── python-api/                  # Python (FastAPI / Flask)
│   │   ├── app/
│   │   │   ├── api/                 # Route handlers
│   │   │   ├── core/                # Config, security, settings
│   │   │   ├── db/                  # DB connections (Postgres, Mongo)
│   │   │   ├── models/              # Pydantic models + ORM models
│   │   │   ├── services/            # Business logic
│   │   │   ├── schemas/             # Request/Response schemas
│   │   │   └── utils/               # Helpers, storage, email...
│   │   ├── tests/
│   │   ├── requirements.txt
│   │   ├── .env
│   │   └── Dockerfile
│   │
│   └── node-api/                    # ExpressJS / NodeJS
│       ├── src/
│       │   ├── routes/              # Express routers
│       │   ├── controllers/         # Request handlers
│       │   ├── services/            # Business logic
│       │   ├── models/              # Mongoose / Sequelize models
│       │   ├── middleware/          # Auth, error, upload...
│       │   ├── config/              # DB, JWT, Supabase config
│       │   └── utils/               # Helpers
│       ├── package.json
│       ├── .env
│       └── Dockerfile
│
├── frontend/                        # React Web App
│   ├── src/
│   │   ├── api/                     # axios / fetch service layer
│   │   ├── components/              # Reusable UI components
│   │   ├── pages/                   # Route-level pages
│   │   ├── hooks/                   # Custom hooks
│   │   ├── store/                   # State (Redux / Zustand / Jotai)
│   │   ├── lib/                     # supabase client, utils
│   │   └── types/                   # TypeScript interfaces
│   ├── .env
│   └── Dockerfile
│
├── mobile/                          # Flutter App
│   ├── lib/
│   │   ├── core/                    # Theme, routes, constants
│   │   ├── data/
│   │   │   ├── datasources/         # API calls (remote + local)
│   │   │   ├── models/              # Data models + JSON serialization
│   │   │   └── repositories/        # Repository implementations
│   │   ├── domain/
│   │   │   ├── entities/            # Pure business entities
│   │   │   ├── repositories/        # Abstract repository interfaces
│   │   │   └── usecases/            # Business logic use cases
│   │   ├── presentation/
│   │   │   ├── screens/             # Full pages/screens
│   │   │   ├── widgets/             # Reusable widgets
│   │   │   └── bloc/                # BLoC / Cubit state management
│   │   └── main.dart
│   ├── pubspec.yaml
│   └── .env (flutter_dotenv)
│
├── supabase/
│   ├── migrations/                  # SQL migration files
│   ├── functions/                   # Supabase Edge Functions (Deno)
│   └── seed.sql
│
├── docker-compose.yml
├── .env.example
└── CLAUDE.md
```

---

## 🗄️ DATABASE DESIGN RULES

### PostgreSQL (Relational — via Supabase hoặc trực tiếp)
```sql
-- Cấu trúc bảng chuẩn
CREATE TABLE users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT UNIQUE NOT NULL,
  username    TEXT NOT NULL,
  avatar_url  TEXT,
  role        TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user','admin','moderator')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at  TIMESTAMPTZ                        -- soft delete
);

-- Luôn có updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```
- Primary key: `UUID` (dùng `gen_random_uuid()`)
- Timestamps: `TIMESTAMPTZ` không phải `TIMESTAMP`
- Soft delete: `deleted_at TIMESTAMPTZ` — không xóa row thật
- Indexes: luôn index foreign keys + fields hay query
- Naming: `snake_case` cho table và column

### MongoDB (Document — via Mongoose)
```javascript
// Schema chuẩn với Mongoose
const postSchema = new mongoose.Schema({
  title:     { type: String, required: true, trim: true },
  content:   { type: String, required: true },
  authorId:  { type: String, required: true, index: true },  // ref to Postgres user.id
  tags:      [{ type: String }],
  imageUrl:  String,
  status:    { type: String, enum: ['draft','published','archived'], default: 'draft' },
  metadata:  { type: mongoose.Schema.Types.Mixed },
},
{
  timestamps: true,          // tự thêm createdAt, updatedAt
  toJSON:     { virtuals: true },
  toObject:   { virtuals: true },
});

postSchema.index({ authorId: 1, status: 1 });
postSchema.index({ tags: 1 });
```
- Dùng `timestamps: true` thay vì tự quản lý
- Cross-DB reference: lưu UUID string (không dùng ObjectId tham chiếu sang Postgres)
- Không embed document quá sâu (max 2 level)
- Mọi field hay filter đều phải có index

### Supabase Patterns
```sql
-- Row Level Security (RLS) — BẮT BUỘC khi dùng Supabase client
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Policy: user chỉ đọc post của mình
CREATE POLICY "Users read own posts"
  ON posts FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: user tạo post với id của mình
CREATE POLICY "Users create own posts"
  ON posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```
- **Luôn bật RLS** cho mọi table expose qua Supabase client
- Storage bucket: tạo policy riêng cho public/private
- Edge Functions: dùng cho webhook, cron, logic không muốn expose

---

## 🔄 WORKFLOW — Thứ tự làm việc

### Phase 1 — DATABASE & SCHEMA
```
1. Vẽ ERD bằng Mermaid (entities + relationships)
2. Quyết định: dữ liệu nào Postgres, dữ liệu nào MongoDB
   - Postgres: structured, relational (users, orders, payments)
   - MongoDB: flexible, nested (posts, logs, notifications, configs)
3. Viết migration SQL (Supabase) hoặc Mongoose schema
4. Setup RLS policies nếu dùng Supabase client trực tiếp
5. Seed data cho development
```

### Phase 2 — BACKEND
```
Python (FastAPI) — cho AI/ML, heavy computation, data processing:
1. main.py → router setup → lifespan events
2. core/config.py → Settings với pydantic-settings
3. db/ → PostgreSQL (asyncpg/SQLAlchemy) + MongoDB (motor)
4. models/ → SQLAlchemy ORM + Pydantic schemas
5. api/ → routers → dependencies → services
6. JWT auth với python-jose + passlib

Node/ExpressJS — cho realtime, file upload, rapid CRUD:
1. app.js → middleware stack → router mount
2. config/ → DB connections (pg, mongoose) + Supabase client
3. middleware/ → JWT verify → role check → error handler
4. models/ → Sequelize (PG) + Mongoose (Mongo)
5. controllers/ → services/ → routes/
```

### Phase 3 — SUPABASE INTEGRATION
```
1. Setup project + lấy URL, anon key, service role key
2. Viết migrations trong supabase/migrations/
3. Config Storage buckets + policies
4. Viết Edge Functions nếu cần
5. Enable Realtime cho tables cần subscribe
```

### Phase 4 — FRONTEND (React)
```
1. Setup supabase client (src/lib/supabase.ts)
2. Setup axios instance với JWT interceptor
3. Auth flow: Supabase Auth hoặc custom JWT
4. API service layer per feature
5. State management + React Query cho server state
6. Upload ảnh: Supabase Storage
```

### Phase 5 — MOBILE (Flutter)
```
1. Folder structure theo Clean Architecture
2. dio package cho HTTP + interceptors JWT
3. BLoC/Cubit cho state management
4. Repository pattern: abstract → implementation
5. Local storage: Hive hoặc SharedPreferences
6. Push notification: Firebase Cloud Messaging
7. Image upload: dio multipart
```

### Phase 6 — DEPLOY
```
1. Docker Compose: tất cả services
2. .env.example documenting mọi keys
3. Test API: Postman / Thunder Client collection
4. CI/CD: GitHub Actions
```

---

## 🛠️ SKILLS

### SKILL: Python API (FastAPI)
```python
# Response chuẩn
from pydantic import BaseModel
from typing import Generic, TypeVar, Optional
T = TypeVar("T")

class APIResponse(BaseModel, Generic[T]):
    success: bool
    message: str
    data: Optional[T] = None

# Route handler chuẩn
@router.post("/", response_model=APIResponse[UserResponse], status_code=201)
async def create_user(
    payload: UserCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user = await user_service.create(db, payload)
    return APIResponse(success=True, message="Tạo thành công", data=user)
```
- Dùng **FastAPI** cho new Python projects (async native, auto docs)
- `pydantic-settings` cho config — không đọc `os.environ` trực tiếp
- `asyncpg` + `SQLAlchemy async` cho PostgreSQL
- `motor` cho MongoDB async
- `python-jose` + `passlib[bcrypt]` cho JWT + password
- Dependency Injection qua `Depends()` — không new service trong handler

### SKILL: ExpressJS / NodeJS
```javascript
// asyncHandler — không try/catch trong mọi route
const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Global error handler — luôn đặt cuối cùng
const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error',
    errors: err.errors || [],
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// Route example
router.get('/:id', asyncHandler(async (req, res) => {
  const data = await service.findById(req.params.id);
  if (!data) throw Object.assign(new Error('Not found'), { status: 404 });
  res.json({ success: true, data });
}));
```
- `express-validator` cho input validation
- `multer` → Supabase Storage cho file upload
- `helmet` + `cors` + `express-rate-limit` — luôn có trong production

### SKILL: JWT Authentication
```javascript
// JWT Flow
// 1. Login → accessToken (15m) + refreshToken (7d)
// 2. Lưu refreshToken hash vào DB
// 3. Mọi request: Bearer token trong Authorization header
// 4. /auth/refresh → validate → cấp accessToken mới
// 5. Logout → xóa refreshToken (blacklist)

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Unauthorized' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Token invalid or expired' });
  }
};

// Role guard
const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role))
    return res.status(403).json({ success: false, message: 'Forbidden' });
  next();
};
```

### SKILL: Supabase Storage (Image Upload)
```javascript
// Node: upload lên Supabase Storage
const uploadImage = async (file, bucket = 'images', folder = 'uploads') => {
  const ext  = file.originalname.split('.').pop();
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file.buffer, { contentType: file.mimetype });

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path);
  return { url: publicUrl, path };
};

// Xóa ảnh khi xóa entity
const deleteImage = async (path, bucket = 'images') =>
  supabase.storage.from(bucket).remove([path]);
```
- Bucket names: `avatars`, `posts`, `products`, `documents`
- Public bucket: ảnh hiển thị public. Private bucket: dùng signed URL
- Lưu cả `url` và `path` vào DB — cần `path` để xóa sau này

### SKILL: React Frontend
```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// src/api/client.ts — axios với JWT
import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res.data,
  async err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err.response?.data || err);
  }
);

export default api;
```
- **React Query** (`@tanstack/react-query`) cho server state
- **Zustand** cho client state (auth, ui, cart)
- `react-hook-form` + `zod` cho form validation
- Error boundary + Toast cho user feedback

### SKILL: Flutter Mobile (Clean Architecture)
```dart
// 1. Entity — domain layer, pure Dart
class User {
  final String id;
  final String email;
  final String? avatarUrl;
  const User({required this.id, required this.email, this.avatarUrl});
}

// 2. Repository interface — domain layer
abstract class UserRepository {
  Future<Either<Failure, User>> getUserById(String id);
}

// 3. Use case — domain layer
class GetUser {
  final UserRepository repo;
  GetUser(this.repo);
  Future<Either<Failure, User>> call(String id) => repo.getUserById(id);
}

// 4. Model — data layer, extends Entity
class UserModel extends User {
  const UserModel({required super.id, required super.email, super.avatarUrl});
  factory UserModel.fromJson(Map<String, dynamic> j) =>
    UserModel(id: j['id'], email: j['email'], avatarUrl: j['avatar_url']);
}
```
- **BLoC pattern** — không dùng `setState` ngoài leaf widget
- **dio** cho HTTP với interceptors (token inject + 401 refresh)
- **flutter_secure_storage** cho token — không dùng SharedPreferences cho secrets
- `freezed` + `json_serializable` để giảm boilerplate
- `fpdart` — `Either<Failure, Success>` cho error handling

---

## 📏 RULES

### ✅ ALWAYS DO

| # | Rule |
|---|------|
| 1 | **Hỏi trước khi code** — Yêu cầu mơ hồ → hỏi 1 câu rõ nhất |
| 2 | **ERD/Schema trước** — Mermaid ERD trước khi viết code |
| 3 | **Quyết định DB rõ ràng** — Giải thích lý do chọn Postgres vs MongoDB cho từng entity |
| 4 | **Validate mọi input** — Python: Pydantic · Node: express-validator · Flutter: Form validators |
| 5 | **Chuẩn hóa response** — `{ success, message, data }` ở mọi endpoint |
| 6 | **RLS cho Supabase** — Bật RLS + viết policies trước khi expose table |
| 7 | **Env variables** — Mọi secret đọc từ `.env`. Luôn có `.env.example` |
| 8 | **Repository pattern Flutter** — Domain layer không phụ thuộc data layer |
| 9 | **React Query** — Không fetch trong useEffect; dùng useQuery/useMutation |
| 10 | **Soft delete** — `deleted_at` timestamp thay vì xóa thật |
| 11 | **asyncHandler** — Wrap mọi Express route async |
| 12 | **Index đầy đủ** — Mọi field dùng trong WHERE/filter phải có index |
| 13 | **Giao tiếp tiếng Việt, code tiếng Anh** — Mọi phản hồi, giải thích bằng tiếng Việt. Code (biến, hàm, class, comment) bằng tiếng Anh |

### ❌ NEVER DO

| # | Rule |
|---|------|
| 1 | Hardcode URL, secret, API key trong source code |
| 2 | Expose password hash hoặc sensitive fields trong response |
| 3 | Bỏ qua RLS khi dùng Supabase anon key ở client |
| 4 | Dùng `any` type trong TypeScript — luôn type rõ ràng |
| 5 | Gọi API trực tiếp trong React component — phải qua service/hook |
| 6 | setState trong BLoC Flutter — logic trong Bloc, UI chỉ lắng nghe state |
| 7 | Lưu token trong `SharedPreferences` Flutter — dùng `flutter_secure_storage` |
| 8 | Viết business logic trong controller/route handler |
| 9 | Mix MongoDB và Postgres data không có cross-reference strategy rõ ràng |
| 10 | Push code chứa file `.env` thật — `.gitignore` bắt buộc |
| 11 | Viết code với tên biến/hàm tiếng Việt — luôn dùng tiếng Anh cho code |
| 12 | Trả lời bằng tiếng Anh khi người dùng hỏi bằng tiếng Việt |

---

## 🗺️ FEATURE FLOW TEMPLATE

Khi implement feature mới, Claude làm theo thứ tự:

```
1. 📊 Data Design
   └── Postgres hay MongoDB? → Schema/Model → ERD Mermaid
   └── Supabase Storage bucket (nếu có file)

2. 🔒 Auth & Permissions
   └── Endpoint nào cần auth? Role nào được làm gì?
   └── RLS policy nếu dùng Supabase

3. ⚙️ Backend
   └── Python (FastAPI): schema → service → router
   └── Node (Express): model → service → controller → route

4. 🖼️ File Upload (nếu có)
   └── multer (Node) / UploadFile (Python) → Supabase Storage → lưu URL + path vào DB

5. 🌐 API Endpoints
   └── Document: method · path · auth required · request body · response

6. 🔌 Frontend (React)
   └── API service function → useQuery/useMutation hook → Component

7. 📱 Mobile (Flutter)
   └── Model → Repository → UseCase → BLoC → Screen → Widget

8. 🧪 Test
   └── Postman collection: auth flow · upload · CRUD · error cases
```

---

## 🔌 CONNECT CHECKLIST

```bash
# .env.example — document đầy đủ
# === SUPABASE ===
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_KEY=eyJ...          # chỉ dùng ở backend

# === DATABASE ===
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
MONGODB_URI=mongodb://localhost:27017/dbname

# === JWT ===
JWT_SECRET=your-super-secret-min-32-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# === FRONTEND ===
VITE_API_URL=http://localhost:8000/api/v1
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...

# === FLUTTER ===
API_BASE_URL=http://10.0.2.2:8000/api/v1   # Android emulator → localhost
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
```

**CORS Config:**
```python
# FastAPI
app.add_middleware(CORSMiddleware,
  allow_origins=["http://localhost:5173", "https://your-domain.com"],
  allow_credentials=True, allow_methods=["*"],
  allow_headers=["Authorization", "Content-Type"],
)
```
```javascript
// Express
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(','),
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Authorization','Content-Type'],
}));
```

**Docker note:** services gọi nhau bằng service name, không phải `localhost`
```
backend → postgres   (không phải localhost:5432)
backend → mongodb    (không phải localhost:27017)
frontend → backend   (không phải localhost:8000)
```

---

## 📋 TECH DECISION GUIDE

| Dùng | Khi nào |
|------|---------|
| **Python / FastAPI** | AI/ML, data processing, complex computation, data pipelines |
| **Node / ExpressJS** | Realtime, file streaming, rapid CRUD API, webhooks |
| **PostgreSQL** | Users, auth, orders, payments — relational + ACID |
| **MongoDB** | Posts, logs, notifications, configs — flexible / nested documents |
| **Supabase** | Auth out-of-box, Storage, Realtime subscriptions, RLS |
| **React** | Web dashboard, admin panel, customer-facing web app |
| **Flutter** | Cross-platform mobile iOS + Android |

---

## ⚡ QUICK PROMPTS

```bash
# Schema design
"Thiết kế schema cho [tính năng X].
 Quyết định Postgres vs MongoDB. Viết ERD Mermaid + SQL migration + Mongoose schema."

# Full CRUD Node
"Viết full CRUD [resource] với ExpressJS:
 Model → Service → Controller → Router → Validation. Auth required: [yes/no]"

# Full CRUD Python
"Viết full CRUD [resource] với FastAPI:
 SQLAlchemy model → Pydantic schema → Service → Router. Auth required: [yes/no]"

# File upload
"Thêm upload ảnh cho [entity] dùng Supabase Storage.
 Backend: [Node/Python]. Bucket: [tên]. Lưu URL + path vào field [tên]."

# React feature
"Viết React feature [X]: API service + useQuery hook + Component.
 Dùng Supabase client: [yes/no]. Form validation với zod."

# Flutter feature
"Viết Flutter feature [X] theo Clean Architecture:
 Entity → Repository (abstract + impl) → UseCase → BLoC → Screen"

# Debug lỗi
"Lỗi: [paste error / stack trace]
 File: [tên] | Layer: [route/service/model/component/screen]
 Context: [mô tả ngắn]"

# CORS debug
"API [endpoint] bị lỗi [X] khi gọi từ [frontend/mobile].
 Backend: [Node/Python] port [X] | CORS config hiện tại: [paste]"
```
