/*
  types for shapes
*/

export type Coordinate = {
  x: number,
  y: number,
}

export type TextFontWeight = 'lighter' | 'normal' | 'bold' | 'bolder'

export type Text = {
  content: string,
  fontSize?: number,
  fontWeight?: TextFontWeight,
  color?: string,
  bgColor?: string,
}

export const LINE_TEXT_DEFAULTS = {
  fontSize: 12,
  fontWeight: 'normal',
  color: 'black',
  offsetFromCenter: 0,
} as const

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
  // offsetFromCenter is used to position text. By default, text is centered on the line.
  // If -10, text will be on the line but 10 units below the center.
  // If 10, text will be on the line but 10 units above the center.
  text?: Text & { offsetFromCenter?: number },
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
  text?: Text
}