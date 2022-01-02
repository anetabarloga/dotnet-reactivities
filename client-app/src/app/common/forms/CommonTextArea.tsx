import { useField } from "formik";
import React from "react";
import { Form, Label } from "semantic-ui-react";

interface Props {
	name: string;
	placeholder: string;
	label?: string;
	rows?: number;
}

export default function CommonTextArea(props: Props) {
	// bind the name to the field input
	const [field, meta] = useField(props.name);
	return (
		<Form.Field error={meta.touched && !!meta.error}>
			<label>{props.label}</label>
			<textarea {...field} {...props} rows={props.rows} />
			{meta.touched && meta.error ? (
				<Label basic color="red">
					{" "}
					{meta.error}{" "}
				</Label>
			) : null}
		</Form.Field>
	);
}
