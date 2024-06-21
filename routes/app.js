import { Candidate } from '../models';


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
}

export default routes;
