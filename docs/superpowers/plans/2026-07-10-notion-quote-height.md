# Notion 인용문 세로 바 높이 정합 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 인용문(blockquote)의 좌측 브랜드색 세로 바가 본문 텍스트 높이에 정확히 맞게 한다.

**Architecture:** 순수 CSS 수정. `prose.css`의 `.prose blockquote`에서 상하 padding을 제거하고, 첫/끝 문단의 상하 마진을 0으로 만드는 자식 셀렉터 규칙을 추가한다. 바(`border-l-4`)는 padding box까지 그려지므로 상하 padding·내부 문단 마진이 사라지면 텍스트 높이와 일치한다. prose.css는 블로그·북 레이아웃이 공유하므로 한 번에 둘 다 해결된다.

**Tech Stack:** CSS (prose.css), 코드·컴포넌트 변경 없음

## Global Constraints

- 테스트 러너 없음 — 검증은 `pnpm exec tsc --noEmit` + `pnpm lint` + 브라우저 수동 확인 + `pnpm build` (CLAUDE.md)
- worktree에서 `pnpm lint` 실패 시 M-13 우회: `.eslintrc.json`에 임시 `"root": true` 추가 → lint → `git checkout -- .eslintrc.json`
- 커밋은 commit-message 스킬 형식: 한국어 제목, 마침표 없음, scope 없음, 본문 한 줄 40자 이내
- 콜아웃(`aside.notion-callout`)·인용문 색상·폰트는 건드리지 않는다 (스펙 범위 밖)

## File Structure

| 파일                                                              | 변경 | 책임                                             |
| ----------------------------------------------------------------- | ---- | ------------------------------------------------ |
| `src/styles/prose.css`                                            | 수정 | blockquote 상하 padding 제거 + 첫/끝 문단 마진 0 |
| `docs/superpowers/specs/2026-07-10-notion-quote-height-design.md` | 생성 | 설계 문서                                        |
| `docs/superpowers/plans/2026-07-10-notion-quote-height.md`        | 생성 | 구현 계획 (이 문서)                              |

---

### Task 1: spec·plan 문서 커밋

**Files:**

- Create(이미 작성됨): `docs/superpowers/specs/2026-07-10-notion-quote-height-design.md`
- Create(이미 작성됨): `docs/superpowers/plans/2026-07-10-notion-quote-height.md`

**Interfaces:**

- Consumes: 없음
- Produces: 이후 Task의 근거 문서 (feature 브랜치 첫 커밋)

- [ ] **Step 1: 두 문서를 feature 브랜치에 커밋**

```bash
git add docs/superpowers/specs/2026-07-10-notion-quote-height-design.md \
        docs/superpowers/plans/2026-07-10-notion-quote-height.md
git commit -m "docs: 인용문 바 높이 정합 설계·계획 문서 추가"
```

### Task 2: prose.css blockquote 수정

**Files:**

- Modify: `src/styles/prose.css:140-155` (인용구 스타일 블록)

**Interfaces:**

- Consumes: 없음 (독립 CSS)
- Produces: `.prose blockquote` 스타일 — 두 레이아웃의 plain 인용문이 소비

- [ ] **Step 1: 스타일 수정**

기존:

```css
/* 인용구 스타일 */
.prose blockquote {
  @apply border-l-4 border-brand-400;
  padding-left: 1.25rem;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  margin-top: 2rem;
  margin-bottom: 2rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.6;
}

.prose blockquote p {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}
```

변경 후:

```css
/* 인용구 스타일 — 좌측 바가 텍스트 높이에 맞도록 상하 padding 없음 */
.prose blockquote {
  @apply border-l-4 border-brand-400;
  padding-left: 1.25rem;
  margin-top: 2rem;
  margin-bottom: 2rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.6;
}

.prose blockquote p {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

/* 첫/끝 문단의 바깥쪽 마진 제거 (문단 사이 간격은 유지) */
.prose blockquote > p:first-child {
  margin-top: 0;
}

.prose blockquote > p:last-child {
  margin-bottom: 0;
}
```

- [ ] **Step 2: 타입체크·린트**

Run: `pnpm exec tsc --noEmit && pnpm lint`
Expected: 둘 다 통과 (worktree에서 lint 실패 시 M-13 우회 적용)

- [ ] **Step 3: 커밋**

```bash
git add src/styles/prose.css
git commit -m "design: 인용문 좌측 바 높이를 텍스트에 맞게 수정" -m "상하 padding과 첫/끝 문단 마진이
바를 텍스트보다 길게 그리던 문제"
```

### Task 3: 엔드투엔드 수동 검증

**Files:** 코드 변경 없음 (검증 전용)

**Interfaces:**

- Consumes: Task 2의 스타일, 인용문이 포함된 실제 포스트
- Produces: PR 첨부용 스크린샷 + 검증 결과

- [ ] **Step 1: 인용문 있는 포스트 확보**

기존 Upload 포스트 중 quote 블록이 있는 글을 찾는다 (없으면 상황 보고 후 사용자에게 테스트 블록 추가 요청).

- [ ] **Step 2: dev 서버에서 확인**

Run: `pnpm dev` 후 해당 포스트 접속. 체크리스트:

- 좌측 바 상단·하단이 텍스트 첫/끝 라인과 일치 (개발자도구 border box)
- 다중 문단 인용에서 문단 사이 0.5rem 간격 유지
- 인용 블록과 본문 사이 상하 간격(2rem) 유지
- 콜아웃 렌더 무변화 (aside.notion-callout 별도 클래스)
- 다크모드 토글 정상, 375px 정상, hydration 경고 0건

- [ ] **Step 3: 프로덕션 빌드**

Run: `pnpm build`
Expected: 성공

- [ ] **Step 4: 스크린샷 캡처**

수정 후 라이트/다크 각 1장 — PR 본문 첨부용 (UI 변경이므로 필수)

---

## Self-Review

- 스펙 커버리지: 결정 1·2(padding 제거+첫/끝 마진 0)→Task 2 Step 1, 결정 3(블록 간격 유지)→Task 3 체크리스트, 결정 4(콜아웃 무영향)→Task 3 체크리스트, 결정 5(블로그·북 공유)→Architecture 명시. 갭 없음.
- 플레이스홀더: 없음 (기존/변경 CSS 전문, 명령·커밋 메시지 명시).
- 타입 일관성: 신규 심볼 없음, 셀렉터 명칭 spec과 일치 (`> p:first-child`/`> p:last-child`).
