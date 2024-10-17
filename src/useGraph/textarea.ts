import {
  type TextArea,
  TEXTAREA_DEFAULTS,
  TEXT_DEFAULTS,
} from '@/shapes/types';

export const engageTextarea = (textAreaSchema: TextArea, handler: (str: string) => void) => {

  const {
    at,
    text,
    color: bgColor,
  } = {
    ...TEXTAREA_DEFAULTS,
    ...textAreaSchema,
  }

  const {
    x,
    y
  } = at;

  const {
    color: textColor,
    content,
    fontSize,
    fontWeight,
  } = {
    ...TEXT_DEFAULTS,
    ...text,
  }

  const SIZE = fontSize * 2;

  // create a text input
  const input = document.createElement('textarea');
  input.style.position = 'absolute';
  input.style.left = `${x + (SIZE / 2)}px`;
  input.style.top = `${y + (SIZE / 2)}px`;
  input.style.width = `${SIZE}px`;
  input.style.height = `${SIZE}px`;
  input.style.zIndex = '1000';

  // disable resizing
  input.style.resize = 'none';

  input.style.overflow = 'hidden';
  input.style.border = 'none';
  input.style.padding = '0';
  // no hard coding, but i need to figure out how text area works
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

  document.body.appendChild(input);
  setTimeout(() => input.focus(), 10);
}