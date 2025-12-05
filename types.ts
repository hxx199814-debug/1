export enum ParticleShape {
  Snowflake = 'Snowflake',
  Circle = 'Circle',
  Star = 'Star',
  Heart = 'Heart',
  Petal = 'Petal'
}

export interface UIState {
  shape: ParticleShape;
  color: string;
  particleCount: number;
}