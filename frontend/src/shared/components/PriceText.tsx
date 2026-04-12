export function PriceText({ amount }: { amount: number }) {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
  return <span className="font-semibold">{formatted}</span>;
}
