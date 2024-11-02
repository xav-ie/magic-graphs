import type { TextArea } from '@shape/types'
import type { DeepRequired } from '@utils/types';

export const engageTextarea = (textArea: DeepRequired<TextArea>, handler: (str: string) => void) => {
  const {
    at,
    text,
    activeColor: bgColor,
  } = textArea;

  const {
    x,
    y
  } = at;

  const {
    color: textColor,
    content,
    fontSize,
    fontWeight,
  } = text

  const SIZE = fontSize * 2;

  const input = document.createElement('textarea');

  input.style.position = 'absolute';
  input.style.left = `${x}px`;
  input.style.top = `${y}px`;
  input.style.width = `${SIZE}px`;
  input.style.height = `${SIZE}px`;
  input.style.zIndex = '1000';

  input.style.resize = 'none';

  input.style.overflow = 'hidden';
  input.style.border = 'none';
  input.style.padding = '0';

  // TODO remove hard coding, but i need to figure out how text area works
  input.style.paddingTop = '4px';

  input.style.margin = '0';
  input.style.fontSize = `${fontSize}px`;
  input.style.color = textColor;
  input.style.backgroundColor = bgColor;
  input.style.fontFamily = 'Arial';
  input.style.textAlign = 'center';
  input.style.fontWeight = fontWeight;
  input.style.outline = 'none';

  // no text wrapping
  input.style.whiteSpace = 'nowrap';


  input.value = content;

  const removeInput = () => {
    input.onblur = null;
    handler(input.value);
    input.remove();
  }

  input.onblur = removeInput;

  input.onkeydown = (ev) => {
    if (ev.key === 'Enter') {
      removeInput();
    }
  }

  const responsiveCanvas = document.getElementById('responsive-canvas-container');
  if (!responsiveCanvas) throw new Error('responsive canvas container not found');
  responsiveCanvas.appendChild(input);
  setTimeout(() => input.focus(), 10);
}