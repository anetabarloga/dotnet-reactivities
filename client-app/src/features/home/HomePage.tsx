import React from "react";
import { Link } from "react-router-dom";
import { Button, Container, Header, Image, Segment } from "semantic-ui-react";

export default function HomePage() {
	return (
		<Segment inverted textAlign="center" vertical className="masthead">
			<Container text>
				<Header as="h1" inverted>
					<Image size="large" src="/assets/logo.png" alt="logo" />
					Reactivities
				</Header>
				<Header as="h2" inverted content="Welcome to reactivities" />
				<Button as={Link} to="/activities" size="huge" inverted>
					{" "}
					Let's go!
				</Button>
			</Container>
		</Segment>
	);
}
