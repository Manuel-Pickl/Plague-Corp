function gameOfLife(column, row) {
    var activeNeighborCount = getActiveNeighborCount(column, row);
    var cellIsAlive = determineLife(column, row, activeNeighborCount);
    virusMatrixNextStep[column][row] = cellIsAlive;
}
// Get the number of active neighboring virus tiles
/**
 * @param {string=} column - The column of the virus tile
 * @param {number} row - The row of the virus tile
 * @returns {number} The number of active neighboring virus tiles
 */
function getActiveNeighborCount(column, row) {
    // add up all the states in a 2,3,2 surrounding hexagon
    var activeNeighborCount = 0;
    if ((row % 2 == 0) && (column > 0) && (row > 0))
        activeNeighborCount += virusMatrix[column - 1][row - 1];
    else if ((column < virusColumns - 1) && (row > 0))
        activeNeighborCount += virusMatrix[column + 1][row - 1];
    if (row > 0)
        activeNeighborCount += virusMatrix[column][row - 1];
    if (column > 0)
        activeNeighborCount += virusMatrix[column - 1][row];
    if (column < virusColumns - 1)
        activeNeighborCount += virusMatrix[column + 1][row];
    if (row < virusRows - 1)
        activeNeighborCount += virusMatrix[column][row + 1];
    if ((row % 2 == 0) && (column > 0) && (row < virusRows - 1))
        activeNeighborCount += virusMatrix[column - 1][row + 1];
    else if ((column < virusColumns - 1) && (row < virusRows - 1))
        activeNeighborCount += virusMatrix[column + 1][row + 1];
    // check if bound tiles are skips
    // if (row % 2 == 0) neighbors += virusMatrix[column - 1][row - 1];
    // else              neighbors += virusMatrix[column + 1][row - 1];
    //                   neighbors += virusMatrix[column][row - 1];
    //                   neighbors += virusMatrix[column - 1][row];
    //                   neighbors += virusMatrix[column + 1][row];
    //                   neighbors += virusMatrix[column][row + 1];
    // if (row % 2 == 0) neighbors += virusMatrix[column - 1][row + 1];
    // else              neighbors += virusMatrix[column + 1][row + 1];
    return activeNeighborCount;
}
// Determine if the virus tile is alive for the next cycle
/**
 * @param {string=} column - The column of the virus tile
 * @param {number} row - The row of the virus tile
 * @param {number} activeNeighborCount - The number of active neighbors
 * @returns {number} 1 if the virus tile is alive in the next cycle, 0 if otherwise
 */
function determineLife(column, row, activeNeighborCount) {
    if (activeNeighborCount < minPopulation)
        return 0; // Loneliness
    else if (activeNeighborCount > overPopulation)
        return 0; // Overpopulation
    else if (activeNeighborCount >= minPopulation)
        return 1; // Reproduction
    else
        console.log("SHOULD NEVER HAPPEN!");
}
//# sourceMappingURL=gameOfLife.js.map