const {
  banksToSeed,
  bpsToSeed,
  categoriesToSeed,
  pricesToSeed,
  servicesToSeed,
  tasksToSeed,
} = require('./seed-data.ts');
const fs = require('fs');
const path = require('path');

function filterArrayWithId(data) {
  const uniqueIds = {};
  const fiteredData = data.reduce((acc, obj) => {
    if (!uniqueIds[obj.id]) {
      uniqueIds[obj.id] = true;
      acc.push(obj);
    }
    return acc;
  }, []);
}

const filteredTasks = filterArrayWithId(tasksToSeed);
const filteredBps = filterArrayWithId(bpsToSeed);
const filteredServices = filterArrayWithId(servicesToSeed);
const filteredCategories = filterArrayWithId(categoriesToSeed);
const filteredBanks = filterArrayWithId(banksToSeed);
const filteredPrices = filterArrayWithId(pricesToSeed);

fs.writeFile(
  path.join(__dirname, './seed-tasks.ts'),
  `export const seedTasks = ${JSON.stringify(filteredTasks, null, 2)}`,
  (err) => {
    if (err) console.log(err);
  },
);
fs.writeFile(
  path.join(__dirname, './seed-services.ts'),
  `export const seedServices = ${JSON.stringify(filteredServices, null, 2)}`,
  (err) => {
    if (err) console.log(err);
  },
);
fs.writeFile(
  path.join(__dirname, './seed-bps.ts'),
  `export const seedBps = ${JSON.stringify(filteredBps, null, 2)}`,
  (err) => {
    if (err) console.log(err);
  },
);
fs.writeFile(
  path.join(__dirname, './seed-categories.ts'),
  `export const seedCategories = ${JSON.stringify(
    filteredCategories,
    null,
    2,
  )}`,
  (err) => {
    if (err) console.log(err);
  },
);
fs.writeFile(
  path.join(__dirname, './seed-banks.ts'),
  `export const seedBanks = ${JSON.stringify(filteredBanks, null, 2)}`,
  (err) => {
    if (err) console.log(err);
  },
);
fs.writeFile(
  path.join(__dirname, './seed-prices.ts'),
  `export const seedPrices = ${JSON.stringify(filteredPrices, null, 2)}`,
  (err) => {
    if (err) console.log(err);
  },
);
