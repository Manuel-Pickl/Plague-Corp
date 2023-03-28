var svgObject = document.getElementById("svgObject");
svgObject === null || svgObject === void 0 ? void 0 : svgObject.addEventListener("load", onSvgLoad, false);
function determineSvgSize() {
    // calculate best fit for svg
    var width = getWidth();
    var height = getHeight();
    var aspectHeight = Math.floor(width / 2.333);
    height = height < aspectHeight ? height : aspectHeight;
    var aspectWidth = Math.floor(height * 2.333);
    width = width < aspectWidth ? width : aspectWidth;
    // calculate grid based on svg and virus size
    virusColumns = Math.floor(((width - virusWidth / 2) / (virusWidth)));
    virusRows = Math.floor((height - virusHeight * 0.25) / (virusHeight * 0.75));
    // adjust size to fit grid
    var calcWidth = (virusColumns + 0.5) * virusWidth;
    var calcHeight = (virusRows - 1) * virusHeight * 3 / 4 + virusHeight;
    // set sizes
    svgObject.style.width = "".concat(width, "px");
    svgObject.style.height = "".concat(height, "px");
    virusMapElement.style.width = "".concat(calcWidth, "px");
    virusMapElement.style.height = "".concat(calcHeight, "px");
    console.log("svg size determined");
}
function createSeaMatrix() {
    seaMatrix = new Array(virusColumns);
    for (var column = 0; column < virusColumns; column++) {
        seaMatrix[column] = new Array(virusRows);
    }
    for (var row = 0; row < virusRows; row++) {
        for (var column = 0; column < virusColumns; column++) {
            var positionX = column * virusWidth;
            if (row % 2 == 1)
                positionX += virusWidth / 2;
            var positionY = row * virusHeight * 0.75;
            var pointOnLand = (worldSvgElement.ownerDocument.elementFromPoint(positionX + virusWidth / 2, positionY + virusHeight / 2) != worldSvgElement)
                // sides
                || (worldSvgElement.ownerDocument.elementFromPoint(positionX + virusWidth / 2, positionY) != worldSvgElement) // top
                || (worldSvgElement.ownerDocument.elementFromPoint(positionX + virusWidth, positionY + virusHeight / 2) != worldSvgElement) // right
                || (worldSvgElement.ownerDocument.elementFromPoint(positionX + virusWidth / 2, positionY + virusHeight) != worldSvgElement) // bottom
                || (worldSvgElement.ownerDocument.elementFromPoint(positionX, positionY + virusHeight / 2) != worldSvgElement); // left
            // edges
            // || (worldSvg.ownerDocument.elementFromPoint(positionX, positionY) != worldSvg) // top left
            // || (worldSvg.ownerDocument.elementFromPoint(positionX + virusWidth, positionY) != worldSvg) // top right
            // || (worldSvg.ownerDocument.elementFromPoint(positionX + virusWidth, positionY + virusHeight) != worldSvg) // bottom right
            // || (worldSvg.ownerDocument.elementFromPoint(positionX, positionY + virusHeight) != worldSvg) // bottom left
            seaMatrix[column][row] = pointOnLand ? 1 : 0;
        }
    }
}
function getCountry(x, y) {
    // let path = worldSvg.ownerDocument.elementFromPoint(x, y);
    // // console.log(path);
    // // let pointInGermany = worldSvg.ownerDocument.elementFromPoint(e.x, e.y) == de;
    // let country = path.getAttribute("name") ?? path.className.baseVal ?? path.id;
    // console.log(country == "" ? "Sea" : country);
}
//# sourceMappingURL=svgHelper.js.map