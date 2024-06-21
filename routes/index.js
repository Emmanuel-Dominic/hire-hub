import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from './app';

const createServer = () => {
    const app = express();
    app.use(bodyParser.json());
    app.use(cors());
    routes(app)
    return app
}

export default createServer;