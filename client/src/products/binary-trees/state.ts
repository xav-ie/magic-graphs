import { shallowRef, type ComputedRef } from "vue";
import type { TreeTrace } from "./tree/avl";

export type TreeSim = {
  step: ComputedRef<number>;
  next: () => void;
  prev: () => void;
  /**
   * dismisses the simulation
   */
  exit: () => void;
  trace: ComputedRef<TreeTrace[]>;
};

const activeSim = shallowRef<TreeSim>();

const reset = () => {
  if (activeSim.value) {
    activeSim.value.exit();
    activeSim.value = undefined;
  }
}

export default {
  activeSim,
  reset,
};
