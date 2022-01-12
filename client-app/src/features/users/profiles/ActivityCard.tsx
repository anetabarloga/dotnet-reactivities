import { format } from "date-fns";
import React from "react";
import { Link } from "react-router-dom";
import { Card, Image } from "semantic-ui-react";
import { UserActivity } from "../../../app/models/Profile";

interface Props {
	activity: UserActivity;
}

export default function ActivityCard({ activity }: Props) {
	return (
		<>
			<Card as={Link} to={`/activities/${activity.id}`} key={activity.id}>
				<Image src={`/assets/categoryImages/${activity.category}.jpg`} style={{ minHeight: 100, objectFit: "cover" }} />
				<Card.Content>
					<Card.Header>{activity.title}</Card.Header>
					<Card.Meta textAlign="center">
						<div>{format(new Date(activity.date), "do LLLL")}</div>
						<div>{format(new Date(activity.date), "h:mm aa")}</div>
					</Card.Meta>
				</Card.Content>
			</Card>
		</>
	);
}
