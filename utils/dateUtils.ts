/**
 * Get the time remaining until midnight (when the quiz refreshes)
 * @returns Object with hours, minutes, seconds until next day
 */
export function getTimeUntilNextDay(): { hours: number; minutes: number; seconds: number } {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  const diffMs = tomorrow.getTime() - now.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  
  const hours = Math.floor(diffSec / 3600);
  const minutes = Math.floor((diffSec % 3600) / 60);
  const seconds = diffSec % 60;
  
  return { hours, minutes, seconds };
}

/**
 * Format the time until next quiz as a string
 */
export function formatTimeUntilNext({ hours, minutes, seconds }: { hours: number; minutes: number; seconds: number }): string {
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}