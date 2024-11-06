import type { Collaborator } from "@graph/compositions/useCollaborativeGraphTypes";
import colors from "@colors";
import type { Rect } from "@shape/rect";
import type { Circle } from "@shape/circle";

export const collabTagShapes = (collaborator: Collaborator) => {
  const {
    name: collaboratorName,
    color: collaboratorColor,
    mousePosition,
  } = collaborator

  const { x, y } = mousePosition

  const width = collaboratorName.length * 11
  const height = 20
  const topLeftOffset = 10

  const tag: Rect = {
    at: {
      x: x - width - topLeftOffset,
      y: y - height - topLeftOffset,
    },
    width,
    height,
    color: collaboratorColor,
    borderRadius: 5,
    textArea: {
      text: {
        content: collaboratorName,
        color: colors.WHITE,
        fontSize: 14,
        fontWeight: 'bold',
      },
      color: colors.TRANSPARENT

    },
  }

  const cursorPoint: Circle = {
    radius: 3,
    at: { x, y },
    color: collaboratorColor,
  }

  return {
    tag,
    cursorPoint,
  }
}