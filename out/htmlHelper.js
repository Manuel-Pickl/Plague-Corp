// html elements
var worldSvgElement;
var virusMapElement;
// left side
var framerateValueElement;
var increaseFramerateElement;
var decreaseFramerateElement;
var backwardSimulationElement;
var pauseSimulationElement;
var forwardSimulationElement;
var flightEnabledElement;
var brushSymbol;
var brushFillElement;
var brushSizeElement;
var increaseBrushSizeElement;
var decreaseBrushSizeElement;
var neighborNumberElements;
// right side
var cycleCounterElement;
var infectedCountElement;
var healthyCountElement;
function assignHtmlVariables() {
    worldSvgElement = svgObject.contentDocument.querySelector("svg");
    virusMapElement = document.querySelector("#virusMap");
    cycleCounterElement = document.querySelector(".cycleCounter span");
    infectedCountElement = document.querySelector(".infectedCount span");
    healthyCountElement = document.querySelector(".healthyCount span");
    backwardSimulationElement = document.querySelector(".backwardSimulation");
    pauseSimulationElement = document.querySelector(".pauseSimulation");
    forwardSimulationElement = document.querySelector(".forwardSimulation");
    framerateValueElement = document.querySelector(".framerate #framerateValue");
    decreaseFramerateElement = document.querySelector(".framerate #decreaseFramerate");
    increaseFramerateElement = document.querySelector(".framerate #increaseFramerate");
    flightEnabledElement = document.querySelector(".enableFlights");
    brushSymbol = document.querySelector(".brush .brushSymbol");
    brushFillElement = document.querySelector(".brush .hexagonFill");
    brushSizeElement = document.querySelector(".brush #brushSize");
    decreaseBrushSizeElement = document.querySelector(".brush #decreaseBrushSize");
    increaseBrushSizeElement = document.querySelector(".brush #increaseBrushSize");
    neighborNumberElements = document.querySelectorAll(".neighborsContainer span");
}
function assignHtmlEvents() {
    assignEnableFlightEvents();
    assignPauseSimulationEvents();
    assignFramerateEvents();
    assignBrushEvents();
    assignNeighborEvents();
}
function assignEnableFlightEvents() {
    flightEnabledElement.onclick = () => {
        flightEnabled = !flightEnabled;
        flightEnabledElement.querySelector("i").style.color = flightEnabled ? "green" : "red";
        if (flightEnabled) {
            return;
        }
        airplanes.forEach(airplane => airplane.remove());
        flightIntervals.forEach(flightInterval => clearInterval(flightInterval));
    };
}
var firstBackwardAfterPause;
function assignPauseSimulationEvents() {
    pauseSimulationElement.onclick = () => {
        firstBackwardAfterPause = true;
        simulationPaused = !simulationPaused;
        pauseSimulationElement.innerHTML = simulationPaused
            ? '<i class="fa-solid fa-play"></i>'
            : '<i class="fa-solid fa-pause"></i>';
    };
    backwardSimulationElement.onclick = () => {
        if (cycleCount <= 1) {
            return;
        }
        if (virusMatrixSteps.length <= 1) {
            alert("backwards limit reached!");
            return;
        }
        cycleCount -= 2;
        if (firstBackwardAfterPause) {
            firstBackwardAfterPause = false;
            virusMatrixSteps.pop();
        }
        virusMatrixSteps.pop();
        var matrixStepBefore = virusMatrixSteps.pop();
        // error handling?!
        virusMatrix = matrixStepBefore.map(function (arr) {
            return arr.slice();
        });
        simulate();
        updateHud();
    };
    forwardSimulationElement.onclick = () => {
        simulate();
        updateHud();
    };
}
function assignFramerateEvents() {
    decreaseFramerateElement.onclick = () => {
        if (maxFramerate <= 1) {
            return;
        }
        maxFramerate--;
        framerateValueElement.innerText = maxFramerate.toString();
        clearInterval(simulationInterval);
        simulationInterval = setInterval(draw, 1000 / maxFramerate);
    };
    increaseFramerateElement.onclick = () => {
        if (maxFramerate >= 60) {
            return;
        }
        maxFramerate++;
        framerateValueElement.innerText = maxFramerate.toString();
        clearInterval(simulationInterval);
        simulationInterval = setInterval(draw, 1000 / maxFramerate);
    };
}
function assignBrushEvents() {
    brushSymbol.onclick = () => {
        brushFill = !brushFill;
        brushFillElement.style.visibility = brushFill ? "hidden" : "visible";
    };
    decreaseBrushSizeElement.onclick = () => {
        if (brushSize > brushSizeMin)
            brushSize--;
        brushSizeElement.innerText = brushSize.toString();
    };
    increaseBrushSizeElement.onclick = () => {
        if (brushSize < brushSizeMax)
            brushSize++;
        brushSizeElement.innerText = brushSize.toString();
    };
}
function assignNeighborEvents() {
    neighborNumberElements.forEach(neighborNumber => {
        neighborNumber.onclick = () => {
            gameOfLifeRules[neighborNumber.textContent] = !Number(gameOfLifeRules[neighborNumber.textContent]);
            let color = Number(gameOfLifeRules[neighborNumber.textContent])
                ? "green" : "red";
            neighborNumber.style.color = color;
        };
    });
}
function initializeHtmlElements() {
    pauseSimulationElement.innerHTML = simulationPaused
        ? '<i class="fa-solid fa-play"></i>'
        : '<i class="fa-solid fa-pause"></i>';
    framerateValueElement.innerText = maxFramerate.toString();
    flightEnabledElement.querySelector("i").style.color = flightEnabled ? "green" : "red";
    brushSizeElement.innerText = brushSize.toString();
    neighborNumberElements.forEach(neighborNumber => {
        let color = Number(gameOfLifeRules[neighborNumber.textContent])
            ? "green" : "red";
        neighborNumber.style.color = color;
    });
}
//# sourceMappingURL=htmlHelper.js.map