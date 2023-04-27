import anime from '../../animejs/lib/anime.es.js';
import { getHeight, getWidth } from './helperFunctions.js';
import { onSvgLoad } from './script.js';
import { flightEnabled, virusMapElement } from './htmlHelper.js';
import { virusMatrix, spreadVirus } from './script.js';
import * as constants from './constants.js';

export var svgObject: any = document.getElementById('svgObject');
svgObject?.addEventListener('load', onSvgLoad, false);

export var virusColumns: number;
export var virusRows: number;

export function determineSvgSize() {
  // calculate best fit for svg
  let width: number = getWidth();
  let height: number = getHeight();

  let aspectHeight = Math.floor(width / 2.333);
  height = height < aspectHeight ? height : aspectHeight;

  let aspectWidth = Math.floor(height * 2.333);
  width = width < aspectWidth ? width : aspectWidth;

  // calculate grid based on svg and virus size
  virusColumns = Math.floor((width - constants.virusWidth / 2) / constants.virusWidth);
  virusRows = Math.floor((height - constants.virusHeight * 0.25) / (constants.virusHeight * 0.75));

  // adjust size to fit grid
  let calcWidth = (virusColumns + 0.5) * constants.virusWidth;
  let calcHeight = ((virusRows - 1) * constants.virusHeight * 3) / 4 + constants.virusHeight;

  // set sizes
  svgObject.style.width = `${width}px`;
  svgObject.style.height = `${height}px`;
  virusMapElement.style.width = `${calcWidth}px`;
  virusMapElement.style.height = `${calcHeight}px`;

  console.log('svg size determined');
}

async function preprocessWorldSvg(worldSvgElement: HTMLElement, columns: number, rows: number) {
  const seaMatrix = new Array(columns).fill(null).map(() => new Array(rows).fill(0));

  const offscreenCanvas = new OffscreenCanvas(
    columns * constants.virusWidth,
    rows * constants.virusHeight * 0.75
  );
  const ctx: any = offscreenCanvas.getContext('2d', {
    willReadFrequently: true,
  });

  const svgImage = new Image();

  const svgDataUrl =
    'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(worldSvgElement.outerHTML);

  svgImage.src = svgDataUrl;

  const loadPromise = new Promise<void>(resolve => {
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

      placePlanes();

      for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
          let positionX = column * constants.virusWidth;
          if (row % 2 === 1) positionX += constants.virusWidth / 2;
          let positionY = row * constants.virusHeight * 0.75;

          let onLand;
          if (ctx) {
            const imageData = ctx.getImageData(
              positionX + constants.virusWidth / 2,
              positionY + constants.virusHeight / 2,
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

export async function createSeaMatrix() {
  const worldSvg = svgObject.contentDocument.querySelector('svg');
  return preprocessWorldSvg(worldSvg, virusColumns, virusRows);
}

function placePlanes() {
  setInterval(() => {
    if (!flightEnabled) {
      return;
    }
    if (Math.random() > 0.1) {
      var Airports = selectRandomAirports();
      initiateFlight(Airports);
    }
  }, 1000);
}

function getDegreeBetweenPoints(x1, y1, x2, y2) {
  const deltaX = x2 - x1;
  const deltaY = y2 - y1;
  const radians = Math.atan2(deltaY, deltaX);
  const degrees = radians * (180 / Math.PI);

  return (degrees + 360) % 360;
}

function initiateFlight(airports) {
  let svgContent = svgObject.contentDocument;

  var airportSource = svgContent.getElementById(airports.source);
  const { x: sourceX, y: sourceY } = airportSource.getBoundingClientRect();
  var airportDestination = svgContent.getElementById(airports.destination);
  const { x: destinationX, y: destinationY } = airportDestination.getBoundingClientRect();

  //getPlaneRotation
  let degree =
    getDegreeBetweenPoints(sourceX, sourceY, destinationX, destinationY) +
    constants.degreeOfPlaneImage;

  //get flight time
  let distance = distanceBetweenPoints(sourceX, sourceY, destinationX, destinationY);
  let flightTime = calculateTime(distance, 15);

  let isAirportInfectedOnStart = isAirportInfected(airports);

  //set values for planes
  let plane = document.createElement('img');
  plane.classList.add('airplane');

  plane.src = isAirportInfectedOnStart ? 'assets/airplane_infected.png' : 'assets/airplane.png';

  plane.style.left = `${sourceX}px`;
  plane.style.top = `${sourceY}px`;
  plane.style.rotate = `${degree}deg`;
  document.getElementById('virusMap').append(plane);

  let animateFlying = anime({
    targets: '.airplane',
    left: `${destinationX}px`,
    top: `${destinationY}px`,
    autoplay: false,
  });

  //animateFlying.restart();

  setTimeout(() => {
    animateFlying.restart();
  }, 1000);

  setTimeout(() => {
    //spread virus on flight destination
    if (isAirportInfectedOnStart) {
      let tileX = getMatrixRowByX(destinationX);
      let tileY = getMatrixColoumByY(destinationY);
      let virusTile = document.getElementById(`${tileX}-${tileY}`);
      spreadVirus(virusTile, 4);
    }
    //remove html plane after flight is over
    plane.remove();
    animateFlying.stop();
  }, flightTime * 1000 + 200);
}

function selectRandomAirports() {
  let maxValue = Object.keys(constants.airportNeighbours).length;
  let randomAirportNumber = Math.floor(Math.random() * maxValue);
  let airportName = Object.keys(constants.airportNeighbours)[randomAirportNumber];

  return {
    source: airportName,
    destination: getRandomElement(constants.airportNeighbours[airportName]),
  };
}

function getRandomElement(arr) {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

function distanceBetweenPoints(x1, y1, x2, y2) {
  const deltaX = x2 - x1;
  const deltaY = y2 - y1;
  return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
}

function calculateTime(distance, speed) {
  // Speed should be in the same unit as distance per second.
  return distance / speed;
}

function isAirportInfected(airport) {
  let svgContent = svgObject.contentDocument;
  var airportSource = svgContent.getElementById(airport.source);
  const { x, y } = airportSource.getBoundingClientRect();

  let tileX = getMatrixRowByX(x);
  let tileY = getMatrixColoumByY(y);
  let airportTile = document.getElementById(`${tileX}-${tileY}`);
  if (virusMatrix[tileX][tileY] == 1) {
    return true;
  } else return false;
}

function getMatrixRowByX(x) {
  return Math.floor(x / constants.virusWidth);
}

function getMatrixColoumByY(y) {
  return Math.floor(y / (constants.virusHeight * 0.75));
}
