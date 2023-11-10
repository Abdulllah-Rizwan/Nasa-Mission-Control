import express from 'express';
import cors from 'cors';
import path,{dirname} from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan';
import { api } from './routes/api.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const app = express();
app.use(cors({
    origin: 'http://localhost:3000'
}));
app.use(morgan('combined'));
app.use('/v1',api);
app.use(express.json());
app.use(express.static(path.join(__dirname, '..','public')));

app.get('/*',(req,res) => {
    res.sendFile(path.join(__dirname,'..' ,'public','index.html'))
})