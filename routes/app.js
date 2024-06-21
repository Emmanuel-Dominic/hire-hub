import { Candidate } from '../models';
import validateCandidateData from '../helpers/validator';


const routes = (app) => {
    app.get('/', async (req, res) => {
        res.json({ status: true, message: "The application for adding or updating candidate’s information" })
    });

    app.get('/candidates', async (req, res) => {
        try{
            const candidates = await Candidate.findAll();
            res.status(200).json({ candidates });
        } catch (error) {
            res.status(400).json({ message: 'Failed to retrieve candidates!', error: error.message });
        }
    });

    app.get('/candidates/:id', async (req, res) => {
        try{
            const candidate = await Candidate.findByPk(req.params.id);
            if (candidate) {
                res.status(200).json({ candidate});
            } else {
                res.status(404).json({message: 'Candidate not found'});
            }
        } catch (error) {
            res.status(400).json({ message: 'Failed to retrieve candidate!', error: error.message });
        }
    });

    app.post('/candidates', validateCandidateData, async (req, res) => {
        const { email, ...candidateData } = req.body;
        try {
            const existingCandidate = await Candidate.findOne({ where: { email } });
            if (existingCandidate) {
                return res.status(400).json({ message: 'Email already in use' });
            } else {
                const created = await Candidate.create(candidateData);
                res.status(201).json({ message: 'Candidate created successfully', candidate: created });
            }
        } catch (error) {
            res.status(400).json({ message: 'Failed to create candidate!', error: error.message });
        }
    });
    
    app.put('/candidates/:id', validateCandidateData, async (req, res) => {
        const candidateId = req.params.id;
        const { email, ...candidateData } = req.body;

        try {
            const candidate = await Candidate.findByPk(candidateId);
            if (!candidate) {
                return res.status(404).json({ message: 'Candidate not found!' });
            }

            if (email) {
                const existingCandidate = await Candidate.findOne({ where: { email } });
                if (existingCandidate && existingCandidate.id !== parseInt(candidateId)) {
                    return res.status(400).json({ message: 'Email already in use' });
                }
            }

            await Candidate.update(candidateData, { where: { id: candidateId } });
            res.status(200).json({ message: 'Candidate updated successfully', candidate });
        } catch (error) {
            res.status(400).json({ message: 'Failed to update candidate!', error: error.message });
        }
    });

    app.delete('/candidates/:id', async (req, res) => {
        try{
            const deleted = await Candidate.destroy({
                where: { id: req.params.id }
            });
            if (deleted) {
                res.status(200).json({ message: "candidate deleted successfully" });
            } else {
                res.status(404).json({ message: 'Candidate not found' });
            }
        } catch (error) {
            res.status(400).json({ message: 'Failed to delete candidate!', error: error.message });
        }
    });

    app.use((err, req, res, next) => {
        res.status(err.status || 500).json({ error: err.message });
    });
}

export default routes;
