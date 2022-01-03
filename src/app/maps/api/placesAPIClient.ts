import {HttpClient, HttpHandler, HttpParams} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class PlacesAPIClient extends HttpClient {
  public baseUrlMapbox: string = environment.baseUrlMapbox;

  constructor(handler: HttpHandler) {
    super(handler);
  }

  public override get<T>(url: string, options: {
    params?: HttpParams | {
      [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
    };
  }) {
    url = this.baseUrlMapbox + url;
    return super.get<T>(url, {
      params: {
        limit: 5,
        language: 'es',
        access_token: environment.access_token,
        ...options.params
      }
    });
  }
}
