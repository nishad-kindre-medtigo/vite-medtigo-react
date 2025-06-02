import moment from 'moment';

// Calculate Hours difference in start time and end time for a shift
export function calculateHours(startTime, endTime) {
  const start = moment(startTime, 'HH:mm:ss');
  let end = moment(endTime, 'HH:mm:ss');

  // If the end time is earlier than the start time, add 24 hours to the end time (next day scenario)
  if (end.isBefore(start)) {
    end.add(1, 'day');
  }

  const diffInHours = Math.abs(end.diff(start, 'hours', true));
  const diffInMinutes = Math.abs(end.diff(start, 'minutes')) % 60;

  // Return the result with 2 decimal places if there are minutes involved
  if (diffInMinutes) {
    return diffInHours.toFixed(2);
  }

  // Return the integer value if no minutes are involved
  return diffInHours;
}

// Calculate Total Payment for a single shift including regular hours & overtime hours if applicable
export function calculateTotalPayment(row) {
  const workingHours = calculateHours(
    row.shiftData.start_time,
    row.shiftData.end_time
  );
  const overtTimeHours = row.extraTime;
  if (overtTimeHours) {
    const overTimePay = calculatePayment(overtTimeHours, row.shiftData.price);
    return `$${workingHours * row.shiftData.price + overTimePay}`;
  }
  return `$${workingHours * row.shiftData.price +
    overtTimeHours * row.shiftData.price}`;
}

// Calculate payable amount considering hours & minutes of working with rate given
export function calculatePayment(time, rate) {
  // Split the time string into hours and minutes
  const [hours, minutes] = time.split(':').map(Number);
  const totalHours = hours + minutes / 60;
  const totalPayable = totalHours * rate;

  return parseFloat(totalPayable.toFixed(2));
}

export function roundHours(time) {
  const [hours, minutes] = time.split(':').map(Number);
  const totalHours = hours + minutes / 60;

  if (minutes) {
    return totalHours.toFixed(2);
  }
  return hours;
}
