import { onMounted } from "vue";
import { useRoute } from "vue-router";
import type { Graph } from "@graph/types";
import { collabControls } from "@graph/collab";
import type { ProductInfo } from "src/types";
import { routeToProduct } from "./product";
import { globalGraph } from "@graph/global";

/**
 * bootstraps a graph centric product, connecting to a room if a room id is provided in the query
 * and performing various other configuration tasks such as setting the document title
 *
 * @param graph the graph instance of the product
 * @param product the product info for the product (inferred from the route if not provided)
 */
export const useGraphProductBoot = (graph: Graph, product?: ProductInfo) => {
  const route = useRoute();

  if (!product) {
    const productForCurrentRoute = routeToProduct[route.path];
    if (!productForCurrentRoute) throw new Error(`no product found for route ${route.path}`);
    product = productForCurrentRoute;
  }

  const { connectToRoom } = collabControls;
  const roomId = route.query.rid;

  const { productId, name } = product;
  document.title = `${name} - Magic Algorithms`;

  globalGraph.value = graph;

  onMounted(() => {
    if (!roomId) return;
    if (typeof roomId !== 'string') return console.error('room id must be a string');

    connectToRoom({
      graph,
      roomId,
      productId,
    })
  })
}