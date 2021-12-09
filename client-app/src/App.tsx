import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import { Header, List, ListItem } from "semantic-ui-react";

function App() {
	const [activities, setActivities] = useState([]);

	// fetch activities from API server
	useEffect(() => {
		axios.get("http://localhost:5000/api/activities").then((response) => {
			setActivities(response.data);
		});
	}, []); // arry of dependencies that ensures that this doesn't run in infinite loop with use state which gets triggered every times state changes and cascades to use effect. Works also if passed empty array with no dependencies.

	return (
		<div>
			<Header as="h2" icons="users" content="Reactivities" />
			<List>
				{activities.map((activity: any) => (
					<ListItem key={activity.id}>{activity.title}</ListItem>
				))}
			</List>
		</div>
	);
}

export default App;
