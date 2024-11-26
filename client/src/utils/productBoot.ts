import type { Graph } from "@graph/types";
import { useRoute, useRouter } from "vue-router";
import { onMounted } from "vue";
import { collabControls } from "@graph/collab";
import { routeToProduct } from "./product";
import type { ProductInfo } from "src/types";

export const useGraphProductBoot = (graph: Graph, product?: ProductInfo) => {
  const route = useRoute();
  const router = useRouter();

  if (!product) {
    const productForCurrentRoute = routeToProduct[route.path];
    if (!productForCurrentRoute) throw new Error(`no product found for route ${route.path}`);
    product = productForCurrentRoute;
  }

  const { connectToRoom } = collabControls;
  const roomId = route.query.rid;

  const { productId, name } = product;
  document.title = name;

  onMounted(() => {
    if (!roomId) return;
    if (typeof roomId !== 'string') return console.error('room id must be a string');

    connectToRoom({
      graph,
      roomId,
      productId,
    })

    router.replace({
      query: { rid: roomId }
    })
  })
}