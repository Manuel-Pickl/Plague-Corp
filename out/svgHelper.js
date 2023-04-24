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
var svgObject = document.getElementById('svgObject');
svgObject === null || svgObject === void 0 ? void 0 : svgObject.addEventListener('load', onSvgLoad, false);
function determineSvgSize() {
    // calculate best fit for svg
    var width = getWidth();
    var height = getHeight();
    var aspectHeight = Math.floor(width / 2.333);
    height = height < aspectHeight ? height : aspectHeight;
    var aspectWidth = Math.floor(height * 2.333);
    width = width < aspectWidth ? width : aspectWidth;
    // calculate grid based on svg and virus size
    virusColumns = Math.floor((width - virusWidth / 2) / virusWidth);
    virusRows = Math.floor((height - virusHeight * 0.25) / (virusHeight * 0.75));
    // adjust size to fit grid
    var calcWidth = (virusColumns + 0.5) * virusWidth;
    var calcHeight = ((virusRows - 1) * virusHeight * 3) / 4 + virusHeight;
    // set sizes
    svgObject.style.width = "".concat(width, "px");
    svgObject.style.height = "".concat(height, "px");
    virusMapElement.style.width = "".concat(calcWidth, "px");
    virusMapElement.style.height = "".concat(calcHeight, "px");
    console.log('svg size determined');
}
function preprocessWorldSvg(worldSvgElement, columns, rows) {
    return __awaiter(this, void 0, void 0, function () {
        var seaMatrix, offscreenCanvas, ctx, svgImage, svgDataUrl, loadPromise;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    seaMatrix = new Array(columns).fill(null).map(function () { return new Array(rows).fill(0); });
                    offscreenCanvas = new OffscreenCanvas(columns * virusWidth, rows * virusHeight * 0.75);
                    ctx = offscreenCanvas.getContext('2d', {
                        willReadFrequently: true,
                    });
                    svgImage = new Image();
                    svgDataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(worldSvgElement.outerHTML);
                    svgImage.src = svgDataUrl;
                    loadPromise = new Promise(function (resolve) {
                        svgImage.onload = function () {
                            if (ctx) {
                                ctx.drawImage(svgImage, 0, 0, parseInt(svgObject.style.width), parseInt(svgObject.style.height));
                            }
                            for (var row = 0; row < rows; row++) {
                                for (var column = 0; column < columns; column++) {
                                    var positionX = column * virusWidth;
                                    if (row % 2 === 1)
                                        positionX += virusWidth / 2;
                                    var positionY = row * virusHeight * 0.75;
                                    var onLand = void 0;
                                    if (ctx) {
                                        var imageData = ctx.getImageData(positionX + virusWidth / 2, positionY + virusHeight / 2, 1, 1);
                                        onLand = imageData.data[3] !== 0;
                                    }
                                    else {
                                        onLand = false;
                                    }
                                    seaMatrix[column][row] = onLand ? 1 : 0;
                                }
                            }
                            resolve();
                        };
                    });
                    return [4 /*yield*/, loadPromise];
                case 1:
                    _a.sent();
                    return [2 /*return*/, seaMatrix];
            }
        });
    });
}
function createSeaMatrix() {
    return __awaiter(this, void 0, void 0, function () {
        var worldSvg;
        return __generator(this, function (_a) {
            worldSvg = svgObject.contentDocument.querySelector('svg');
            return [2 /*return*/, preprocessWorldSvg(worldSvg, virusColumns, virusRows)];
        });
    });
}
function getCountry(x, y) {
    // let path = worldSvg.ownerDocument.elementFromPoint(x, y);
    // // console.log(path);
    // // let pointInGermany = worldSvg.ownerDocument.elementFromPoint(e.x, e.y) == de;
    // let country = path.getAttribute("name") ?? path.className.baseVal ?? path.id;
    // console.log(country == "" ? "Sea" : country);
}
//# sourceMappingURL=svgHelper.js.map