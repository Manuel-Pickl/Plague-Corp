var worldSvg;
var virusMap;
var virusColumns;
var virusRows;
var virusMatrix;
var virusMatrixNextStep;
var seaMatrix;
function onSvgLoad() {
    assignHtmlVariables();
    initializeSimulation();
    startSimluation();
}
function assignHtmlVariables() {
    worldSvg = svgObject.contentDocument.querySelector("svg");
    virusMap = document.getElementById("virusMap");
}
function pointInSea(column, row) {
    return !seaMatrix[column][row];
}
function initializeSimulation() {
    determineSvgSize();
    createMatrices();
    // placeVirusRandomly();
    if (debugMode)
        console.log("simulation initialized");
}
function startSimluation() {
    var interval = setInterval(draw, 1000 / framerate);
    document.querySelector(".splash-screen").style.visibility = "hidden";
    enableVirusPlacement();
    if (debugMode)
        console.log("simulation started");
}
function createMatrices() {
    createSeaMatrix();
    createVirusMatrix();
    if (debugMode)
        console.log("game matrices created");
}
function createVirusMatrix() {
    virusMatrix = new Array(virusColumns);
    for (var column = 0; column < virusColumns; column++) {
        virusMatrix[column] = new Array(virusRows);
        for (var row = 0; row < virusRows; row++) {
            virusMatrix[column][row] = 0;
        }
    }
    virusMatrixNextStep = new Array(virusColumns);
    for (var column = 0; column < virusColumns; column++) {
        virusMatrixNextStep[column] = new Array(virusRows);
        for (var row = 0; row < virusRows; row++) {
            virusMatrixNextStep[column][row] = 0;
        }
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
            virus.style.opacity = "0";
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
                currentVirus.style.opacity = "0.5";
            }
            else if (virusMatrix[column][row] == 0) {
                currentVirus.style.opacity = "0";
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
            all++;
        }
    }
    console.log("start point set for virus");
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
            gameOfLife(column, row);
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
var mouseIsDown = false;
function enableVirusPlacement() {
    document.onmousedown = function (e) {
        mouseIsDown = true;
        placeVirus(e);
    };
    document.onmouseup = function () { return mouseIsDown = false; };
    document.querySelectorAll(".virus").forEach(function (virus) { return virus.onmouseover = placeVirus; });
}
function placeVirus(e) {
    if (!mouseIsDown)
        return;
    var virus = e.target;
    if (!virus.classList.contains("virus"))
        return;
    var column = parseInt(virus.id.split("-")[0]);
    var row = parseInt(virus.id.split("-")[1]);
    if (pointInSea(column, row))
        return;
    virusMatrix[column][row] = 1;
    // we can already make the tile visible, but it's functionality/spreading only starts on next frame
    // virus.style.opacity = "0.5";
}
//# sourceMappingURL=script.js.map