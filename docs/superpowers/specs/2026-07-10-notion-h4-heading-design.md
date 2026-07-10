# Notion heading_4 블록 지원 — 설계

날짜: 2026-07-10
관련 작업: 노션 h4 헤딩 블록을 블로그에서 렌더링

## 배경

Notion이 2026-03 업데이트로 `heading_4` 블록을 추가했다. 이 레포의 마크다운 변환기
`notion-to-md@3.1.9`는 `heading_1`~`heading_3`만 알고, 미지 타입은 default 분기에서
rich_text만 추출해 **일반 문단처럼 출력**한다. 그 결과 Notion 본문의 h4 헤딩이
블로그에서 헤딩 시맨틱을 잃고 평문으로 렌더된다.

참고 선례: `~/appsuit-fe/apps/home/src/lib/cms-notion/blocks.ts`가 같은 문제를
겪었다. 고정된 SDK 타입 union에 `heading_4`가 없어 switch로 잡히지 않으므로,
`type` 문자열 검사 + 캐스팅으로 level 4 헤딩으로 정규화하고 TOC에 포함시켰다.
이 레포는 파이프라인 구조가 다르므로(블록 정규화 대신 n2m 커스텀 트랜스포머)
원리만 가져온다.

## 결정 사항

1. **수정 지점은 `src/libs/notion/transformers.ts` 한 곳.**
   `n2m.setCustomTransformer("heading_4", ...)`로 `#### <텍스트>`를 방출한다.
   n2m은 커스텀 트랜스포머를 타입 문자열 키로 조회하므로 SDK union에 없는
   타입에도 동작함을 소스(`notion-to-md.js:230`)에서 확인했다.
2. **센티넬 마커를 쓰지 않는다.** `####`는 순수 마크다운이라 react-markdown이
   기본으로 `<h4>`를 렌더한다. 마커 상수·렌더러 오버라이드·`<p>` 언랩 분기가
   모두 불필요하다.
3. **인라인 서식 보존.** 기존 헬퍼 `richTextToMarkdown`을 재사용해 볼드·링크·
   인라인 수식 등 annotation을 유지한다. 공백만 있는 헤딩이 빈 `<h4>`로 남지
   않도록 텍스트를 trim한다.
4. **토글 h4의 하위 블록을 보존한다.** n2m은 커스텀 트랜스포머가 등록된 타입의
   children 재귀를 건너뛴다(`blocksToMarkdown`의 재귀 가드, notion-to-md.js:202).
   등록 전에는 토글 h4의 하위 블록이 이 재귀로 렌더되고 있었으므로, 트랜스포머가
   children을 처리하지 않으면 **기존 대비 콘텐츠 소실 회귀**가 된다. callout
   트랜스포머와 동일하게 `getChildrenAsMarkdown`으로 하위 블록을 이어 붙인다.
   (셀프리뷰에서 발견 — 최초 설계의 "토글 children 미지원" 결정을 뒤집음.
   미지원 근거였던 "h1~3과 대칭" 전제가 틀렸다: h1~3은 커스텀 트랜스포머가
   아니어서 children이 렌더된다.)
5. **렌더러·스타일·TOC는 무변경.** `prose.css`에 `.prose h4` 스타일이 이미 있고,
   tailwind typography 설정의 scroll-margin이 h4를 포함하며, `NotionToc`는 DOM에서
   `h1~h6`를 수집하므로 자동 반영된다. 트랜스포머는 블로그(`NotionPostLayout`)와
   북(`BookPostLayout`) 양쪽이 공유하므로 한 번의 수정으로 둘 다 해결된다.
6. **rehypeSanitize 스키마 무변경.** 기본 스키마가 h1~h6을 허용한다.

## 데이터 흐름

```
Notion heading_4 블록
 → transformers.ts 커스텀 트랜스포머: "#### " + richTextToMarkdown(rich_text)
 → 마크다운 문자열 (순수 표준 문법, 마커 없음)
 → react-markdown 기본 렌더링 → <h4>
 → prose.css의 .prose h4 스타일 적용, NotionToc가 DOM에서 자동 수집
```

## 구성 요소

| 구성 요소                              | 변경 | 내용                                       |
| -------------------------------------- | ---- | ------------------------------------------ |
| `src/libs/notion/transformers.ts`      | 수정 | `heading_4` 커스텀 트랜스포머 추가 (~10줄) |
| 마커 상수 (`data/constants/notion.ts`) | 없음 | 마커 미사용                                |
| `NotionPostLayout` / `BookPostLayout`  | 없음 | react-markdown 기본 h4 렌더                |
| `prose.css` / tailwind typography      | 없음 | h4 스타일 기존재                           |
| `NotionToc`                            | 없음 | h1~h6 DOM 수집으로 자동 포함               |

## 에러 처리 · 폴백

- `rich_text`가 비었거나 공백뿐이면 헤딩은 생략하되, 토글 하위 블록이 있으면
  그 내용만 보존해 반환한다 (콘텐츠 소실 방지).
- SDK 타입 union에 `heading_4`가 없으므로 appsuit-fe 선례처럼 명시적 캐스팅으로
  접근하고, 캐스팅 사유를 주석으로 남긴다.

## 테스트 · 검증

테스트 러너가 없으므로 CLAUDE.md 공통 게이트를 따른다:

1. `pnpm exec tsc --noEmit` + `pnpm lint` (worktree면 M-13 우회)
2. Notion 테스트 포스트(status=Upload)에 h4 블록(일반 / 인라인 서식 포함 / 빈
   텍스트) 삽입 후 `pnpm dev`에서:
   - h4가 `<h4>`로 렌더되고 prose 스타일 적용
   - NotionToc에 level 4로 표시, 앵커 스크롤 동작
   - 다크모드·375px 정상, hydration 경고 0건
   - 블로그·북 상세 양쪽 확인
3. `pnpm build` 성공

## 범위 밖 (YAGNI)

- **heading_5 / heading_6** — Notion에 존재하지 않는 블록. 추가하지 않는다.
- **notion-to-md v4 업그레이드** — 베타이고 API가 전면 개편됨. 별도 작업.
- **@notionhq/client 업그레이드** — heading_4 타입이 포함된 SDK가 나와도 이번
  작업에서는 올리지 않는다 (의존성 변경은 에스컬레이션 대상).
