import type { ArenaConfig } from "../data/arena";

export interface ArenaPresentation {
  readonly depth: number;
  readonly scale: number;
}

export interface ArenaPosition extends ArenaPresentation {
  readonly x: number;
  readonly y: number;
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(Math.max(value, minimum), maximum);
}

function getDepthProgress(y: number, config: ArenaConfig): number {
  return clamp((y - config.farY) / (config.nearY - config.farY), 0, 1);
}

function getHalfWidthAtY(y: number, config: ArenaConfig): number {
  const progress = getDepthProgress(y, config);
  return config.farHalfWidth + (config.nearHalfWidth - config.farHalfWidth) * progress;
}

export function getArenaPresentation(
  y: number,
  config: ArenaConfig,
): ArenaPresentation {
  const progress = getDepthProgress(y, config);

  return {
    depth: config.depthBase + Math.round(y),
    scale: config.farScale + (config.nearScale - config.farScale) * progress,
  };
}

export function clampActorToArena(
  x: number,
  y: number,
  width: number,
  height: number,
  config: ArenaConfig,
): ArenaPosition {
  const halfHeight = (height * config.nearScale) / 2;
  const clampedY = clamp(y, config.farY + halfHeight, config.nearY - halfHeight);
  const presentation = getArenaPresentation(clampedY, config);
  const scaledHalfWidth = (width * presentation.scale) / 2;
  const scaledHalfHeight = (height * presentation.scale) / 2;
  const narrowestHalfWidth = getHalfWidthAtY(clampedY - scaledHalfHeight, config);
  const minimumX = config.centerX - narrowestHalfWidth + scaledHalfWidth;
  const maximumX = config.centerX + narrowestHalfWidth - scaledHalfWidth;

  return {
    ...presentation,
    x: clamp(x, minimumX, maximumX),
    y: clampedY,
  };
}
