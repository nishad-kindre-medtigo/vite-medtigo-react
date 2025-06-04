export function generateMonthRange(startMonth, endMonth) {
  const months = [];

  // Ensure startMonth and endMonth are Date objects
  let currentMonth = new Date(startMonth);

  // Loop until currentMonth exceeds endMonth
  while (currentMonth <= endMonth) {
    // Format the current month as "MM YYYY"
    months.push(
      `${(currentMonth.getMonth() + 1)
        .toString()
        .padStart(2, '0')} ${currentMonth.getFullYear()}`
    );

    // Move to the next month (no need to re-create Date objects)
    currentMonth.setMonth(currentMonth.getMonth() + 1);
  }

  return months;
}
