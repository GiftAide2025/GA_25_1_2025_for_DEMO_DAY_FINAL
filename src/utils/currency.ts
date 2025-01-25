export const formatCurrency = (amount: number, region: 'IN' | 'US'): string => {
  const formatter = new Intl.NumberFormat(region === 'IN' ? 'en-IN' : 'en-US', {
    style: 'currency',
    currency: region === 'IN' ? 'INR' : 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });

  return formatter.format(amount);
};