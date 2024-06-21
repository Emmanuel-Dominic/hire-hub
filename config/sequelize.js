import { Sequelize } from 'sequelize';
import config from './config';

let sequelize;
const environment = process.env.NODE_ENV || 'development';
const connect = config[environment];

if (environment === 'test') {
    sequelize = new Sequelize({
        dialect: connect.dialect,
        storage: connect.storage
    });
} else {
    sequelize = new Sequelize(connect.database, connect.username, connect.password, {
        host: connect.host,
        dialect: connect.dialect
    });
}

export default sequelize;
