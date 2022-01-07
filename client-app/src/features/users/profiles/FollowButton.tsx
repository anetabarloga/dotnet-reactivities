import { observer } from "mobx-react-lite";
import React, { SyntheticEvent } from "react";
import { Button, Reveal } from "semantic-ui-react";
import { Profile } from "../../../app/models/Profile";
import { useStore } from "../../../app/stores/store";

interface Props {
	profile: Profile;
}

export default observer(function FollowButton({ profile }: Props) {
	const { profileStore, userStore } = useStore();
	const { updateFollowing, loadingProfile } = profileStore;

	function handleFollow(e: SyntheticEvent, username: string) {
		// prevent button from opening user profile
		e.preventDefault();
		updateFollowing(username, !profile.following);
	}

	// dont display button if reviewing own profile
	if (userStore.user?.username === profile.username) return null;
	return (
		<Reveal animated="move">
			<Reveal.Content visible style={{ width: "100%" }}>
				<Button fluid color="teal" content={profile.following ? "Following" : "Not following"} />
			</Reveal.Content>
			<Reveal.Content hidden style={{ width: "100%" }}>
				<Button
					fluid
					basic
					loading={loadingProfile}
					onClick={(e) => handleFollow(e, profile.username)}
					color={profile.following ? "red" : "green"}
					content={profile.following ? "Unfollow" : "Follow"}
				/>
			</Reveal.Content>
		</Reveal>
	);
});
