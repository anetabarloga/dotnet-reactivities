import React from "react";
import { Dimmer, Loader } from "semantic-ui-react";

interface Props {
	inverted?: boolean; // darken backgroud when loading
	content?: string;
}

export default function LoadingComponent({ inverted = true, content = "Loading..." }: Props) {
	return (
		<Dimmer active inverted={inverted}>
			<Loader content={content} />
		</Dimmer>
	);
}
