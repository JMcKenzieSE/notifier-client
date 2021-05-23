import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constants } from '../constants';
import { User } from '../models/user.model';

@Injectable({
	providedIn: 'root',
})
export class ApiService {
	constructor(private http: HttpClient) { }

	public getSupervisors(): Observable<string[]> {
		return this.http.get<string[]>(Constants.SUPERVISOR_URL);
	}

	public submitUser(user: User): Observable<any> {
		return this.http.post(Constants.SUBMIT_URL, user);
	}
}
