import type { RouteRecordRaw } from "vue-router"
import type { Graph } from "@graph/types"
import type { SimulationControls } from "@ui/sim/types"

/**
 * options for exposing a product to the main page
 */
export type MainPageInfo = {
  /**
   * the name of the menu item
   */
  name: string,
  /**
   *
   */
  description: string,
  /**
   * an image to display in the menu
   */
  thumbnail: string,
}

/**
 * options for exposing a simulation to other products
 */
export type SimulationDeclaration = {
  /**
   * the name of the simulation, user facing
   */
  name: string,
  /**
   * the description of the simulation, user facing
   */
  description: string,
  /**
   * an image to display in the simulation selection
   */
  thumbnail: string,
  /**
   * a predicate to determine if the simulation can run on the given graph.
   * returning a string indicates that the simulation cannot run and the string, user facing,
   * is the reason why it cannot. returning true indicates that the simulation can run.
   */
  canRun?: () => true | string,
  /**
   * the controls for the simulation returned by your products useSimulation instance
   */
  controls: SimulationControls,
  /**
   * runs when the simulation is opened or started by the user.
   * use this to prepare the simulation experience by activating colorizers, prompting
   * user for starting nodes, etc.
   */
  onInit?: () => Promise<void> | void,
  /**
   * runs when the simulation is closed or stopped by the user.
   * use this to deactivate colorizers or other visual effects that were activated
   * in `onInit` or during the runtime of the simulation.
   */
  onDismiss?: () => Promise<void> | void,
}

export type SimulationDeclarationGetter = (graph: Graph) => SimulationDeclaration[]

/**
 * interface for exposing a product to global resources
 * like menus, router, and other products
 */
export type ProductInfo = {
  /**
   * consumed by vue-router in order to add it as an available route
   */
  route: RouteRecordRaw,
  /**
   * the name of the product.
   * used as document title
   */
  name: string,
  /**
   * the description of the product
   */
  description: string,
  /**
   * a unique identifier for the product, cannot contain spaces or special characters
   */
  productId: string,
  /**
   * if defined, the product will be added to the main menu
   * with the properties defined here
   */
  menu?: MainPageInfo,
  /**
   * if defined, this products simulations will be exposed to other products
   */
  simulations?: SimulationDeclarationGetter,
}