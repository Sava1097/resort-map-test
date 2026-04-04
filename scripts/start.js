const path = require('node:path');
const { concurrently } = require('concurrently');

function readArgValue(flagName) {
  const args = process.argv.slice(2);
  const index = args.indexOf(flagName);

  if (index === -1 || index === args.length - 1) {
    return undefined;
  }

  return args[index + 1];
}

const mapArg = readArgValue('--map');
const bookingsArg = readArgValue('--bookings');

const mapPath = path.resolve(process.cwd(), mapArg ?? 'map.ascii');
const bookingsPath = path.resolve(
  process.cwd(),
  bookingsArg ?? 'server/bookings.json'
);

concurrently(
  [
    {
      command: 'npm run dev -w client',
      name: 'client',
      prefixColor: 'blue',
    },
    {
      command: `npm run dev -w server -- --map "${mapPath}" --bookings "${bookingsPath}"`,
      name: 'server',
      prefixColor: 'green',
    },
  ],
  {
    killOthersOn: ['failure', 'success'],
  }
).result.catch(() => {
  process.exit(1);
});
