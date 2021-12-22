import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Photo, Profile } from "../models/Profile";
import { store } from "./store";

export default class ProfileStore {
	profile: Profile | null = null;
	loadingProfile = false;
	uploading = false;
	loadingPhoto = false;

	constructor() {
		makeAutoObservable(this);
	}

	get isCurrentUser() {
		if (store.userStore.user && this.profile) {
			return store.userStore.user.username === this.profile.username;
		}
		return false;
	}

	loadProfile = async (username: string) => {
		this.loadingProfile = true;
		try {
			const profile = await agent.Profiles.get(username);
			runInAction(() => {
				this.profile = profile;
				this.loadingProfile = false;
			});
		} catch (error) {
			console.log(error);
			runInAction(() => (this.loadingProfile = false));
		}
	};

	uploadPhoto = async (file: Blob) => {
		this.uploading = true;
		try {
			const response = await agent.Profiles.uploadPhoto(file);
			const photo = response.data;
			runInAction(() => {
				if (this.profile) {
					this.profile.photos?.push(photo);
					if (photo.isMain && store.userStore.user) {
						store.userStore.setImage(photo.url);
						this.profile.image = photo.url;
					}
				}
				this.uploading = false;
			});
		} catch (error) {
			console.log(error);
			runInAction(() => (this.uploading = false));
		}
	};

	setMainPhoto = async (photo: Photo) => {
		this.loadingPhoto = true;
		try {
			await agent.Profiles.setMainPhoto(photo.id); // there was an await here
			store.userStore.setImage(photo.id);
			runInAction(() => {
				// reset current main photo
				if (this.profile && this.profile.photos) {
					this.profile.photos.find((p) => p.isMain)!.isMain = false;
					this.profile.photos.find((p) => p.id === photo.id)!.isMain = true;
					this.profile.image = photo.url;
				}
			});
		} catch (error) {
			console.log(error);
		} finally {
			runInAction(() => (this.loadingPhoto = false));
		}
	};

	deletePhoto = async (photo: Photo) => {
		this.loadingPhoto = true;
		try {
			await agent.Profiles.deletePhoto(photo.id);
			runInAction(() => {
				if (this.profile && this.profile.photos) {
					this.profile.photos = this.profile.photos.filter((p) => p.id !== photo.id);
					this.loadingPhoto = false;
				}
			});
		} catch (error) {
			console.log(error);
			runInAction(() => (this.loadingPhoto = false));
		}
	};
}
