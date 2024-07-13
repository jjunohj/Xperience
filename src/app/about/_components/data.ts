import { Activity, Project, TechStack } from "./type";

export const techStacks: TechStack[] = [
  {
    title: "프로그래밍 언어",
    elements: ["JavaScript", "TypeScript", "Python"],
  },
  {
    title: "웹 프레임워크/라이브러리",
    elements: [
      "React",
      "Next.js",
      "Node.js",
      "Tailwind CSS",
      "Styled Components",
      "Emotion",
      "Tanstack Query",
      "Zustand",
      "Recoil",
      "React-hook-form",
      "Framer Motion",
      "Apollo Client",
    ],
  },
  {
    title: "데이터베이스",
    elements: ["Postgresql", "MongoDB", "MySQL"],
  },
  {
    title: "디자인",
    elements: ["Figma", "Creatie"],
  },
];

export const projects: Project[] = [
  {
    title: "Sync-D",
    description: "소규모 개발팀을 위한 실시간 아이디어 기획 협업 플랫폼",
    role: "Team Leader, FE, Designer",
    period: "2024.03 ~ 2024.06",
    stacks: [
      "Next 14",
      "TypeScript",
      "TailwindCSS",
      "Zustand",
      "React-hook-form",
      "Framer Motion",
      "Figma",
      "Contenteditable",
      "Liveblocks SDK",
      "Sendbird SDK",
      "Reactflow",
      "Prettier",
    ],
    info: [
      "서비스 UI 디자인 및 퍼블리시",
      "두 종속 라이브러리를 Type-Safe하게 사용하도록 새로운 타입 정의",
      "다중 유저 실시간 동시 편집 차트 협업 툴 구현",
      "모바일 환경 대응을 위한 반응형 디자인",
      "AJOU SOFTCON 개발부문 최우수상 (1위)",
      "AJOU SOFTCON 인기상 2개 수상 (온라인 득표 1위, 현장 득표 1위)",
    ],
  },
  {
    title: "Ajou Festa",
    description: "2024-1학기 아주대학교 동아리박람회 실시간 정보 공유 웹 앱",
    role: "FE",
    period: "2024.03",
    stacks: [
      "Next 14",
      "TypeScript",
      "TailwindCSS",
      "Zustand",
      "ESLint",
      "Prettier",
      "PWA",
      "GA",
    ],
    info: [
      "GA적용 - 이틀간 실사용자 약 650명 유치",
      "PWA적용- 접근성/사용성 개선",
      "Fetch cache/revalidate를 활용해 백엔드 요청 부하 관리",
      "2024학년도 1학기 아주대학고 동아리 박람회 공식 웹 앱",
    ],
  },
  {
    title: "Exchangers",
    description: "교환학생들을 위한 캠퍼스 주변 시설 정보 공유 플랫폼",
    role: "Team Leader, FE, Designer",
    period: "2023.09 ~ 2023.12",
    stacks: [
      "React",
      "JavaScript",
      "Emotion",
      "Recoil",
      "React-hook-form",
      "KakaoMap SDK",
      "Prettier",
      "Figma",
    ],
    info: [
      "서비스 UI 디자인 및 퍼블리시",
      "Container-Presenter 패턴 적용 - 코드 가독성 확보",
      "언어적 장벽 해소를 위한 UI/UX 설계",
      "전역 상태 관리와 추상화로 재사용가능한 컴포넌트 구현",
      "카카오맵 SDK를 활용한 자체 DB 지도 서비스 구현",
    ],
  },
];

