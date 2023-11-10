import dotenv from 'dotenv';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url)); 
dotenv.config({path: __dirname + "/.env"});
import { app } from './app.js';
import http from 'http';
import { loadPlanetsData } from './models/planets.models.js';
import { mongoConnect } from './services/mongo.js';
import {loadLaunchData} from './models/launches.model.js';


const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer() {
    await mongoConnect();
    await loadPlanetsData();
    await loadLaunchData();
    server.listen(PORT,() => console.log(`listening on PORT ${PORT}`));
}

startServer();