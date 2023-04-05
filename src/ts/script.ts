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

async function load() {
  let splashScreen = document.querySelector('.splash-screen') as HTMLElement;

  determineSvgSize();
  await createMatrices();
  placeVirusRandomly();

  const interval = setInterval(draw, 1000 / framerate);
  console.log('loaded');

  svgObject.style.visibility = 'visible';
  virusMap.style.visibility = 'visible';
  splashScreen.style.visibility = 'hidden';
}

async function createMatrices() {
  const start = performance.now();
  createVirusMatrix();
  seaMatrix = await createSeaMatrix();

  console.log(performance.now() - start + ' ' + 'ms');
}

async function preprocessWorldSvg(
  worldSvgElement: HTMLElement,
  columns: number,
  rows: number
) {
  const seaMatrix = new Array(columns)
    .fill(null)
    .map(() => new Array(rows).fill(0));

  const offscreenCanvas = new OffscreenCanvas(
    columns * virusWidth,
    rows * virusHeight * 0.75
  );
  const ctx: any = offscreenCanvas.getContext('2d', {
    willReadFrequently: true,
  });

  const svgImage = new Image();

  const svgDataUrl =
    'data:image/svg+xml;charset=utf-8,' +
    encodeURIComponent(worldSvgElement.outerHTML);

  svgImage.src = svgDataUrl;

  const loadPromise = new Promise<void>((resolve) => {
    svgImage.onload = () => {
      if (ctx) {
        ctx.drawImage(
          svgImage,
          0,
          0,
          parseInt(svgObject.style.width),
          parseInt(svgObject.style.height)
        );

      }
      for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
          let positionX = column * virusWidth;
          if (row % 2 === 1) positionX += virusWidth / 2;
          let positionY = row * virusHeight * 0.75;

          let onLand;
          if (ctx) {
            const imageData = ctx.getImageData(
              positionX + virusWidth / 2,
              positionY + virusHeight / 2,
              1,
              1
            );

            onLand = imageData.data[3] !== 0;
          } else {
            onLand = false;
          }
          seaMatrix[column][row] = onLand ? 1 : 0;
        }
      }
      resolve();
    };
  });
  await loadPromise;
  return seaMatrix;
}

async function createSeaMatrix() {
  return preprocessWorldSvg(worldSvg, virusColumns, virusRows);
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
