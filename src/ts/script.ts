import {
  assignHtmlVariables,
  assignHtmlEvents,
  initializeHtmlElements,
  brushSize,
  virusMapElement,
  cycleCounterElement,
  infectedCountElement,
  healthyCountElement,
} from './htmlHelper.js';

import { determineSvgSize, createSeaMatrix, virusColumns, virusRows } from './svgHelper.js';
import { gameOfLife, getNeighbors } from './gameOfLife.js';
import * as constants from './constants.js';

// intervals
var simulationInterval: any;
var hudInterval: any;

// matrices
export var virusMatrix: number[][];
export var virusMatrixNextStep: number[][];
var seaMatrix: number[][];

var mouseIsDown: boolean = false;

var airplanes: HTMLElement[] = [];
var flightIntervals: number[] = [];

var simulationPaused: boolean = false;

// hud
var cycleCount: number = 0;
var brushFill: boolean = true;
var brushSize: number = 1;
var minPopulation: number = 1;
var overPopulation: number = 7;
var flightEnabled: boolean = false;
var planeSpawnInterval: number = 1;
var gameOfLifeRules = {
  // neighbors: state
  // 1 neighbors : dead/0
  // 2 neighbors : alive/1
  0: 0,
  1: 0,
  2: 1,
  3: 1,
  4: 1,
  5: 0,
  6: 0,
};

var possibleVirusCount: number = 0;
var infectedCount: number = 0;
export var cycleCount: number = 0;

export async function onSvgLoad() {
  assignHtmlVariables();
  assignHtmlEvents();
  initializeHtmlElements();

  await initializeSimulation();
  startSimluation();
}

function pointInSea(column: number, row: number) {
  return !seaMatrix[column][row];
}

async function initializeSimulation() {
  determineSvgSize();
  await createMatrices();
  // placeVirusRandomly();

  if (constants.debugMode) console.log('simulation initialized');
}

function startSimluation() {
  simulationInterval = setInterval(draw, 1000 / constants.maxFramerate);
  hudInterval = setInterval(updateHud, 1000 / constants.maxHudFramerate);

  (<HTMLElement>document.querySelector('.splash-screen')).style.visibility = 'hidden';

  enableVirusPlacement();

  if (constants.debugMode) console.log('simulation started');
}

async function createMatrices() {
  const start = performance.now();
  createVirusMatrix();
  seaMatrix = await createSeaMatrix();

  console.log(performance.now() - start + ' ' + 'ms');

  if (constants.debugMode) console.log('game matrices created');
}

function createVirusMatrix() {
  virusMatrix = new Array(virusColumns);
  for (let column = 0; column < virusColumns; column++) {
    virusMatrix[column] = new Array(virusRows);
    for (let row = 0; row < virusRows; row++) {
      virusMatrix[column][row] = 0;
    }
  }

  virusMatrixNextStep = new Array(virusColumns);
  for (let column = 0; column < virusColumns; column++) {
    virusMatrixNextStep[column] = new Array(virusRows);
    for (let row = 0; row < virusRows; row++) {
      virusMatrixNextStep[column][row] = 0;
    }
  }

  // create all virus div elements
  for (let row = 0; row < virusRows; row++) {
    for (let column = 0; column < virusColumns; column++) {
      // ToDo: try to skip virus tiles that are in the sea
      var virus = document.createElement('div');
      virus.id = `${column}-${row}`;
      virus.classList.add('virus');
      virus.classList.add(Math.random() < 0.5 ? 'alpha' : 'beta');
      let positionX = column * constants.virusWidth;
      if (row % 2 == 1) positionX += constants.virusWidth / 2;
      let positionY = row * constants.virusHeight * 0.75;
      virus.style.left = `${positionX}px`;
      virus.style.top = `${positionY}px`;
      virus.style.width = `${constants.virusWidth}px`;
      virus.style.height = `${constants.virusHeight}px`;
      virus.style.opacity = '0';
      // virus.style.visibility = "hidden";

      virusMapElement.appendChild(virus);
    }
  }
}

