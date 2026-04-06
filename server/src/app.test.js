const path = require('node:path');
const request = require('supertest');
const { createApp } = require('./app');

const mapPath = path.resolve(__dirname, '../../map.ascii');
const bookingsPath = path.resolve(__dirname, '../../bookings.json');
const assetsDir = path.resolve(__dirname, '../../assets');

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

  it('cancels booking for the same guest and makes cabana available again', async () => {
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

    const cancelResponse = await request(app).delete('/api/book').send({
      room: '101',
      guestName: 'Alice Smith',
      x: targetX,
      y: targetY,
    });

    expect(cancelResponse.status).toBe(200);
    expect(cancelResponse.body.success).toBe(true);
    expect(cancelResponse.body.message).toBe('Booking cancelled.');

    const mapResponse = await request(app).get('/api/map-data');
    const tile = mapResponse.body.map.tiles.find(
      (mapTile) => mapTile.x === targetX && mapTile.y === targetY
    );

    expect(tile.booked).toBe(false);
    expect(tile.status).toBe('available');
  });

  it('rejects cancel when booking belongs to another guest', async () => {
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

    const cancelResponse = await request(app).delete('/api/book').send({
      room: '102',
      guestName: 'Bob Jones',
      x: targetX,
      y: targetY,
    });

    expect(cancelResponse.status).toBe(401);
    expect(cancelResponse.body.error).toBe(
      'Only the guest who booked this cabana can cancel it.'
    );
  });
});
