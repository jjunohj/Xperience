"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/src/libs/core";

/** scrollWidth/clientWidth 반올림으로 생기는 sub-pixel 차이는 넘침으로 보지 않는다 */
const OVERFLOW_EPSILON_PX = 1;

interface MarqueeTextProps {
  text: string;
  className?: string;
  /** 슬라이드 속도 (px/초) */
  speed?: number;
  /** 시작 정지 시간 (초) */
  startDelay?: number;
  /** 끝 정지 시간 (초) */
  endDelay?: number;
}

/**
 * 한 줄 텍스트가 컨테이너보다 넓을 때만 일정 속도로 슬라이드하는 마퀴.
 * 시작 정지 → 슬라이드 → 끝 정지 → 첫 위치로 즉시 점프 → 반복.
 *
 * 넘치지 않거나 prefers-reduced-motion이면 한 줄 말줄임으로 정적 표시한다.
 * 텍스트는 항상 실제 <h3> 콘텐츠로 렌더되어 SSR HTML에 존재하고(SEO),
 * 측정은 마운트 후에만 일어나 하이드레이션 미스매치·레이아웃 시프트가 없다.
 */
export default function MarqueeText({ text, className, speed = 30, startDelay = 1, endDelay = 3 }: MarqueeTextProps) {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    // 애니메이션을 쓰지 않으면 측정·관찰도 불필요
    if (prefersReducedMotion) return;

    const el = containerRef.current;
    if (!el) return;

    let cancelled = false;
    const measure = () => {
      if (cancelled) return;
      const overflow = el.scrollWidth - el.clientWidth;
      setDistance(overflow > OVERFLOW_EPSILON_PX ? overflow : 0);
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(el);
    // 텍스트 폭은 웹폰트 로드 후 바뀔 수 있어 한 번 더 측정
    if (document.fonts) {
      document.fonts.ready.then(measure).catch(() => {});
    }

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [text, prefersReducedMotion]);

  const isMarquee = distance > 0 && !prefersReducedMotion;

  // 저자는 우측 자연 너비(shrink-0)를 유지하고, 제목은 남은 폭만 차지(min-w-0)한다.
  // flex-grow는 주지 않아 짧은 제목은 저자 바로 옆에 붙는다.
  // 정적/마퀴 두 상태 모두 overflow-hidden·whitespace-nowrap을 유지해 측정 조건을
  // 일치시키고, 정적일 때만 text-ellipsis로 말줄임을 보인다.
  return (
    <h3
      ref={containerRef}
      className={cn("min-w-0 overflow-hidden whitespace-nowrap", !isMarquee && "text-ellipsis", className)}
    >
      {isMarquee ? (
        <MarqueeInner
          text={text}
          distance={distance}
          speed={Math.max(speed, 1)}
          startDelay={Math.max(0, startDelay)}
          endDelay={Math.max(0, endDelay)}
        />
      ) : (
        text
      )}
    </h3>
  );
}

interface MarqueeInnerProps {
  text: string;
  distance: number;
  speed: number;
  startDelay: number;
  endDelay: number;
}

function MarqueeInner({ text, distance, speed, startDelay, endDelay }: MarqueeInnerProps) {
  const scrollDuration = distance / speed;
  const total = startDelay + scrollDuration + endDelay;

  return (
    <motion.span
      key={distance}
      className="inline-block whitespace-nowrap"
      animate={{ x: [0, 0, -distance, -distance] }}
      transition={{
        duration: total,
        ease: "linear",
        times: [0, startDelay / total, (startDelay + scrollDuration) / total, 1],
        repeat: Infinity,
        repeatType: "loop",
      }}
    >
      {text}
    </motion.span>
  );
}
