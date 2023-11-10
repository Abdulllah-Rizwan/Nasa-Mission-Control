import express from 'express';
import { httpGetAllPlanets } from './planets.controller.js';
export const planetsRouter = express.Router();

planetsRouter.get('/',httpGetAllPlanets);