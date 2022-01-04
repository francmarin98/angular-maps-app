import {Injectable} from '@angular/core';
import {LngLatBounds, LngLatLike, Map, Marker, Popup} from "mapbox-gl";
import {Feature} from "../interfaces/places";
import {DirectionsAPIClient} from "../api/directionsAPIClient";
import {DirectionResponse, Route} from "../interfaces/directions";

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private map?: Map;
  private markers: Marker[] = [];

  constructor(private directionsAPIClient: DirectionsAPIClient) {
  }

  get isMapReady(): boolean {
    return !!this.map;
  }

  setMap(map: Map) {
    this.map = map;
  }

  flyTo(coords: LngLatLike) {
    if (!this.isMapReady) throw new Error("The map is not ready");

    this.map?.flyTo({zoom: 14, center: coords});
  }

  createMarkersFromPlaces(places: Feature[], userLocation: [number, number]) {

    if (!this.map) throw Error('Mapa no inicializado');


    this.markers.forEach(marker => marker.remove());
    const newMarkers = [];

    for (const place of places) {
      const [lng, lat] = place.center;
      const popup = new Popup()
        .setHTML(`
          <h6>${place.text}</h6>
          <span>${place.place_name}</span>
        `);

      const newMarker = new Marker()
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(this.map);

      newMarkers.push(newMarker);
    }

    this.markers = newMarkers;

    if (places.length === 0) return;

    // Limites del mapa
    const bounds = new LngLatBounds();
    newMarkers.forEach(marker => bounds.extend(marker.getLngLat()));
    bounds.extend(userLocation);

    this.map.fitBounds(bounds, {
      padding: 200
    });

  }

  getPointsBetweenToPoints(start: [number, number], end: [number, number]) {
    this.directionsAPIClient.get<DirectionResponse>(`/mapbox/driving/${start.join(',')};${end.join(',')}`).subscribe(data => {
      this.drawPolyline(data.routes[0])
    })
  }

  drawPolyline(route: Route) {
    console.log({
      kms: route.distance / 1000,
      duration: route.duration / 60,
    });

    if (!this.map) throw Error('Map is not initialized');

    const coords = route.geometry.coordinates;
    const bounds = new LngLatBounds();
    coords.forEach(([lng, lat]) => {
      bounds.extend([lng, lat])
    });

    this.map?.fitBounds(bounds, {
      padding: 200
    });
  }
}
