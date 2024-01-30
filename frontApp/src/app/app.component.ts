import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FlightsService } from '../services/flights.service';
import { WeatherService } from '../services/weather.service';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule],
  providers: [FlightsService, WeatherService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  title = 'Flight Search';
  origen: string = '';
  destino: string = '';
  loader: boolean = false;
  error: boolean = false;
  flights: any;
  weather: any;
  combinedData: any;
  displayOrigen: string = '';
  displayDestino: string = '';

  constructor(private flight: FlightsService, private getWether: WeatherService) { }

  async enviarDatos() {

    this.flights = null;
    this.weather = null;

    this.displayOrigen = this.origen;
    this.displayDestino = this.destino;

    console.log('Origen:', this.origen);
    console.log('Destino:', this.destino);
    this.loader = true;

  
    try {
      
      const flightsData = await firstValueFrom(this.flight.getFlight(this.origen, this.destino));
      let weatherData = await firstValueFrom(this.getWether.getWeather(this.destino));

      if (Array.isArray(weatherData) && weatherData.length > 1) {
        weatherData = weatherData.slice(1);
      }
  
  
      this.flights = flightsData;
      this.weather = weatherData;
  


      this.combinedData = { flights: flightsData, weather: weatherData };
  
      console.log('Vuelos:', this.flights);
      console.log('Clima:', this.weather);
      console.log('Datos combinados:', this.combinedData);

    } catch (error) {
      console.log('Error:', error);
      this.error = true;

    } finally {
      this.loader = false;
    }
  }


}
