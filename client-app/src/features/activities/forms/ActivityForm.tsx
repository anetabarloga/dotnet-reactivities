import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { Button, Header, Segment } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";
import { Link } from "react-router-dom";
import { Formik, Form } from "formik";
import { v4 as uuid } from "uuid";
import * as yup from "yup";
import CommonTextInput from "../../../app/common/forms/CommonTextInput";
import CommonTextArea from "../../../app/common/forms/CommonTextArea";
import DropdownInput from "../../../app/common/forms/DropdownInput";
import { categories } from "../../../app/common/enums/categories";
import DateInput from "../../../app/common/forms/DateInput";
import { ActivityFormValues } from "../../../app/models/activity";

export default observer(function ActivityForm() {
	const history = useHistory();
	const { activityStore } = useStore();
	const { createActivity, loadActivity, updateActivity, loadingInitial } = activityStore;
	const { id } = useParams<{ id: string }>();

	const [activity, setActivity] = useState<ActivityFormValues>(new ActivityFormValues());

	const validationSchema = yup.object({
		title: yup.string().required("Please enter the title!"),
		category: yup.string().required(),
		description: yup.string().required(),
		date: yup.string().required("Please enter a valid date!").nullable(),
		city: yup.string().required(),
		venue: yup.string().required(),
	});

	useEffect(() => {
		if (id) loadActivity(id).then((activity) => setActivity(new ActivityFormValues(activity)));
	}, [id, loadActivity]); // by adding dependencies we only execute code if any of the dependencies changed

	function handleFormSubmit(activity: ActivityFormValues) {
		if (!activity.id) {
			let newActivity = { ...activity, id: uuid() };
			createActivity(newActivity).then(() => history.push(`/activities/${newActivity.id}`));
		} else {
			updateActivity(activity).then(() => history.push(`/activities/${activity.id}`));
		}
	}

	if (loadingInitial) return <LoadingComponent content="Loading activity..." />;

	return (
		<Segment clearing>
			<Header content="Activity details" sub color="teal"></Header>
			<Formik validationSchema={validationSchema} enableReinitialize initialValues={activity} onSubmit={(values) => handleFormSubmit(values)}>
				{({ handleSubmit, isValid, isSubmitting, dirty }) => (
					<Form className="ui form" onSubmit={handleSubmit} autoComplete="false">
						<CommonTextInput placeholder="Title" name="title" />
						<CommonTextArea placeholder="Description" name="description" />
						<DropdownInput options={categories} placeholder="Select a category" name="category" />
						<DateInput placeholderText="Date" name="date" showTimeSelect timeCaption="time" dateFormat="MMMM d, yyyy h:mm aa" />
						<Header content="Location details" sub color="teal" />
						<CommonTextInput placeholder="City" name="city" />
						<CommonTextInput placeholder="Venue" name="venue" />
						<Button disabled={isSubmitting || !dirty || !isValid} loading={isSubmitting} floated="right" positive type="submit" content="Submit" />
						<Button as={Link} to={"/activities"} loading={isSubmitting} floated="right" type="button" content="Cancel" />
					</Form>
				)}
			</Formik>
		</Segment>
	);
});
