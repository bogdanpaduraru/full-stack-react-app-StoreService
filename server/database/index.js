var { Pool } = require('pg');

const CONNECTION_STRING = process.env.DATABASE_URL || 'postgresql://postgres:test@localhost:5432/store-service-db';
const SSL = process.env.NODE_ENV === 'production';

class Database {
    constructor() {
        this._pool = new Pool({
            connectionString: CONNECTION_STRING,
            ssl: SSL
        });

        this._pool.on('error', (err, client) => {
            console.error('Unexpected error on postgresql client.', err);
            process.exit(-1);
        });
    }

    query(query, ...args) {
        this._pool.connect((err, client, done) => {
            if(err) throw err;
            const params = args.length === 2 ? args[0] : [];
            const callback = args.length === 1 ? args[0] : args[1];

            client.query(query, params, (error, res) => {
                done(); 
                if(error){
                    console.log(error.stack);
                    return callback({ error: 'Database error.'}, null);
                }
                callback({ error: null }, res.rows);
            });
        });
    }

    end() {
        this._pool.end();
    }
}

module.exports = new Database();