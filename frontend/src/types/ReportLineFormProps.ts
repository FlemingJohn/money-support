export interface ReportLineFormProps {
  isSending: boolean;
  onReport: (selectedText: string, kind: string) => void;
  onCancel: () => void;
}
