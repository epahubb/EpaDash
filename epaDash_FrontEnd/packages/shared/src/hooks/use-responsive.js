import { useState, useEffect, useCallback } from "react";

/**
 * useMediaQuery — returns true when the given CSS media query matches.
 *
 * const isMobile = useMediaQuery("(max-width: 767px)");
 */
function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia(query);
    setMatches(mql.matches);

    const listener = (e) => setMatches(e.matches);
    mql.addEventListener("change", listener);
    return () => mql.removeEventListener("change", listener);
  }, [query]);

  return matches;
}

/**
 * useBreakpoint — returns the current Tailwind breakpoint name.
 *
 * const bp = useBreakpoint();
 * // bp.isMobile, bp.isTablet, bp.isDesktop, bp.name
 */
function useBreakpoint() {
  const isSm = useMediaQuery("(min-width: 640px)");
  const isMd = useMediaQuery("(min-width: 768px)");
  const isLg = useMediaQuery("(min-width: 1024px)");
  const isXl = useMediaQuery("(min-width: 1280px)");
  const is2xl = useMediaQuery("(min-width: 1536px)");

  let name = "xs";
  if (is2xl) name = "2xl";
  else if (isXl) name = "xl";
  else if (isLg) name = "lg";
  else if (isMd) name = "md";
  else if (isSm) name = "sm";

  return {
    name,
    isMobile: !isMd,
    isTablet: isMd && !isLg,
    isDesktop: isLg,
    xs: !isSm,
    sm: isSm && !isMd,
    md: isMd && !isLg,
    lg: isLg && !isXl,
    xl: isXl && !is2xl,
    "2xl": is2xl,
  };
}

/**
 * useWindowSize — reactive window dimensions.
 */
function useWindowSize() {
  const [size, setSize] = useState(() =>
    typeof window === "undefined"
      ? { width: 1280, height: 800 }
      : { width: window.innerWidth, height: window.innerHeight }
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return size;
}

/**
 * useScrollLock — prevents body scroll (e.g. while a modal is open).
 */
function useScrollLock(locked = true) {
  useEffect(() => {
    if (locked) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [locked]);
}

/**
 * useClickOutside — fires callback when user clicks outside the ref element.
 */
function useClickOutside(ref, callback) {
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        callback(e);
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [ref, callback]);
}

/**
 * useToggle — simple boolean toggle with optional initial state.
 *
 * const [isOpen, toggle, setIsOpen] = useToggle(false);
 */
function useToggle(initial = false) {
  const [state, setState] = useState(initial);
  const toggle = useCallback(() => setState((v) => !v), []);
  return [state, toggle, setState];
}

/**
 * usePrevious — returns the previous value of a reactive variable.
 */
function usePrevious(value) {
  const ref = useState(null);
  // We use a plain variable approach using effect
  const [prev, setPrev] = useState(undefined);
  useEffect(() => {
    setPrev(value);
  });
  return prev;
}

export {
  useMediaQuery,
  useBreakpoint,
  useWindowSize,
  useScrollLock,
  useClickOutside,
  useToggle,
  usePrevious,
};

