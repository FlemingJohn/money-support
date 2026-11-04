export interface SwitchProps {
  isOn: boolean;
  label: string;
  isDisabled?: boolean;
  onToggle: () => void;
}
