'use client';

import type { Size } from '@/types/store';

interface Props {
  sizes: Size[];
  selected: string | null;
  onSelect: (size: Size) => void;
}

export function SizeSelector({ sizes, selected, onSelect }: Props) {
  if (sizes.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {sizes.map((size) => {
        const isSelected = selected === size.label;
        const isOos = !size.inStock;
        return (
          <button
            key={size.label}
            onClick={() => !isOos && onSelect(size)}
            disabled={isOos}
            style={{
              border: isSelected
                ? '2px solid var(--gold)'
                : '1px solid rgba(201,163,91,0.25)',
              backgroundColor: isSelected ? 'rgba(201,168,76,0.12)' : 'transparent',
              color: isOos
                ? 'var(--text-secondary)'
                : isSelected
                ? 'var(--gold)'
                : 'var(--text-primary)',
              borderRadius: 8,
              padding: '8px 18px',
              fontSize: 13,
              fontWeight: isSelected ? 600 : 400,
              cursor: isOos ? 'not-allowed' : 'pointer',
              opacity: isOos ? 0.35 : 1,
              transition: 'all 0.15s',
              position: 'relative',
            }}
          >
            <span>{size.label}</span>
            {size.price > 0 && (
              <span
                style={{
                  display: 'block',
                  fontSize: 11,
                  color: isSelected ? 'rgba(201,168,76,0.8)' : 'var(--text-secondary)',
                  marginTop: 1,
                }}
              >
                AED {size.price.toLocaleString()}
              </span>
            )}
            {isOos && (
              <span
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: 1,
                    backgroundColor: 'rgba(154,143,122,0.4)',
                    transform: 'rotate(-20deg)',
                  }}
                />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
