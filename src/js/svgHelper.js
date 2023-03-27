var svgObject = document.getElementById("svgObject");
svgObject === null || svgObject === void 0 ? void 0 : svgObject.addEventListener("load", function () {
    assignHtmlVariables();
    load();
}, false);
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
    virusMap.style.width = "".concat(calcWidth, "px");
    virusMap.style.height = "".concat(calcHeight, "px");
}
function getCountry(x, y) {
    // let path = worldSvg.ownerDocument.elementFromPoint(x, y);
    // // console.log(path);
    // // let pointInGermany = worldSvg.ownerDocument.elementFromPoint(e.x, e.y) == de;
    // let country = path.getAttribute("name") ?? path.className.baseVal ?? path.id;
    // console.log(country == "" ? "Sea" : country);
}
//# sourceMappingURL=svgHelper.js.map