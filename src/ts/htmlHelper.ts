import anime from '../../animejs/lib/anime.es.js';
import * as constants from './constants.js';
import {
  svgObject,
  deletePlanes,
  pausePlanesAnimation,
  restartPlanesAnimation,
} from './svgHelper.js';
import {
  cycleCount,
  virusMatrixSteps,
  decCycleCount,
  simulate,
  updateHud,
  simulationInterval,
  setSimulationIntervall,
  gameOfLifeRules,
  setNextStepInMatrix,
} from './script.js';

export var simulationPaused: boolean = false;

//hud elements
var brushFill: boolean = true;
export var brushSize: number = 1;
export var minPopulation: number = 1;
export var overPopulation: number = 7;
export var flightEnabled: boolean = true;
export var maxFramerate: number = 15;

// html elements
var worldSvgElement: SVGElement;
export var virusMapElement: HTMLElement;

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

var neighborNumberElements: NodeListOf<HTMLInputElement>;

// right side
export var cycleCounterElement: HTMLElement;
export var infectedCountElement: HTMLElement;
export var healthyCountElement: HTMLElement;

export function assignHtmlVariables() {
  worldSvgElement = svgObject.contentDocument.querySelector('svg');
  virusMapElement = document.querySelector('#virusMap');

  cycleCounterElement = document.querySelector('.cycleCounter span');
  infectedCountElement = document.querySelector('.infectedCount span');
  healthyCountElement = document.querySelector('.healthyCount span');

  backwardSimulationElement = document.querySelector('.backwardSimulation');
  pauseSimulationElement = document.querySelector('.pauseSimulation');
  forwardSimulationElement = document.querySelector('.forwardSimulation');

  framerateValueElement = document.querySelector('.framerate #framerateValue');
  decreaseFramerateElement = document.querySelector('.framerate #decreaseFramerate');
  increaseFramerateElement = document.querySelector('.framerate #increaseFramerate');

  flightEnabledElement = document.querySelector('.enableFlights');

  brushSymbol = document.querySelector('.brush .brushSymbol');
  brushFillElement = document.querySelector('.brush .hexagonFill');
  brushSizeElement = document.querySelector('.brush #brushSize');

  decreaseBrushSizeElement = document.querySelector('.brush #decreaseBrushSize');
  increaseBrushSizeElement = document.querySelector('.brush #increaseBrushSize');

  neighborNumberElements = document.querySelectorAll('.neighborsContainer span');
}

export function assignHtmlEvents() {
  assignEnableFlightEvents();
  assignPauseSimulationEvents();
  assignFramerateEvents();
  assignBrushEvents();
  assignNeighborEvents();
}

function assignEnableFlightEvents() {
  flightEnabledElement.onclick = () => {
    flightEnabled = !flightEnabled;
    flightEnabledElement.querySelector('i').style.color = flightEnabled ? 'green' : 'red';

    if (flightEnabled) {
      return;
    }

    deletePlanes();
    anime.remove('.airplane');
  };
}

var firstBackwardAfterPause: boolean;
function assignPauseSimulationEvents() {
  pauseSimulationElement.onclick = () => {
    firstBackwardAfterPause = true;
    simulationPaused = !simulationPaused;
    pauseSimulationElement.innerHTML = simulationPaused
      ? '<i class="fa-solid fa-play"></i>'
      : '<i class="fa-solid fa-pause"></i>';
    pausePlanesAnimation();
  };

  backwardSimulationElement.onclick = () => {
    if (cycleCount <= 1) {
      return;
    }

    if (virusMatrixSteps.length <= 1) {
      alert('backwards limit reached!');
      return;
    }

    //changed to function because variable is import: cycleCount -= 2;
    decCycleCount();
    decCycleCount();

    if (firstBackwardAfterPause) {
      firstBackwardAfterPause = false;
      virusMatrixSteps.pop();
    }
    virusMatrixSteps.pop();
    var matrixStepBefore = virusMatrixSteps.pop();
    // error handling?!

    setNextStepInMatrix();

    simulate();
    updateHud();
  };

  forwardSimulationElement.onclick = () => {
    simulate();
    updateHud();
    restartPlanesAnimation();
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
    setSimulationIntervall();
  };

  increaseFramerateElement.onclick = () => {
    if (maxFramerate >= 60) {
      return;
    }

    maxFramerate++;
    framerateValueElement.innerText = maxFramerate.toString();

    clearInterval(simulationInterval);
    setSimulationIntervall();
  };
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

function assignNeighborEvents() {
  neighborNumberElements.forEach(neighborNumber => {
    neighborNumber.onclick = () => {
      gameOfLifeRules[neighborNumber.textContent] = !Number(
        gameOfLifeRules[neighborNumber.textContent]
      );
      let color = Number(gameOfLifeRules[neighborNumber.textContent]) ? 'green' : 'red';
      neighborNumber.style.color = color;
    };
  });
}

export function initializeHtmlElements() {
  pauseSimulationElement.innerHTML = simulationPaused
    ? '<i class="fa-solid fa-play"></i>'
    : '<i class="fa-solid fa-pause"></i>';

  framerateValueElement.innerText = maxFramerate.toString();

  flightEnabledElement.querySelector('i').style.color = flightEnabled ? 'green' : 'red';

  brushSizeElement.innerText = brushSize.toString();

  neighborNumberElements.forEach(neighborNumber => {
    let color = Number(gameOfLifeRules[neighborNumber.textContent]) ? 'green' : 'red';
    neighborNumber.style.color = color;
  });
}
