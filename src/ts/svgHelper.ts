var svgObject: any = document.getElementById('svgObject');
svgObject?.addEventListener('load', onSvgLoad, false);

var svgPlane1: any = document.getElementById('plane1');
var svgPlane2: any = document.getElementById('plane2');
var svgPlane3: any = document.getElementById('plane3');

const airportNeighbours = {
  'FH-AfrikaOst': ['FH-Madagaska'],
  'FH-Madagaska': ['FH-AfrikaOst'],
  'FH-Brasilien': ['FH-AfrikaSued', 'FH-Kolumbien'],
  'FH-AfrikaSued': ['FH-Brasilien'],
  'FH-Kolumbien': ['FH-Mexiko', 'FH-USASued', 'FH-Protugal'],
  'FH-Mexiko': ['FH-USAWest', 'FH-Kolumbien'],
  'FH-USAWest': ['FH-USANord', 'FH-Mexiko'],
  'FH-USASued': ['FH-USANord', 'FH-Kolumbien'],
  'FH-USANord': ['FH-Canada', 'FH-England', 'FH-USASued', 'FH-USAWest'],
  'FH-Canada': ['FH-USANord', 'FH-Groenland'],
  'FH-Protugal': ['FH-England', 'FH-Kolumbien'],
  'FH-England': ['FH-Deutschland', 'FH-Egypt', 'FH-Protugal', 'FH-USANord', 'FH-Groenland'],
  'FH-Deutschland': ['FH-England'],
  'FH-Egypt': ['FH-SaudiArabien', 'FH-England'],
  'FH-SaudiArabien': ['FH-Idien', 'FH-Egypt'],
  'FH-Idien': ['FH-Thailand', 'FH-SaudiArabien'],
  'FH-Thailand': ['FH-China', 'FH-Indonesien', 'FH-Idien'],
  'FH-China': ['FH-Thailand', 'FH-Japan'],
  'FH-Japan': ['FH-Papua', 'FH-China'],
  'FH-Papua': ['FH-AustralienNord', 'FH-AustralienOst', 'FH-Japan'],
  'FH-AustralienNord': ['FH-Papua'],
  'FH-AustralienOst': ['FH-Papua'],
  'FH-Indonesien': ['FH-AustralienWest', 'FH-Thailand'],
  'FH-AustralienWest': ['FH-Indonesien'],
  'FH-Groenland': ['FH-Canada', 'FH-England'],
};

function determineSvgSize() {
  // calculate best fit for svg
  let width: number = getWidth();
  let height: number = getHeight();

  let aspectHeight = Math.floor(width / 2.333);
  height = height < aspectHeight ? height : aspectHeight;

  let aspectWidth = Math.floor(height * 2.333);
  width = width < aspectWidth ? width : aspectWidth;

  // calculate grid based on svg and virus size
  virusColumns = Math.floor((width - virusWidth / 2) / virusWidth);
  virusRows = Math.floor((height - virusHeight * 0.25) / (virusHeight * 0.75));

  // adjust size to fit grid
  let calcWidth = (virusColumns + 0.5) * virusWidth;
  let calcHeight = ((virusRows - 1) * virusHeight * 3) / 4 + virusHeight;

  // set sizes
  svgObject.style.width = `${width}px`;
  svgObject.style.height = `${height}px`;
  virusMapElement.style.width = `${calcWidth}px`;
  virusMapElement.style.height = `${calcHeight}px`;

  console.log('svg size determined');
}

async function preprocessWorldSvg(worldSvgElement: HTMLElement, columns: number, rows: number) {
  const seaMatrix = new Array(columns).fill(null).map(() => new Array(rows).fill(0));

  const offscreenCanvas = new OffscreenCanvas(columns * virusWidth, rows * virusHeight * 0.75);
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
      //svg must have been loaded
      placePlanes(ctx);

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
  const worldSvg = svgObject.contentDocument.querySelector('svg');
  return preprocessWorldSvg(worldSvg, virusColumns, virusRows);
}

function getCountry(x, y) {
  // let path = worldSvg.ownerDocument.elementFromPoint(x, y);
  // // console.log(path);
  // // let pointInGermany = worldSvg.ownerDocument.elementFromPoint(e.x, e.y) == de;
  // let country = path.getAttribute("name") ?? path.className.baseVal ?? path.id;
  // console.log(country == "" ? "Sea" : country);
}

function placePlanes(ctx) {
  var svgContent = svgObject.contentDocument;

  var airportAustraliaWest = svgContent.getElementById('FH-AustralienWest');
  const { x: x1, y: y1 } = airportAustraliaWest.getBoundingClientRect();

  const flight_intervall = setInterval(function () {
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

  return (degrees + 360 + 90) % 360;
}

function movePlane(x1, y1, x2, y2) {}

function initiateFlight(airports) {
  let svgContent = svgObject.contentDocument;

  var airportSource = svgContent.getElementById(airports.source);
  const { x: sourceX, y: sourceY } = airportSource.getBoundingClientRect();
  var airportDestination = svgContent.getElementById(airports.destination);
  const { x: destinationX, y: destinationY } = airportDestination.getBoundingClientRect();

  //getPlaneRotation
  let degree = getDegreeBetweenPoints(sourceX, sourceY, destinationX, destinationY);

  //get flight time
  let distance = distanceBetweenPoints(sourceX, sourceY, destinationX, destinationY);
  let flightTime = calculateTime(distance, 15);

  //set values for planes
  let plane = document.createElement('object');
  plane.classList.add('airplane');
  plane.id = 'plane1';
  plane.data = 'assets/airplane.svg';

  plane.style.transition = `${flightTime}s`;
  plane.style.width = `20px`;
  plane.style.height = `20px`;
  plane.style.left = `${sourceX}px`;
  plane.style.top = `${sourceY}px`;
  plane.style.rotate = `${degree}deg`;
  document.getElementById('virusMap').append(plane);
  if (isAirportInfected(airports)) {
    plane.style.color = 'red';
    plane.style.fill = 'red';
  }

  plane.style.left = `${destinationX}px`;
  plane.style.top = `${destinationY}px`;

  //remove html plane after flight is over
  setTimeout(() => {
    //spread virus on flight destination
    if (isAirportInfected(airports)) {
      let tileX = getMatrixRowByX(destinationX);
      let tileY = getMatrixColoumByY(destinationY);
      let virusTile = document.getElementById(`${tileX}-${tileY}`);
      spreadVirus(virusTile, 4);
    }
    plane.remove();
  }, flightTime * 1000 + 200);
}

function selectRandomAirports() {
  let maxValue = Object.keys(airportNeighbours).length;
  let randomAirportNumber = Math.floor(Math.random() * maxValue);
  let airportName = Object.keys(airportNeighbours)[randomAirportNumber];

  return { source: airportName, destination: getRandomElement(airportNeighbours[airportName]) };
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
  return Math.floor(x / virusWidth);
}

function getMatrixColoumByY(y) {
  return Math.floor(y / (virusHeight * 0.75));
}
