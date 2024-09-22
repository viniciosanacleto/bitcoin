export const subtractDays = (days: number, date?: Date): Date => {
  const dateToSubtract = date || new Date();
  dateToSubtract.setDate(dateToSubtract.getDate() - days);
  return dateToSubtract;
};
