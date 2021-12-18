import { useField } from "formik";
import React from "react";
import { Form, Label } from "semantic-ui-react";

interface Props {
	name: string;
	placeholder: string;
	label?: string;
	type?: string;
}

export default function CommonTextInput(props: Props) {
	// bind the name to the field input
	const [field, meta] = useField(props.name);
	return (
		<Form.Field error={meta.touched && !!meta.error}>
			<label>{props.label}</label>
			<input {...field} {...props} />
			{meta.touched && meta.error ? (
				<Label basic color="red">
					{" "}
					{meta.error}{" "}
				</Label>
			) : null}
		</Form.Field>
	);
}
