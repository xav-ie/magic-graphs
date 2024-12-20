import type { GEdge, GNode, Graph } from "@graph/types";
import { useGraph } from "@graph/useGraph";
import type { BoundingBox } from "@shape/types";
import { getCtx } from "@utils/ctx";
import { onUnmounted, ref } from "vue";
import { getEncapsulatedNodeBox } from "@graph/plugins/marquee/helpers";
import { products } from "@utils/product";
import type { GraphTemplate } from "./types";
import { triangle } from "@shapes";

export const createImageFromCanvasRegion = (
  canvas: HTMLCanvasElement,
  boundingBox: BoundingBox
) => {
  const { at, width, height } = boundingBox;
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = getCtx(tempCanvas);

  tempCtx.drawImage(
    canvas,           // Source canvas
    at.x, at.y,       // Source start x, y
    width, height,    // Source width, height
    0, 0,             // Destination start x, y
    width, height     // Destination width, height
  );

  const dataURL = tempCanvas.toDataURL();

  tempCanvas.remove();

  return dataURL;
};

export const useGraphSnapshot = (graph: Graph) => {
  const tempCanvas = ref(document.createElement('canvas'));
  tempCanvas.value.width = 10000
  tempCanvas.value.height = 10000
  const tempGraph = useGraph(tempCanvas);

  const productTemplates = ref<GraphTemplate[]>(
    products.flatMap((p) => p.templates ?? [])
  );

  const getSnapshot = (graphState: { nodes: GNode[], edges: GEdge[] }) => {
    tempGraph.load(graphState)

    tempGraph.themeName.value = graph.themeName.value
    const boundingBox = getEncapsulatedNodeBox(graphState.nodes, tempGraph);
    const thumbnail = createImageFromCanvasRegion(tempGraph.canvas.value!, boundingBox);
    console.log(thumbnail)

    return thumbnail
  }

  const updateProductThumbnails = () => { 
    productTemplates.value.forEach((p) => {
      p.thumbnail = getSnapshot(p.graphState)
    })
  }

  graph.subscribe('onThemeChange', updateProductThumbnails)

  onUnmounted(() => {
    graph.unsubscribe('onThemeChange', updateProductThumbnails)
    tempCanvas.value.remove()
    console.log('goneee')
  })

  return {
    getSnapshot,
    productTemplates,
  }
}