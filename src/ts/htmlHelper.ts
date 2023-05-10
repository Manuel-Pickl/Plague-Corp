// html elements
var worldSvgElement: SVGElement;
var virusMapElement: HTMLElement;



// left side
var framerateValueElement: HTMLElement;
var increaseFramerateElement: HTMLElement;
var decreaseFramerateElement: HTMLElement;

var backwardSimulationElement: HTMLElement;
var pauseSimulationElement: HTMLElement;
var forwardSimulationElement: HTMLElement;

var flightEnabledElement: HTMLElement;

var brushSymbol: HTMLElement;
var brushFillElement: HTMLElement;
var brushSizeElement: HTMLElement;
var increaseBrushSizeElement: HTMLElement;
var decreaseBrushSizeElement: HTMLElement;

var minPopulationElement: HTMLElement;
var increaseMinPopulationElement: HTMLElement;
var decreaseMinPopulationElement: HTMLElement;

var overPopulationElement: HTMLElement;
var increaseOverPopulationElement: HTMLElement;
var decreaseOverPopulationElement: HTMLElement;



// right side
var cycleCounterElement: HTMLElement;
var infectedCountElement: HTMLElement;
var healthyCountElement: HTMLElement;



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
    increaseBrushSizeElement = document.querySelector(".brush #increaseBrushSize")
    
    minPopulationElement = document.querySelector(".minPopulation #minPopulation");
    decreaseMinPopulationElement = document.querySelector(".minPopulation #decreaseMinPopulation");
    increaseMinPopulationElement = document.querySelector(".minPopulation #increaseMinPopulation");
    
    overPopulationElement = document.querySelector(".overPopulation #overPopulation");
    decreaseOverPopulationElement = document.querySelector(".overPopulation #decreaseOverPopulation");
    increaseOverPopulationElement = document.querySelector(".overPopulation #increaseOverPopulation");
}

function assignHtmlEvents() {
    assignEnableFlightEvents();
    assignPauseSimulationEvents();    
    assignFramerateEvents();
    assignBrushEvents();
    assignMinPopulationEvents();
    assignoverPopulationEvents();
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
    }
}

var firstBackwardAfterPause: boolean;
function assignPauseSimulationEvents() {
    pauseSimulationElement.onclick = () => {
        firstBackwardAfterPause = true;
        simulationPaused = !simulationPaused;
        pauseSimulationElement.innerHTML = simulationPaused
            ? '<i class="fa-solid fa-play"></i>'
            : '<i class="fa-solid fa-pause"></i>';
    }

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
    }

    forwardSimulationElement.onclick = () => {
        simulate();
        updateHud();
    }
}

function assignFramerateEvents() {
    decreaseFramerateElement.onclick = () => {
        if (maxFramerate > 1) maxFramerate--;
        framerateValueElement.innerText = maxFramerate.toString();

        clearInterval(simulationInterval);
        simulationInterval = setInterval(draw, 1000 / maxFramerate);
    };

    increaseFramerateElement.onclick = () => {
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
        if (brushSize > brushSizeMin) brushSize--;
        brushSizeElement.innerText = brushSize.toString();
    };

    increaseBrushSizeElement.onclick = () => {
        if (brushSize < brushSizeMax) brushSize++;
        brushSizeElement.innerText = brushSize.toString();
    };
}

function assignMinPopulationEvents() {
    decreaseMinPopulationElement.onclick = () => {
        if (minPopulation > minPopulationMin) minPopulation--;
        minPopulationElement.innerText = minPopulation.toString();
    };

    increaseMinPopulationElement.onclick = () => {
        if (minPopulation < minPopulationMax) minPopulation++;
        minPopulationElement.innerText = minPopulation.toString();
    };
}

function assignoverPopulationEvents() {
    decreaseOverPopulationElement.onclick = () => {
        if (overPopulation > overPopulationMin) overPopulation--;
        overPopulationElement.innerText = overPopulation.toString();
    };

    increaseOverPopulationElement.onclick = () => {
        if (overPopulation < overPopulationMax) overPopulation++;
        overPopulationElement.innerText = overPopulation.toString();
    };
}

function initializeHtmlElements() {
    pauseSimulationElement.innerHTML = simulationPaused
        ? '<i class="fa-solid fa-play"></i>'
        : '<i class="fa-solid fa-pause"></i>';
    framerateValueElement.innerText = maxFramerate.toString();
    flightEnabledElement.querySelector("i").style.color = flightEnabled ? "green" : "red";
    brushSizeElement.innerText = brushSize.toString();
    minPopulationElement.innerText = minPopulation.toString();
    overPopulationElement.innerText = overPopulation.toString();
}