import {Component} from '@angular/core';
import {MapService, PlacesService} from '../../services';
import {Feature} from "../../interfaces/places";

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent {

  public selectedId: string = "";

  constructor(private placesService: PlacesService, private mapService: MapService) {
  }

  get isLoadingPlaces(): boolean {
    return this.placesService.isLoadingPlaces;
  }

  get places(): Feature[] {
    return this.placesService.places;
  }

  flyTo(place: Feature) {
    const [longitude, latitude] = place.center;
    this.selectedId = place.id;
    this.mapService.flyTo([longitude, latitude]);
  }

  createRoute(place: Feature) {
    if (!this.placesService.userLocation) throw Error('No hay userLocation');
    this.placesService.deletePolyline();
    const start = this.placesService.userLocation;
    const end = place.center as [number, number];
    this.mapService.getPointsBetweenToPoints(start, end)
  }
}
