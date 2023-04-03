var svgObject: any = document.getElementById('svgObject');
svgObject?.addEventListener('load', onSvgLoad, false);

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

const isOnLandCache = new Map<string, boolean>();

function preprocessWorldSvg(
  worldSvgElement: HTMLElement,
  columns: number,
  rows: number
): Uint8Array {
  const lookupTable = new Uint8Array(columns * rows);

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      let positionX = column * virusWidth;
      if (row % 2 === 1) positionX += virusWidth / 2;
      let positionY = row * virusHeight * 0.75;

      const onLand =
        worldSvgElement.ownerDocument.elementFromPoint(
          positionX + virusWidth / 2,
          positionY + virusHeight / 2
        ) !== worldSvgElement;
      lookupTable[column + row * columns] = onLand ? 1 : 0;
    }
  }

  return lookupTable;
}

function isOnLand(
  positionX: number,
  positionY: number,
  worldSvgElement: HTMLElement
): boolean {
  const cacheKey = `${positionX},${positionY}`;
  if (isOnLandCache.has(cacheKey)) {
    return isOnLandCache.get(cacheKey)!;
  }

  const onLand =
    worldSvgElement.ownerDocument.elementFromPoint(
      positionX + virusWidth / 2,
      positionY + virusHeight / 2
    ) !== worldSvgElement;

  isOnLandCache.set(cacheKey, onLand);
  return onLand;
}

function createSeaMatrix(worldSvgElement: any): number[][] {
  const lookupTable = preprocessWorldSvg(
    worldSvgElement,
    virusColumns,
    virusRows
  );
  seaMatrix = Array.from({ length: virusColumns }, () => new Array(virusRows));

  for (let row = 0; row < virusRows; row++) {
    for (let column = 0; column < virusColumns; column++) {
      seaMatrix[column][row] = lookupTable[column + row * virusColumns];
    }
  }

  return seaMatrix;
}

function getCountry(x, y) {
  // let path = worldSvg.ownerDocument.elementFromPoint(x, y);
  // // console.log(path);
  // // let pointInGermany = worldSvg.ownerDocument.elementFromPoint(e.x, e.y) == de;
  // let country = path.getAttribute("name") ?? path.className.baseVal ?? path.id;
  // console.log(country == "" ? "Sea" : country);
}
