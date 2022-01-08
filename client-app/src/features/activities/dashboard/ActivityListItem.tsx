import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Button, Icon, Item, Label, Segment } from "semantic-ui-react";
import { Activity } from "../../../app/models/Activity";
import ActivityListItemAttendee from "./ActivityListItemAttendee";

interface Props {
	activity: Activity;
}

export default function ActivityListItem({ activity }: Props) {
	return (
		<Segment.Group>
			<Segment>
				{activity.isCancelled && <Label attached="top" color="red" content="Cancelled" />}
				<Item.Group>
					<Item>
						<Item.Image style={{ marginBottom: "3" }} size="tiny" circular src={activity.host?.image || "/assets/user.png"} />
						<Item.Content>
							<Item.Header as={Link} to={`/activities/${activity.id}`}>
								{activity.title}
							</Item.Header>
							<Item.Description>
								Hosted by <Link to={`/profiles/${activity.host?.username}`}>{activity.host?.displayName}</Link>
							</Item.Description>
							{activity.isHost && (
								<Label basic color="orange">
									You are hosting this activity
								</Label>
							)}
							{!activity.isHost && activity.isGoing && (
								<Label basic color="green">
									You are going to this activity
								</Label>
							)}
						</Item.Content>
					</Item>
				</Item.Group>
			</Segment>
			<Segment>
				<span>
					<Icon name="clock" /> {format(activity.date!, "dd MMM yyyy h:mm aa")}
					<Icon name="marker" /> {activity.venue}
				</span>
			</Segment>
			<Segment secondary>
				<ActivityListItemAttendee attendees={activity.attendees!} />
			</Segment>
			<Segment clearing>
				<Item.Description>{activity.description}</Item.Description>
				<Button as={Link} to={`/activities/${activity.id}`} color="teal" floated="right" content="view" />
			</Segment>
		</Segment.Group>
	);
}
