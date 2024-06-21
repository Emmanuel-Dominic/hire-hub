import validateCandidateData from '../helpers/validator';
import { mockRequest, mockResponse, mockNext } from '../helpers/mocks';
import { Candidate } from '../models';


jest.mock('../models', () => ({
  Candidate: {
    findOne: jest.fn(),
    findByPk: jest.fn()
  }
}));

describe('validateCandidateData Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    next = mockNext();
  });

  it('should pass validation with correct data', async () => {
    req.body = {
        firstName: 'Dominic',
        lastName: 'Matembu',
        email: 'emmanuelmatembu@example.com',
        phoneNumber: '256-700-701-616',
        timeInterval: '9 AM - 5 PM',
        linkedIn: 'https://linkedin.com/in/matembu-emmanuel-dominic',
        github: 'https://github.com/Emmanuel-Dominic',
        comment: 'A Senior Software Engineer.'
    };

    Candidate.findOne.mockResolvedValue(null);
    await validateCandidateData(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should fail validation if firstName is missing', async () => {
    req.body = {
        lastName: 'Matembu',
        email: 'emmamatembu@example.com',
        phoneNumber: '256-700-701-616',
        timeInterval: '9 AM - 5 PM',
        linkedIn: 'https://linkedin.com/in/matembu-emmanuel-dominic',
        github: 'https://github.com/Emmanuel-Dominic',
        comment: 'A Senior Software Engineer.'
    };

    await validateCandidateData(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: [
        { field: 'firstName', message: 'First name is required and must be a non-empty string.' }
      ]
    });
  });

  it('should fail validation if email is invalid', async () => {
    req.body = {
        firstName: 'Dominic',
        lastName: 'Matembu',
        email: 'ematembu.com',
        phoneNumber: '256-700-701-616',
        timeInterval: '9 AM - 5 PM',
        linkedIn: 'https://linkedin.com/in/matembu-emmanuel-dominic',
        github: 'https://github.com/Emmanuel-Dominic',
        comment: 'A Senior Software Engineer.'
    };

    await validateCandidateData(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: [
        { field: 'email', message: 'A valid email address is required.' }
      ]
    });
  });

  it('should fail validation if phoneNumber is not a string', async () => {
    req.body = {
        firstName: 'Dominic',
        lastName: 'Matembu',
        email: 'dominic.matembu1@example.com',
        phoneNumber: 256-700-701-616,
        timeInterval: '9 AM - 5 PM',
        linkedIn: 'https://linkedin.com/in/matembu-emmanuel-dominic',
        github: 'https://github.com/Emmanuel-Dominic',
        comment: 'A Senior Software Engineer.'
    };

    await validateCandidateData(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: [
        { field: 'phoneNumber', message: 'Phone number must be a string.' }
      ]
    });
  });

  it('should fail validation if timeInterval is not a string', async () => {
    req.body = {
        firstName: 'Dominic',
        lastName: 'Matembu',
        email: 'dominic.matembu2@example.com',
        phoneNumber: '256-700-701-616',
        timeInterval: 12345,
        linkedIn: 'https://linkedin.com/in/matembu-emmanuel-dominic',
        github: 'https://github.com/Emmanuel-Dominic',
        comment: 'A Senior Software Engineer.'
    };

    await validateCandidateData(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: [
        { field: 'timeInterval', message: 'Time interval must be a string.' }
      ]
    });
  });

  it('should fail validation if linkedIn URL is invalid', async () => {
    req.body = {
        firstName: 'Dominic',
        lastName: 'Matembu',
        email: 'dominic.matembu3@example.com',
        phoneNumber: '256-700-701-616',
        timeInterval: '9 AM - 5 PM',
        linkedIn: 'linkedin/in/matembu-emmanuel-dominic',
        github: 'https://github.com/Emmanuel-Dominic',
        comment: 'A Senior Software Engineer.'
    };

    await validateCandidateData(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: [
        { field: 'linkedIn', message: 'LinkedIn profile URL must be a valid URL.' }
      ]
    });
  });

  it('should fail validation if github URL is invalid', async () => {
    req.body = {
        firstName: 'Dominic',
        lastName: 'Matembu',
        email: 'dominic.matembu4@example.com',
        phoneNumber: '256-700-701-616',
        timeInterval: '9 AM - 5 PM',
        linkedIn: 'https://linkedin.com/in/matembu-emmanuel-dominic',
        github: 'github/Emmanuel-Dominic',
        comment: 'A Senior Software Engineer.'
    };

    await validateCandidateData(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: [
        { field: 'github', message: 'GitHub profile URL must be a valid URL.' }
      ]
    });
  });

  it('should fail validation if comment is missing', async () => {
    req.body = {
        firstName: 'Dominic',
        lastName: 'Matembu',
        email: 'dominic.matembu5@example.com',
        phoneNumber: '256-700-701-616',
        timeInterval: '9 AM - 5 PM',
        linkedIn: 'https://linkedin.com/in/matembu-emmanuel-dominic',
        github: 'https://github.com/Emmanuel-Dominic'
    };

    await validateCandidateData(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: [
        { field: 'comment', message: 'Free text comment is required and must be a non-empty string.' }
      ]
    });
  });

  it('should fail validation if comment is less than 5 characters', async () => {
    req.body = {
        firstName: 'Dominic',
        lastName: 'Matembu',
        email: 'dominic.matembu6@example.com',
        phoneNumber: '256-700-701-616',
        timeInterval: '9 AM - 5 PM',
        linkedIn: 'https://linkedin.com/in/matembu-emmanuel-dominic',
        github: 'https://github.com/Emmanuel-Dominic',
        comment: 'Bird'
    };

    await validateCandidateData(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: [
        { field: 'comment', message: 'Comment must be at least 5 characters long.' }
      ]
    });
  });

  it('should return candidate data if candidateId is provided and candidate exists', async () => {
    req.params.id = '1';
    req.body = {
        firstName: 'Dominic',
        lastName: 'Matembu',
        email: 'dominic.matembu7@example.com',
        phoneNumber: '256-700-701-616',
        timeInterval: '9 AM - 5 PM',
        linkedIn: 'https://linkedin.com/in/matembu-emmanuel-dominic',
        github: 'https://github.com/Emmanuel-Dominic',
        comment: 'A Senior Software Engineer.'
    };

    Candidate.findByPk.mockResolvedValue({ id: 1 });
    await validateCandidateData(req, res, next);

    expect(next).toHaveBeenCalled();
  });

});
