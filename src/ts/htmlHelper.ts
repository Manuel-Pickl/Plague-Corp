// html elements
var worldSvgElement: SVGElement;
var virusMapElement: HTMLElement;

var cycleCounterElement: HTMLElement;
var brushSymbol: HTMLElement;
var brushFillElement: HTMLElement;
var brushSizeElement: HTMLElement;
var decreaseBrushSizeElement: HTMLElement;
var increaseBrushSizeElement: HTMLElement;

var infectedCountElement: HTMLElement;
var healthyCountElement: HTMLElement;

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
