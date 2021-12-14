import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container } from "semantic-ui-react";
import { Activity } from "../models/Activity";
import NavBar from "./NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import { v4 as uuid } from "uuid";

function App() {
	const [activities, setActivities] = useState<Activity[]>([]);
	const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
	const [editMode, setEditMode] = useState(false);

	// fetch activities from API server
	useEffect(() => {
		axios.get<Activity[]>("http://localhost:5000/api/activities").then((response) => {
			setActivities(response.data);
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
		activity.id ? setActivities([...activities.filter((x) => x.id !== activity.id), activity]) : setActivities([...activities, { ...activity, id: uuid() }]);
		setEditMode(false);
		setSelectedActivity(activity);
	}

	function HandleDeleteActivity(id: string) {
		setActivities([...activities.filter((x) => x.id !== id)]);
	}

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
				></ActivityDashboard>
			</Container>
		</>
	);
}

export default App;
