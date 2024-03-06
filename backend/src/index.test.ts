import request from 'supertest';
import { Express } from "express";

enum Location {
    LAX = "LAX",
    UCLA = "UCLA",
    BUR = "BUR"
}

const app: Express = require('./index').app; // Adjust the path to where your Express app is exported

describe('Express Server Endpoints', () => {
  describe('GET /', () => {
    it('should return a welcome message', async () => {
      const response = await request(app).get('/');
      expect(response.statusCode).toBe(200);
      expect(response.text).toContain("Mickey's Express Server. Have a wonderful day!");
    });
  });

  describe('GET /table', () => {
    it('should retrieve submissions', async () => {
      const response = await request(app).get('/table');
      expect(response.statusCode).toBe(200);
    });
  });

  describe('POST /submission', () => {
    it('should acknowledge the submission post request', async () => {
      const submission = {
        userid: 1,
        interval_start: new Date('2024-02-10T09:00:00Z'),
        interval_end: new Date('2024-02-10T10:00:00Z'),
        source: Location.UCLA,
        destination: Location.LAX,
        contact: '@ChadJohnson'
      };
      const response = await request(app)
        .post('/submission')
        .send(submission);
      expect(response.statusCode).toBe(200);
      expect(response.text).toContain('Mickey has acknowledged your POST request. Have a wonderful day!');
    });
  });

  describe('POST /user', () => {
    it('should acknowledge user addition', async () => {
      const email = { email: "kitten@ucla.edu" };
      const response = await request(app)
        .post('/user')
        .send(email);
      expect(response.statusCode).toBe(200);
    });
  });
});
