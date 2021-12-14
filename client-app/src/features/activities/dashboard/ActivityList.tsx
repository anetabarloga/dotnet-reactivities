import React, { SyntheticEvent, useState } from "react";
import { Button, Item, Label, Segment } from "semantic-ui-react";
import { Activity } from "../../../app/models/Activity";

interface Props {
	activities: Activity[];
	selectActivity: (id: string) => void;
	deleteActivity: (id: string) => void;
	submitting: boolean;
}

export default function ActivityList({ activities, selectActivity, deleteActivity, submitting }: Props) {
	const [target, setTarget] = useState("");

	function HandleActivityDelete(e: SyntheticEvent<HTMLButtonElement>, id: string) {
		setTarget(e.currentTarget.name);
		deleteActivity(id);
	}

	return (
		<Segment>
			<Item.Group divided>
				{activities.map((activity) => {
					return (
						<Item key={activity.id}>
							<Item.Content>
								<Item.Header as="a">{activity.title}</Item.Header>
								<Item.Meta>{activity.date}</Item.Meta>
								<Item.Description>
									<div>{activity.description}</div>
									<div>
										{activity.city}, {activity.venue}
									</div>
								</Item.Description>
								<Item.Extra>
									<Button onClick={() => selectActivity(activity.id)} floated="right" content="View" color="blue" />
									<Label basic content={activity.category} />
									<Button name={activity.id} loading={submitting && target === activity.id} onClick={(e) => HandleActivityDelete(e, activity.id)} floated="right" content="Delete" color="red" />
								</Item.Extra>
							</Item.Content>
						</Item>
					);
				})}
			</Item.Group>
		</Segment>
	);
}
