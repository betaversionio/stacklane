import { useCallback, useEffect, useState, type RefObject } from "react";

export function useFullscreen<T extends HTMLElement = HTMLElement>(
  elementRef?: RefObject<T | null>
) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const element = elementRef?.current;
    const target = element || document;

    const onChange = () => {
      if (element) {
        setIsFullscreen(document.fullscreenElement === element);
      } else {
        setIsFullscreen(!!document.fullscreenElement);
      }
    };

    target.addEventListener("fullscreenchange", onChange);
    return () => target.removeEventListener("fullscreenchange", onChange);
  }, [elementRef]);

  const toggle = useCallback(() => {
    const element = elementRef?.current;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      if (element) {
        element.requestFullscreen();
      } else {
        document.documentElement.requestFullscreen();
      }
    }
  }, [elementRef]);

  return { isFullscreen, toggle };
}
