import type { TextArea } from '@shape/types'
import { getCanvasScale } from '@utils/components/useCanvasCoord';
import type { DeepRequired } from '@utils/types';

export const engageTextarea = (ctx: CanvasRenderingContext2D, textArea: DeepRequired<TextArea>, handler: (str: string) => void) => {
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

  const scale = getCanvasScale(ctx)

  const inputWidth = Math.max(fontSize * 2 * scale, fontSize * 0.6 * content.length * scale)
  const inputHeight = fontSize * 2 * scale;

  const input = document.createElement('textarea');

  input.style.position = 'absolute';
  input.style.left = `${x}px`;
  input.style.top = `${y}px`;
  input.style.width = `${(inputWidth)}px`;
  input.style.height = `${inputHeight}px`;
  input.style.zIndex = '1000';

  input.style.resize = 'none';

  input.style.overflow = 'hidden';
  input.style.border = 'none';
  input.style.padding = '0';

  // TODO remove hard coding, but i need to figure out how text area works
  input.style.paddingTop = '4px';

  input.style.margin = '0';
  input.style.fontSize = `${fontSize * scale}px`;
  input.style.color = textColor;
  input.style.backgroundColor = bgColor;
  input.style.fontFamily = 'Arial';
  input.style.textAlign = 'center';
  input.style.fontWeight = fontWeight;
  input.style.outline = 'none';

  // no text wrapping
  input.style.whiteSpace = 'nowrap';

  const adjustSize = () => {
    input.style.width = `${Math.max(fontSize * 2, fontSize * 0.6 * input.value.length) * scale}px`;
  };

  input.onfocus = adjustSize

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
  setTimeout(() => {
    input.focus();
    input.setSelectionRange(0, input.value.length);
  }, 10);
}