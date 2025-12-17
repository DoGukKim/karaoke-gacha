# 노래방 애창곡 뽑기 (Karaoke Gacha)

## 프로젝트 개요

- **서비스명**: 노래방 애창곡 뽑기 (Karaoke Gacha)
- **플랫폼**: 토스 미니앱 (Toss Mini App)
- **서비스 한 줄 소개**: "코노 필수템! 랜덤 노래 뽑기"
- **핵심 가치**: 결정 장애 해결, 발견의 재미, 큐레이션, 잊고있던 명곡 발견
- **타겟**: 코인노래방(코노)을 이용하는 MZ세대

## 기술 스택

| 분류 | 기술 | 용도 |
|------|------|------|
| Framework | Next.js 16 + React 19 | Full-stack app (App Router) |
| Language | TypeScript 5 | 정적 타입 지원 |
| Styling | Tailwind CSS 4 + Emotion | 유틸리티 CSS |
| State (Client) | Zustand 5 | 클라이언트 상태 관리 |
| State (Server) | TanStack Query 5 | 서버 상태, 캐싱, prefetch |
| Validation | Zod 4 | 스키마 검증, DTO 매핑 |
| Component | CVA (class-variance-authority) | 타입 안전 variant 컴포넌트 |
| Backend | Supabase + PostgreSQL | DB, RPC, Storage |
| Design System | @toss/tds-mobile | 토스 UI 컴포넌트 |
| Build | Granite + Next.js | 토스 미니앱 빌드 |
| Deploy | AIT CLI | 토스 미니앱 배포 |

## 프로젝트 구조 (Clean Architecture + FSD)

```
src/
├── app/                          # Next.js App Router (Pages & Layouts)
│   ├── layout.tsx               # 루트 레이아웃 (Provider 설정)
│   ├── page.tsx                 # 홈 페이지 (가챠 머신)
│   ├── globals.css              # 전역 스타일, 커스텀 애니메이션
│   └── recommendations/
│       └── page.tsx             # 추천 결과 페이지
│
├── domain/                       # 도메인 레이어 (순수 비즈니스 로직)
│   └── song/
│       └── model.ts             # Song 인터페이스, 상수
│
├── features/                     # 기능 모듈 (Feature-Sliced Design)
│   └── song/
│       ├── actions/             # Server Actions
│       │   └── getRandomSongsAction.ts
│       ├── hooks/               # React Query 훅
│       │   ├── keys.ts          # Query Key Factory
│       │   └── useRandomSongs.ts
│       ├── ports/               # 인터페이스 (계약)
│       │   └── repository.ts    # ISongRepository
│       ├── ui/                  # UI 컴포넌트
│       │   ├── SongList.tsx     # 노래 목록
│       │   └── SongItem.tsx     # 노래 카드
│       └── usecase/             # Use Case
│           └── getRandomSongs.ts
│
├── infrastructure/               # 인프라 레이어 (외부 시스템 연동)
│   ├── adapters/                # Repository 구현체
│   │   └── SongRepository.ts    # Supabase 어댑터
│   ├── di/                      # 의존성 주입
│   │   └── container.ts         # DI 컨테이너
│   ├── lib/                     # 외부 라이브러리 클라이언트
│   │   ├── supabase/client.ts   # Supabase 클라이언트
│   │   └── tanstackQuery/client.ts
│   ├── providers/               # React Provider
│   │   ├── QueryProvider.tsx
│   │   └── TDSProvider.tsx
│   └── schemas/                 # Zod 스키마
│       └── song.ts              # DTO 검증 & 도메인 매핑
│
├── view/                         # View 레이어 (복합 UI)
│   └── widgets/
│       └── GachaMachine/        # 가챠 머신 위젯
│           ├── GachaMachine.tsx # CVA 기반 컴포넌트
│           └── GachaMachineHero.tsx
│
└── shared/                       # 공용 유틸리티
    ├── lib/
    │   ├── cn.tsx               # Tailwind 클래스 머지 유틸
    │   └── env.ts               # 환경 변수 검증
    └── ui/
        ├── MarqueeText.tsx      # 스크롤 텍스트 애니메이션
        └── icons/
            └── SpotifyIcon.tsx
```

## 데이터 흐름 아키텍처

```
UI (SongList, GachaMachine)
        │ useQuery/usePrefetchQuery
        ▼
React Hooks (useRandomSongs)
        │ TanStack Query
        ▼
Server Actions (getRandomSongsAction)
        │ DI Container
        ▼
Use Case (GetRandomSongsUseCase)
        │ Repository Pattern
        ▼
Repository (SongRepository)
        │ Zod Validation
        ▼
Supabase (RPC: get_random_songs)
        │ HTTP
        ▼
PostgreSQL Database
```

## 도메인 모델

### Song

