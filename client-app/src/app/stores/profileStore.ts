import { makeAutoObservable, reaction, runInAction } from "mobx";
import agent from "../api/agent";
import { Photo, Profile } from "../models/Profile";
import { store } from "./store";

export default class ProfileStore {
	profile: Profile | null = null;
	loadingProfile = false;
	loadingPhoto = false;
	loadingFollowings = false;
	uploading = false;
	followings: Profile[] = [];
	activeTab = 0;

	constructor() {
		makeAutoObservable(this);

		reaction(
			() => this.activeTab,
			(activeTab) => {
				if (activeTab === 3 || activeTab === 4) {
					const predicate = activeTab === 3 ? "followers" : "following";
					this.loadFollowings(predicate);
				} else {
					this.followings = [];
				}
			}
		);
	}

	setActiveTab = (tab: any) => {
		this.activeTab = tab;
	};

	get isCurrentUser() {
		if (store.userStore.user && this.profile) {
			return store.userStore.user.username === this.profile.username;
		}
		return false;
	}

	loadProfile = async (username: string) => {
		this.loadingProfile = true;
		try {
			const profile = await agent.Profiles.getProfile(username);
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

	updateFollowing = async (username: string, shouldFollow: boolean) => {
		this.loadingProfile = true;
		try {
			await agent.Profiles.updateFollowings(username);
			store.activityStore.updateAttendeeFollowing(username);

			runInAction(() => {
				// check if updating for current or other user

				// if updating for other user,
				if (this.profile && this.profile.username !== store.userStore.user?.username && this.profile.username !== username) {
					shouldFollow ? this.profile.followersCount++ : this.profile.followersCount--;
					this.profile.following = !this.profile.following;
				}
				if (this.profile && this.profile.username === store.userStore.user?.username) {
					shouldFollow ? this.profile.followingsCount++ : this.profile.followingsCount--;
				}
				this.followings.forEach((profile) => {
					if (profile.username === username) {
						profile.following ? profile.followersCount-- : profile.followersCount++;
						profile.following = !profile.following;
					}
				});
				this.loadingProfile = false;
			});
		} catch (error) {
			console.log(error);
			runInAction(() => (this.loadingProfile = false));
		}
	};

	loadFollowings = async (predicate: string) => {
		this.loadingFollowings = true;
		try {
			const followings = await agent.Profiles.listFollowings(this.profile!.username, predicate);
			runInAction(() => {
				this.followings = followings;
				this.loadingFollowings = false;
			});
		} catch (error) {
			runInAction(() => (this.loadingFollowings = false));
		}
	};
}
