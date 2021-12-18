import { observer } from "mobx-react-lite";
import React from "react";
import { Link } from "react-router-dom";
import { Button, Container, Header, Image, Segment } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import LoginForm from "../users/forms/LoginForm";
import RegisterForm from "../users/forms/RegisterForm";

export default observer(function HomePage() {
	const { userStore, modalStore } = useStore();
	return (
		<Segment inverted textAlign="center" vertical className="masthead">
			<Container text>
				<Header as="h1" inverted>
					<Image size="large" src="/assets/logo.png" alt="logo" />
					Reactivities
				</Header>
				{userStore.isLoggedIn ? (
					<>
						<Header as="h2" inverted content="Welcome back!" />
						<Button as={Link} to="/activities" size="huge" inverted content="Go to activities" />
					</>
				) : (
					<>
						<Header as="h2" inverted content="Welcome to reactivities!" />
						<Button onClick={() => modalStore.openModal(<LoginForm />)} size="huge" inverted content="Login" />
						<Button onClick={() => modalStore.openModal(<RegisterForm />)} size="huge" inverted content="Register" />
					</>
				)}
			</Container>
		</Segment>
	);
});
