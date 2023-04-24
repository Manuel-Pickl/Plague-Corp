var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    assignHtmlVariables();
                    assignHtmlEvents();
                    initializeHtmlElements();
                    return [4 /*yield*/, initializeSimulation()];
                case 1:
                    _a.sent();
                    startSimluation();
                    return [2 /*return*/];
            }
        });
    });
}
function pointInSea(column, row) {
    return !seaMatrix[column][row];
}
function initializeSimulation() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    determineSvgSize();
                    return [4 /*yield*/, createMatrices()];
                case 1:
                    _a.sent();
                    // placeVirusRandomly();
                    if (debugMode)
                        console.log('simulation initialized');
                    return [2 /*return*/];
            }
        });
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
    return __awaiter(this, void 0, void 0, function () {
        var start;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    start = performance.now();
                    createVirusMatrix();
                    return [4 /*yield*/, createSeaMatrix()];
                case 1:
                    seaMatrix = _a.sent();
                    console.log(performance.now() - start + ' ' + 'ms');
                    if (debugMode)
                        console.log('game matrices created');
                    return [2 /*return*/];
            }
        });
    });
}
function createVirusMatrix() {
    virusMatrix = new Array(virusColumns);
    for (var column = 0; column < virusColumns; column++) {
        virusMatrix[column] = new Array(virusRows);
        for (var row = 0; row < virusRows; row++) {
            virusMatrix[column][row] = 0;
        }
    }
    virusMatrixNextStep = new Array(virusColumns);
    for (var column = 0; column < virusColumns; column++) {
        virusMatrixNextStep[column] = new Array(virusRows);
        for (var row = 0; row < virusRows; row++) {
            virusMatrixNextStep[column][row] = 0;
        }
    }
    // create all virus div elements
    for (var row = 0; row < virusRows; row++) {
        for (var column = 0; column < virusColumns; column++) {
            // ToDo: try to skip virus tiles that are in the sea
            var virus = document.createElement('div');
            virus.id = "".concat(column, "-").concat(row);
            virus.classList.add('virus');
            virus.classList.add(Math.random() < 0.5 ? 'alpha' : 'beta');
            var positionX = column * virusWidth;
            if (row % 2 == 1)
                positionX += virusWidth / 2;
            var positionY = row * virusHeight * 0.75;
            virus.style.left = "".concat(positionX, "px");
            virus.style.top = "".concat(positionY, "px");
            virus.style.width = "".concat(virusWidth, "px");
            virus.style.height = "".concat(virusHeight, "px");
            virus.style.opacity = '0';
            // virus.style.visibility = "hidden";
            virusMapElement.appendChild(virus);
        }
    }
}
function draw() {
    cycleCount++;
    for (var row = 0; row < virusRows; row++) {
        for (var column = 0; column < virusColumns; column++) {
            var currentVirus = document.getElementById("".concat(column, "-").concat(row));
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
    for (var row = 0; row < virusRows; row++) {
        for (var column = 0; column < virusColumns; column++) {
            var randomNumber = 0;
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
    for (var column = 0; column < virusColumns; column++) {
        for (var row = 0; row < virusRows; row++) {
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
    document.onmousedown = function (e) {
        mouseIsDown = true;
        placeVirus(e);
    };
    document.onmouseup = function () { return (mouseIsDown = false); };
    document
        .querySelectorAll('.virus')
        .forEach(function (virus) { return (virus.onmouseover = placeVirus); });
}
function placeVirus(e) {
    if (!mouseIsDown)
        return;
    // clicked element has to be a virus tile
    var virus = e.target;
    if (!virus.classList.contains('virus'))
        return;
    // determine column and column of clicked virus tile
    var column = parseInt(virus.id.split('-')[0]);
    var row = parseInt(virus.id.split('-')[1]);
    // get all relevant virus tiles
    var virusTiles = new Array();
    virusTiles.push([column, row]); // virus tile on mouse point
    getNeighbors(column, row, brushSize - 1).forEach(function (neighbor) { return virusTiles.push(neighbor); }); // all neighboring virus tiles
    // enable all virus tiles that are not in the sea
    virusTiles.forEach(function (neighbor) {
        if (pointInSea(neighbor[0], neighbor[1]))
            return;
        virusMatrix[neighbor[0]][neighbor[1]] = 1;
        // we can already make the tile visible, but it's functionality/spreading only starts on next frame
        document.getElementById("".concat(neighbor[0], "-").concat(neighbor[1])).style.opacity = '0.5';
    });
}
function updateHud() {
    cycleCounterElement.innerText = cycleCount.toString();
    infectedCountElement.innerText = infectedCount.toString();
    healthyCountElement.innerText = (possibleVirusCount - infectedCount).toString();
}
//# sourceMappingURL=script.js.map