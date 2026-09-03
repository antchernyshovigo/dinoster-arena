export interface DamageResult {
  readonly remainingHealth: number;
  readonly damageApplied: boolean;
}

export function applyDamage(
  currentHealth: number,
  maxHealth: number,
  amount: number,
): DamageResult {
  const clampedHealth = Math.min(maxHealth, Math.max(0, currentHealth));
  const remainingHealth = Math.min(
    maxHealth,
    Math.max(0, clampedHealth - Math.max(0, amount)),
  );

  return {
    remainingHealth,
    damageApplied: remainingHealth < clampedHealth,
  };
}
