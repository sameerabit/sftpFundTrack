import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import {mainLoop} from './sftpClient';
import {prisma} from './dbService';

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


mainLoop().catch((err) => {
    console.log(err);
}).finally(() => prisma.$disconnect());


app.get('/', (req, res) => {
    res.send('Hello World!. TypeScript are working!');
})



app.listen(3000, () => {
    console.log('✅ Server is running on port 3000');
    console.log('🌐 Open http://localhost:3000/graphql');
});
