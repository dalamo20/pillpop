export const calculateWeeklyProgress = ({
  completions,
  times,
  daysOfWeek,
  docId,
  today,
}: {
  completions: Record<string, boolean>,
  times: any[],
  daysOfWeek: string[],
  docId: string,
  today: Date
}): Record<string, { toTake: number, taken: number }> => {
  const weekly: Record<string, { toTake: number, taken: number }> = {};

  times.forEach((_, i) => {
    const pillId = `${docId}_${i}`;

    for (let d = 0; d < 7; d++) {
      const date = new Date(today);
      date.setDate(today.getDate() - today.getDay() + d);
      const day = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dateKey = date.toLocaleDateString('en-CA');

      if (!weekly[day]) weekly[day] = { toTake: 0, taken: 0 };

      if (daysOfWeek.includes(day)) {
        const completionKey = `${dateKey}_${pillId}`;
        if (completions[completionKey]) weekly[day].taken++;
        weekly[day].toTake++;
      }
    }
  });

  return weekly;
};
