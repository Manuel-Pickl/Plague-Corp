function gameOfLife(column, row) {
    var activeNeighborCount = getActiveNeighborCount(column, row);
    var cellIsAlive = determineLife(column, row, activeNeighborCount);
    virusMatrixNextStep[column][row] = cellIsAlive;
}
// Get the number of active neighboring virus tiles
/**
 * @param {number} column - The column of the virus tile
 * @param {number} row - The row of the virus tile
 * @returns {number} The number of active neighboring virus tiles
 */
function getActiveNeighborCount(column, row) {
    var activeNeighborCount = 0;
    var neighbors = getNeighbors(column, row);
    neighbors.forEach(function (neighbor) { return activeNeighborCount += virusMatrix[neighbor[0]][neighbor[1]]; });
    return activeNeighborCount;
}
// Get all the neighboring virus tiles
/**
 * @param {number} column - The column of the virus tile
 * @param {number} row - The row of the virus tile
 * @param {number} radius - The row of the virus tile, default is 1
 * @returns {[number, number][]} An array of all neighbors in specified radius. The elements are returned as a tuple of column & row
 */
function getNeighbors(column, row, radius) {
    if (radius === void 0) { radius = 1; }
    var neighbors = new Array();
    if (radius == 0)
        return neighbors;
    else if (radius == 1) {
        // top row
        if ((row % 2 == 0) && (column > 0) && (row > 0))
            neighbors.push([column - 1, row - 1]);
        else if ((column < virusColumns - 1) && (row > 0))
            neighbors.push([column + 1, row - 1]);
        if (row > 0)
            neighbors.push([column, row - 1]);
        // middle row
        if (column > 0)
            neighbors.push([column - 1, row]);
        if (column < virusColumns - 1)
            neighbors.push([column + 1, row]);
        // bottom row
        if (row < virusRows - 1)
            neighbors.push([column, row + 1]);
        if ((row % 2 == 0) && (column > 0) && (row < virusRows - 1))
            neighbors.push([column - 1, row + 1]);
        else if ((column < virusColumns - 1) && (row < virusRows - 1))
            neighbors.push([column + 1, row + 1]);
        /// loop solution for radius == 1
        // for (let r = row - radius; r <= row + radius; r++) {
        // //     if (r >= virusColumns || r < 0) continue;
        // //     for (let c = column - radius; c <= column + radius; c++) {
        // //         if (c >= virusColumns || c < 0) continue;
        // //         if ((row % 2 == 1) && (c == column - radius) && ((r == row - radius) || (r == row + radius))) continue;
        // //         else if ((row % 2 == 0) && (c == column + radius) && ((r == row - radius) || (r == row + radius))) continue;
        // //         neighbors.push([c, r]);
        // //     }
        // // }
    }
    // recurse solution
    // -> performance struggles on higher brushSizes > 5
    // ToDo: try to implement a radius/degree based function
    else if (radius > 1) {
        neighbors = getNeighbors(column, row, radius - 1);
        neighbors.forEach(function (neighbor) {
            var nextNeighbors = getNeighbors(neighbor[0], neighbor[1]);
            nextNeighbors.forEach(function (nextNeighbor) {
                if (neighbors.indexOf(nextNeighbor) != -1)
                    return; // skip if virus tile already added
                neighbors.push(nextNeighbor);
            });
        });
    }
    return neighbors;
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