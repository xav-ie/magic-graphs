import type { MaybeRef } from "vue";
import { useTextTip } from "./useTextTip";
import { useGraphColors } from "@graph/themes/useGraphColors";
import { onMounted } from "vue";

/**
 * a text tip themed after the global graph
 */
export const useGTextTip = (textInput?: MaybeRef<string>) => {
  const textTip = useTextTip(textInput);
  const colors = useGraphColors();

  onMounted(() => {
    const { innerDiv } = textTip.els;
    innerDiv.style.backgroundColor = colors.value.primary;
    innerDiv.style.color = colors.value.text;
  });

  // const { innerDiv } = textTip.els;
  // innerDiv.style.backgroundColor = colors.value.tertiary;
  // innerDiv.style.color = colors.value.text;

  return textTip;
}