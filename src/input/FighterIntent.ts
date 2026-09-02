import type { CombatIntent } from "./CombatIntent";
import type { MovementIntent } from "./MovementIntent";

export type FighterIntent = MovementIntent & CombatIntent;
