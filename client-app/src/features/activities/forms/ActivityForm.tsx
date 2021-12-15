import { observer } from "mobx-react-lite";
import React, { ChangeEvent, useState } from "react";
import { Button, Form, Segment } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";

export default observer(function ActivityForm() {
	const { activityStore } = useStore();
	const { closeForm, selectedActivity, createActivity, updateActivity, loading } = activityStore;

	const initialState = selectedActivity ?? {
		id: "",
		title: "",
		category: "",
		description: "",
		date: "",
		city: "",
		venue: "",
	};

	const [activity, setActivity] = useState(initialState);

	function HandleSubmit() {
		activity.id ? updateActivity(activity) : createActivity(activity);
	}

	function HandleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
		const { name, value } = event.target;

		//use elypsis to decosntruct activity attributes and set property with the key of on to value
		setActivity({ ...activity, [name]: value });
	}

	return (
		<Segment clearing>
			<Form onSubmit={HandleSubmit} autocomplete="false">
				<Form.Input placeholder="Title" value={activity.title} name="title" onChange={HandleInputChange} />
				<Form.TextArea placeholder="Description" value={activity.description} name="description" onChange={HandleInputChange} />
				<Form.Input placeholder="Category" value={activity.category} name="category" onChange={HandleInputChange} />
				<Form.Input type="date" placeholder="Date" value={activity.date} name="date" onChange={HandleInputChange} />
				<Form.Input placeholder="City" value={activity.city} name="city" onChange={HandleInputChange} />
				<Form.Input placeholder="Venue" value={activity.venue} name="venue" onChange={HandleInputChange} />
				<Button loading={loading} onClick={HandleSubmit} floated="right" positive content="Submit" />
				<Button loading={loading} onClick={closeForm} floated="right" type="submit" content="Cancel" />
			</Form>
		</Segment>
	);
});
