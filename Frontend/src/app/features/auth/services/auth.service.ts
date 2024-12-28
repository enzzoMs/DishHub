import { Injectable } from "@angular/core";
import { HttpClient, HttpContext } from "@angular/common/http";
import { User } from "../models/user.model";
import { Observable } from "rxjs";
import { apiEndpoints } from "../../../../api/api-endpoints";
import { IGNORE_ERROR_STATUS_TOKEN } from "../../../shared/interceptors/error-interceptor";
import { ErrorCode } from "../../error/models/error-codes.model";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(private readonly http: HttpClient) {}

  signUpUser(userName: string, password: string): Observable<User> {
    return this.http.post<User>(
      apiEndpoints.signUpUser(),
      {
        userName,
        password,
      },
      {
        context: new HttpContext().set(IGNORE_ERROR_STATUS_TOKEN, [
          ErrorCode.Conflict,
        ]),
      },
    );
  }
}