```typescript
interface Song {
  id: string;
  title: string;
  artist: string;
  artWorkUrl: string;
  spotifyUrl: string;
}

const DEFAULT_RANDOM_SONG_COUNT = 15;
```

## 핵심 디자인 패턴

1. **Dependency Injection** - `container.ts`에서 의존성 관리
2. **Repository Pattern** - `ISongRepository` 인터페이스로 데이터 접근 추상화
3. **Use Case Pattern** - 단일 책임 비즈니스 로직 클래스
4. **Server Actions** - 클라이언트에서 안전한 서버 호출
5. **React Query** - 서버 상태 관리 + Prefetch
6. **Zod Validation** - DTO → Domain 매핑 시 검증
7. **CVA** - 컴포넌트 variant 타입 안전 관리
8. **Barrel Exports** - `index.ts`를 통한 깔끔한 모듈 인터페이스

## 사용자 플로우

### 1. 홈 페이지 (`/`)
- GachaMachine 컴포넌트 (floating 상태)
- "노래 뽑기" 버튼 클릭
- `usePrefetchRandomSongs(15)` 호출
- 1700ms 동안 shake 애니메이션
- `/recommendations`로 이동

### 2. 추천 페이지 (`/recommendations`)
- `useRandomSongs(15)` 훅으로 데이터 fetch
- SongList로 15곡 표시
- 각 노래: 앨범아트, 제목, 아티스트, Spotify 링크
- "다시 뽑기" 버튼으로 새로운 랜덤 곡 요청

## 명령어

```bash
pnpm dev          # 개발 서버 실행
pnpm build        # 프로덕션 빌드
pnpm lint         # ESLint 검사
pnpm deploy       # 토스 미니앱 배포

# 데이터 시딩 (Spotify 플레이리스트에서 노래 가져오기)
pnpm seed <playlist_id>           # 단일 플레이리스트 import
pnpm seed p1 p2 p3                # 다중 플레이리스트 import
pnpm seed clear                   # 모든 노래 삭제
```

## 환경 변수

```env
NEXT_PUBLIC_SUPABASE_URL=         # Supabase 프로젝트 URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=    # Supabase 익명 키
SUPABASE_SERVICE_ROLE_KEY=        # Supabase 서비스 역할 키

# seed 스크립트용 (선택)
SPOTIFY_CLIENT_ID=                # Spotify API 클라이언트 ID
SPOTIFY_CLIENT_SECRET=            # Spotify API 시크릿
```

## 외부 연동

### Supabase
- **Database**: `songs` 테이블 + `get_random_songs(count)` RPC 함수
- **Storage**: CDN으로 이미지 호스팅 (가챠 머신, 로고)

### Spotify
- 노래 메타데이터 (제목, 아티스트, 앨범아트)
- 딥링크용 Spotify URL
- seed 스크립트에서 플레이리스트 import

### Toss Design System
- UI 컴포넌트: BottomCTA, FixedBottomCTA, Result, Skeleton, Post, Paragraph
- Provider: TDSMobileAITProvider

## 커스텀 애니메이션 (globals.css)

| 애니메이션 | 용도 |
|-----------|------|
| `animate-float` | 가챠 머신 부유 효과 |
| `animate-shake` | 가챠 머신 흔들림 (뽑기 중) |
| `animate-shadow` | 가챠 머신 그림자 펄스 |
| `animate-marquee` | 긴 텍스트 스크롤 |

## 코딩 컨벤션

- Prettier + ESLint 사용
- Tailwind CSS 클래스 자동 정렬 (`prettier-plugin-tailwindcss`)
- Barrel export 패턴 (`index.ts` 사용)
- Zod 스키마로 외부 데이터 검증
- snake_case (DB) → camelCase (JS) 변환

## 주요 파일 위치 (빠른 참조)

| 용도 | 경로 |
|------|------|
| 도메인 모델 | `src/domain/song/model.ts` |
| Use Case | `src/features/song/usecase/getRandomSongs.ts` |
| Repository 인터페이스 | `src/features/song/ports/repository.ts` |
| Repository 구현체 | `src/infrastructure/adapters/SongRepository.ts` |
| DI 컨테이너 | `src/infrastructure/di/container.ts` |
| React Query 훅 | `src/features/song/hooks/useRandomSongs.ts` |
| Server Action | `src/features/song/actions/getRandomSongsAction.ts` |
| 가챠 머신 위젯 | `src/view/widgets/GachaMachine/` |
| 홈 페이지 | `src/app/page.tsx` |
| 추천 페이지 | `src/app/recommendations/page.tsx` |
| 전역 스타일 | `src/app/globals.css` |
| Supabase 클라이언트 | `src/infrastructure/lib/supabase/client.ts` |
| 환경 변수 검증 | `src/shared/lib/env.ts` |
