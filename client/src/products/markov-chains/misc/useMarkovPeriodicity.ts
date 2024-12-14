import { lowestPrimeFactor } from "@utils/math";

const getPeriod = (component: number[], adjacencyMap: AdjacencyMap): number => {
  const periods = getPeriodBFS(component[0], adjacencyMap);

  // return the greatest common divisor of all the node periods
  const componentPeriod = periods.reduce((acc, curr) => {
    return greatestCommonDivisor(acc, curr);
  }, periods[0]);

  return lowestPrimeFactor(componentPeriod);
}