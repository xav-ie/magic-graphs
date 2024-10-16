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
  input.style.fontSize = `${fontSize}px`;
  input.style.color = textColor;
  input.style.backgroundColor = bgColor;
  input.style.fontFamily = 'Arial';
  input.style.textAlign = 'center';
  input.style.fontWeight = fontWeight;
  input.style.outline = 'none';
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