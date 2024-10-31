
/*
  types for shapes
*/

export type ShapeName = 'circle' | 'line' | 'square' | 'rect' | 'triangle' | 'arrow' | 'uturn'

export type Shape = {
  id: string,
  name: ShapeName,

  draw: (ctx: CanvasRenderingContext2D) => void,
  drawText?: (ctx: CanvasRenderingContext2D) => void,

  hitbox: (point: Coordinate) => boolean,
  textHitbox?: (point: Coordinate) => boolean,
}

export type Coordinate = {
  x: number,
  y: number,
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

export type TextFontWeight = 'lighter' | 'normal' | 'bold' | 'bolder'

// the text displayed in the text area
export type Text = {
  content: string,
  fontSize?: number,
  fontWeight?: TextFontWeight,
  color?: string,
}

export type Stroke = {
  color: string,
  width: number,
}