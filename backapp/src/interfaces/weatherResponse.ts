export class WeatherApiResponse {

    city: string = '';
    uv!: number;
    maxtemp_c!: number;
    mintemp_c!: number;
    avgtemp_c!: number;
    maxwind_kph!: number;
    totalprecip_mm!: number;
    avghumidity!: number;
    
    }
export class DayWeatherItem {
    day: WeatherApiResponse = new WeatherApiResponse();
    date: string = '';

}