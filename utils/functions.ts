import { FirestoreTimestamp } from '@/types'

export const formatTimeAgo = (unixSeconds: FirestoreTimestamp) => {
  const timestamp = unixSeconds.seconds;

  // Create a new Date object using the Unix timestamp
  const date = new Date(timestamp * 1000);

  // Get the current time
  const now = new Date();

  // Calculate the difference in milliseconds
  const difference = now.getTime() - date.getTime();

  // Convert the difference from milliseconds to minutes
  const minutesDifference = Math.floor(difference / (1000 * 60));

  // Format the time difference
  let timeAgo;
  if (minutesDifference < 1) {
      timeAgo = 'just now';
  } else if (minutesDifference === 1) {
      timeAgo = '1 minute ago';
  } else if (minutesDifference < 60) {
      timeAgo = `${minutesDifference} minutes ago`;
  } else if (minutesDifference < 120) {
      timeAgo = '1 hour ago';
  } else if (minutesDifference < 24 * 60) {
      timeAgo = `${Math.floor(minutesDifference / 60)} hours ago`;
  } else if (minutesDifference < 24 * 60 * 2) {
      timeAgo = '1 day ago';
  } else {
      timeAgo = `${Math.floor(minutesDifference / (60 * 24))} days ago`;
  }
  return timeAgo;
};