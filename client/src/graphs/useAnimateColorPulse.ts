import { ref, watch, onUnmounted } from "vue";
import type { GEdge, Graph } from "@graph/types";
import { useTheme } from "@graph/themes/useTheme";
import { interpolateColor, EASING_FUNCTIONS } from "@utils/animate";

export const useAnimateColorPulse = (graph: Graph) => {
  const { setTheme, removeAllThemes } = useTheme(graph, "pulse_animation");

  const edgesToPulseColor = ref<Map<GEdge["id"], string>>(new Map());
  const animateInterval = ref<NodeJS.Timeout | null>(null);

  const easingFunction = EASING_FUNCTIONS["in-out"];
  const PULSE_DURATION = 1000; 

  const clearAll = () => {
    edgesToPulseColor.value.clear();
    removeAllThemes();
    if (animateInterval.value !== null) {
      clearInterval(animateInterval.value);
    }
  };

  const animate = () => {
    const currentTime = Date.now();
    const currentColor = graph.baseTheme.value.edgeColor;
    edgesToPulseColor.value.forEach((targetColor) => {
      const elapsed = currentTime % PULSE_DURATION;
      const progress = elapsed / PULSE_DURATION;
      const easedProgress = easingFunction(progress < 0.5 ? progress : 1 - progress); // Oscillate

      const interpolatedColor = interpolateColor(currentColor, targetColor, easedProgress);
      setTheme("edgeColor", interpolatedColor.toHexString());
    });
  };
 

  watch(edgesToPulseColor, (newVal) => {
    if (newVal.size > 0) {
      animateInterval.value = setInterval(animate, PULSE_DURATION)
    } else {
      clearAll();
    }
  });

  onUnmounted(() => {
    clearAll();
  });

  return {
    clearAll,
    edgesToPulseColor,
  };
};
