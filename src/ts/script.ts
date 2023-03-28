var worldSvg;
var svgTest;
var virusMap: HTMLDivElement;

var virusColumns: number;
var virusRows: number;

var virusMatrix: Array<Array<number>>;
var virusMatrixNextStep: Array<Array<number>>;
var seaMatrix: Array<Array<number>>;

function assignHtmlVariables() {
  worldSvg = svgObject.contentDocument.querySelector('svg');
  virusMap = document.getElementById('virusMap') as HTMLDivElement;
}

function pointInSea(column: number, row: number) {
  // return false;
  return !seaMatrix[column][row];
}

function load() {
  let splashScreen = document.querySelector('.splash-screen') as HTMLElement;

  determineSvgSize();
  createMatrices();
  placeVirusRandomly();

  const interval = setInterval(draw, 1000 / framerate);
  console.log('loaded');

  svgObject.style.visibility = 'visible';
  virusMap.style.visibility = 'visible';
  splashScreen.style.visibility = 'hidden';
}

function createMatrices() {
  createVirusMatrix();
  createSeaMatrix();
}

function createSeaMatrix() {
  seaMatrix = new Array(virusColumns);
  for (let column = 0; column < virusColumns; column++) {
    seaMatrix[column] = new Array(virusRows);
  }

  // Get references to all the <path> elements in the <svg>
  const pathElements = d3
    .select(worldSvg)
    .selectAll<SVGPathElement, unknown>('path');

  // Cache the bounding boxes of the path elements in an array
  const pathBBoxes = pathElements.nodes().map((path) => path.getBBox());

  // Iterate over all the <path> elements
  pathBBoxes.forEach((bbox, index) => {
    // Iterate over all the <div> elements
    d3.select(virusMap)
      .selectAll('div')
      .each(function () {
        // Get the bounding rect of the <div> element
        // @ts-ignore
        const divRect = this?.getBoundingClientRect();

        // Check if the <div> element overlaps with the <path> element
        const divOverPath =
          divRect.left < bbox.x + bbox.width &&
          divRect.left + divRect.width > bbox.x &&
          divRect.top < bbox.y + bbox.height &&
          divRect.top + divRect.height > bbox.y;

        // Update the seaMatrix
        // @ts-ignore
        const [_, column, row] = this.id.split('-');
        seaMatrix[+column][+row] = divOverPath ? 1 : 0;
      });
  });
}

function createVirusMatrix() {
  virusMatrix = new Array(virusColumns);
  for (let column = 0; column < virusColumns; column++) {
    virusMatrix[column] = new Array(virusRows);
  }

  virusMatrixNextStep = new Array(virusColumns);
  for (let column = 0; column < virusColumns; column++) {
    virusMatrixNextStep[column] = new Array(virusRows);
  }

  let all = '';
  // create all virus div elements
  for (let row = 0; row < virusRows; row++) {
    for (let column = 0; column < virusColumns; column++) {
      // calc pos
      let x = column * virusWidth;
      if (row % 2 == 1) x += virusWidth / 2;
      let y = row * virusHeight * 0.75;

      // create div
      all += `
      <div 
      id="virus-${column}-${row}"
      class="virus ${Math.random() < 0.5 ? 'alpha' : 'beta'}" 
      style="left:${x}px; top:${y}px; width:${virusWidth}px; height: ${virusHeight}px; opacity: 0.5; visibility: hidden;">
      </div>
      `;
    }
  }
  virusMap.innerHTML = all;
}

var cycleCount = 0;
function draw() {
  cycleCount++;

  if (logCyclus) console.log('Cycle: ', cycleCount);

  for (let row = 0; row < virusRows; row++) {
    for (let column = 0; column < virusColumns; column++) {
      let currentVirus = document.getElementById(
        `virus-${column}-${row}`
      ) as HTMLDivElement;
      if (currentVirus) {
        if (virusMatrix[column][row] == 1) {
          if (currentVirus.style.visibility != 'visible') {
            currentVirus.style.visibility = 'visible';
          }
        } else if (virusMatrix[column][row] == 0) {
          currentVirus.style.visibility = 'hidden';
        } else console.log('should never happen: ', virusMatrix[column][row]);
      }
    }
  }

  generate();
  if (logCyclus) console.log('==========');
}

var all = 0;
var current = 0;
function placeVirusRandomly() {
  for (let row = 0; row < virusRows; row++) {
    for (let column = 0; column < virusColumns; column++) {
      let randomNumber = 0;

      if (pointInSea(column, row)) {
        randomNumber = 0;
      } else if (Math.random() <= spawnProbability) {
        randomNumber = 1;
        current++;
      }

      virusMatrix[column][row] = randomNumber;
      virusMatrixNextStep[column][row] = 0;

      all++;
    }
  }
}

function generate() {
  current = 0;
  all = 0;
  // Loop through every spot in our 2D array and check spots neighbors
  for (let column = 0; column < virusColumns; column++) {
    for (let row = 0; row < virusRows; row++) {
      if (pointInSea(column, row)) {
        virusMatrixNextStep[column][row] = 0; // Water
        continue;
      }

      // algorith for hexagon
      // Add up all the states in a 2,3,2 surrounding hexagon
      let neighbors = 0;

      if (row % 2 == 0 && column > 0 && row > 0)
        neighbors += virusMatrix[column - 1][row - 1];
      else if (column < virusColumns - 1 && row > 0)
        neighbors += virusMatrix[column + 1][row - 1];
      if (row > 0) neighbors += virusMatrix[column][row - 1];

      if (column > 0) neighbors += virusMatrix[column - 1][row];
      if (column < virusColumns - 1) neighbors += virusMatrix[column + 1][row];

      if (row < virusRows - 1) neighbors += virusMatrix[column][row + 1];
      if (row % 2 == 0 && column > 0 && row < virusRows - 1)
        neighbors += virusMatrix[column - 1][row + 1];
      else if (column < virusColumns - 1 && row < virusRows - 1)
        neighbors += virusMatrix[column + 1][row + 1];

      // check if bound tiles are skips
      // if (row % 2 == 0) neighbors += virusMatrix[column - 1][row - 1];
      // else              neighbors += virusMatrix[column + 1][row - 1];
      //                   neighbors += virusMatrix[column][row - 1];

      //                   neighbors += virusMatrix[column - 1][row];
      //                   neighbors += virusMatrix[column + 1][row];

      //                   neighbors += virusMatrix[column][row + 1];
      // if (row % 2 == 0) neighbors += virusMatrix[column - 1][row + 1];
      // else              neighbors += virusMatrix[column + 1][row + 1];

      // Rules of Life
      if (neighbors < minPopulation)
        virusMatrixNextStep[column][row] = 0; // Loneliness
      else if (neighbors > overPopulation)
        virusMatrixNextStep[column][row] = 0; // Overpopulation
      else if (neighbors >= minPopulation)
        virusMatrixNextStep[column][row] = 1; // Reproduction
      else console.log('SHOULD NEVER HAPPEN!');

      if (virusMatrixNextStep[column][row] == 1) current++;
      all++;
    }
  }

  if (logCyclus) console.log('alive: ', current);
  if (logCyclus) console.log('dead: ', all - current);

  virusMatrix = virusMatrixNextStep.map(function (arr) {
    return arr.slice();
  });
}
