import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(private http: HttpClient)  { }

  getWeather(city: string): Observable<any> {
    const url = `http://localhost:3000/weather/${city}`
    return this.http.get(url)
  }
}