function draw() {
  if (simulationPaused) {
    return;
  }

  simulate();
}

function simulate() {
  cycleCount++;

  for (let row = 0; row < virusRows; row++) {
    for (let column = 0; column < virusColumns; column++) {
      let currentVirus = document.getElementById(`${column}-${row}`);

      if (virusMatrix[column][row] == 1) {
        currentVirus.style.opacity = '0.5';
      } else if (virusMatrix[column][row] == 0) {
        currentVirus.style.opacity = '0';
      } else console.log('should never happen: ', virusMatrix[column][row]);
    }
  }

  generate();

  if (constants.logCyclus) console.log('==========');
}

function placeVirusRandomly() {
  for (let row = 0; row < virusRows; row++) {
    for (let column = 0; column < virusColumns; column++) {
      let randomNumber = 0;

      if (pointInSea(column, row)) {
        randomNumber = 0;
      } else if (Math.random() <= constants.spawnProbability) {
        randomNumber = 1;
        infectedCount++;
      }

      virusMatrix[column][row] = randomNumber;

      possibleVirusCount++;
    }
  }

  console.log('start point set for virus');
}

// var virusMatrixSteps = {};
var virusMatrixSteps = [];
function generate() {
  infectedCount = 0;
  possibleVirusCount = 0;

  // Loop through every spot in our 2D array and check spots neighbors
  for (let column = 0; column < virusColumns; column++) {
    for (let row = 0; row < virusRows; row++) {
      if (pointInSea(column, row)) {
        virusMatrixNextStep[column][row] = 0; // Water
        continue;
      }

      gameOfLife(column, row);

      if (virusMatrixNextStep[column][row] == 1) infectedCount++;
      possibleVirusCount++;
    }
  }

  virusMatrix = virusMatrixNextStep.map(function (arr) {
    return arr.slice();
  });

  // we're only holding a set number of states
  if (virusMatrixSteps.length > backwardStepsLimit + 1) {
    virusMatrixSteps.shift();
  }
  virusMatrixSteps.push(virusMatrix);
}

function enableVirusPlacement() {
  document.onmousedown = e => {
    mouseIsDown = true;
    placeVirus(e);
  };
  document.onmouseup = () => (mouseIsDown = false);

  document
    .querySelectorAll('.virus')
    .forEach(virus => ((<HTMLElement>virus).onmouseover = placeVirus));
}

function placeVirus(e: MouseEvent) {
  if (!mouseIsDown) return;

  // clicked element has to be a virus tile
  let virus = <HTMLElement>e.target;
  if (!virus.classList.contains('virus')) return;

  spreadVirus(virus, brushSize);
}

function updateHud() {
  cycleCounterElement.innerText = cycleCount.toString();
  infectedCountElement.innerText = infectedCount.toString();
  healthyCountElement.innerText = (possibleVirusCount - infectedCount).toString();
}

export function spreadVirus(virus, brush) {
  // determine column and column of clicked virus tile
  let column = parseInt(virus.id.split('-')[0]);
  let row = parseInt(virus.id.split('-')[1]);

  // get all relevant virus tiles
  let virusTiles = new Array<[number, number]>();
  virusTiles.push([column, row]); // virus tile on mouse point
  getNeighbors(column, row, brush - 1).forEach(neighbor => virusTiles.push(neighbor)); // all neighboring virus tiles

  // enable all virus tiles that are not in the sea
  virusTiles.forEach(neighbor => {
    if (pointInSea(neighbor[0], neighbor[1])) return;
    virusMatrix[neighbor[0]][neighbor[1]] = 1;

    // we can already make the tile visible, but it's functionality/spreading only starts on next frame
    document.getElementById(`${neighbor[0]}-${neighbor[1]}`).style.opacity = '0.5';
  });
}
