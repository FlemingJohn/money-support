import type { HandOffSettings } from "@/types/HandOffSettings";

export interface HandOffModePickerProps {
  mode: HandOffSettings["mode"];
  onChange: (mode: HandOffSettings["mode"]) => void;
}
