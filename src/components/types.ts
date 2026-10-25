export type Meta = {
  name: string;
  category?: string;
  note?: string;
  cols: number;
  rows: number;
  cell?: number;
  fps: number;
  ground: string;
  palette: string[];
};

export type Frame = (t: number, options?: { color?: Uint8Array; steps?: Uint8Array }) => string;
