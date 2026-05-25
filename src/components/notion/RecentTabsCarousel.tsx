"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cn } from "@/src/libs/core";

type TabId = "posts" | "readings";

interface Tab {
  id: TabId;
  label: string;
}

interface RecentTabsCarouselProps {
  postsSlot: ReactNode;
  readingsSlot: ReactNode | null;
}

const ALL_TABS: readonly Tab[] = [
  { id: "posts", label: "RECENT POSTS" },
  { id: "readings", label: "RECENT READS" },
] as const;

export default function RecentTabsCarousel({ postsSlot, readingsSlot }: RecentTabsCarouselProps) {
  const reduceMotion = useReducedMotion();
  const tabsId = useId();
  const visibleTabs = useMemo<readonly Tab[]>(
    () => (readingsSlot ? ALL_TABS : ALL_TABS.slice(0, 1)),
    [readingsSlot],
  );

  const [activeId, setActiveId] = useState<TabId>("posts");
  const tabButtonRefs = useRef<Partial<Record<TabId, HTMLButtonElement | null>>>({});
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [centerOffsets, setCenterOffsets] = useState<number[]>([]);
  const [measured, setMeasured] = useState(false);

  const activeIndex = Math.max(
    0,
    visibleTabs.findIndex((t) => t.id === activeId),
  );

  // 각 탭의 중심을 트랙 자체의 중심과 일치시키는 x 오프셋을 측정한다.
  // 트랙은 부모 컨테이너에서 좌우 mx-auto로 가운데 정렬되므로, 트랙 중심 = 컨테이너 중심.
  useLayoutEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      const buttons = visibleTabs.map((t) => tabButtonRefs.current[t.id]);
      if (buttons.some((b) => !b)) return;
      const trackCenter = track.scrollWidth / 2;
      const offsets = buttons.map((btn) => trackCenter - (btn!.offsetLeft + btn!.offsetWidth / 2));
      setCenterOffsets(offsets);
      setMeasured(true);
    };

    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", measure);

    // 폰트 로드 후 폭이 달라질 수 있으므로 한 번 더 측정
    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(measure).catch(() => {});
    }
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [visibleTabs]);

  // visibleTabs.length 변화에 따른 activeId 정합성 보정
  useEffect(() => {
    if (!visibleTabs.some((t) => t.id === activeId)) {
      setActiveId(visibleTabs[0].id);
    }
  }, [activeId, visibleTabs]);

  const goTo = useCallback((next: TabId, focus = false) => {
    setActiveId(next);
    if (focus) {
      requestAnimationFrame(() => {
        tabButtonRefs.current[next]?.focus();
      });
    }
  }, []);

  const goPrev = useCallback(() => {
    if (visibleTabs.length <= 1) return;
    const i = (activeIndex - 1 + visibleTabs.length) % visibleTabs.length;
    goTo(visibleTabs[i].id);
  }, [activeIndex, goTo, visibleTabs]);

  const goNext = useCallback(() => {
    if (visibleTabs.length <= 1) return;
    const i = (activeIndex + 1) % visibleTabs.length;
    goTo(visibleTabs[i].id);
  }, [activeIndex, goTo, visibleTabs]);

  const onTabKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (visibleTabs.length <= 1) return;
      const len = visibleTabs.length;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goTo(visibleTabs[(activeIndex + 1) % len].id, true);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goTo(visibleTabs[(activeIndex - 1 + len) % len].id, true);
      } else if (e.key === "Home") {
        e.preventDefault();
        goTo(visibleTabs[0].id, true);
      } else if (e.key === "End") {
        e.preventDefault();
        goTo(visibleTabs[len - 1].id, true);
      }
    },
    [activeIndex, goTo, visibleTabs],
  );

  const arrowEnabled = visibleTabs.length > 1;
  const xOffset = centerOffsets[activeIndex] ?? 0;

  return (
    <section
      className="mx-auto mt-8 flex w-full flex-col items-center gap-3 sm:mt-16 md:max-w-3xl"
      aria-labelledby={`${tabsId}-label`}
    >
      <h2 id={`${tabsId}-label`} className="sr-only">
        Recent
      </h2>

      <div
        role="tablist"
        aria-label="Recent"
        onKeyDown={onTabKeyDown}
        className="relative mb-2 flex h-9 w-full items-center justify-center sm:mb-4 sm:h-11"
      >
        {arrowEnabled && (
          <button
            type="button"
            aria-label="이전 탭"
            onClick={goPrev}
            className="absolute left-0 z-10 rounded-full p-1.5 text-neutral-300 outline-none transition-colors hover:text-neutral-700 focus-visible:ring-1 focus-visible:ring-neutral-400 dark:text-neutral-600 dark:hover:text-neutral-200"
          >
            <Chevron direction="left" />
          </button>
        )}

        <div
          className="relative mx-9 overflow-hidden sm:mx-11"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
          }}
        >
          <motion.div
            ref={trackRef}
            className="flex items-center gap-8 whitespace-nowrap will-change-transform sm:gap-10"
            initial={false}
            animate={{ x: xOffset }}
            transition={
              !measured || reduceMotion
                ? { duration: 0 }
                : { type: "spring", stiffness: 320, damping: 32, mass: 0.8 }
            }
          >
            {visibleTabs.map((tab) => {
              const isActive = tab.id === activeId;
              return (
                <button
                  key={tab.id}
                  ref={(el) => {
                    tabButtonRefs.current[tab.id] = el;
                  }}
                  role="tab"
                  type="button"
                  id={`${tabsId}-tab-${tab.id}`}
                  aria-selected={isActive}
                  aria-controls={`${tabsId}-panel-${tab.id}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => goTo(tab.id)}
                  className={cn(
                    "shrink-0 outline-none transition-all duration-300 text-base sm:text-2xl sm:tracking-tight",
                    "focus-visible:underline focus-visible:decoration-2 focus-visible:underline-offset-4",
                    isActive
                      ? "font-semibold text-neutral-900 opacity-100 dark:text-neutral-100"
                      : "font-light text-neutral-400 opacity-50 hover:text-neutral-600 hover:opacity-80 dark:hover:text-neutral-300",
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </motion.div>
        </div>

        {arrowEnabled && (
          <button
            type="button"
            aria-label="다음 탭"
            onClick={goNext}
            className="absolute right-0 z-10 rounded-full p-1.5 text-neutral-300 outline-none transition-colors hover:text-neutral-700 focus-visible:ring-1 focus-visible:ring-neutral-400 dark:text-neutral-600 dark:hover:text-neutral-200"
          >
            <Chevron direction="right" />
          </button>
        )}
      </div>

      <div className="relative w-full overflow-hidden">
        <motion.div
          className="flex w-full will-change-transform"
          initial={false}
          animate={{ x: `-${activeIndex * 100}%` }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 260, damping: 32, mass: 0.9 }
          }
        >
          <Panel tabsId={tabsId} id="posts" isActive={activeId === "posts"}>
            {postsSlot}
          </Panel>
          {readingsSlot && (
            <Panel tabsId={tabsId} id="readings" isActive={activeId === "readings"}>
              {readingsSlot}
            </Panel>
          )}
        </motion.div>
      </div>
    </section>
  );
}

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-4 w-4 sm:h-5 sm:w-5"
    >
      <path d={direction === "left" ? "M15.75 19.5 8.25 12l7.5-7.5" : "m8.25 4.5 7.5 7.5-7.5 7.5"} />
    </svg>
  );
}

function Panel({
  tabsId,
  id,
  isActive,
  children,
}: {
  tabsId: string;
  id: TabId;
  isActive: boolean;
  children: ReactNode;
}) {
  return (
    <div
      role="tabpanel"
      id={`${tabsId}-panel-${id}`}
      aria-labelledby={`${tabsId}-tab-${id}`}
      aria-hidden={!isActive}
      inert={!isActive}
      className="w-full shrink-0"
    >
      {children}
    </div>
  );
}
