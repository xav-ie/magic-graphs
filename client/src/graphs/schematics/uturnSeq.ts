/**
 * sequencing for edge shape animations
 */
export const SEQ = {
  IN: {
    LINE: [0, 0.25] as const, // for component
    TURN: [0.25, 0.5] as const, // for component
    ARROW: [0.5, 0.75] as const, // for component
    BODY: [0, 0.75] as const, // for body as a whole
    TEXT_AREA: [0.75, 1] as const
  },
}