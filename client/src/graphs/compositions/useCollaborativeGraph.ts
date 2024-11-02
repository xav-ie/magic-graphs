import type { Ref } from "vue";
import type { UserEditableGraphOptions } from "./useUserEditableGraph";
import { usePersistentGraph } from "./usePersistentGraph";


export const useCollaborativeGraph = (
  canvas: Ref<HTMLCanvasElement | undefined | null>,
  options: Partial<UserEditableGraphOptions> = {}
) => {
  const graph = usePersistentGraph(canvas, options)
  return graph
}