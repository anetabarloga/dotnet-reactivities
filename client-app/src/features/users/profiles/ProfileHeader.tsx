import { observer } from "mobx-react-lite";
import React from "react";
import { Button, Divider, Grid, Header, Item, Reveal, Segment, Statistic } from "semantic-ui-react";
import { Profile } from "../../../app/models/Profile";

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
						<Statistic label="Following" value="5" />
						<Statistic label="Followers" value="20" />
					</Statistic.Group>
					<Divider></Divider>
					<Reveal animated="move">
						<Reveal.Content visible style={{ width: "100%" }}>
							<Button fluid color="teal" content="Following" />
						</Reveal.Content>
						<Reveal.Content hidden style={{ width: "100%" }}>
							<Button fluid color={true ? "red" : "green"} content={true ? "Unfollow" : "Follow"} />
						</Reveal.Content>
					</Reveal>
				</Grid.Column>
			</Grid>
		</Segment>
	);
});
