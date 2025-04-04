import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
import {mainLoop} from './sftpClient';
import {prisma} from './db';

dotenv.config();

const app = express();

app.use(cors());
app.use(
    helmet({
        contentSecurityPolicy: {
            useDefaults: true,
            directives: {
                "default-src": ["'self'"],
                "img-src": ["'self'", "data:"],
                "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
                "style-src": ["'self'", "'unsafe-inline'"],
            },
        },
    })
);
app.use(express.json());

// const schema = buildSchema(`
//   type Query {
//     hello: String,
//     name: String
//   }
// `);
//
// const root = {
//     hello: () => {
//         return 'Hello world! GraphQL and TypeScript are working!';
//     },
//     name: () => {
//         return 'John Doe';
//     },
// };

// app.use(
//     '/graphql',
//     graphqlHTTP({
//         schema,
//         rootValue: root,
//         graphiql: true,
//     })
// );


mainLoop().catch((err) => {
    console.log(err);
}).finally(() => prisma.$disconnect());


app.get('/', (req, res) => {
    res.send('Hello World! GraphQL and TypeScript are working!');
})



app.listen(3000, () => {
    console.log('✅ Server is running on port 3000');
    console.log('🌐 Open http://localhost:3000/graphql');
});
