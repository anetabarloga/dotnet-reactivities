import { useField } from "formik";
import React from "react";
import { Form, Label, Select } from "semantic-ui-react";

interface Props {
	name: string;
	placeholder: string;
	label?: string;
	options: any;
}

export default function DropdownInput(props: Props) {
	// bind the name to the field input
	const [field, meta, helpers] = useField(props.name);
	return (
		<Form.Field error={meta.touched && !!meta.error}>
			<label>{props.label}</label>
			<Select clearable options={props.options} value={field.value || null} onChange={(e, d) => helpers.setValue(d.value)} onBlur={() => helpers.setTouched(true)} placeholder={props.placeholder} />
			{meta.touched && meta.error ? (
				<Label basic color="red">
					{" "}
					{meta.error}{" "}
				</Label>
			) : null}
		</Form.Field>
	);
}
