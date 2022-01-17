import React from "react";
import { toast } from "react-toastify";
import { Button, Divider, Header, Icon, Segment } from "semantic-ui-react";
import agent from "../../app/api/agent";
import useQuery from "../../app/common/utils/hooks";

export default function RegisterSuccess() {
	const email = useQuery().get("email") as string;

	function handleConfirmEmailResend() {
		agent.Account.resendEmailConfirm(email)
			.then(() => {
				toast.success("Verification email resent - please check your inbox.");
			})
			.catch((error) => console.log(error));
	}
	return (
		<Segment placeholder textAlign="center">
			<Header icon color="green">
				<Icon name="check">Registration successful!</Icon>
			</Header>
			<p>Please check your inbox, including the Spam folder for the verification email</p>
			<Divider></Divider>
			{email && (
				<>
					<p>Didn't receive the email? Click the button below to resend.</p>
					<Button primary onClick={handleConfirmEmailResend} content="Resend email" size="huge" />
				</>
			)}
		</Segment>
	);
}
