import { Check, Clock, X } from 'lucide-react';
import type { DeliveryStatus } from '@/lib/types';

const STAGES: { key: DeliveryStatus; labelEn: string; labelAr: string }[] = [
  { key: 'received', labelEn: 'Order Received', labelAr: 'تم استلام الطلب' },
  { key: 'payment_confirmed', labelEn: 'Payment Confirmed', labelAr: 'تم تأكيد الدفع' },
  { key: 'preparing', labelEn: 'Preparing Your Order', labelAr: 'قيد التحضير' },
  { key: 'packed', labelEn: 'Packed & Ready', labelAr: 'تم التعبئة' },
  { key: 'courier_assigned', labelEn: 'Courier Assigned', labelAr: 'تم تعيين الساعي' },
  { key: 'out_for_delivery', labelEn: 'Out for Delivery', labelAr: 'في الطريق إليك' },
  { key: 'delivered', labelEn: 'Delivered', labelAr: 'تم التوصيل' },
];

const ORDER: Record<DeliveryStatus, number> = {
  received: 0,
  payment_confirmed: 1,
  preparing: 2,
  packed: 3,
  courier_assigned: 4,
  out_for_delivery: 5,
  delivered: 6,
  cancelled: -1,
};

interface Props {
  currentStatus: DeliveryStatus;
  lang?: 'en' | 'ar';
}

export function OrderTimeline({ currentStatus, lang = 'en' }: Props) {
  if (currentStatus === 'cancelled') {
    return (
      <div
        className="flex items-center gap-3 p-4 rounded-xl"
        style={{
          backgroundColor: 'rgba(181,71,71,0.1)',
          border: '1px solid rgba(181,71,71,0.3)',
        }}
      >
        <X size={20} style={{ color: 'var(--error)', flexShrink: 0 }} />
        <span style={{ color: 'var(--error)', fontWeight: 600, fontSize: 14 }}>
          {lang === 'ar' ? 'تم إلغاء الطلب' : 'Order Cancelled'}
        </span>
      </div>
    );
  }

  const currentIdx = ORDER[currentStatus];

  return (
    <div>
      {STAGES.map((stage, idx) => {
        const done = idx < currentIdx;
        const active = idx === currentIdx;

        return (
          <div key={stage.key} className="flex items-start gap-4">
            {/* Icon + connector */}
            <div className="flex flex-col items-center" style={{ flexShrink: 0 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: done
                    ? 'var(--gold)'
                    : active
                    ? 'rgba(201,168,76,0.15)'
                    : 'rgba(154,143,122,0.08)',
                  border: done
                    ? 'none'
                    : active
                    ? '2px solid var(--gold)'
                    : '1px solid rgba(154,143,122,0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                }}
              >
                {done ? (
                  <Check size={14} color="#000" strokeWidth={2.5} />
                ) : active ? (
                  <Clock size={13} color="var(--gold)" />
                ) : (
                  <div
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(154,143,122,0.3)',
                    }}
                  />
                )}
              </div>
              {idx < STAGES.length - 1 && (
                <div
                  style={{
                    width: 2,
                    height: 28,
                    backgroundColor: done
                      ? 'var(--gold)'
                      : 'rgba(154,143,122,0.15)',
                    transition: 'background-color 0.2s',
                  }}
                />
              )}
            </div>

            {/* Label */}
            <div style={{ paddingTop: 7, paddingBottom: idx < STAGES.length - 1 ? 0 : 0 }}>
              <p
                style={{
                  color:
                    done || active ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: active ? 600 : done ? 500 : 400,
                  fontSize: 14,
                  lineHeight: 1.4,
                }}
              >
                {lang === 'ar' ? stage.labelAr : stage.labelEn}
              </p>
              {active && (
                <p style={{ color: 'var(--gold)', fontSize: 11, marginTop: 2 }}>
                  {lang === 'ar' ? 'الحالة الحالية' : 'Current status'}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
