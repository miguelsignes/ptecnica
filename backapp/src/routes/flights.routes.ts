import express from 'express';
import FlightsService from '../services/flight.services';

const router = express.Router();

const flightsService = new FlightsService();

router.get('/:origin/:destination', async (req, res) => {
    try {
        const origin = req.params.origin;
        const destination = req.params.destination;
        const flightsData = await flightsService.scrapping(origin, destination);

        const bestFights = flightsData.slice(0, 5);
        console.log(flightsData);
        res.json(bestFights);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los datos del vuelo', error });
    }
});

export default router;