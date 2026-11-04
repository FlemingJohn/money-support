import type { RefObject } from "react";

export interface FollowLatest {
  containerRef: RefObject<HTMLDivElement | null>;
  handleScroll: () => void;
}
