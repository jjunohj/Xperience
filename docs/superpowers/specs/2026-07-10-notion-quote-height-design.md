# Notion 인용문 세로 바 높이 정합 — 설계

날짜: 2026-07-10
관련 작업: 인용문(quote) 블록의 좌측 바가 본문 텍스트보다 위아래로 튀어나오는 문제 수정

## 배경

Notion에서 `"`로 작성한 인용문(quote 블록)은 n2m 기본 변환으로 `> …` 마크다운이
되고, `NotionBlockquote`가 콜아웃 마커가 없으면 plain `<blockquote>`로 렌더한다.
`prose.css:140`의 `.prose blockquote`가 상하 `padding 0.75rem`을 주고, 내부
`.prose blockquote p`가 상하 `margin 0.5rem`을 더해, 좌측 브랜드색 세로 바
(`border-l-4`)가 **텍스트보다 위아래로 합계 ~1.25rem씩 길게** 그려진다.
Notion 원본 스타일은 바가 텍스트 높이에 정확히 맞는다.

## 결정 사항

1. **수정 지점은 `src/styles/prose.css` 한 곳.** `.prose blockquote`의
   `padding-top`/`padding-bottom`을 0으로 바꾸고, 첫/끝 문단의 상하 마진을
   0으로 만드는 `>` 자식 셀렉터 규칙을 추가한다.
2. **문단 사이 간격은 유지.** 다중 문단 인용에서 문단 간 0.5rem 간격은
   그대로 두고, 첫 문단의 위쪽·마지막 문단의 아래쪽 마진만 제거한다
   (`> p:first-child` / `> p:last-child`).
3. **블록 바깥 간격(margin 2rem)은 유지.** margin은 border 바깥이라 바
   길이에 영향이 없고, 본문과의 상하 간격 리듬은 보존한다.
4. **콜아웃은 무영향.** 콜아웃은 `aside.notion-callout` 별도 클래스로
   렌더되어 `.prose blockquote` 규칙을 타지 않는다.
5. **블로그·북 동시 해결.** prose.css는 두 레이아웃(`NotionPostLayout`,
   `BookPostLayout`)이 공유하는 `.prose` 스타일 원천이다.

## 데이터 흐름

```
Notion quote 블록 → n2m 기본 "> …" → NotionBlockquote(마커 없음) → <blockquote>
 → prose.css .prose blockquote (padding 상하 0, 첫/끝 문단 마진 0)
 → 좌측 바가 텍스트 높이와 일치
```

## 구성 요소

| 구성 요소                     | 변경 | 내용                                             |
| ----------------------------- | ---- | ------------------------------------------------ |
| `src/styles/prose.css`        | 수정 | blockquote 상하 padding 제거 + 첫/끝 문단 마진 0 |
| `NotionBlockquote` / 레이아웃 | 없음 | 렌더 경로 그대로                                 |
| `.notion-callout` 스타일      | 없음 | 별도 클래스, 무영향                              |

## 에러 처리 · 폴백

- 순수 CSS 변경으로 런타임 실패 경로 없음. 다중 문단·단일 문단·긴 줄바꿈
  인용 모두 동일 규칙이 적용된다.

## 테스트 · 검증

1. `pnpm exec tsc --noEmit` + `pnpm lint` (worktree면 M-13 우회)
2. 인용문이 있는 실제 포스트에서 `pnpm dev`로:
   - 좌측 바 상단·하단이 텍스트 라인과 일치 (개발자도구로 border box 확인)
   - 다중 문단 인용에서 문단 간 간격 유지
   - 본문과 인용 블록 사이 상하 간격(2rem) 유지
   - 콜아웃 렌더 무변화, 다크모드·375px 정상
3. `pnpm build` 성공

## 범위 밖 (YAGNI)

- 인용문 색상·폰트·이탤릭 등 시각 스타일 변경 — 높이 정합만 다룬다.
- 콜아웃(`aside.notion-callout`) 스타일 — 별도 클래스, 건드리지 않는다.
- tailwind typography 설정의 blockquote 관련 항목 — prose.css가 원천이므로
  중복 수정하지 않는다.
