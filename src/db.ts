import { Pool } from 'pg'

const pool = new Pool({
    user:'postgres',
    password:'root',
    host:'localhost',
    port:5432,
    database:'music-service',
    // ssl: {
    //     rejectUnauthorized: false,
    // }
})

export default pool