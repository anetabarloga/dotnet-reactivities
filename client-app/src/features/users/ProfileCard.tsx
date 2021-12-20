import React from "react";
import { Card, Icon, Image } from "semantic-ui-react";
import { Profile } from "../../app/models/Profile";

interface Props {
	profile: Profile;
}

export default function ProfileCard({ profile }: Props) {
	return (
		<Card>
			<Image src={profile.image || "/assets/user.png"} />
			<Card.Content>
				<Card.Header>{profile.displayName}</Card.Header>
				<Card.Description>This will be a bio</Card.Description>
			</Card.Content>
			<Card.Content extra>
				<Icon name="user" />
				20 Followers
			</Card.Content>
		</Card>
	);
}
