import * as constants from './constants.js';
import { svgObject } from './svgHelper.js';
import { cycleCount } from './script.js';

//hud elements
var brushFill: boolean = true;
export var brushSize: number = 1;
export var minPopulation: number = 1;
export var overPopulation: number = 7;
export var flightEnabled: boolean = true;

// html elements
var worldSvgElement: SVGElement;
export var virusMapElement: HTMLElement;

export var cycleCounterElement: HTMLElement;

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

export var infectedCountElement: HTMLElement;
export var healthyCountElement: HTMLElement;

export function assignHtmlVariables() {
  worldSvgElement = svgObject.contentDocument.querySelector('svg');
  virusMapElement = document.querySelector('#virusMap');

  cycleCounterElement = document.querySelector('.cycleCounter span');
  infectedCountElement = document.querySelector('.infectedCount span');
  healthyCountElement = document.querySelector('.healthyCount span');

  brushSymbol = document.querySelector('.brush .brushSymbol');
  brushFillElement = document.querySelector('.brush .hexagonFill');
  brushSizeElement = document.querySelector('.brush #brushSize');

  increaseBrushSizeElement = document.querySelector('.brush #increaseBrushSize');
  decreaseBrushSizeElement = document.querySelector('.brush #decreaseBrushSize');

  minPopulationElement = document.querySelector('.minPopulation #minPopulation');
  increaseMinPopulationElement = document.querySelector('.minPopulation #increaseMinPopulation');
  decreaseMinPopulationElement = document.querySelector('.minPopulation #decreaseMinPopulation');

  overPopulationElement = document.querySelector('.overPopulation #overPopulation');
  increaseOverPopulationElement = document.querySelector('.overPopulation #increaseOverPopulation');
  decreaseOverPopulationElement = document.querySelector('.overPopulation #decreaseOverPopulation');
}

export function assignHtmlEvents() {
  assignBrushEvents();
  assignMinPopulationEvents();
  assignoverPopulationEvents();
}

export function assignBrushEvents() {
  brushSymbol.onclick = () => {
    brushFill = !brushFill;
    brushFillElement.style.visibility = brushFill ? 'hidden' : 'visible';
  };

  decreaseBrushSizeElement.onclick = () => {
    if (brushSize > constants.brushSizeMin) brushSize--;
    brushSizeElement.innerText = brushSize.toString();
  };

  increaseBrushSizeElement.onclick = () => {
    if (brushSize < constants.brushSizeMax) brushSize++;
    brushSizeElement.innerText = brushSize.toString();
  };
}

function assignMinPopulationEvents() {
  decreaseMinPopulationElement.onclick = () => {
    if (minPopulation > constants.minPopulationMin) minPopulation--;
    minPopulationElement.innerText = minPopulation.toString();
  };

  increaseMinPopulationElement.onclick = () => {
    if (minPopulation < constants.minPopulationMax) minPopulation++;
    minPopulationElement.innerText = minPopulation.toString();
  };
}

function assignoverPopulationEvents() {
  decreaseOverPopulationElement.onclick = () => {
    if (overPopulation > constants.overPopulationMin) overPopulation--;
    overPopulationElement.innerText = overPopulation.toString();
  };

  increaseOverPopulationElement.onclick = () => {
    if (overPopulation < constants.overPopulationMax) overPopulation++;
    overPopulationElement.innerText = overPopulation.toString();
  };
}

export function initializeHtmlElements() {
  brushSizeElement.innerText = brushSize.toString();
  minPopulationElement.innerText = minPopulation.toString();
  overPopulationElement.innerText = overPopulation.toString();
}
