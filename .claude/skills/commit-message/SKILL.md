---
name: commit-message
description: Use when staging or writing git commit messages in this repo. Enforces the project commit convention - Korean title with no period, body lines under 40 chars, fixed keyword set (feat/fix/docs/style/design/test/build/chore/rename/remove/ci/init plus refactor), focus on what and why over how. Also enforces commit-splitting rules - separate unrelated changes, group atomic ones. Skip for `git log`, history inspection, or read-only git commands.
---

# Commit Message Convention

이 레포의 커밋은 `.github/COMMIT_CONVENTION.md`의 규칙을 따른다. 새 커밋을 만들기 전에 아래 규칙을 반드시 적용한다.

## Format

```
키워드: 제목

본문 (생략 가능)
```

### 제목 (subject line)

- 한글로 작성. 영문 식별자(파일명, 함수명, 라이브러리명)는 그대로 둔다.
- **마침표를 붙이지 않는다.**
- `(scope)` 표기를 쓰지 않는다. `feat(book):` ❌ → `feat:` ⭕
- 무엇을 했는지 한 줄로 요약. 50자 내외 권장.

### 본문 (body)

- 본문이 없어도 되는 변경은 굳이 쓰지 않는다 (한 줄 커밋 OK).
- 본문을 쓸 때는 **한 줄당 40자를 초과하지 않는다.**
- **무엇과 왜**를 쓴다. 어떻게는 코드가 말한다.
  - ❌ "for 루프를 map으로 바꿈"
  - ⭕ "리스트 변환 로직을 선언적으로 표현해 가독성 향상"
- 항목이 여러 개면 `- ` 불릿으로 정렬한다.

## Keywords

이 키워드 셋 외의 단어(`perf`, `revert`, `wip` 등)는 쓰지 않는다.

| 키워드     | 사용 시점                                  |
| ---------- | ------------------------------------------ |
| `feat`     | 새로운 기능 추가                           |
| `fix`      | 이슈, 버그 수정                            |
| `docs`     | 문서 수정                                  |
| `style`    | 기능 수정이 없는, 코드 스타일 및 포맷 변경 |
| `design`   | UI 관련 변경                               |
| `refactor` | 동작은 그대로, 코드 구조만 개선            |
| `test`     | 테스트 코드 추가 및 변경                   |
| `build`    | 빌드 관련 파일 변경                        |
| `chore`    | 설정(config) 수정, 패키지 매니저 수정      |
| `rename`   | 파일 혹은 폴더 명 수정                     |
| `remove`   | 파일 삭제                                  |
| `ci`       | CI 설정 파일 수정                          |
| `init`     | 프로젝트 초기 세팅                         |

**키워드 판정이 헷갈릴 때:**

- 사용자가 보는 동작이 바뀌었나? → `feat` 또는 `fix`
- 코드 구조만 바뀌었나? → `refactor`
- 빌드/배포/도구 설정만 바뀌었나? → `build` / `chore` / `ci`
- 성능 개선이라도 코드 구조 변경이면 → `refactor`

## 커밋 분리 기준

### 나누는 게 좋은 경우

- 서로 다른 목적의 변경이 섞여 있을 때 (예: 기능 추가 + 버그 수정 + 문서)
- 서로 다른 앱/패키지를 건드렸고 독립적으로 이해 가능할 때
- 리팩토링과 기능 추가가 같이 있을 때 → **리팩토링 먼저, 기능 나중에**

### 하나로 묶는 게 좋은 경우

- 한 기능을 구현하기 위해 여러 파일을 동시에 건드린 경우
- 파일명 변경 + 해당 파일 참조 업데이트처럼 원자적으로 변경되어야 할 때
- 설정 파일 수정 + 그에 따른 코드 수정이 한 쌍일 때

### 한 파일에 두 가지 목적의 변경이 섞여 있을 때

`git add -p`로 hunk 단위 분리하거나, 파일을 임시로 HEAD 상태로 되돌렸다가 각 변경분을 순차적으로 적용하면서 커밋을 나눈다. "어쩔 수 없이 같이 커밋"은 마지막 수단으로만 쓴다.

## 예시

### 본문 없는 경우

```
fix: 개발 모드 서비스 버전 표시 수정
```

```
chore: eslint 설정 업데이트
```

### 본문 있는 경우

```
feat: 커서 기반 페이지네이션 구현

- cursorId를 URL 파라미터로 관리
- 그룹 전환 로직 훅으로 캡슐화
- Pagination UI 둥근 버튼 스타일로 변경
```

```
refactor: 필터링 시스템 일괄 초기화로 단순화

scope 단위 초기화는 상태 분기가 많아
예측하기 어려웠기 때문에 일괄 초기화로 통일
```

## 작성 절차

1. `git status` / `git diff --staged`로 무엇이 들어가는지 확인.
2. 변경이 한 가지 목적인지 검토. 두 가지 이상이면 **분리**.
3. 키워드 선택 → 한 줄 제목 작성 → (필요 시) 본문.
4. `Co-Authored-By` 같은 트레일러는 사용자가 명시적으로 요청하지 않으면 붙이지 않는다.
5. HEREDOC으로 메시지를 넘긴다:

   ```bash
   git commit -m "$(cat <<'EOF'
   feat: 한 줄 요약

   - 본문 첫 줄
   - 본문 둘째 줄
   EOF
   )"
   ```

## 푸시 전 메시지 정정

푸시하지 않은 커밋의 메시지를 일괄 정정해야 할 땐 `git filter-branch --msg-filter`로 SHA→새 메시지 매핑을 적용한다. (`-i` 플래그는 이 환경에서 쓸 수 없다.) 작업 전 반드시 백업 브랜치(`git branch backup-...`)를 만든다.
