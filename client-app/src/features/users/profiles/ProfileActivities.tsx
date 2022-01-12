import { observer } from "mobx-react-lite";
import { SyntheticEvent, useEffect } from "react";
import { Card, Grid, Header, Tab, TabProps } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import ActivityCard from "./ActivityCard";

export default observer(function ProfileActivities() {
	const {
		profileStore: { loadingActivities, loadActivities, activities, profile },
	} = useStore();

	const panes = [
		{ menuItem: "Future Events", pane: { key: "future" } },
		{ menuItem: "Past Events", pane: { key: "past" } },
		{ menuItem: "Hosting", pane: { key: "hosting" } },
	];

	useEffect(() => {
		loadActivities(profile!.username);
	}, [loadActivities, profile]);

	const handleTabChange = (e: SyntheticEvent, data: TabProps) => {
		loadActivities(profile!.username, panes[data.activeIndex as number].pane.key);
	};

	return (
		<>
			<Tab.Pane loading={loadingActivities}>
				<Grid>
					<Grid.Column width={16}>
						<Header floated="left" icon="calendar" content={"Activities"} />
					</Grid.Column>
					<Grid.Column width={16}>
						<Tab
							menu={{ secondary: true, pointing: true }}
							panes={panes}
							onTabChange={(e, data) => {
								handleTabChange(e, data);
							}}
						/>
						<br />
						<Card.Group itemsPerRow={4}>
							{activities.map((activity) => (
								<ActivityCard key={activity.id} activity={activity} />
							))}
						</Card.Group>
					</Grid.Column>
				</Grid>
			</Tab.Pane>
		</>
	);
});
