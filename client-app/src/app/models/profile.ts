import { User } from "./User";

export interface UserActivity {
	id: string;
	title: string;
	date: Date;
	category: string;
}

export interface Profile {
	username: string;
	displayName: string;
	image?: string;
	bio?: string;
	followersCount: number;
	followingsCount: number;
	following: boolean;
	photos?: Photo[];
}

export class Profile implements Profile {
	constructor(user: User) {
		this.username = user.username;
		this.displayName = user.displayName;
		this.image = user.image;
	}
}

export interface Photo {
	id: string;
	url: string;
	isMain: boolean;
}
