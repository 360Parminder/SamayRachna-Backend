// const {Client} = require('pg');


// const client = new Client({
//     host: 'localhost',
//     user:'postgres',
//     port: 5432,
//     password: 'Yadav@123',
//     database: 'serene_bhaskara',
//     connectionTimeoutMillis: 5000  // Set a 5-second timeout
// });

// // client.connect();

// // client.query(`select * from users`, (err, res) => {
    
    
// //     if(err){
// //         console.error(err);
// //         return;
// //     }
// //     else{
// //         console.log(res.rows);
// //         console.log("connected");
// //     }
// //     client.end();
// // });

// module.exports = client;


import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient({
    log: ['query', 'info', 'warn'],
    errorFormat: 'pretty ,colorless',   
});

export default prisma;