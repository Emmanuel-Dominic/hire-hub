import express, { json } from 'express';

const app = express();

app.use(json())

const PORT = process.env.PORT || 3001;

app.get('/', async (req, res) => {
    res.json({ status: true, message: "The application for adding or updating candidate’s information" })
});

app.listen(PORT, () => console.log(`App listening at port ${PORT}`));
