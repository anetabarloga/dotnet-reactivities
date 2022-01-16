import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { User, UserFormValues } from "../models/User";
import { store } from "./store";
import { history } from "../..";

export default class UserStore {
	user: User | null = null;
	fbAccessToken: string | null = null;
	fbLoading = false;

	constructor() {
		makeAutoObservable(this);
	}

	get isLoggedIn() {
		return !!this.user;
	}

	login = async (creds: UserFormValues) => {
		try {
			const user = await agent.Account.login(creds);
			store.commonStore.setToken(user.token);
			runInAction(() => (this.user = user));
			history.push("/activities");
			store.modalStore.closeModal();
		} catch (error) {
			throw error;
		}
	};

	// set to async to make sure we return a Promise
	getFacebookLoginStatus = async () => {
		window.FB.getLoginStatus((response) => {
			if (response.status === "connected") {
				this.fbAccessToken = response.authResponse.accessToken;
			}
		});
	};

	facebookLogin = () => {
		this.fbLoading = true;
		const apiLogin = (accessToken: string) => {
			agent.Account.fbLogin(accessToken)
				.then((user) => {
					store.commonStore.setToken(user.token);
					runInAction(() => {
						this.user = user;
						this.fbLoading = false;
					});
					history.push("/activities");
				})
				.catch((error) => {
					console.log(error);
					runInAction(() => (this.fbLoading = false));
				});
		};

		if (this.fbAccessToken) {
			apiLogin(this.fbAccessToken);
		} else {
			window.FB.login(
				(response) => {
					apiLogin(response.authResponse.accessToken);
				},
				{ scope: "public_profile,email" }
			);
		}
	};

	logout = () => {
		store.commonStore.setToken(null);
		window.localStorage.removeItem("jwt");
		this.user = null;
		history.push("/");
	};

	register = async (creds: UserFormValues) => {
		try {
			const user = await agent.Account.register(creds);
			store.commonStore.setToken(user.token);
			runInAction(() => (this.user = user));
			history.push("/activities");
			store.modalStore.closeModal();
		} catch (error) {
			throw error;
		}
	};

	getUser = async () => {
		try {
			const user = await agent.Account.current();
			runInAction(() => (this.user = user));
		} catch (error) {
			console.log(error);
		}
	};

	setImage = (image: string) => {
		if (this.user) this.user.image = image;
	};

	setDisplayName = (name: string) => {
		if (this.user) this.user.displayName = name;
	};
}