export const activities: Activity[] = [
  {
    title: "아주대학교 웹개발 동아리 Do-it!",
    period: "2022.09 ~ 2024.06",
    contents: [
      "자바스크립트 스터디 참여 - JS Deep Dive 스터디",
      "Next.js 스터디 참여 - 렌더링의 종류와 원리, 라우팅, 데이터 통신 등",
    ],
  },
  {
    title: "Code Camp 온라인 부트캠프",
    period: "2023.01 ~ 2023.06",
    contents: ["React, Next 13, TypeScript 등 실무 중심 FE 학습"],
  },
  {
    title: "2023 한국차세대컴퓨팅학회 춘계학술대회 학술지 투고",
    period: "2023.06",
    contents: [
      "“WebRTC를 사용한 다자간 회의 지원을 위한 MCU 구조 설계” (333-336)",
      "“다중 스트림 믹싱을 지원하는 WebRTC 클라이언트 구조 설계” (337-340)",
    ],
  },
  {
    title: "아주대학교 코딩 교육 봉사 동아리 Sweat",
    period: "2022.03 ~ 2022.06",
    contents: ["파이썬 기초 문법 교육 및 알고리즘 문제 실습 강의"],
  },
  {
    title: "2021 군장병 공개SW 온라인 교육 및 해커톤 진행",
    period: "2021.08 ~ 2021.11",
    contents: [
      "군장병 집체교육 WEB 분야 수강",
      "WEB 분야 온라인 교육 성적 우수자 선발",
    ],
  },
];

export const awards: Activity[] = [
  {
    title: "AJOU SOFTCON <최우수상 | 인기상(온라인 투표) | 인기상(현장 투표)>",
    period: "2024.06",
    contents: [
      "실시간 아이디어 기획 협업 플랫폼 “Sync-D”",
      "최우수상 (1위), 인기상 (온라인 득표 1위), 인기상 (현장 득표 1위)",
      "아주대학교 SW융합교육원",
    ],
  },
  {
    title: "제 21회 TOPCIT 정기평가 성적우수자 포상 <장려상>",
    period: "2024.06",
    contents: ["장려상 (3위)", "과학기술정보통신부, 아주대학교 SW융합교육원"],
  },
  {
    title: "2024 발명/BM아이디어 경진대회 <최우수상>",
    period: "2024.06",
    contents: [
      "분산형 버전관리 음원 협업 플랫폼 “Kompose Hub”",
      "최우수상 (2위)",
      "아주대학교 지식재산융합인재양성사업",
    ],
  },
  {
    title: "2024 특허 경진대회 <최우수상>",
    period: "2024.06",
    contents: [
      "분산형 버전관리 음원 협업 플랫폼 “Kompose Hub”",
      "최우수상 (2위)",
      "아주대학교 지식재산융합인재양성사업",
    ],
  },
  {
    title: "2023 창업아이디어 경진대회 <최우수상>",
    period: "2023.06",
    contents: [
      "화장품 성분 테스트 키트 및 AI 기반 화장품 맞춤 추천 서비스 “Not for Me;”",
      "최우수상 (2위)",
      "아주대학교 LINC 3.0 사업단",
    ],
  },
  {
    title: "2022 디지털 뉴딜 아이디어톤 <우수상>",
    period: "2022.12",
    contents: [
      "무명 힙합 아티스트와 프로듀서 간 음원 공유 및 중개 플랫폼 “타입비트”",
      "우수상 (2위)",
      "아주대학교 창업교육원",
    ],
  },
  {
    title: "“모여서 각자 소프트웨어하자” 학습 공동체 성과발표 <우수상>",
    period: "2022.08",
    contents: [
      "“코딩에서 살아남기 (코살)” 팀",
      "우수상(2위)",
      "아주대학교 SW융합교육원",
    ],
  },
];

export const educations: Activity[] = [
  {
    title: "아주대학교",
    period: "2019.03 ~ 2024.08",
    contents: ["컴퓨터및소프트웨어공학 학사 과정 졸업 (예정)"],
  },
];

export const certifications: Activity[] = [
  {
    title: "TOPCIT 수준 3 (594점)",
    period: "2024.05",
  },
  {
    title: "SQL 개발자 (SQLD)",
    period: "2024.04",
  },
  {
    title: "IELTS Overall 6.0",
    period: "2024.04",
  },
  {
    title: "TOEIC Speaking IH (Intermediate-High)",
    period: "2022.12",
  },
  {
    title: "정보처리기능사",
    period: "2021.12",
  },
];
