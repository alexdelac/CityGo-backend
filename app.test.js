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















//test camille (start ligne 31)




























//test alex (start ligne 60)

