// html elements
var worldSvgElement;
var virusMapElement;
var cycleCounterElement;
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
    assignBrushEvents();
    assignMinPopulationEvents();
    assignoverPopulationEvents();
}
function assignBrushEvents() {
    brushSymbol.onclick = function () {
        brushFill = !brushFill;
        brushFillElement.style.visibility = brushFill ? "hidden" : "visible";
    };
    decreaseBrushSizeElement.onclick = function () {
        if (brushSize > brushSizeMin)
            brushSize--;
        brushSizeElement.innerText = brushSize.toString();
    };
    increaseBrushSizeElement.onclick = function () {
        if (brushSize < brushSizeMax)
            brushSize++;
        brushSizeElement.innerText = brushSize.toString();
    };
}
function assignMinPopulationEvents() {
    decreaseMinPopulationElement.onclick = function () {
        if (minPopulation > minPopulationMin)
            minPopulation--;
        minPopulationElement.innerText = minPopulation.toString();
    };
    increaseMinPopulationElement.onclick = function () {
        if (minPopulation < minPopulationMax)
            minPopulation++;
        minPopulationElement.innerText = minPopulation.toString();
    };
}
function assignoverPopulationEvents() {
    decreaseOverPopulationElement.onclick = function () {
        if (overPopulation > overPopulationMin)
            overPopulation--;
        overPopulationElement.innerText = overPopulation.toString();
    };
    increaseOverPopulationElement.onclick = function () {
        if (overPopulation < overPopulationMax)
            overPopulation++;
        overPopulationElement.innerText = overPopulation.toString();
    };
}
function initializeHtmlElements() {
    brushSizeElement.innerText = brushSize.toString();
    minPopulationElement.innerText = minPopulation.toString();
    overPopulationElement.innerText = overPopulation.toString();
}
//# sourceMappingURL=htmlHelper.js.map