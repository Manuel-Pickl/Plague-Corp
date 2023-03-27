// var worldSvg: SVGElement;
var worldSvg;
var virusMap;
var virusColumns;
var virusRows;
var virusMatrix;
var virusMatrixNextStep;
var seaMatrix;
// window.addEventListener('load', load);
function assignHtmlVariables() {
    worldSvg = svgObject.contentDocument.querySelector("svg");
    virusMap = document.getElementById("virusMap");
}
function pointInSea(column, row) {
    // return false;
    return !seaMatrix[column][row];
}
function load() {
    var splashScreen = document.querySelector(".splash-screen");
    determineSvgSize();
    createMatrices();
    placeVirusRandomly();
    var interval = setInterval(draw, 1000 / framerate);
    console.log("loaded");
    svgObject.style.visibility = "visible";
    virusMap.style.visibility = "visible";
    splashScreen.style.visibility = "hidden";
}
function createMatrices() {
    createSeaMatrix();
    createVirusMatrix();
}
function createSeaMatrix() {
    // seaMatrix = JSON.parse(matrix);
    seaMatrix = new Array(virusColumns);
    for (var column = 0; column < virusColumns; column++) {
        seaMatrix[column] = new Array(virusRows);
    }
    for (var row = 0; row < virusRows; row++) {
        for (var column = 0; column < virusColumns; column++) {
            var positionX = column * virusWidth;
            if (row % 2 == 1)
                positionX += virusWidth / 2;
            var positionY = row * virusHeight * 0.75;
            var pointOnLand = (worldSvg.ownerDocument.elementFromPoint(positionX + virusWidth / 2, positionY + virusHeight / 2) != worldSvg)
                // sides
                || (worldSvg.ownerDocument.elementFromPoint(positionX + virusWidth / 2, positionY) != worldSvg) // top
                || (worldSvg.ownerDocument.elementFromPoint(positionX + virusWidth, positionY + virusHeight / 2) != worldSvg) // right
                || (worldSvg.ownerDocument.elementFromPoint(positionX + virusWidth / 2, positionY + virusHeight) != worldSvg) // bottom
                || (worldSvg.ownerDocument.elementFromPoint(positionX, positionY + virusHeight / 2) != worldSvg); // left
            // edges
            // || (worldSvg.ownerDocument.elementFromPoint(positionX, positionY) != worldSvg) // top left
            // || (worldSvg.ownerDocument.elementFromPoint(positionX + virusWidth, positionY) != worldSvg) // top right
            // || (worldSvg.ownerDocument.elementFromPoint(positionX + virusWidth, positionY + virusHeight) != worldSvg) // bottom right
            // || (worldSvg.ownerDocument.elementFromPoint(positionX, positionY + virusHeight) != worldSvg) // bottom left
            seaMatrix[column][row] = pointOnLand ? 1 : 0;
        }
    }
}
function createVirusMatrix() {
    virusMatrix = new Array(virusColumns);
    for (var column = 0; column < virusColumns; column++) {
        virusMatrix[column] = new Array(virusRows);
    }
    virusMatrixNextStep = new Array(virusColumns);
    for (var column = 0; column < virusColumns; column++) {
        virusMatrixNextStep[column] = new Array(virusRows);
    }
    // create all virus div elements
    for (var row = 0; row < virusRows; row++) {
        for (var column = 0; column < virusColumns; column++) {
            var virus = document.createElement("div");
            virus.id = "".concat(column, "-").concat(row);
            virus.classList.add("virus");
            virus.classList.add((Math.random() < 0.5) ? "alpha" : "beta");
            var positionX = column * virusWidth;
            if (row % 2 == 1)
                positionX += virusWidth / 2;
            var positionY = row * virusHeight * 0.75;
            virus.style.left = "".concat(positionX, "px");
            virus.style.top = "".concat(positionY, "px");
            virus.style.width = "".concat(virusWidth, "px");
            virus.style.height = "".concat(virusHeight, "px");
            virus.style.opacity = 0.5.toString();
            // virus.style.visibility = "hidden";
            virusMap.appendChild(virus);
        }
    }
}
var cycleCount = 0;
function draw() {
    cycleCount++;
    if (logCyclus)
        console.log("Cycle: ", cycleCount);
    for (var row = 0; row < virusRows; row++) {
        for (var column = 0; column < virusColumns; column++) {
            var currentVirus = document.getElementById("".concat(column, "-").concat(row));
            if (virusMatrix[column][row] == 1) {
                if (currentVirus.style.visibility != "visible") {
                    currentVirus.style.visibility = "visible";
                }
            }
            else if (virusMatrix[column][row] == 0) {
                currentVirus.style.visibility = "hidden";
            }
            else
                console.log("should never happen: ", virusMatrix[column][row]);
        }
    }
    generate();
    if (logCyclus)
        console.log("==========");
}
var all = 0;
var current = 0;
function placeVirusRandomly() {
    for (var row = 0; row < virusRows; row++) {
        for (var column = 0; column < virusColumns; column++) {
            var randomNumber = 0;
            if (pointInSea(column, row)) {
                randomNumber = 0;
            }
            else if (Math.random() <= spawnProbability) {
                randomNumber = 1;
                current++;
            }
            virusMatrix[column][row] = randomNumber;
            virusMatrixNextStep[column][row] = 0;
            all++;
        }
    }
}
function generate() {
    current = 0;
    all = 0;
    // Loop through every spot in our 2D array and check spots neighbors
    for (var column = 0; column < virusColumns; column++) {
        for (var row = 0; row < virusRows; row++) {
            if (pointInSea(column, row)) {
                virusMatrixNextStep[column][row] = 0; // Water
                continue;
            }
            // algorith for hexagon
            // Add up all the states in a 2,3,2 surrounding hexagon
            var neighbors = 0;
            if ((row % 2 == 0) && (column > 0) && (row > 0))
                neighbors += virusMatrix[column - 1][row - 1];
            else if ((column < virusColumns - 1) && (row > 0))
                neighbors += virusMatrix[column + 1][row - 1];
            if (row > 0)
                neighbors += virusMatrix[column][row - 1];
            if (column > 0)
                neighbors += virusMatrix[column - 1][row];
            if (column < virusColumns - 1)
                neighbors += virusMatrix[column + 1][row];
            if (row < virusRows - 1)
                neighbors += virusMatrix[column][row + 1];
            if ((row % 2 == 0) && (column > 0) && (row < virusRows - 1))
                neighbors += virusMatrix[column - 1][row + 1];
            else if ((column < virusColumns - 1) && (row < virusRows - 1))
                neighbors += virusMatrix[column + 1][row + 1];
            // check if bound tiles are skips
            // if (row % 2 == 0) neighbors += virusMatrix[column - 1][row - 1];
            // else              neighbors += virusMatrix[column + 1][row - 1];
            //                   neighbors += virusMatrix[column][row - 1];
            //                   neighbors += virusMatrix[column - 1][row];
            //                   neighbors += virusMatrix[column + 1][row];
            //                   neighbors += virusMatrix[column][row + 1];
            // if (row % 2 == 0) neighbors += virusMatrix[column - 1][row + 1];
            // else              neighbors += virusMatrix[column + 1][row + 1];
            // Rules of Life
            if (neighbors < minPopulation)
                virusMatrixNextStep[column][row] = 0; // Loneliness
            else if (neighbors > overPopulation)
                virusMatrixNextStep[column][row] = 0; // Overpopulation
            else if (neighbors >= minPopulation)
                virusMatrixNextStep[column][row] = 1; // Reproduction      
            else
                console.log("SHOULD NEVER HAPPEN!");
            if (virusMatrixNextStep[column][row] == 1)
                current++;
            all++;
        }
    }
    if (logCyclus)
        console.log("alive: ", current);
    if (logCyclus)
        console.log("dead: ", all - current);
    virusMatrix = virusMatrixNextStep.map(function (arr) {
        return arr.slice();
    });
}
//# sourceMappingURL=script.js.map