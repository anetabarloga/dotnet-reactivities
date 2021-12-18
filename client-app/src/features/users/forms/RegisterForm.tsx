import { ErrorMessage, Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import React from "react";
import { Button, Header, Label } from "semantic-ui-react";
import CommonTextInput from "../../../app/common/forms/CommonTextInput";
import { useStore } from "../../../app/stores/store";
import * as yup from "yup";
import ValidationErrors from "../../errors/ValidationErrors";

export default observer(function RegisterForm() {
	const { userStore } = useStore();

	return (
		<Formik
			initialValues={{ displayName: "", username: "", email: "", password: "", error: null }}
			onSubmit={(values, { setErrors }) => userStore.register(values).catch((error) => setErrors({ error }))}
			validationSchema={yup.object({
				displayName: yup.string().required(),
				username: yup.string().required(),
				email: yup.string().required().email(),
				password: yup.string().required(),
			})}
		>
			{({ handleSubmit, isSubmitting, errors, isValid, dirty }) => (
				<Form className="ui form error" onSubmit={handleSubmit} autoComplete="off">
					<Header as="h3" content="Registration" textAlign="center" />
					<CommonTextInput name="email" placeholder="Email" />
					<CommonTextInput name="displayName" placeholder="Display name" />
					<CommonTextInput name="username" placeholder="Username" />
					<CommonTextInput name="password" placeholder="Password" type="password" />
					<ErrorMessage name="error" render={() => <ValidationErrors errors={errors.error} />} />
					<Button disabled={!isValid || !dirty || isSubmitting} loading={isSubmitting} positive content="Sign Up" type="submit" fluid />
				</Form>
			)}
		</Formik>
	);
});
