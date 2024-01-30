import { WeatherApiResponse } from "../interfaces/weatherResponse";

export class Weather {
   
    public city: string;
    public date: string;
    public uv: number;
    public maxtemp_c: number;
    public mintemp_c: number;
    public avgtemp_c: number;
    public maxwind_kph: number;
    public totalprecip_mm: number;
    public avghumidity: number;



    constructor(data: WeatherApiResponse, city: string, date: string) {
        this.city = city;
        this.date = date;
        this.uv = data.uv;
        this.maxtemp_c = data.maxtemp_c;
        this.mintemp_c = data.mintemp_c;
        this.avgtemp_c = data.avgtemp_c;
        this.maxwind_kph = data.maxwind_kph;
        this.totalprecip_mm = data.totalprecip_mm;
        this.avghumidity = data.avghumidity;
    }

    public static fromResponse(data: WeatherApiResponse, city: string, date: string): Weather {
        return new Weather(data,city,date);

    }

}