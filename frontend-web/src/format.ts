export const format = {
  date: (value: Date | string) =>
    new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(value)),
  currency: (value: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value),
  number: (value: number) => new Intl.NumberFormat('en-IN').format(value),
  percent: (value: number) => `${value.toFixed(1)}%`,
};
