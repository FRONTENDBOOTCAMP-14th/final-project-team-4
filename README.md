# 📌 Minimo

**Mini + Motivation**  
_"작은 성취가 큰 성공으로 이어진다"_

---

**Minimo**는 사용자가 작은 챌린지를 만들고, 참여하며, 인증을 통해 성취감을 쌓을 수 있는 **참여형 SNS 플랫폼**입니다.

큰 목표는 멀게 느껴질 수 있지만, 작은 도전을 하나씩 해내면서 얻는 성취감은 우리를 더 큰 도전으로 이끌어줍니다.  
사소한 성취라도 기록하고 자신감을 쌓을 수 있는 서비스를 만들고자, **미니 챌린지 SNS**를 기획하게 되었습니다.

---

## 🚀 기능 (Features)

- **챌린지 생성**: 사용자가 직접 챌린지 생성 가능

- **챌린지 참여**: 챌린지에 참여 가능

- **인증 기능**: 참여 후 사진으로 인증

- **댓글 및 소통**: 댓글 작성 및 피드백

- **참여 기록 확인**: 내가 참여한 챌린지 및 기록 확인

- **커뮤니티 기능**: 인기 챌린지 확인 및 사용자 상호작용

---

## 📂 프로젝트 구조 (Project Structure)

```plaintext
minimo/
├─ public/                       # 정적 파일
│   ├─ icon.png
│   └─ fonts/
│
├─ src/
│   ├─ app/                      # App Router 라우팅 & 메타데이터
│   │   ├─ layout.tsx            # 모든 페이지 공통 레이아웃
│   │   ├─ page.tsx              # "/" 메인 페이지 (홈)
│   │   │
│   │   ├─ icon.png              # favicon 역할
│   │   ├─ manifest.ts           # PWA manifest
│   │   ├─ robot.ts              # 웹 크롤링 설정
│   │   │
│   │   ├─ users/
│   │   ├─ challenges/
│   │   └─ auth/
│   │
│   ├─ components/               # UI 컴포넌트 모음
│   ├─ lib/                      # 외부 API/DB 클라이언트, 설정 등
│   ├─ utils/                    # 순수 유틸 함수 모음
│   └─ styles/                   # 전역 스타일
│
├─ .gitignore                    # gitignore 설정
├─ .prettierrc                   # Prettier 설정
├─ .eslint.config.mjs            # ESLint 설정
├─ next-env.d.ts
├─ next.config.ts                # Next.js 설정
├─ tsconfig.json                 # TypeScript 설정
├─ README.md
├─ package.json
└─ bun.lock / package-lock.json

```

---

## ⚙️ 설치 및 실행 (Installation & Usage)

### 1. 저장소 클론

```bash
git clone https://github.com/FRONTENDBOOTCAMP-14th/final-project-team-4.git
cd final-project-team-4
```

### 2. 의존성 설치

```bash
bun install
```

### 3. 실행

```bash
bun start
```

---

## 🛠 기술 스택 (Tech Stack)

| 분류             | 사용 기술           |
| ---------------- | ------------------- |
| ⚙️ 프레임워크    | Next.js, React, PWA |
| 💻 언어          | TypeScript          |
| 🗄 데이터베이스  | Supabase            |
| 🔄 상태 관리     | Zustand, SWR        |
| 🎨 스타일링      | Module CSS          |
| 🚀 배포          | Vercel              |
| 📦 패키지 매니저 | Bun                 |
| 💬 커뮤니케이션  | Discord             |

---

## 🙌 제작자 (Authors)

- **박민성** – [GitHub](https://github.com/PMS990126)
- **차지현** – [GitHub](https://github.com/chajiiiii)
- **이지수** – [GitHub](https://github.com/chacokyo)
- **정우진** – [GitHub](https://github.com/wjinss)
