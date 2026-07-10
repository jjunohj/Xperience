# Notion heading_4 블록 지원 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Notion 2026-03에 추가된 `heading_4` 블록을 블로그·북 상세 페이지에서 `<h4>`로 렌더링한다.

**Architecture:** `notion-to-md@3.1.9`가 모르는 `heading_4` 타입에 커스텀 트랜스포머를 등록해 표준 마크다운 `#### `를 방출한다. 순수 마크다운이므로 센티넬 마커·렌더러 오버라이드·TOC 변경이 전혀 필요 없다 — react-markdown 기본 h4 렌더 + 기존 `prose.css` 스타일 + `NotionToc`의 DOM 수집이 그대로 동작한다.

**Tech Stack:** notion-to-md 커스텀 트랜스포머, react-markdown (변경 없음)

## Global Constraints

- 테스트 러너 없음 — 검증은 `pnpm exec tsc --noEmit` + `pnpm lint` + 브라우저 수동 확인 + `pnpm build` (CLAUDE.md)
- worktree에서 `pnpm lint` 실패 시 M-13 우회: `.eslintrc.json`에 임시 `"root": true` 추가 → lint → `git checkout -- .eslintrc.json`
- 커밋은 commit-message 스킬 형식: 한국어 제목, 마침표 없음, scope 없음, 본문 한 줄 40자 이내
- 의존성 추가·업그레이드 금지 (notion-to-md v4, @notionhq/client 업그레이드는 범위 밖)
- 주석은 한국어, 식별자는 영어
- 센티넬 마커 미사용 — `####`는 표준 마크다운 (마커 철칙 해당 없음)

## File Structure

| 파일                                                            | 변경   | 책임                                            |
| --------------------------------------------------------------- | ------ | ----------------------------------------------- |
| `src/libs/notion/transformers.ts`                               | 수정   | heading_4 커스텀 트랜스포머 (마크다운 방출)     |
| `docs/superpowers/specs/2026-07-10-notion-h4-heading-design.md` | 생성   | 설계 문서                                       |
| `docs/superpowers/plans/2026-07-10-notion-h4-heading.md`        | 생성   | 구현 계획 (이 문서)                             |
| 렌더러·스타일·TOC·마커 상수                                     | 무변경 | 표준 마크다운이라 기존 파이프라인이 그대로 동작 |

---

### Task 1: spec·plan 문서 커밋

**Files:**

- Create(이미 작성됨): `docs/superpowers/specs/2026-07-10-notion-h4-heading-design.md`
- Create(이미 작성됨): `docs/superpowers/plans/2026-07-10-notion-h4-heading.md`

**Interfaces:**

- Consumes: 없음
- Produces: 이후 Task의 근거 문서 (feature 브랜치 첫 커밋)

- [ ] **Step 1: 두 문서를 feature 브랜치에 커밋**

```bash
git add docs/superpowers/specs/2026-07-10-notion-h4-heading-design.md \
        docs/superpowers/plans/2026-07-10-notion-h4-heading.md
git commit -m "docs: 노션 h4 헤딩 지원 설계·계획 문서 추가"
```

### Task 2: heading_4 커스텀 트랜스포머

**Files:**

- Modify: `src/libs/notion/transformers.ts` (embed 트랜스포머 블록 뒤, `getPageContentAsMarkdown` 앞에 추가)

**Interfaces:**

- Consumes: 같은 파일의 `richTextToMarkdown(richText: RichTextItemResponse[]): string` · `getChildrenAsMarkdown(blockId: string): Promise<string>` 헬퍼, `n2m` 싱글턴 (`./client`)
- Produces: `heading_4` 블록 → `#### <인라인 서식 보존 텍스트>` 마크다운. 렌더러는 별도 소비 코드 없음 (react-markdown 기본 동작)

- [ ] **Step 1: 트랜스포머 추가**

`transformers.ts`의 embed 트랜스포머(`n2m.setCustomTransformer("embed", ...)`) 블록 바로 아래에 추가:

