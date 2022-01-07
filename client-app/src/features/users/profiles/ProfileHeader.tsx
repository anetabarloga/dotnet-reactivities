import { observer } from "mobx-react-lite";
import React from "react";
import { Divider, Grid, Header, Item, Segment, Statistic } from "semantic-ui-react";
import { Profile } from "../../../app/models/Profile";
import FollowButton from "./FollowButton";

interface Props {
	profile: Profile;
}

export default observer(function ProfileHeader({ profile }: Props) {
	return (
		<Segment>
			<Grid>
				<Grid.Column width={12}>
					<Item.Group>
						<Item>
							<Item.Image src={profile ? profile.image : "/assets/user.png"} />
							<Item.Content verticalAlign="middle">
								<Header>{profile.displayName}</Header>
							</Item.Content>
						</Item>
					</Item.Group>
				</Grid.Column>
				<Grid.Column width={4}>
					<Statistic.Group>
						<Statistic label="Following" value={profile.followingsCount} />
						<Statistic label={profile.followersCount === 1 ? "Follower" : "Followers"} value={profile.followersCount} />
					</Statistic.Group>
					<Divider></Divider>
					<FollowButton profile={profile} />
				</Grid.Column>
			</Grid>
		</Segment>
	);
});
