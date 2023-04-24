var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var svgObject = document.getElementById('svgObject');
svgObject === null || svgObject === void 0 ? void 0 : svgObject.addEventListener('load', onSvgLoad, false);
var svgPlane1 = document.getElementById('plane1');
var svgPlane2 = document.getElementById('plane2');
var svgPlane3 = document.getElementById('plane3');
function determineSvgSize() {
    // calculate best fit for svg
    let width = getWidth();
    let height = getHeight();
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
    /*//planes
    let planeWidth = width * 0.03;
    let planeHeight = height * 0.03;
    svgPlane1.style.width = `${planeWidth}px`;
    svgPlane1.style.height = `${planeHeight}px`;
    svgPlane2.style.width = `${planeWidth}px`;
    svgPlane2.style.height = `${planeHeight}px`;
    svgPlane3.style.width = `${planeWidth}px`;
    svgPlane3.style.height = `${planeHeight}px`;*/
}
function preprocessWorldSvg(worldSvgElement, columns, rows) {
    return __awaiter(this, void 0, void 0, function* () {
        const seaMatrix = new Array(columns).fill(null).map(() => new Array(rows).fill(0));
        const offscreenCanvas = new OffscreenCanvas(columns * virusWidth, rows * virusHeight * 0.75);
        const ctx = offscreenCanvas.getContext('2d', {
            willReadFrequently: true,
        });
        const svgImage = new Image();
        const svgDataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(worldSvgElement.outerHTML);
        svgImage.src = svgDataUrl;
        const loadPromise = new Promise(resolve => {
            svgImage.onload = () => {
                if (ctx) {
                    ctx.drawImage(svgImage, 0, 0, parseInt(svgObject.style.width), parseInt(svgObject.style.height));
                }
                //svg muss schon geladen worden sein
                placePlanes(ctx);
                for (let row = 0; row < rows; row++) {
                    for (let column = 0; column < columns; column++) {
                        let positionX = column * virusWidth;
                        if (row % 2 === 1)
                            positionX += virusWidth / 2;
                        let positionY = row * virusHeight * 0.75;
                        let onLand;
                        if (ctx) {
                            const imageData = ctx.getImageData(positionX + virusWidth / 2, positionY + virusHeight / 2, 1, 1);
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
        yield loadPromise;
        return seaMatrix;
    });
}
function createSeaMatrix() {
    return __awaiter(this, void 0, void 0, function* () {
        const worldSvg = svgObject.contentDocument.querySelector('svg');
        return preprocessWorldSvg(worldSvg, virusColumns, virusRows);
    });
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
    var airportAustraliaNorth = svgContent.getElementById('FH-AustralienNord');
    var x_coord = airportAustraliaNorth.getAttribute('cx') * 0.5;
    var y_coord = airportAustraliaNorth.getAttribute('cy') * 0.5;
    svgPlane1.style.width = `20px`;
    svgPlane1.style.height = `20px`;
    svgPlane1.style.transform = `translate(${x_coord}px,${y_coord}px)`;
    //TODO: Richtiges Koordinatensystem dafür verwenden
    /*var img = new Image();
    img.onload = function () {
      ctx.drawImage(img, 0, 0);
      console.log('Planes loaded');
    };
    img.src = '/assets/airplane.svg';*/
    //svgPlane1.style.transform = 'translate(x_coord, y_coord)';
}
//# sourceMappingURL=svgHelper.js.map