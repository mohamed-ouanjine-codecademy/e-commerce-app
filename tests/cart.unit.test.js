// Import necessary modules
const request = require('supertest');
const app = require('../app'); // Assuming your Express app is exported from app.js
const { expect } = require('chai');
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJlbWFpbC5mb3IudHYuZWxoYWpqaUBnbWFpbC5jb20iLCJpYXQiOjE3MTEwNDAwNjAsImV4cCI6MTcxMTI5OTI2MH0.Ayaj8mDGd9PYenaNHSTtW6WjWzS-afOv7kPHHlBGYYQ';
describe('Cart routes', () => {
  it('should get user cart', async () => {
    const res = await request(app)
      .get('/api/cart')
      .set('Authorization', `Bearer ${token}`);
    // console.log(res);
    expect(res.statusCode).to.equal(200);
    // Add more expectations based on the response data
  });

  // Add tests for other routes similarly
});

