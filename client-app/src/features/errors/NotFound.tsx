import React from "react";
import { NavLink } from "react-router-dom";
import { Button, Header, Icon, Segment } from "semantic-ui-react";

export default function NotFound() {
	return (
		<Segment placeholder size="large">
			<Header icon>
				<Icon name="search" />
				Oops! I cannot find the item you are looking for!
			</Header>
			<Segment.Inline>
				<Button primary as={NavLink} to={"/activities"} content="Go back" />
			</Segment.Inline>
		</Segment>
	);
}
