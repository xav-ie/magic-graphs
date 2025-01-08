import { ref, onUnmounted } from "vue";
import type { GEdge, Graph } from "@graph/types";
import { useTheme } from "@graph/themes/useTheme";
import { interpolateColors, EASING_FUNCTIONS } from "@utils/animate";

export const useAnimateColorPulse = (graph: Graph) => {
  const { setTheme, removeAllThemes } = useTheme(graph, "pulse_animation");

  const edgesToPulseColor = ref<Set<GEdge['id']>>(new Set());
  const animateInterval = ref<NodeJS.Timeout | null>(null);
  const pulseColor = ref("#FFFFFF");
  
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
    const baseColor = graph.baseTheme.value.edgeColor;
    const currentTime = Date.now();
    const elapsed = currentTime % PULSE_DURATION;
    const progress = elapsed / PULSE_DURATION;
    const easedProgress = easingFunction(progress < 0.5 ? progress : 1 - progress); // oscillate
    const interpolatedColor = interpolateColors([baseColor, pulseColor.value], easedProgress);
    setTheme("edgeColor", interpolatedColor.toHexString());
  };

  animateInterval.value = setInterval(animate, 25)

  onUnmounted(() => {
    clearAll();
  });

  return {
    clearAll,

    edgesToPulseColor,
    pulseColor,
  };
};
