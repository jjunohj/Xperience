# BookCard 제목 마퀴 구현 계획

> 설계: `docs/superpowers/specs/2026-06-06-book-card-title-marquee-design.md` · 이슈 #56

**Goal:** BookCard 긴 제목의 `...` 말줄임을, 넘칠 때만 일정 속도로 슬라이드(끝→3초→즉시 점프→반복)하는 마퀴로 교체. 저자는 우측 자연 너비 유지.

**Architecture:** 마퀴 로직을 `MarqueeText` 컴포넌트로 분리. 클라이언트에서 `scrollWidth - clientWidth`로 넘침 측정(`ResizeObserver` + 폰트 로드 후 재측정), framer-motion `x` 키프레임 + `repeat:"loop"`로 점프 복귀. 첫 페인트는 정적 말줄임 → SEO/SSR 무영향.

**Tech Stack:** framer-motion(기존), Tailwind, React 19. (프로젝트에 테스트 러너 없음 → 검증은 타입체크·lint·시각.)

---

### Task 1: `MarqueeText` 컴포넌트 생성

- Create `src/app/book/_components/MarqueeText.tsx`
- props: `text`, `className`, `speed`(기본 30), `startDelay`(1), `endDelay`(3)
- `containerRef.scrollWidth - clientWidth`로 `distance` 측정, `ResizeObserver`/`document.fonts.ready` 재측정
- `distance>0 && !reducedMotion`일 때만 마퀴, 아니면 `truncate` 폴백
- 마퀴: `x:[0,0,-distance,-distance]`, `times`로 시작정지/스크롤/끝정지 분배, `ease:"linear"`, `repeat:Infinity`, `repeatType:"loop"`, `key={distance}`
- 두 분기 모두 `<h3>` + `min-w-0 flex-1`

### Task 2: `BookCard` 적용

- Modify `src/app/book/_components/BookCard.tsx`
- `import MarqueeText from "./MarqueeText";`
- 제목 `<h3 line-clamp-1>` → `<MarqueeText text=... className="text-xl font-bold ..." />`
- 저자 `<p shrink-0>` 그대로

### Task 3: 검증

- `npx tsc --noEmit` 에러 0
- `pnpm lint` 에러 0
- `/book` 시각: 긴 제목 슬라이드(시작1s→슬라이드→끝3s→점프→반복), 짧은 제목 정지, 저자 잘림 없음·baseline 정렬, 다크모드, reduced-motion 폴백
