import request from 'supertest';
import createServer from "../routes/index";

const app = createServer();

describe('Application API', () => {

    test('should return api application message', async () => {
        const responseData = { 
            status: true, 
            message: "The application for adding or updating candidate’s information"
        };

        const response = await request(app).get('/');

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toEqual(responseData.message);
        expect(response.body.status).toEqual(responseData.status);
    });
});
