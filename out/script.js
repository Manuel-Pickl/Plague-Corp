// html elements
var worldSvgElement;
var virusMapElement;
var cycleCounterElement;
var infectedCountElement;
var healthyCountElement;
// intervals 
var simulationInterval;
var hudInterval;
// matrices
var virusMatrix;
var virusMatrixNextStep;
var seaMatrix;
var virusColumns;
var virusRows;
var mouseIsDown = false;
// hud
var cycleCount = 0;
var possibleVirusCount = 0;
var infectedCount = 0;
function onSvgLoad() {
    assignHtmlVariables();
    initializeSimulation();
    startSimluation();
}
function assignHtmlVariables() {
    worldSvgElement = svgObject.contentDocument.querySelector("svg");
    virusMapElement = document.querySelector("#virusMap");
    cycleCounterElement = document.querySelector(".cycleCounter span");
    infectedCountElement = document.querySelector(".infectedCount span");
    healthyCountElement = document.querySelector(".healthyCount span");
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
    simulationInterval = setInterval(draw, 1000 / maxFramerate);
    hudInterval = setInterval(updateHud, 1000 / maxHudFramerate);
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
            virusMapElement.appendChild(virus);
        }
    }
}
function draw() {
    cycleCount++;
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
function placeVirusRandomly() {
    for (var row = 0; row < virusRows; row++) {
        for (var column = 0; column < virusColumns; column++) {
            var randomNumber = 0;
            if (pointInSea(column, row)) {
                randomNumber = 0;
            }
            else if (Math.random() <= spawnProbability) {
                randomNumber = 1;
                infectedCount++;
            }
            virusMatrix[column][row] = randomNumber;
            possibleVirusCount++;
        }
    }
    console.log("start point set for virus");
}
function generate() {
    infectedCount = 0;
    possibleVirusCount = 0;
    // Loop through every spot in our 2D array and check spots neighbors
    for (var column = 0; column < virusColumns; column++) {
        for (var row = 0; row < virusRows; row++) {
            if (pointInSea(column, row)) {
                virusMatrixNextStep[column][row] = 0; // Water
                continue;
            }
            gameOfLife(column, row);
            if (virusMatrixNextStep[column][row] == 1)
                infectedCount++;
            possibleVirusCount++;
        }
    }
    virusMatrix = virusMatrixNextStep.map(function (arr) {
        return arr.slice();
    });
}
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
function updateHud() {
    cycleCounterElement.innerText = cycleCount.toString();
    infectedCountElement.innerText = infectedCount.toString();
    healthyCountElement.innerText = (possibleVirusCount - infectedCount).toString();
}
//# sourceMappingURL=script.js.map