import {Injectable} from '@angular/core';
import {Feature, PlacesResponse} from "../interfaces/places";
import {PlacesAPIClient} from "../api/placesAPIClient";
import {MapService} from "./map.service";

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

  constructor(private httpPlacesAPI: PlacesAPIClient, private mapService: MapService) {
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
    if (query.length === 0) {
      this.isLoadingPlaces = false;
      this.places = [];
      return;
    }

    if (!this.userLocation) throw Error('No hay userLocation');

    this.isLoadingPlaces = true;
    this.httpPlacesAPI.get<PlacesResponse>(`/mapbox.places/${query}.json`, {
      params: {
        proximity: this.userLocation.join(',')
      }
    }).subscribe(data => {
      console.log(data.features)
      this.isLoadingPlaces = false;
      this.places = data.features;
      this.mapService.createMarkersFromPlaces(data.features, this.userLocation!);
    })
  }
}
