
// takes a textarea schema
// takes a handler function that will return the text of the edited textarea
// takes a graph instance
export const engageTextarea = (ev) => {
  const { offsetX: x, offsetY: y } = ev;
  const topItem = graph.getDrawItemsByCoordinates(x, y).pop();
  if (!topItem) return;
  const { isInLineText } = hitboxes({ x, y });
  if (topItem.schemaType === 'arrow' && isInLineText(topItem.schema)) {
    // create a text input
    const input = document.createElement('textarea');
    input.style.position = 'absolute';
    input.style.left = `${x}px`;
    input.style.top = `${y}px`;
    input.style.width = '40px';
    input.style.height = '40px';
    input.style.zIndex = '1000';
    // disable resizing
    input.style.resize = 'none';
    input.style.overflow = 'hidden';
    input.style.border = 'none';
    input.style.padding = '0';
    input.style.margin = '0';
    input.style.fontSize = '20px';
    input.style.color = 'white';
    input.style.backgroundColor = graph.options.value.graphBgColor;
    input.style.fontFamily = 'Arial';
    input.style.textAlign = 'center';
    input.style.fontWeight = 'bold';
    input.style.outline = 'none';
    input.value = topItem.schema.text?.content || '';

    const removeInput = () => {
      input.onblur = null;
      const edge = graph.getEdge(topItem.id);
      if (!edge) throw new Error('Edge not found');
      edge.weight = Number(input.value);
      input.remove();
    }

    input.onblur = removeInput;

    input.onkeydown = (ev) => {
      if (ev.key === 'Enter') {
        removeInput();
      }
    }

    document.body.appendChild(input);
    input.focus();
  }
}