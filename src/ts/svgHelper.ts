var svgObject: any = document.getElementById("svgObject");
svgObject?.addEventListener("load",function() {
  assignHtmlVariables();
  initializeSimulation();
  startSimluation();
}, false);

function determineSvgSize() {
    // calculate best fit for svg
    let width: number = getWidth();
    let height: number = getHeight();
  
    let aspectHeight = Math.floor(width / 2.333);
    height = height < aspectHeight ? height : aspectHeight;
    
    let aspectWidth = Math.floor(height * 2.333);
    width = width < aspectWidth ? width : aspectWidth;
  
    // calculate grid based on svg and virus size
    virusColumns = Math.floor(((width - virusWidth / 2) / (virusWidth)));
    virusRows = Math.floor((height - virusHeight * 0.25) / (virusHeight * 0.75));
    
    // adjust size to fit grid
    let calcWidth = (virusColumns + 0.5) * virusWidth;
    let calcHeight = (virusRows - 1) * virusHeight * 3/4 + virusHeight;
  
    // set sizes
    svgObject.style.width = `${width}px`;
    svgObject.style.height = `${height}px`;
    virusMap.style.width = `${calcWidth}px`;
    virusMap.style.height = `${calcHeight}px`;

    console.log("svg size determined");
}

  
function getCountry(x, y) {
    // let path = worldSvg.ownerDocument.elementFromPoint(x, y);
    // // console.log(path);
  
    // // let pointInGermany = worldSvg.ownerDocument.elementFromPoint(e.x, e.y) == de;
    // let country = path.getAttribute("name") ?? path.className.baseVal ?? path.id;
    // console.log(country == "" ? "Sea" : country);
}