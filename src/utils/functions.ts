import { FirestoreTimestamp } from "@/types";

export const formatTimeAgo = (unixSeconds: FirestoreTimestamp | undefined): string => {
  if (!unixSeconds) return "";

  const timestamp = unixSeconds._seconds * 1000;
  const now = Date.now();
  const difference = now - timestamp;

  const minutesDifference = Math.floor(difference / (1000 * 60));
  const hoursDifference = Math.floor(minutesDifference / 60);
  const daysDifference = Math.floor(hoursDifference / 24);

  if (minutesDifference < 1) return "just now";
  if (minutesDifference === 1) return "1 minute ago";
  if (minutesDifference < 60) return `${minutesDifference} minutes ago`;
  if (hoursDifference === 1) return "1 hour ago";
  if (hoursDifference < 24) return `${hoursDifference} hours ago`;
  if (daysDifference === 1) return "1 day ago";
  return `${daysDifference} days ago`;
};