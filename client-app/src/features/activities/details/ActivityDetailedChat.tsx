import { Field, FieldProps, Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Segment, Header, Comment, Loader } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import * as yup from "yup";
import { formatDistanceToNow } from "date-fns";

interface Props {
	activityId: string;
}

export default observer(function ActivityDetailedChat({ activityId }: Props) {
	const { commentStore } = useStore();

	useEffect(() => {
		if (activityId) {
			commentStore.createHubConnection(activityId);
		}

		// cleanup all comments and stop hub connection when compoment gets destroyed
		return () => {
			commentStore.clearComments();
		};
	}, [commentStore, activityId]);

	return (
		<>
			<Segment textAlign="center" attached="top" inverted color="teal" style={{ border: "none" }}>
				<Header>Chat about this event</Header>
			</Segment>
			<Segment attached clearing>
				<Formik
					onSubmit={(values, { resetForm }) => commentStore.addComment(values).then(() => resetForm())}
					initialValues={{ body: "" }}
					validationSchema={yup.object({ body: yup.string().required() })}
				>
					{({ isSubmitting, isValid, handleSubmit }) => (
						<Form className="ui form">
							<Field name="body">
								{(props: FieldProps) => (
									<div style={{ position: "relative" }}>
										<Loader active={isSubmitting} />
										<textarea
											placeholder="Add a comment (ENTER to submit)"
											rows={2}
											{...props.field}
											onKeyPress={(e) => {
												if (e.key === "Enter") {
													if (e.shiftKey) {
														return;
													} else {
														e.preventDefault(); // prvent starting new line
														isValid && handleSubmit();
													}
												}
											}}
										/>
									</div>
								)}
							</Field>
						</Form>
					)}
				</Formik>
				<Comment.Group>
					{commentStore.comments.map((comment) => (
						<Comment key={comment.id}>
							<Comment.Avatar src={comment.image || "/assets/user.png"} />
							<Comment.Content>
								<Comment.Author as={Link} to={`/profiles/${comment.username}`}>
									{comment.displayName}
								</Comment.Author>
								<Comment.Metadata>
									<div>{formatDistanceToNow(comment.createdAt)}</div>
								</Comment.Metadata>
								<Comment.Text style={{ whiteSpace: "pre-wrap" }}>{comment.body}</Comment.Text>
							</Comment.Content>
						</Comment>
					))}
				</Comment.Group>
			</Segment>
		</>
	);
});
