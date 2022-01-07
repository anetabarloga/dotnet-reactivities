import React from "react";
import { Link } from "react-router-dom";
import { Card, Icon, Image } from "semantic-ui-react";
import { Profile } from "../../../app/models/Profile";
import FollowButton from "./FollowButton";

interface Props {
	profile: Profile;
}

export default function ProfileCard({ profile }: Props) {
	return (
		<Card as={Link} to={`/profiles/${profile.username}`}>
			<Image src={profile.image || "/assets/user.png"} />
			<Card.Content>
				<Card.Header>{profile.displayName}</Card.Header>
				<Card.Description>{profile.bio}</Card.Description>
			</Card.Content>
			<Card.Content extra>
				<Icon name="user" />
				{profile.followersCount} {profile.followersCount === 1 ? "Follower" : "Followers"}
			</Card.Content>
			<FollowButton profile={profile} />
		</Card>
	);
}
