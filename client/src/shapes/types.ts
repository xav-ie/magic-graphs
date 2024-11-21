
/*
  types for shapes
*/
import type { Rect } from '@shape/rect'

export type BoundingBox = Pick<Rect, 'at' | 'width' | 'height'>

export type BoundingBoxCorners = {
  topLeft: Coordinate,
  bottomRight: Coordinate
}

export type ShapeName = 'circle' | 'line' | 'square' | 'rect' | 'triangle' | 'arrow' | 'uturn' | 'cross' | 'scribble'

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
   * returns true if the point is within the shape or text area of the shape
   */
  hitbox: (point: Coordinate) => boolean,

  /**
   * returns true if the point is within the area of the shape
   */
  shapeHitbox: (point: Coordinate) => boolean,

  /**
   * returns true if the point is within the rectangular bounding box of the shape
   */
  efficientHitbox: (boxToCheck: BoundingBox) => boolean,

  /**
   * returns the top left and bottom right corners of the bounding box as Coordinates
   */
  getBoundingBox: () => BoundingBoxCorners,

  /**
   * returns true if the point is within the text area of the shape
   */
  textHitbox?: (point: Coordinate) => boolean,

  /**
   * activates the text area of the shape
   */
  activateTextArea?: (handler: (str: string) => void) => void,
}

export type Coordinate = {
  x: number,
  y: number,
}

/**
 * an area that wraps some text
 */
export type TextAreaNoLocation = {
  /**
   * the text areas inner text
   */
  text: Text,
  /**
   * the color of the text area
   */
  color?: string,
  /**
   * the color of the text area when it is engaged
   * IE is converted to a textarea html element for user interaction
   */
  activeColor?: string,
}

export const TEXTAREA_DEFAULTS = {
  color: 'white',
  // TODO - make active color depend on the color of the text area
  activeColor: 'white',
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

export const TEXT_DEFAULTS = {
  fontSize: 12,
  fontWeight: 'normal',
  color: 'black',
} as const

export type Stroke = {
  color: string,
  width: number,
    /**
   * For dashed border
   * 
   * @params
   *
   * dash: [dashLength, gapLength]
   * 
  */
    dash?: [number, number]
}

export const STROKE_DEFAULTS = {
  color: 'black',
  width: 0
}