import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { Button, Divider, Grid, Header, Tab } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import ProfileEditForm from "../forms/ProfileEditForm";

export default observer(function ProfileFollowings() {
	const {
		profileStore: { isCurrentUser, profile },
	} = useStore();
	const [editProfileMode, setEditProfileMode] = useState(false);

	return (
		<Tab.Pane>
			<Grid>
				<Grid.Column width={16}>
					<Header floated="left" icon="user" content={`About ${profile?.displayName}`} />
					{isCurrentUser && <Button floated="right" basic content={editProfileMode ? "Cancel" : "Edit"} onClick={() => setEditProfileMode(!editProfileMode)} />}
				</Grid.Column>
				<Grid.Column width={16}>
					{editProfileMode ? (
						<ProfileEditForm setEditMode={setEditProfileMode} />
					) : (
						<>
							<div>{profile?.bio}</div>
							<Divider />
						</>
					)}
				</Grid.Column>
			</Grid>
		</Tab.Pane>
	);
});
