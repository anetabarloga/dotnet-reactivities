import { Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import { Button } from "semantic-ui-react";
import CommonTextArea from "../../../app/common/forms/CommonTextArea";
import CommonTextInput from "../../../app/common/forms/CommonTextInput";
import { useStore } from "../../../app/stores/store";
import * as yup from "yup";

interface Props {
	setEditMode: (editMode: boolean) => void;
}

export default observer(function ProfileEditForm({ setEditMode }: Props) {
	const {
		profileStore: { profile, updateProfile },
	} = useStore();
	return (
		<Formik
			initialValues={{ displayName: profile?.displayName, bio: profile?.bio }}
			onSubmit={(values) => updateProfile(values).then(() => setEditMode(false))}
			validationSchema={yup.object({
				displayName: yup.string().required(),
			})}
		>
			{({ isSubmitting, isValid, dirty }) => (
				<Form className="ui form" autoComplete="off">
					<CommonTextInput name="displayName" placeholder={profile?.displayName ?? "Enter a display name"} />
					<CommonTextArea name="bio" placeholder={profile?.bio ?? "Enter a bio"} />
					<Button loading={isSubmitting} content="Save" positive type="submit" fluid disabled={!isValid || !dirty} />
				</Form>
			)}
		</Formik>
	);
});
