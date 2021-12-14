import React from "react";
import { Grid } from "semantic-ui-react";
import { Activity } from "../../../app/models/Activity";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../forms/ActivityForm";
import ActivityList from "./ActivityList";

interface Props {
	activities: Activity[];
	selectedActivity: Activity | undefined;
	selectActivity: (id: string) => void;
	deleteActivity: (id: string) => void;
	cancelActivity: () => void;
	editMode: boolean;
	openForm: (id: string) => void; // id doesn't have to be nullable here because if we pass it to activity detail it means it for sure exists
	closeForm: () => void;
	createOrEdit: (activity: Activity) => void;
	submitting: boolean;
}

export default function ActivityDashboard({
	activities,
	selectActivity,
	cancelActivity,
	selectedActivity,
	editMode,
	openForm,
	closeForm,
	createOrEdit,
	deleteActivity,
	submitting,
}: Props) {
	return (
		<Grid>
			<Grid.Column width="10">
				<ActivityList
					activities={activities}
					selectActivity={selectActivity}
					deleteActivity={deleteActivity}
					submitting={submitting}
				/>
			</Grid.Column>
			<Grid.Column width="6">
				{selectedActivity && !editMode && (
					<ActivityDetails
						activity={selectedActivity}
						cancelSelectActivity={cancelActivity}
						openForm={openForm}
					/>
				)}
				{editMode && (
					<ActivityForm
						closeForm={closeForm}
						activity={selectedActivity}
						createOrEdit={createOrEdit}
						submitting={submitting}
					/>
				)}
			</Grid.Column>
		</Grid>
	);
}
