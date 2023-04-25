// intervals
var simulationInterval: any;
var hudInterval: any;

// matrices
var virusMatrix: number[][];
var virusMatrixNextStep: number[][];
var seaMatrix: number[][];

var virusColumns: number;
var virusRows: number;
var mouseIsDown: boolean = false;

var airplanes = [];
var flightIntervals = [];

// hud
var cycleCount: number = 0;
var brushFill: boolean = true;
var brushSize: number = 1;
var minPopulation: number = 1;
var overPopulation: number = 7;
var flightEnabled: boolean = true;

var possibleVirusCount: number = 0;
var infectedCount: number = 0;

async function onSvgLoad() {
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

  if (debugMode) console.log('simulation initialized');
}

function startSimluation() {
  simulationInterval = setInterval(draw, 1000 / maxFramerate);
  hudInterval = setInterval(updateHud, 1000 / maxHudFramerate);

  (<HTMLElement>document.querySelector('.splash-screen')).style.visibility = 'hidden';

  enableVirusPlacement();

  if (debugMode) console.log('simulation started');
}

async function createMatrices() {
  const start = performance.now();
  createVirusMatrix();
  seaMatrix = await createSeaMatrix();

  console.log(performance.now() - start + ' ' + 'ms');

  if (debugMode) console.log('game matrices created');
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
      let positionX = column * virusWidth;
      if (row % 2 == 1) positionX += virusWidth / 2;
      let positionY = row * virusHeight * 0.75;
      virus.style.left = `${positionX}px`;
      virus.style.top = `${positionY}px`;
      virus.style.width = `${virusWidth}px`;
      virus.style.height = `${virusHeight}px`;
      virus.style.opacity = '0';
      // virus.style.visibility = "hidden";

      virusMapElement.appendChild(virus);
    }
  }
}

function draw() {
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

  if (logCyclus) console.log('==========');
}

function placeVirusRandomly() {
  for (let row = 0; row < virusRows; row++) {
    for (let column = 0; column < virusColumns; column++) {
      let randomNumber = 0;

      if (pointInSea(column, row)) {
        randomNumber = 0;
      } else if (Math.random() <= spawnProbability) {
        randomNumber = 1;
        infectedCount++;
      }

      virusMatrix[column][row] = randomNumber;

      possibleVirusCount++;
    }
  }

  console.log('start point set for virus');
}

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

function spreadVirus(virus, brush) {
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
