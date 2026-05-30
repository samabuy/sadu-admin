import type { DeliveryStatus } from '@/lib/types';

const DELIVERY_COLORS: Record<DeliveryStatus, { bg: string; text: string }> = {
  received:          { bg: 'rgba(154,143,122,0.15)', text: '#9A8F7A' },
  payment_confirmed: { bg: 'rgba(63,125,88,0.15)',   text: '#3F7D58' },
  preparing:         { bg: 'rgba(201,168,76,0.15)',  text: '#C9A84C' },
  packed:            { bg: 'rgba(201,168,76,0.2)',   text: '#C9A84C' },
  courier_assigned:  { bg: 'rgba(100,149,237,0.15)', text: '#6495ED' },
  out_for_delivery:  { bg: 'rgba(100,149,237,0.2)',  text: '#6495ED' },
  delivered:         { bg: 'rgba(63,125,88,0.2)',    text: '#3F7D58' },
  cancelled:         { bg: 'rgba(181,71,71,0.15)',   text: '#B54747' },
};

const PAYMENT_COLORS: Record<string, { bg: string; text: string }> = {
  pending:   { bg: 'rgba(201,168,76,0.15)',  text: '#C9A84C' },
  confirmed: { bg: 'rgba(63,125,88,0.2)',    text: '#3F7D58' },
  failed:    { bg: 'rgba(181,71,71,0.15)',   text: '#B54747' },
  refunded:  { bg: 'rgba(154,143,122,0.15)', text: '#9A8F7A' },
};

interface DeliveryBadgeProps { status: DeliveryStatus }
interface PaymentBadgeProps { status: string }

function Badge({ label, bg, text }: { label: string; bg: string; text: string }) {
  return (
    <span
      className="text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap"
      style={{ backgroundColor: bg, color: text }}
    >
      {label}
    </span>
  );
}

export function DeliveryBadge({ status }: DeliveryBadgeProps) {
  const color = DELIVERY_COLORS[status] ?? DELIVERY_COLORS.received;
  const label = status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return <Badge label={label} {...color} />;
}

export function PaymentBadge({ status }: PaymentBadgeProps) {
  const color = PAYMENT_COLORS[status] ?? PAYMENT_COLORS.pending;
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return <Badge label={label} {...color} />;
}

export function ActiveBadge({ active }: { active: boolean }) {
  return (
    <Badge
      label={active ? 'Active' : 'Inactive'}
      bg={active ? 'rgba(63,125,88,0.2)' : 'rgba(154,143,122,0.15)'}
      text={active ? '#3F7D58' : '#9A8F7A'}
    />
  );
}
