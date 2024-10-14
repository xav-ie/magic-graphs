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

export type Rectangle = {
  at: Coordinate,
  width: number,
  height: number,
  color?: string,
  stroke?: Stroke,
  text?: Text
}

export type Square = Rectangle

export type Line = {
  start: Coordinate,
  end: Coordinate,
  width: number,
  color?: string,
}

export type Arrow = Line

export type Triangle = {
  point1: Coordinate,
  point2: Coordinate,
  point3: Coordinate,
  color?: string,
}

export type UTurnArrow = {
  spacing: number,
  center: Coordinate,
  upDistance: number,
  downDistance: number,
  angle: number,
  lineWidth: number,
  color?: string,
}