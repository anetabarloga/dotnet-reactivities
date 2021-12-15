import React, { useEffect } from "react";
import { Container } from "semantic-ui-react";
import NavBar from "./NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import LoadingComponent from "./LoadingComponent";
import { useStore } from "../stores/store";
import { observer } from "mobx-react-lite";

function App() {
	const { activityStore } = useStore();

	// fetch activities from API server
	useEffect(() => {
		activityStore.loadActivities();
	}, [activityStore]);

	if (activityStore.loadingInitial) return <LoadingComponent />;
	return (
		<>
			<NavBar />
			<Container style={{ marginTop: "8em" }}>
				<ActivityDashboard />
			</Container>
		</>
	);
}

export default observer(App);
