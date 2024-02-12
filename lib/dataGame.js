const dataAU2mobile = require('./au2mobile.js');
const dataCoda = require('./codashop.json');
const dataDunia = require('./duniagames.json');
const dataRoglobal = require('./roglobal.js');

let oldDataGame = [...dataCoda.data, ...dataDunia.data, ...dataAU2mobile.data, ...dataRoglobal.data];

const dataGame = [...new Map(oldDataGame.map((m) => [m.slug, m])).values()];

module.exports = { dataGame };
