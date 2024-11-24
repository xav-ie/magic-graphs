import { ref } from "vue";
import type { Ref } from "vue";
import type { Aggregator, GraphOptions } from "@graph/types";
import type { Coordinate, Shape } from "@shape/types";
import { shapes } from "@shapes";
import { useMarqueeGraph } from "../useMarqueeGraph";
import type { GraphMouseEvent } from "../useBaseGraph/types";
import { BRUSH_WEIGHTS, COLORS } from "./types";

export const useAnnotationGraph = (
  canvas: Ref<HTMLCanvasElement | undefined | null>,
  options: Partial<GraphOptions> = {},
) => {
  const graph = useMarqueeGraph(canvas, options)

  const selectedColor = ref(COLORS[0])
  const selectedBrushWeight = ref(BRUSH_WEIGHTS[0])

  const batch = ref<Coordinate[]>([])
  const scribbles = ref<Shape[]>([])
  const isDrawing = ref(false)
  const lastPoint = ref<Coordinate>()

  const isActive = ref(false)

  const clear = () => {
    scribbles.value = []
  }

  /**
   * starts drawing from the current mouse position
   */
  const startDrawing = ({ coords }: GraphMouseEvent) => {
    isDrawing.value = true;

    lastPoint.value = coords;
    batch.value = [coords];
  };

  /**
   * draws a line that connects two points.
   * the delta between two mouse points while
   * mouse is being dragged
   */
  const drawLine = ({ coords }: GraphMouseEvent) => {
    if (!isDrawing.value || !lastPoint.value) return;

    lastPoint.value = coords;
    batch.value.push(coords);
  };

  const stopDrawing = () => {
    if (!isDrawing.value) return;

    isDrawing.value = false;
    lastPoint.value = undefined;

    if (batch.value.length === 0) return;

    const scribbleShape = shapes.scribble({
      type: 'draw',
      points: batch.value,
      color: selectedColor.value,
      brushWeight: selectedBrushWeight.value,
    })

    scribbles.value.push(scribbleShape);
    batch.value = [];
  };

  const addScribblesToAggregator = (aggregator: Aggregator) => {
    if (!isActive.value) return aggregator
    for (const scribble of scribbles.value) {
      aggregator.push({
        graphType: "annotation",
        id: scribble.id,
        shape: scribble,
        priority: 5000,
      })
    }

    return aggregator
  }

  graph.updateAggregator.push(addScribblesToAggregator)

  const activate = () => {
    if (!graph.canvas.value) return;

    isActive.value = true;
    graph.settings.value.userEditable = false;
    graph.settings.value.marquee = false;
    graph.settings.value.focusable = false;
    graph.graphCursorDisabled.value = true;

    graph.canvas.value.style.cursor = 'crosshair';

    graph.subscribe('onMouseDown', startDrawing)
    graph.subscribe('onMouseMove', drawLine)
    graph.subscribe('onMouseUp', stopDrawing)
  }

  const deactivate = () => {
    if (!graph.canvas.value) return;

    isActive.value = false;

    graph.settings.value.userEditable = true;
    graph.settings.value.marquee = true;
    graph.settings.value.focusable = true;
    graph.graphCursorDisabled.value = false;

    graph.canvas.value.style.cursor = 'default';

    graph.unsubscribe('onMouseDown', startDrawing)
    graph.unsubscribe('onMouseMove', drawLine)
    graph.unsubscribe('onMouseUp', stopDrawing)
  }

  return {
    ...graph,

    clearAnnotations: clear,
    annotationActive: isActive,

    annotationColor: selectedColor,
    annotationBrushWeight: selectedBrushWeight,

    activateAnnotation: activate,
    deactivateAnnotation: deactivate,
  }
}