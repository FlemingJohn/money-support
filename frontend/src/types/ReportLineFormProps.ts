export interface ReportLineFormProps {
  lineText: string;
  isSending: boolean;
  onReport: (selectedText: string, kind: string) => void;
  onCancel: () => void;
}
