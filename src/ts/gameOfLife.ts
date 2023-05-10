import { virusMatrixNextStep, virusMatrix, gameOfLifeRules } from './script.js';
import { minPopulation, overPopulation } from './htmlHelper.js';
import { virusColumns, virusRows } from './svgHelper.js';

export function gameOfLife(column: number, row: number) {
  let activeNeighborCount = getActiveNeighborCount(column, row);
  let cellIsAlive = determineLife(activeNeighborCount);
  virusMatrixNextStep[column][row] = cellIsAlive;
}

// Get the number of active neighboring virus tiles
/**
 * @param {number} column - The column of the virus tile
 * @param {number} row - The row of the virus tile
 * @returns {number} The number of active neighboring virus tiles
 */
function getActiveNeighborCount(column: number, row: number) {
  let neighbors = getNeighbors(column, row);
  return neighbors.reduce((count, neighbor) => count + virusMatrix[neighbor[0]][neighbor[1]], 0);
}

/**
 * https://www.redblobgames.com/grids/hexagons/#conversions-offset
 *
 * All helper functions for conversion
 */
// Helper function to convert offset to axial
function offsetToAxial(col, row) {
  const q = col - (row - (row & 1)) / 2;
  const r = row;
  return [q, r];
}

// Helper function to convert axial to offset
function axialToOffset(q, r) {
  const col = q + (r - (r & 1)) / 2;
  const row = r;
  return [col, row];
}

// Helper function to add two axial coordinates
function axialAdd(a, b) {
  return [a[0] + b[0], a[1] + b[1]];
}

// Get all the neighboring virus tiles
/**
 * @param {number} column - The column of the virus tile
 * @param {number} row - The row of the virus tile
 * @param {number} radius - The row of the virus tile, default is 1
 * @returns {[number, number][]} An array of all neighbors in specified radius. The elements are returned as a tuple of column & row
 */
export function getNeighbors(col: number, row: number, distance: number = 1) {
  // store all coordiantes/neighbors
  const results = [];

  /**
   * https://www.redblobgames.com/grids/hexagons/#distances
   */
  // Iterate through all possible neighbors within the given distance
  for (let di = -distance; di <= distance; di++) {
    for (let dj = -distance; dj <= distance; dj++) {
      if (Math.abs(di + dj) <= distance) {
        // to make life easier => https://www.redblobgames.com/grids/hexagons/#distances-offset
        const axialCoords = axialAdd(offsetToAxial(col, row), [di, dj]);
        const [x, y] = axialToOffset(axialCoords[0], axialCoords[1]);

        // Check if the coordinates are within the allowed range
        if (x >= 0 && x < virusColumns && y >= 0 && y < virusRows && !(x === col && y === row)) {
          results.push([x, y]);
        }
      }
    }
  }

  return results;
}

// Determine if the virus tile is alive for the next cycle
/**
 * @param {string=} column - The column of the virus tile
 * @param {number} row - The row of the virus tile
 * @param {number} activeNeighborCount - The number of active neighbors
 * @returns {number} 1 if the virus tile is alive in the next cycle, 0 if otherwise
 */

function determineLife(activeNeighborCount: number) {
  return gameOfLifeRules[activeNeighborCount];
}
