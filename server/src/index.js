const path = require('node:path');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const { createDefaultApp } = require('./app');

const argv = yargs(hideBin(process.argv))
  .option('map', {
    type: 'string',
    default: 'map.ascii',
    describe: 'Path to ASCII resort map file',
  })
  .option('bookings', {
    type: 'string',
    default: 'server/bookings.json',
    describe: 'Path to bookings JSON file',
  })
  .strict()
  .parseSync();

const app = createDefaultApp(argv);
const PORT = Number(process.env.PORT) || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Using map file: ${path.resolve(argv.map)}`);
  console.log(`Using bookings file: ${path.resolve(argv.bookings)}`);
});
