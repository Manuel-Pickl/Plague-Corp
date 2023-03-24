const virusWidth = 10;
const virusHeight = virusWidth;

const minPopulation = 1;
const overPopulation = 10;
const spawnProbability = 0.01;

// debug
const logCyclus = false;
const seaClickTest = true;

var worldSvg;
var virusMap;
var germany;

var virusColumns;
var virusRows;

var board;
var next;

window.addEventListener('load', load);

var svgObject = document.getElementById("svgObject");
svgObject.addEventListener("load",function() {
  assignHtmlVariables();

  if (seaClickTest) {
    virusMap.addEventListener("click", function(e) {
      let x = e.x;
      let y = e.y;
      let point = {x, y};
      console.log(pointInSea(point));

      
      let column = parseInt(e.target.id.split("-")[0]);
      let row = parseInt(e.target.id.split("-")[1]);
      console.log(column, "-", row);

      if (row % 2 == 0) document.getElementById(`${column - 1}-${row - 1}`).style.backgroundColor = "black";
      else document.getElementById(`${column + 1}-${row - 1}`).style.backgroundColor = "black";
      document.getElementById(`${column}-${row - 1}`).style.backgroundColor = "black";

      document.getElementById(`${column - 1}-${row}`).style.backgroundColor = "black";
      document.getElementById(`${column}-${row}`).style.backgroundColor = "black";
      document.getElementById(`${column + 1}-${row}`).style.backgroundColor = "black";

      document.getElementById(`${column}-${row + 1}`).style.backgroundColor = "black";
      if (row % 2 == 0) document.getElementById(`${column - 1}-${row + 1}`).style.backgroundColor = "black";
      else document.getElementById(`${column + 1}-${row + 1}`).style.backgroundColor = "black";
    });
    worldSvg.addEventListener("click", function(e) {
      let x = e.x;
      let y = e.y;
      let point = {x, y};
      console.log(pointInSea(point));
    });
  }
}, false);

function assignHtmlVariables() {
  worldSvg = svgObject.contentDocument.children[0];
  virusMap = document.getElementById("virusMap");
}

function pointInSea(point) {
  return (worldSvg.ownerDocument.elementFromPoint(point.x, point.y) == worldSvg);
    // && (worldSvg.ownerDocument.elementFromPoint(point.x - virusWidth / 2, point.y - virusWidth / 2) == worldSvg)
    // && (worldSvg.ownerDocument.elementFromPoint(point.x + virusWidth / 2, point.y + virusWidth / 2) == worldSvg);
}

function getCountry(x, y) {
  let path = worldSvg.ownerDocument.elementFromPoint(x, y);
  // console.log(path);

  // let pointInGermany = worldSvg.ownerDocument.elementFromPoint(e.x, e.y) == de;
  let country = path.getAttribute("name") ?? path.className.baseVal ?? path.id;
  console.log(country == "" ? "Sea" : country);
}

function load() {
  initialize();
  setVirus();
  const interval = setInterval(draw, 1000);
}

function initialize() {
  virusColumns = Math.floor(((getWidth() - virusWidth / 2) / (virusWidth)));
  virusRows = Math.floor((getHeight() - virusHeight * 0.25) / (virusHeight * 0.75));

  board = new Array(virusColumns);
  for (let column = 0; column < virusColumns; column++) {
    board[column] = new Array(virusRows);
  }
  // Going to use multiple 2D arrays and swap them
  next = new Array(virusColumns);
  for (column = 0; column < virusColumns; column++) {
    next[column] = new Array(virusRows);
  }
  
  // create all virus div elements
  for (let row = 0; row < virusRows; row++) {
    for (let column = 0; column < virusColumns; column++) {
      var virus = document.createElement("div");
      virus.id = `${column}-${row}`;
      virus.classList.add("virus");
      let positionX = column * virusWidth;
      if (row % 2 == 1) positionX += virusWidth / 2;
      let positionY = row * virusHeight * 0.75;
      virus.style.left = `${positionX}px`;
      virus.style.top = `${positionY}px`;
      virus.style.width =`${virusWidth}px`;
      virus.style.height = `${virusHeight}px`;
      virus.style.opacity = 0.5;

      // virus.style.visibility = "hidden";
      virusMap.appendChild(virus);
    }
  }
}


