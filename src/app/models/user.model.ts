import { Manager } from './manager.model';

export class User {
	firstName?: string;
	lastName?: string;
	email?: string;
	phoneNumber?: string;
	supervisor?: Manager;
}
