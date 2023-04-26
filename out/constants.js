const maxFramerate = 15;
const maxHudFramerate = maxFramerate;
const virusWidth = 7;
const virusHeight = virusWidth;
const spawnProbability = 0.001;
const brushSizeMin = 1;
const brushSizeMax = 10;
const minPopulationMin = 1;
const minPopulationMax = 4;
const overPopulationMin = 1;
const overPopulationMax = 7;
const degreeOfPlaneImage = 45;
// debug
const debugMode = true;
const logCyclus = false;
const seaClickTest = true;
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
export {};
//# sourceMappingURL=constants.js.map