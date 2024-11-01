
/*
  types for shapes
*/

export type ShapeName = 'circle' | 'line' | 'square' | 'rect' | 'triangle' | 'arrow' | 'uturn' | 'cross'

export type Shape = {
  /**
   * a unique identifier for the shape
   */
  id: string,

  /**
   * the name of the shape type, ie 'circle', 'line', etc
   */
  name: ShapeName,

  /**
   * draws the entire shape including text.
   * this is the default use case
   */
  draw: (ctx: CanvasRenderingContext2D) => void,

  /**
   * draws just the shape ignoring all text properties
   */
  drawShape: (ctx: CanvasRenderingContext2D) => void,

  /**
   * draws the text area of the shape (ie both matte and text)
   */
  drawTextArea?: (ctx: CanvasRenderingContext2D) => void,

  /**
   * only draws the matte of the text area
   */
  drawTextAreaMatte?: (ctx: CanvasRenderingContext2D) => void,

  /**
   * only draws the text content of the text area
   */
  drawText?: (ctx: CanvasRenderingContext2D) => void,

  /**
   * returns true if the point is within the shape
   */
  hitbox: (point: Coordinate) => boolean,

  /**
   * returns true if the point is within the text area of the shape
   */
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