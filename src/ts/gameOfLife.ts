function gameOfLife(column: number, row: number) {
  let activeNeighborCount = getActiveNeighborCount(column, row);
  let cellIsAlive = determineLife(column, row, activeNeighborCount);
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

// Get all the neighboring virus tiles => https://www.redblobgames.com/grids/hexagons/#distances
/**
 * @param {number} column - The column of the virus tile
 * @param {number} row - The row of the virus tile
 * @param {number} radius - The row of the virus tile, default is 1
 * @returns {[number, number][]} An array of all neighbors in specified radius. The elements are returned as a tuple of column & row
 */
function getNeighbors(col: number, row: number, distance: number = 1) {
  const results = [];

  // Convert to axial coordinates
  const q = Math.floor(col + (row - (row & 1)) / 2);
  const r = row;

  // Calculate the range in axial coordinates
  for (let dx = -distance; dx <= distance; dx++) {
    for (
      let dy = Math.max(-distance, -dx - distance);
      dy <= Math.min(distance, -dx + distance);
      dy++
    ) {
      // Convert back to double-width offset coordinates
      const x = q + dx - Math.floor((r + dy - ((r + dy) & 1)) / 2);
      const y = r + dy;

      // Check if the coordinates are within the allowed range
      if (x >= 0 && x < virusColumns && y >= 0 && y < virusRows) {
        results.push([x, y]);
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
function determineLife(column: number, row: number, activeNeighborCount: number) {
  if (activeNeighborCount < minPopulation) return 0; // Loneliness
  else if (activeNeighborCount >= overPopulation) return 0; // Overpopulation
  else if (activeNeighborCount >= minPopulation) return 1; // Reproduction
  else console.log('SHOULD NEVER HAPPEN!');
}
