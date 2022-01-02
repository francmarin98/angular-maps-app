import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {MapService, PlacesService} from "../../services";
import {Map, Popup, Marker} from "mapbox-gl";

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements AfterViewInit {

  @ViewChild('mapDiv') mapDiv?: ElementRef;

  constructor(
    private placesService: PlacesService,
    private mapService: MapService)
  {}

  ngAfterViewInit() {

    if (!this.placesService.userLocation) throw new Error("UserLocation is not available");

    const map = new Map({
      container: this.mapDiv?.nativeElement, // container ID
      // style: 'mapbox://styles/mapbox/streets-v11', // style URL
      style: 'mapbox://styles/mapbox/dark-v10', // style URL
      center: this.placesService.userLocation, // starting position [lng, lat]
      zoom: 11 // starting zoom
    });

    const popup = new Popup().setHTML(`
        <h6>Aquí estoy</h6>
        <p>En algún lugar cerca de aquí</p>
    `);

    new Marker().setPopup(popup).setLngLat(this.placesService.userLocation).addTo(map);

    this.mapService.setMap(map);
  }

}
