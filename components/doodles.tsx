export interface DoodleProps {
  className?: string;
}

const STROKE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Estrella de cinco puntas con trazo irregular, como dibujada a mano. */
export function DoodleStar({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={className}>
      <path
        {...STROKE}
        d="M32 6l6.4 15.6L55 24.2l-12 10.6 3.6 16.4L32 43.2 17.4 51.2 21 34.8 9 24.2l16.6-2.6Z"
      />
    </svg>
  );
}

/** Silbato de árbitro con cordón. */
export function DoodleWhistle({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={className}>
      <path
        {...STROKE}
        d="M22 26c-7 1-12 6-12 12s5 10 12 10h16l14 8V22L38 30H22M22 26c2-6 8-10 15-9M34 38h.1"
      />
    </svg>
  );
}

/** Corazón de trazo suelto. */
export function DoodleHeart({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={className}>
      <path
        {...STROKE}
        d="M32 54S10 40 10 24c0-8 6-13 13-13 5 0 8 3 9 6 1-3 4-6 9-6 7 0 13 5 13 13 0 16-22 30-22 30Z"
      />
    </svg>
  );
}

/** Balón con sus gajos. */
export function DoodleBall({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={className}>
      <circle {...STROKE} cx="32" cy="32" r="22" />
      <path {...STROKE} d="M32 14l8 6-3 9h-10l-3-9Zm0 36-8-6 3-9h10l3 9Z" />
    </svg>
  );
}

/** Trazo de subrayado ondulado para acompañar un título. */
export function DoodleScribble({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 120 16" aria-hidden="true" preserveAspectRatio="none" className={className}>
      <path
        {...STROKE}
        strokeWidth={3}
        d="M2 10c12-8 20 6 32-2s20 8 32 0 22-6 32 2 12-4 20 1"
      />
    </svg>
  );
}
