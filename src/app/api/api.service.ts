import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constants } from '../constants';
import { Manager } from '../models/manager.model';
import { User } from '../models/user.model';

@Injectable({
	providedIn: 'root',
})
export class ApiService {
	constructor(private http: HttpClient) { }

	public getSupervisors(): Observable<Manager[]> {
		return this.http.get<Manager[]>(Constants.SUPERVISOR_URL);
	}

	public submitUser(user: User): Observable<User> {
		return this.http.post(Constants.SUBMIT_URL, user);
	}
}
