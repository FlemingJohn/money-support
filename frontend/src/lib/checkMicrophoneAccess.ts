const microphoneProblems: Record<string, string> = {
  NotAllowedError: "Microphone access is blocked. Allow it from the lock icon next to the address bar, then try again.",
  NotFoundError: "No microphone was found. Plug one in or pick one in your system settings, then try again.",
  NotReadableError: "Your microphone is being used by another app. Close it, then try again.",
};

export async function checkMicrophoneAccess(): Promise<string> {
  if (!navigator.mediaDevices?.getUserMedia) return "This browser can't use a microphone here. Open the page over https in Chrome, Edge or Safari.";
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((track) => track.stop());
    return "";
  } catch (error) {
    const name = (error as { name?: string } | null)?.name ?? "";
    return microphoneProblems[name] ?? "The browser couldn't open your microphone. Check its permission, then try again.";
  }
}
