import { environment } from 'src/environments/environment';

export class Constants {
	public static readonly REST_URL = environment.restUrl;
	public static readonly SUPERVISOR_URL = Constants.REST_URL + '/supervisors';
	public static readonly SUBMIT_URL = Constants.REST_URL + '/submit';
}
