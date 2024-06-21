import request from 'supertest';
import createServer from "../routes/index";
import { Candidate } from '../models';

const app = createServer();

jest.mock('../models', () => ({
    Candidate: {
        findByPk: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        findAll: jest.fn(),
        update: jest.fn(),
        destroy: jest.fn(),
    }
}));

describe('Candidate API', () => {
    let candidateId;

    beforeEach(() => {
        candidateId = 1;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should create a new candidate', async () => {
        const candidateData = {
            firstName: 'Dominic',
            lastName: 'Matembu',
            email: 'dominic.matembu@example.com',
            phoneNumber: '256-700-701-616',
            timeInterval: '9 AM - 5 PM',
            linkedIn: 'https://linkedin.com/in/matembu-emmanuel-dominic',
            github: 'https://github.com/Emmanuel-Dominic',
            comment: 'A Senior Software Engineer.'
        };

        Candidate.findOne.mockResolvedValue(null);
        Candidate.create.mockResolvedValue(candidateData);

        const response = await request(app)
        .post('/candidates')
        .send(candidateData);

        expect(response.statusCode).toBe(201);
        expect(response.body.message).toEqual("Candidate created successfully");
        expect(response.body.candidate).toEqual(candidateData);
    });


    test('should read all candidates', async () => {
        const mockCandidates = [{
            id: candidateId,
            firstName: 'Dominic',
            lastName: 'Matembu',
            email: 'dominic.matembu@example.com',
            phoneNumber: '256-700-701-616',
            timeInterval: '9 AM - 5 PM',
            linkedIn: 'https://linkedin.com/in/matembu-emmanuel-dominic',
            github: 'https://github.com/Emmanuel-Dominic',
            comment: 'A Senior Software Engineer.'
        }];

        Candidate.findAll.mockResolvedValue(mockCandidates);

        const response = await request(app).get('/candidates');
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('candidates');
        expect(response.body.candidates).toEqual(mockCandidates);
    });

    test('should read a single candidate by ID', async () => {
        const mockCandidate = {
            id: candidateId,
            firstName: 'Dominic',
            lastName: 'Matembu',
            email: 'dominic.matembu@example.com',
            phoneNumber: '256-700-701-616',
            timeInterval: '9 AM - 5 PM',
            linkedIn: 'https://linkedin.com/in/matembu-emmanuel-dominic',
            github: 'https://github.com/Emmanuel-Dominic',
            comment: 'A Senior Software Engineer.'
        };

        Candidate.findByPk.mockResolvedValue(mockCandidate);

        const response = await request(app).get(`/candidates/${candidateId}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.candidate).toEqual(mockCandidate);
    });

    test('should update a candidate by ID', async () => {
        const updatedCandidateData = {
            id: candidateId,
            firstName: 'Emmanuel',
            lastName: 'Matembu',
            email: 'emmanuel.matembu@example.com',
            phoneNumber: '256-700-701-616',
            timeInterval: '10 AM - 6 PM',
            linkedIn: 'https://linkedin.com/in/matembu-emmanuel-dominic',
            github: 'https://github.com/Emmanuel-Dominic',
            comment: 'With 5years Experience in Software Engineering'
        };
        Candidate.findOne.mockResolvedValue(null);
        Candidate.update.mockResolvedValue([1]);
        Candidate.findByPk.mockResolvedValue({
            "id": 1, "firstName": "Emmanuel", "lastName": "Matembu",
            "email": "emmanuel.matembu@example.com",  
            "comment": "With 5years Experience in Software Engineering",
            "github": "https://github.com/Emmanuel-Dominic", 
            "linkedIn": "https://linkedin.com/in/matembu-emmanuel-dominic", 
            "phoneNumber": "256-700-701-616", 
            "timeInterval": "10 AM - 6 PM"
        });

        const response = await request(app)
        .put(`/candidates/${candidateId}`)
        .send(updatedCandidateData);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toEqual("Candidate updated successfully");
        expect(response.body.candidate).toEqual(updatedCandidateData);
    });

    test('should delete a candidate by ID', async () => {
        Candidate.destroy.mockResolvedValue(1);

        const response = await request(app).delete(`/candidates/${candidateId}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toEqual('candidate deleted successfully');
    });

    test('should return 404 when reading a deleted candidate', async () => {
        Candidate.findByPk.mockResolvedValue(null);

        const response = await request(app).get(`/candidates/${candidateId}`);
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toEqual('Candidate not found');
    });

    it('should fail to create candidate if email already exists', async () => {
        const existingEmail = 'existing.matembu@example.com';
        const candidateData ={
            "firstName": "Emmanuel", "lastName": "Matembu",
            "email": existingEmail,  
            "comment": "With 5years Experience in Software Engineering",
            "github": "https://github.com/Emmanuel-Dominic", 
            "linkedIn": "https://linkedin.com/in/matembu-emmanuel-dominic", 
            "phoneNumber": "256-700-701-616", 
            "timeInterval": "10 AM - 6 PM"
        };

        Candidate.findOne.mockResolvedValue({ id: 1 });
        Candidate.create.mockResolvedValue(candidateData);

        const response = await request(app)
        .post('/candidates')
        .send(candidateData);

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toEqual('Email already in use');
    });
});
