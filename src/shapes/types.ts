/*
  types for shapes
*/

export type Coordinate = {
  x: number,
  y: number,
}

export type Text = {
  content: string,
  fontSize: number,
  fontWeight: 'lighter' | 'normal' | 'bold' | 'bolder',
  color: string,
}

export type Stroke = {
  color: string,
  width: number,
}

export type Circle = {
  at: Coordinate,
  radius: number,
  color?: string,
  stroke?: Stroke,
  text?: Text
}

export type Square = {
  at: Coordinate,
  width: number,
  height: number,
  color?: string,
  stroke?: Stroke,
  text?: Text
}

export type Line = {
  start: Coordinate,
  end: Coordinate,
  width: number,
  color?: string,
}