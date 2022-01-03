import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Feature, PlacesResponse} from "../interfaces/places";

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  public userLocation?: [number, number];

  public isLoadingPlaces = false;
  public places: Feature[] = [];

  get isUserLocationAvailable(): boolean {
    return !!this.userLocation;
  }

  constructor(private http: HttpClient) {
    this.getUserLocation();
  }

  public async getUserLocation(): Promise<[number, number]> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        ({coords}) => {
          this.userLocation = [coords.longitude, coords.latitude];
          resolve(this.userLocation);
        },
        (error) => {
          alert('Geolocation not available');
          console.log(error);
          reject();
        }
      )
    })
  }


  getPlacesByQuery(query: string = '') {
    this.isLoadingPlaces = true;
    this.http.get<PlacesResponse>(`${environment.baseUrlMapbox}/mapbox.places/${query}.json?proximity=-80.10461416267783%2C-0.6825441821710996&language=es&access_token=${environment.access_token}`).subscribe(data => {
      console.log(data.features)
      this.isLoadingPlaces = false;
      this.places = data.features;
    })
  }
}
