const path = require('node:path');
const request = require('supertest');
const { createApp } = require('./app');

const mapPath = path.resolve(__dirname, '../../map.ascii');
const bookingsPath = path.resolve(__dirname, '../../server/bookings.json');
const assetsDir = path.resolve(__dirname, '../../client/public/assets');

describe('booking API', () => {
  it('books cabana for valid guest and marks it booked', async () => {
    const app = createApp({ mapPath, bookingsPath, assetsDir });
    const targetX = 3;
    const targetY = 11;

    const bookResponse = await request(app).post('/api/book').send({
      room: '101',
      guestName: 'Alice Smith',
      x: targetX,
      y: targetY,
    });

    expect(bookResponse.status).toBe(200);
    expect(bookResponse.body.success).toBe(true);

    const mapResponse = await request(app).get('/api/map-data');
    expect(mapResponse.status).toBe(200);

    const bookedTile = mapResponse.body.map.tiles.find(
      (tile) => tile.x === targetX && tile.y === targetY
    );

    expect(bookedTile.type).toBe('W');
    expect(bookedTile.booked).toBe(true);
    expect(bookedTile.status).toBe('booked');
  });

  it('rejects booking when guest does not exist', async () => {
    const app = createApp({ mapPath, bookingsPath, assetsDir });
    const response = await request(app).post('/api/book').send({
      room: '999',
      guestName: 'Ghost User',
      x: 3,
      y: 11,
    });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Guest not found.');
  });
});
