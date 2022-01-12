import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { makeAutoObservable, runInAction } from "mobx";
import { ChatComment } from "../models/comment";
import { store } from "./store";

export default class CommentStore {
	comments: ChatComment[] = [];
	hubConnection: HubConnection | null = null;

	constructor() {
		makeAutoObservable(this);
	}

	createHubConnection = (activityId: string) => {
		if (store.activityStore.selectedActivity) {
			this.hubConnection = new HubConnectionBuilder()
				.withUrl(`${process.env.REACT_APP_CHAT_URL}?activityId=${activityId}`, {
					accessTokenFactory: () => store.userStore.user?.token!,
				})
				.withAutomaticReconnect()
				.configureLogging(LogLevel.Information)
				.build();

			this.hubConnection.start().catch((e) => console.log("Error creating chat hub connection: ", e));

			// receive all comments to selected activity
			this.hubConnection.on("LoadComments", (comments: ChatComment[]) => {
				runInAction(() => {
					comments.forEach((comment) => {
						comment.createdAt = new Date(comment.createdAt.toString().split("+")[0] + "Z");
					});
					this.comments = comments;
				});
			});

			this.hubConnection.on("ReceiveComment", (comment: ChatComment) => {
				runInAction(() => {
					comment.createdAt = new Date(comment.createdAt);
					this.comments.unshift(comment);
				});
			});
		}
	};

	stopHubConnection = () => {
		this.hubConnection?.stop().catch((e) => console.log("Error stopping hub connection: ", e));
	};

	clearComments = () => {
		this.comments = [];
		this.stopHubConnection();
	};

	addComment = async (values: any) => {
		values.activityId = store.activityStore.selectedActivity?.id;

		try {
			await this.hubConnection?.invoke("SendComment", values);
		} catch (error) {
			console.log(error);
		}
	};
}
