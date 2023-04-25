// html elements
var worldSvgElement;
var virusMapElement;
var cycleCounterElement;
var flightEnabledElement;
var brushSymbol;
var brushFillElement;
var brushSizeElement;
var increaseBrushSizeElement;
var decreaseBrushSizeElement;
var minPopulationElement;
var increaseMinPopulationElement;
var decreaseMinPopulationElement;
var overPopulationElement;
var increaseOverPopulationElement;
var decreaseOverPopulationElement;
var infectedCountElement;
var healthyCountElement;
function assignHtmlVariables() {
    worldSvgElement = svgObject.contentDocument.querySelector("svg");
    virusMapElement = document.querySelector("#virusMap");
    cycleCounterElement = document.querySelector(".cycleCounter span");
    infectedCountElement = document.querySelector(".infectedCount span");
    healthyCountElement = document.querySelector(".healthyCount span");
    flightEnabledElement = document.querySelector(".enableFlights");
    brushSymbol = document.querySelector(".brush .brushSymbol");
    brushFillElement = document.querySelector(".brush .hexagonFill");
    brushSizeElement = document.querySelector(".brush #brushSize");
    increaseBrushSizeElement = document.querySelector(".brush #increaseBrushSize");
    decreaseBrushSizeElement = document.querySelector(".brush #decreaseBrushSize");
    minPopulationElement = document.querySelector(".minPopulation #minPopulation");
    increaseMinPopulationElement = document.querySelector(".minPopulation #increaseMinPopulation");
    decreaseMinPopulationElement = document.querySelector(".minPopulation #decreaseMinPopulation");
    overPopulationElement = document.querySelector(".overPopulation #overPopulation");
    increaseOverPopulationElement = document.querySelector(".overPopulation #increaseOverPopulation");
    decreaseOverPopulationElement = document.querySelector(".overPopulation #decreaseOverPopulation");
}
function assignHtmlEvents() {
    flightEnabledElement.onclick = () => {
        flightEnabled = !flightEnabled;
        flightEnabledElement.querySelector("i").style.color = flightEnabled ? "green" : "red";
        if (flightEnabled) {
            return;
        }
        airplanes.forEach(airplane => airplane.remove());
        flightIntervals.forEach(flightInterval => clearInterval(flightInterval));
    };
    assignBrushEvents();
    assignMinPopulationEvents();
    assignoverPopulationEvents();
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
function assignMinPopulationEvents() {
    decreaseMinPopulationElement.onclick = () => {
        if (minPopulation > minPopulationMin)
            minPopulation--;
        minPopulationElement.innerText = minPopulation.toString();
    };
    increaseMinPopulationElement.onclick = () => {
        if (minPopulation < minPopulationMax)
            minPopulation++;
        minPopulationElement.innerText = minPopulation.toString();
    };
}
function assignoverPopulationEvents() {
    decreaseOverPopulationElement.onclick = () => {
        if (overPopulation > overPopulationMin)
            overPopulation--;
        overPopulationElement.innerText = overPopulation.toString();
    };
    increaseOverPopulationElement.onclick = () => {
        if (overPopulation < overPopulationMax)
            overPopulation++;
        overPopulationElement.innerText = overPopulation.toString();
    };
}
function initializeHtmlElements() {
    flightEnabledElement.querySelector("i").style.color = flightEnabled ? "green" : "red";
    brushSizeElement.innerText = brushSize.toString();
    minPopulationElement.innerText = minPopulation.toString();
    overPopulationElement.innerText = overPopulation.toString();
}
//# sourceMappingURL=htmlHelper.js.map