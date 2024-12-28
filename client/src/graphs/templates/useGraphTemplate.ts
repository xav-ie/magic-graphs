import type { Graph } from "@graph/types";
import type { GraphTemplate } from "./types";
import { computed, onMounted, onUnmounted, ref } from "vue";
import {
  centerNodesOnOriginCoordinates,
  getAverageCoordinates,
} from "./helpers";
import { generateId } from "@utils/id";
import { useLocalStorage } from "@vueuse/core";
import { getEncapsulatedNodeBox } from "@graph/plugins/marquee/helpers";
import { useGraph } from "@graph/useGraph";
import { products } from "@utils/product";
import type { BoundingBox } from "@shape/types";
import { getCtx } from "@utils/ctx";

export const useGraphTemplate = (graph: Graph) => {
  const userTemplates = useLocalStorage<GraphTemplate[]>("graph-templates", []);

   const tempCanvas = ref(document.createElement("canvas"));
   const tempGraph = useGraph(tempCanvas);
  
    const productTemplates = ref<GraphTemplate[]>(
      products.flatMap((p) => p.templates ?? [])
    );


  const templates = computed(() => [
    ...userTemplates.value, // user templates first so easier to find
    ...productTemplates.value,
  ]);

  const updateProductThumbnails = async () => {
      tempCanvas.value.width = 5000;
      tempCanvas.value.height = 5000;
      await new Promise((resolve) => setTimeout(resolve, 50)); // needed to load initial canvas since size is so large
      for (const product of productTemplates.value) {
        tempGraph.load(product.graphState);
        await new Promise((resolve) => setTimeout(resolve, 50)); // gives time to load in new graph
        tempGraph.themeName.value = graph.themeName.value;
        const boundingBox = getEncapsulatedNodeBox(
          tempGraph.nodes.value,
          tempGraph
        );
        product.thumbnail = createImageFromCanvasRegion(
          tempCanvas.value,
          boundingBox
        );
      }
      tempCanvas.value.width = 0; // performance
      tempCanvas.value.height = 0; // large canvases lag even if not rendered on screen
    };
  
    onMounted(() => {
      updateProductThumbnails();
      graph.subscribe("onThemeChange", updateProductThumbnails);
    });
  
    onUnmounted(() => {
      graph.unsubscribe("onThemeChange", updateProductThumbnails);
      tempCanvas.value.remove();
    });
  
     const createImageFromCanvasRegion = (
        canvas: HTMLCanvasElement,
        boundingBox: BoundingBox,
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

  const add = (
    options: Pick<GraphTemplate, "title" | "description" | "thumbnail">
  ) => {
    const { nodes, edges, canvas } = graph;

    if (!canvas.value) throw new Error("no snapshot canvas found");

    const boundingBox = getEncapsulatedNodeBox(nodes.value, graph);

    const thumbnail = createImageFromCanvasRegion(canvas.value, boundingBox);

    userTemplates.value.unshift({
      id: generateId(),
      thumbnail,
      isUserAdded: true,
      ...options,
      graphState: {
        nodes: JSON.parse(JSON.stringify(nodes.value)),
        edges: JSON.parse(JSON.stringify(edges.value)),
      },
    });
  };

  const load = (templateId: GraphTemplate["id"]) => {
    const template = templates.value.find((t) => t.id === templateId);
    if (!template) {
      throw new Error(`template could not be loaded: ${templateId} not found`);
    }

    const { nodes, edges } = template.graphState;
    const coords = getAverageCoordinates(graph.nodes.value);
    graph.load({
      nodes: centerNodesOnOriginCoordinates(nodes, coords),
      edges,
    });
  };

  const clearUserTemplates = () => (userTemplates.value = []);

  const removeUserTemplate = (templateId: GraphTemplate["id"]) => {
    userTemplates.value = userTemplates.value.filter(
      (t) => t.id !== templateId
    );
  };

  return {
    add,
    load,
    clearUserTemplates,
    removeUserTemplate,

    templates,
    userTemplates,
    productTemplates,
  };
};
