import express from 'express';
import { getAllPlanets } from '../../models/planets.models.js';

export const httpGetAllPlanets = async (req, res) =>  {
    return res.status(200).json(await getAllPlanets());
}