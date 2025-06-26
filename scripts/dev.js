#!/usr/bin/env node

const { spawn } = require("child_process");
const path = require("path");

// 환경 변수 설정
process.env.NEXT_PRIVATE_DEBUG_CACHE = "1";
process.env.CONTENTLAYER_DEV = "true";

console.log("🚀 Contentlayer와 Next.js 개발 서버를 시작합니다...");

// Contentlayer 빌드
const contentlayerBuild = spawn("npx", ["contentlayer2", "build"], {
  stdio: "inherit",
  shell: true,
  cwd: process.cwd(),
});

contentlayerBuild.on("close", (code) => {
  if (code === 0) {
    console.log("✅ Contentlayer 초기 빌드 완료");

    // Contentlayer dev 모드와 Next.js dev 서버를 동시에 실행
    const contentlayerDev = spawn("npx", ["contentlayer2", "dev"], {
      stdio: "inherit",
      shell: true,
      cwd: process.cwd(),
    });

    const nextDev = spawn("npx", ["next", "dev", "--turbopack"], {
      stdio: "inherit",
      shell: true,
      cwd: process.cwd(),
    });

    // 프로세스 종료 시 정리
    process.on("SIGINT", () => {
      console.log("\n🛑 개발 서버를 종료합니다...");
      contentlayerDev.kill();
      nextDev.kill();
      process.exit(0);
    });
  } else {
    console.error("❌ Contentlayer 빌드 실패");
    process.exit(1);
  }
});
