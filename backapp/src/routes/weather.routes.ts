import express from 'express';
import WeatherService from '../services/weather.services';

const router = express.Router();
const weatherService = new WeatherService();


router.get('/:city', async (req, res) => {
    try {
        const city = req.params.city;
        const weatherData = await weatherService.getWeather(city);
        res.json(weatherData);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los datos del clima', error });
    }
});

export default router;