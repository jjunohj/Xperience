// 2.37MB인 react-transition-group에 비해 크기가 매우 작음
// https://github.com/pacocoursey/use-delayed-render
import { useCallback, useRef, useState } from "react";

interface Options {
  enterDelay?: number; // 마운트 후, rendered가 true가 되기 전까지의 딜레이
  exitDelay?: number; // rendered가 false가 되고, 마운트가 해제되기 전까지의 딜레이
  onUnmount?: () => void; // 마운트가 해제되었을 때 호출되는 콜백
}

export function useDelayedRender(
  active = false,
  options: Options = {}
): {
  mounted: boolean; // DOM에 마운트되어 있는지 여부
  rendered: boolean; // 컴포넌트가 visible한지 여부
} {
  const [, force] = useState<unknown>();
  const mounted = useRef(active);
  const rendered = useRef(false);
  const renderTimer = useRef<NodeJS.Timeout | null>(null);
  const unmountTimer = useRef<NodeJS.Timeout | null>(null);
  const prevActive = useRef(active);

  const recalculate = useCallback(() => {
    const { enterDelay = 1, exitDelay = 0 } = options;

    if (prevActive.current) {
      // Mount immediately
      mounted.current = true;
      if (unmountTimer.current) clearTimeout(unmountTimer.current);

      if (enterDelay <= 0) {
        // Render immediately
        rendered.current = true;
      } else {
        if (renderTimer.current) return;

        // Render after a delay
        renderTimer.current = setTimeout(() => {
          rendered.current = true;
          renderTimer.current = null;
          force({});
        }, enterDelay);
      }
    } else {
      // Immediately set to unrendered
      rendered.current = false;

      if (exitDelay <= 0) {
        mounted.current = false;
      } else {
        if (unmountTimer.current) return;

        // Unmount after a delay
        unmountTimer.current = setTimeout(() => {
          mounted.current = false;
          unmountTimer.current = null;
          force({});
        }, exitDelay);
      }
    }
  }, [options]);

  // When the active prop changes, need to re-calculate
  if (active !== prevActive.current) {
    prevActive.current = active;
    // We want to do this synchronously with the render, not in an effect
    // this way when active → true, mounted → true in the same pass
    recalculate();
  }

  return {
    mounted: mounted.current,
    rendered: rendered.current,
  };
}
