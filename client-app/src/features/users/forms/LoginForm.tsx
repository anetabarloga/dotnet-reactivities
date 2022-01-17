import { ErrorMessage, Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import React from "react";
import { Button, Header, Label } from "semantic-ui-react";
import CommonTextInput from "../../../app/common/forms/CommonTextInput";
import { useStore } from "../../../app/stores/store";

export default observer(function LoginForm() {
	const { userStore } = useStore();

	return (
		<Formik initialValues={{ email: "", password: "", error: null }} onSubmit={(values, { setErrors }) => userStore.login(values).catch((error) => setErrors({ error: error.response.data }))}>
			{({ handleSubmit, isSubmitting, errors }) => (
				<Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
					<Header as="h3" content="Login" textAlign="center" />
					<CommonTextInput name="email" placeholder="Email" />
					<CommonTextInput name="password" placeholder="Password" type="password" />
					<ErrorMessage name="error" render={() => <Label style={{ marginBottom: "10px" }} color="red" content={errors.error} />} />
					<Button loading={isSubmitting} positive content="Login" type="submit" fluid />
				</Form>
			)}
		</Formik>
	);
});