function getWidth() {
  let width = Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth
  );

  // console.log(width);
  return width; 
}

function getHeight() {
  let height = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.documentElement.clientHeight
  );

  // console.log(height);
  return height; 
}

var cycleCount = 0;
function draw() {
  cycleCount++;
  
  if (logCyclus) console.log("Cycle: ", cycleCount);
  
  
  // sea = document.querySelector('svg rect');
  germany = worldSvg.getElementById("DE");
  
  for ( let row = 1; row < virusRows- 1; row++) {
    for ( let column = 1; column < virusColumns - 1; column++) {
      if (board[column][row] == 1) {
        let currentVirus = document.getElementById(`${column}-${row}`);

        if (currentVirus.style.visibility != "visible") {
          currentVirus.style.visibility = "visible";
        }
      }
      else if (board[column][row] == 0) {
        document.getElementById(`${column}-${row}`).style.visibility = "hidden";
      }
      else console.log("should never happen: ", board[column][row]);
    }
  }
  
  generate();
  if (logCyclus) console.log("==========");
}


var all = 0;
var current = 0;
function setVirus() {
  // Filling randomly
  for ( let row = 0; row < virusRows; row++) {
    for (let column = 0; column < virusColumns; column++) {
      let randomNumber = 0;

      if (pointInSea(getCoordinatesOfVirusDiv(column, row))) {
        randomNumber = 0;
      }
      else if (Math.random() <= spawnProbability) {
        randomNumber = 1;
        current++;
      }

      board[column][row] = randomNumber;
      next[column][row] = 0;

      all++;
    }
  }

  initialized = true;
}

function getCoordinatesOfVirusDiv(column, row) {
  let x = column * virusWidth + virusWidth / 2;
  if (row % 2 == 1) x += virusWidth / 2;
  let y = row * virusHeight * 0.75 + virusWidth / 2;

  return {x, y};
}

// The process of creating the new generation
function generate() {
  current = 0;
  all = 0;
  // Loop through every spot in our 2D array and check spots neighbors
  for (let column = 1; column < virusColumns - 1; column++) {
    for (let row = 1; row < virusRows - 1; row++) {
      if (pointInSea(getCoordinatesOfVirusDiv(column, row))) {
        next[column][row] = 0; // Water
        continue;
      }

      // algorith for hexagon
      // Add up all the states in a 2,3,2 surrounding hexagon
      let neighbors = 0;
      
      if (row % 2 == 0) neighbors += board[column - 1][row - 1];
      else              neighbors += board[column + 1][row - 1];
      neighbors += board[column][row - 1];

      neighbors += board[column - 1][row];
      neighbors += board[column + 1][row];

      neighbors += board[column][row + 1];
      if (row % 2 == 0) neighbors += board[column - 1][row + 1];
      else              neighbors += board[column + 1][row + 1];

      // algorith for pixel
      // Add up all the states in a 3x3 surrounding grid
      // let neighbors = 0;
      // for (let i = -1; i <= 1; i++) {
      //   for (let j = -1; j <= 1; j++) {
      //     neighbors += board[column + i][row + j];
      //   }
      // }

      // A little trick to subtract the current cell's state since
      // we added it in the above loop
      // neighbors -= board[column][row];

      // Rules of Life
      if      (neighbors < minPopulation)   next[column][row] = 0; // Loneliness
      else if (neighbors > overPopulation)  next[column][row] = 0; // Overpopulation
      else if (neighbors >= minPopulation)  next[column][row] = 1; // Reproduction      
      else console.log("SHOULD NEVER HAPPEN!");

      if (next[column][row] == 1) current++;
      all++;
    }
  }

  if (logCyclus) console.log("alive: ", current);
  if (logCyclus) console.log("dead: ", all - current);

  board = next.map(function(arr) {
    return arr.slice();
  });
}
