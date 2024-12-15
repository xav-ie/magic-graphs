import { computed, type Ref } from 'vue';
// @ts-ignore
import linearAlgebra from 'linear-algebra';
import BigNumber from 'bignumber.js';
import type { GNode, Graph } from "@graph/types";

const { Matrix } = linearAlgebra();

const findRREFBN = (matrix: BigNumber[][]) => {

  const numRows = matrix.length;
  const numCols = matrix[0].length;

  let lead = 0;

  for (let row = 0; row < numRows; row++) {
    if (numCols <= lead) {
      return matrix;
    }

    let i = row;

    const tolerance = new BigNumber("1e-1");

    while (matrix[i][lead].abs().isLessThanOrEqualTo(tolerance)) {
      i++;
      if (numRows === i) {
        i = row;
        lead++;
        if (numCols === lead) {
          return matrix;
        }
      }
    }

    // Swap rows
    let temp = matrix[i];
    matrix[i] = matrix[row];
    matrix[row] = temp;

    // Scale the pivot row
    let val = matrix[row][lead];
    for (let j = 0; j < numCols; j++) {
      matrix[row][j] = matrix[row][j].div(val);
    }

    // Eliminate other rows
    for (let i = 0; i < numRows; i++) {
      if (i !== row) {
        val = matrix[i][lead];
        for (let j = 0; j < numCols; j++) {
          matrix[i][j] = matrix[i][j].minus(val.times(matrix[row][j]));
        }
      }
    }

    lead++;
  }

  return matrix;
}

const runBigNumberRREF = (matrix: number[][]) => {
  const bigNumberMatrix = matrix.map((row) => row.map((entry) => new BigNumber(entry)));
  return findRREFBN(bigNumberMatrix).map((row) => row.map((entry) => entry.toNumber()));
}

const getSteadyStateVector = (transitionMatrix: number[][]) => {
  const numRows = transitionMatrix.length;
  const inputMatrix = new Matrix(transitionMatrix).trans();
  const identity = Matrix.identity(numRows)

  const { data: augmentedMatrix } = identity.minus(inputMatrix) as { data: number[][] }

  augmentedMatrix.forEach((row) => row.push(0));
  augmentedMatrix.push(Array(numRows + 1).fill(1));

  const solvedMatrix = runBigNumberRREF(augmentedMatrix);

  return new Matrix(solvedMatrix).trans().data.at(-1).slice(0, -1);
}

export type MarkovSteadyStateOptions = {
  recurrentClasses: Ref<Set<GNode['id']>[]>;
  illegalNodeIds: Ref<Set<GNode['id']>>;
}

/**
 * reactive unique steady state of a markov chain
 */
export const useMarkovSteadyState = (graph: Graph, options: MarkovSteadyStateOptions) => {
  return computed(() => {
    const { recurrentClasses, illegalNodeIds } = options;

    // if any of these conditions are true, the chain does not have a unique steady state
    if (recurrentClasses.value.length === 0) return
    if (recurrentClasses.value.length > 1) return
    if (illegalNodeIds.value.size > 0) return

    const { transitionMatrix } = graph.transitionMatrix;
    return getSteadyStateVector(transitionMatrix.value);
  })
}