import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Button, Icon, Item, Segment } from "semantic-ui-react";
import { Activity } from "../../../app/models/Activity";

interface Props {
	activity: Activity;
}

export default function ActivityListItem({ activity }: Props) {
	return (
		<Segment.Group>
			<Segment>
				<Item.Group>
					<Item>
						<Item.Image size="tiny" circular src="/assets/user.png" />
						<Item.Content>
							<Item.Header as={Link} to={`/activities/${activity.id}`}>
								{activity.title}
							</Item.Header>
							<Item.Description>Hosted by Joe Goldberg</Item.Description>
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
			<Segment secondary>Attendees will go here!</Segment>
			<Segment clearing>
				<Item.Description>{activity.description}</Item.Description>
				<Button as={Link} to={`/activities/${activity.id}`} color="teal" floated="right" content="view" />
			</Segment>
		</Segment.Group>
	);
}
