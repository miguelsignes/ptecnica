import { Weather } from "../models/weather";
import { WeatherApiResponse, DayWeatherItem} from '../interfaces/weatherResponse';


class WeatherService {

    public async getWeather(city: string)  {


        const apiKey = process.env.WEATHER_API_KEY;
        const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=8&aqi=no&alerts=no`;
        const response = await fetch(url);
        const data = await response.json();
        const dayWeather = data.forecast.forecastday;
   

        const weather = dayWeather.map((dayItem: DayWeatherItem) => {
            const weatherApiResponse: WeatherApiResponse = dayItem.day;
            const day = dayItem.date;
            return Weather.fromResponse(weatherApiResponse, city, day);
        });

        return weather
     
    }
}

export default WeatherService