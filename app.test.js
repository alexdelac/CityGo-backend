const request = require('supertest');
const app = require('./app');


// test Marie (start ligne 5)

it('POST /signin', async () => {
    const res = await request(app).post('/signin').send({
      email: 'marie@gmail.com',
      password: 'azerty123',
    });
   
    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(true);
   });



// Test Camille
it("GET /detail/:etablissementId", async() => {
  const res = await request(app).get("/detail/12345");

  expect(res.statusCode).toBe(200);
  expect(res.body.product).toEqual({
      id: 12345,
      name: 'Cafe Lovster',
      siret: 87993983300015,
      description: 'Restaurant spécialisé dans les lobster rolls.',
      photos: ['photo01.jpg', 'photo02.jpg'],
      adresse: '3/3 Bis Boulevard Carnot 59800 LILLE',
      latitude: 50.637796,
    longitude: 3.064871,
  })
})

























//test alex (start ligne 60)

