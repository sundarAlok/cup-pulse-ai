export function resolveStoredPhotoUrl(currentPhotoUrl?: string | null, incomingPhotoUrl?: string | null) {
  const trimmedIncoming = typeof incomingPhotoUrl === "string" ? incomingPhotoUrl.trim() : "";
  if (trimmedIncoming) {
    return trimmedIncoming;
  }

  if (typeof currentPhotoUrl === "string") {
    return currentPhotoUrl.trim();
  }

  return "";
}
