/*
  types for shapes
*/

export type Coordinate = {
  x: number,
  y: number,
}

export type TextFontWeight = 'lighter' | 'normal' | 'bold' | 'bolder'

// the actual text
export type Text = {
  content: string,
  fontSize?: number,
  fontWeight?: TextFontWeight,
  color?: string,
}

export const TEXT_DEFAULTS = {
  fontSize: 12,
  fontWeight: 'normal',
  color: 'black',
} as const

// the area in which text is displayed
export type TextAreaNoLocation = {
  text: Text,
  color?: string,
  editable?: boolean,
}

export const TEXTAREA_DEFAULTS = {
  color: 'white',
  editable: true
} as const

export type TextArea = {
  at: Coordinate,
} & TextAreaNoLocation

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

export const RECTANGLE_DEFAULTS = {
  color: 'black',
} as const

export type Square = Rectangle

export const SQUARE_DEFAULTS = {
  color: 'black',
} as const

export type Line = {
  start: Coordinate,
  end: Coordinate,
  width?: number,
  textArea?: TextAreaNoLocation,
  // offsetFromCenter is used to position text. By default, text is centered on the line.
  // If -10, text will be on the line but 10 units below the center.
  // If 10, text will be on the line but 10 units above the center.
  textOffsetFromCenter?: number,
  color?: string,
}

export const LINE_DEFAULTS = {
  width: 10,
  textOffsetFromCenter: 0,
  color: 'black',
} as const

export type Arrow = Line

export const ARROW_DEFAULTS = LINE_DEFAULTS

export type Triangle = {
  point1: Coordinate,
  point2: Coordinate,
  point3: Coordinate,
  color?: string,
}

export const TRIANGLE_DEFAULTS = {
  color: 'black',
} as const

export type UTurnArrow = {
  spacing: number,
  center: Coordinate,
  upDistance: number,
  downDistance: number,
  angle: number,
  lineWidth: number,
  color?: string,
  textArea?: TextAreaNoLocation
}

export const UTURN_ARROW_DEFAULTS = {
  color: 'black',
} as const