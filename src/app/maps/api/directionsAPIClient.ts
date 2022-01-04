import {HttpClient, HttpHandler, HttpParams} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class DirectionsAPIClient extends HttpClient {
  public baseUrlMapbox: string = environment.baseUrlDirectionsMapbox;

  constructor(handler: HttpHandler) {
    super(handler);
  }

  public override get<T>(url: string) {
    url = this.baseUrlMapbox + url;
    return super.get<T>(url, {
      params: {
        alternatives: false,
        geometries: 'geojson',
        language: 'es',
        overview: 'simplified',
        steps: false,
        access_token: environment.access_token
      }
    });
  }
}
