import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, Header, Icon, Segment } from "semantic-ui-react";
import agent from "../../app/api/agent";
import useQuery from "../../app/common/utils/hooks";
import { useStore } from "../../app/stores/store";
import LoginForm from "./forms/LoginForm";

export default function ConfirmEmail() {
	const { modalStore } = useStore();
	const email = useQuery().get("email") as string;
	const token = useQuery().get("token") as string;

	const Status = {
		Verifying: "Verifying",
		Failed: "Failed",
		Success: "Success",
	};

	const [status, setStatus] = useState(Status.Verifying);

	function handleConfirmEmailResend() {
		agent.Account.resendEmailConfirm(email)
			.then(() => {
				toast.success("Verification email resent - please check your inbox.");
			})
			.catch((error) => console.log(error));
	}

	useEffect(() => {
		agent.Account.verifyEmail(token, email)
			.then(() => {
				setStatus(Status.Success);
			})
			.catch(() => {
				setStatus(Status.Failed);
			});
	}, [Status.Failed, Status.Success, email, token]);

	function getBody() {
		switch (status) {
			case Status.Verifying:
				return <p>Verifying...</p>;
			case Status.Failed:
				return (
					<div>
						<p>Verification failed. You can try resending the verification link to your email.</p>
						<Button primary onClick={handleConfirmEmailResend} size="huge" content="Resend link" />
					</div>
				);
			case Status.Success:
				return (
					<div>
						<p>Your email has been verified successfully. You can now log in!</p>
						<Button primary size="huge" content="Login" onClick={() => modalStore.openModal(<LoginForm />)} />
					</div>
				);
		}
	}

	return (
		<Segment placeholder textAlign="center">
			<Header icon>
				{" "}
				<Icon name="envelope">Email verification</Icon>
			</Header>
			<Segment.Inline>{getBody()}</Segment.Inline>
		</Segment>
	);
}
