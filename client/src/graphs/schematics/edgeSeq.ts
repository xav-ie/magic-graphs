/**
 * sequencing for edge shape animations
 */
export const SEQ = {
  IN: {
    // from 0 to 0.9 is the arrow body sequence
    BODY: [0, 0.9] as const,
    // from 0.9 to 1 is the text area sequence
    TEXT_AREA: [0.9, 1] as const
    // after 1, the animation is done
  },
  OUT: {
    TEXT_AREA: [0, 0.1] as const,
    BODY: [0.1, 1] as const
  }
}