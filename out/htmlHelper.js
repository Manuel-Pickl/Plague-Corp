// html elements
var worldSvgElement;
var virusMapElement;
var cycleCounterElement;
var brushSymbol;
var brushFillElement;
var brushSizeElement;
var decreaseBrushSizeElement;
var increaseBrushSizeElement;
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
    decreaseBrushSizeElement = document.querySelector(".brush #decreaseBrushSize");
    increaseBrushSizeElement = document.querySelector(".brush #increaseBrushSize");
}
function assignHtmlEvents() {
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
//# sourceMappingURL=htmlHelper.js.map