```ts
// h4 헤딩 블록 변환 — heading_4는 Notion 2026-03 추가 블록이라
// SDK 타입 union과 notion-to-md 기본 switch에 없어 커스텀 트랜스포머로 지원
// (미등록 시 default 분기로 떨어져 헤딩이 일반 문단처럼 출력됨)
n2m.setCustomTransformer("heading_4", (async (block: BlockObjectResponse) => {
  const headingBlock = block as unknown as { heading_4: { rich_text: RichTextItemResponse[] } };
  // 공백만 있는 헤딩이 빈 <h4>로 남지 않도록 trim
  const text = richTextToMarkdown(headingBlock.heading_4.rich_text).trim();
  // 커스텀 트랜스포머를 등록하면 n2m의 children 재귀가 꺼지므로(blocksToMarkdown의
  // 재귀 가드) 토글 h4의 하위 블록은 callout과 같은 방식으로 직접 이어 붙인다
  const children = block.has_children ? await getChildrenAsMarkdown(block.id) : "";

  // 제목이 비면 헤딩은 생략하되 하위 블록 내용은 보존
  if (!text) return children;

  return children ? `#### ${text}\n\n${children}` : `#### ${text}`;
}) as CustomTransformer);
```

> 최초 계획은 children 미처리였으나 셀프리뷰에서 회귀(토글 h4 하위 블록 소실)로
> 판정되어 스펙 결정 4와 함께 갱신됨. 근거는 스펙의 결정 사항 4 참조.

주의: `BlockObjectResponse`, `RichTextItemResponse`, `CustomTransformer`는 이미 import되어 있음 — import 추가 불필요.

- [ ] **Step 2: 타입체크·린트**

Run: `pnpm exec tsc --noEmit && pnpm lint`
Expected: 둘 다 통과 (worktree에서 lint 실패 시 M-13 우회 적용)

- [ ] **Step 3: 커밋**

```bash
git add src/libs/notion/transformers.ts
git commit -m "feat: 노션 heading_4 블록 h4 렌더링 지원" -m "notion-to-md가 모르는 2026-03 신규 블록이
일반 문단으로 강등되던 문제를
커스텀 트랜스포머로 해결"
```

### Task 3: 엔드투엔드 수동 검증

**Files:** 코드 변경 없음 (검증 전용)

**Interfaces:**

- Consumes: Task 2의 트랜스포머, Notion 테스트 포스트(status=Upload)
- Produces: PR 첨부용 스크린샷 + 검증 결과

- [ ] **Step 1: Notion 테스트 포스트에 h4 케이스 3종 삽입**

status=Upload인 테스트 포스트에: ① 일반 h4 ② 볼드·링크 포함 h4 ③ 빈 텍스트 h4

- [ ] **Step 2: dev 서버에서 확인**

Run: `pnpm dev` 후 해당 포스트 접속. 체크리스트:

- h4가 `<h4>` 태그 + prose 스타일로 렌더 (평문 문단 아님)
- 볼드·링크 등 인라인 서식 보존
- 빈 h4는 화면에 아무것도 남기지 않음
- NotionToc 목차에 level 4로 표시되고 앵커 클릭 시 스크롤
- 다크모드 토글 정상, 375px 뷰포트 정상, 콘솔 hydration 경고 0건
- 일반 본문 텍스트 오탐 없음
- 북 상세(`/book/[slug]`)에서도 h4 렌더 확인 (북 DB에 h4 넣을 수 없으면 트랜스포머 공유 사실을 PR 본문에 근거로 기재)

- [ ] **Step 3: 프로덕션 빌드**

Run: `pnpm build`
Expected: 성공

- [ ] **Step 4: 스크린샷 캡처**

라이트/다크 각 1장 — PR 본문 첨부용 (UI 변경이므로 필수)

---

## Self-Review

- 스펙 커버리지: 결정 1·3(트랜스포머+서식 보존)→Task 2, 결정 2·4·5(무변경 확인)→Task 3 체크리스트, 에러 처리(빈 rich_text)→Task 2 코드 + Task 3 케이스 ③, 테스트·검증 절→Task 2 Step 2 + Task 3. 범위 밖 항목은 어떤 Task도 건드리지 않음. 갭 없음.
- 플레이스홀더: 없음 (모든 코드·명령·커밋 메시지 명시).
- 타입 일관성: `richTextToMarkdown` 시그니처는 기존 파일 정의와 일치, 신규 심볼 없음.
