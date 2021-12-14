import React, { useState, useEffect } from "react";
import { Container } from "semantic-ui-react";
import { Activity } from "../models/Activity";
import NavBar from "./NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import { v4 as uuid } from "uuid";
import agent from "../api/agent";
import LoadingComponent from "./LoadingComponent";

function App() {
	const [activities, setActivities] = useState<Activity[]>([]);
	const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
	const [editMode, setEditMode] = useState(false);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);

	// fetch activities from API server
	useEffect(() => {
		agent.Activities.list().then((response) => {
			// update date format
			let activities: Activity[] = [];

			response.forEach((activity) => {
				activity.date = activity.date.split("T")[0];
				activities.push(activity);
			});

			setActivities(response);
			setLoading(false);
		});
	}, []); // array of dependencies that ensures that this doesn't run in infinite loop with use state which gets triggered every times state changes and cascades to use effect. Works also if passed empty array with no dependencies.

	function HandleSelectActivity(id: string) {
		setSelectedActivity(activities.find((act) => act.id === id));
	}

	function HandleCancelSelectActivity() {
		setSelectedActivity(undefined);
	}

	function HandleFormOpen(id?: string) {
		id ? HandleSelectActivity(id) : HandleCancelSelectActivity();
		setEditMode(true);
	}

	function HandleFormClose() {
		setEditMode(false);
	}

	function HandleCreateOrEditActivity(activity: Activity) {
		setSubmitting(true);

		if (activity.id) {
			agent.Activities.update(activity).then(() => {
				setActivities([...activities.filter((x) => x.id !== activity.id), activity]);
				setSelectedActivity(activity);
				setEditMode(false);
				setSubmitting(false);
			});
		} else {
			activity.id = uuid();
			agent.Activities.create(activity).then(() => {
				setActivities([...activities, activity]);
				setSelectedActivity(activity);
				setEditMode(false);
				setSubmitting(false);
			});
		}
	}

	function HandleDeleteActivity(id: string) {
		setSubmitting(true);
		agent.Activities.delete(id).then(() => {
			setActivities([...activities.filter((x) => x.id !== id)]);
			setSubmitting(false);
		});
	}

	if (loading) return <LoadingComponent />;
	return (
		<>
			<NavBar openForm={HandleFormOpen} />
			<Container style={{ marginTop: "8em" }}>
				<ActivityDashboard
					activities={activities}
					selectedActivity={selectedActivity}
					selectActivity={HandleSelectActivity}
					deleteActivity={HandleDeleteActivity}
					cancelActivity={HandleCancelSelectActivity}
					editMode={editMode}
					openForm={HandleFormOpen}
					closeForm={HandleFormClose}
					createOrEdit={HandleCreateOrEditActivity}
					submitting={submitting}
				></ActivityDashboard>
			</Container>
		</>
	);
}

export default App;
