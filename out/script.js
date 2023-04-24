var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// intervals
var simulationInterval;
var hudInterval;
// matrices
var virusMatrix;
var virusMatrixNextStep;
var seaMatrix;
var virusColumns;
var virusRows;
var mouseIsDown = false;
// hud
var cycleCount = 0;
var brushFill = true;
var brushSize = 1;
var minPopulation = 1;
var overPopulation = 7;
var possibleVirusCount = 0;
var infectedCount = 0;
function onSvgLoad() {
    return __awaiter(this, void 0, void 0, function* () {
        assignHtmlVariables();
        assignHtmlEvents();
        initializeHtmlElements();
        yield initializeSimulation();
        startSimluation();
    });
}
function pointInSea(column, row) {
    return !seaMatrix[column][row];
}
function initializeSimulation() {
    return __awaiter(this, void 0, void 0, function* () {
        determineSvgSize();
        yield createMatrices();
        // placeVirusRandomly();
        if (debugMode)
            console.log('simulation initialized');
    });
}
function startSimluation() {
    simulationInterval = setInterval(draw, 1000 / maxFramerate);
    hudInterval = setInterval(updateHud, 1000 / maxHudFramerate);
    document.querySelector('.splash-screen').style.visibility = 'hidden';
    enableVirusPlacement();
    if (debugMode)
        console.log('simulation started');
}
function createMatrices() {
    return __awaiter(this, void 0, void 0, function* () {
        const start = performance.now();
        createVirusMatrix();
        seaMatrix = yield createSeaMatrix();
        console.log(performance.now() - start + ' ' + 'ms');
        if (debugMode)
            console.log('game matrices created');
    });
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
            if (row % 2 == 1)
                positionX += virusWidth / 2;
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
            }
            else if (virusMatrix[column][row] == 0) {
                currentVirus.style.opacity = '0';
            }
            else
                console.log('should never happen: ', virusMatrix[column][row]);
        }
    }
    generate();
    if (logCyclus)
        console.log('==========');
}
function placeVirusRandomly() {
    for (let row = 0; row < virusRows; row++) {
        for (let column = 0; column < virusColumns; column++) {
            let randomNumber = 0;
            if (pointInSea(column, row)) {
                randomNumber = 0;
            }
            else if (Math.random() <= spawnProbability) {
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
            if (virusMatrixNextStep[column][row] == 1)
                infectedCount++;
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
        .forEach(virus => (virus.onmouseover = placeVirus));
}
function placeVirus(e) {
    if (!mouseIsDown)
        return;
    // clicked element has to be a virus tile
    let virus = e.target;
    if (!virus.classList.contains('virus'))
        return;
    // determine column and column of clicked virus tile
    let column = parseInt(virus.id.split('-')[0]);
    let row = parseInt(virus.id.split('-')[1]);
    // get all relevant virus tiles
    let virusTiles = new Array();
    virusTiles.push([column, row]); // virus tile on mouse point
    getNeighbors(column, row, brushSize - 1).forEach(neighbor => virusTiles.push(neighbor)); // all neighboring virus tiles
    // enable all virus tiles that are not in the sea
    virusTiles.forEach(neighbor => {
        if (pointInSea(neighbor[0], neighbor[1]))
            return;
        virusMatrix[neighbor[0]][neighbor[1]] = 1;
        // we can already make the tile visible, but it's functionality/spreading only starts on next frame
        document.getElementById(`${neighbor[0]}-${neighbor[1]}`).style.opacity = '0.5';
    });
}
function updateHud() {
    cycleCounterElement.innerText = cycleCount.toString();
    infectedCountElement.innerText = infectedCount.toString();
    healthyCountElement.innerText = (possibleVirusCount - infectedCount).toString();
}
//# sourceMappingURL=script.js.map