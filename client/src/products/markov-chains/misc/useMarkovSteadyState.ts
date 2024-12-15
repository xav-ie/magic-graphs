// @ts-ignore
import linearAlgebra from 'linear-algebra';
import type { Graph } from "@graph/types";
import BigNumber from 'bignumber.js';

const { Matrix } = linearAlgebra();

export function getSteadyStateVector(transitionMatrix: number[][], precision: number) {
  const numRows = transitionMatrix.length;
  const inputMatrix = new Matrix(transitionMatrix).trans();
  const identity = Matrix.identity(numRows)

  const { data: augmentedMatrix } = identity.minus(inputMatrix) as { data: number[][] }

  augmentedMatrix.forEach((row) => row.push(0));
  augmentedMatrix.push(Array(numRows + 1).fill(1));

  const solvedMatrix = runBigNumberRREF(augmentedMatrix, precision);

  return new Matrix(solvedMatrix).trans().data.at(-1).slice(0, -1);
}

const findRREFBN = (matrix: BigNumber[][]) => {

  const numRows = matrix.length;
  const numCols = matrix[0].length;

  let lead = 0;

  for (let row = 0; row < numRows; row++) {
    if (numCols <= lead) {
      return matrix;
    }

    let i = row;

    // TODO: add adjustable tolerance parameter to narrow in on the most accurate solution
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

const runBigNumberRREF = (matrix: number[][], precision: number) => {
  const bigNumberMatrix = matrix.map((row) => row.map((entry) => new BigNumber(entry)));
  const rrefMatrix = findRREFBN(bigNumberMatrix);
  return rrefMatrix.map((row) => row.map((entry) => parseFloat(entry.toNumber().toFixed(precision))));
}

/**
 * reactive steady state of a markov chain
 */
export const useMarkovSteadyState = (graph: Graph) => {

}