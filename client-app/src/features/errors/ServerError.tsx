import { observer } from "mobx-react-lite";
import React from "react";
import { Header, Segment } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";

export default observer(function ServerError() {
	const { commonStore } = useStore();

	return (
		<Segment>
			<Header as="h1" content="Server Error Occured" />
			<Header sub as="h5" color="red" content={commonStore.error?.message} />
			{commonStore.error?.details && (
				<Segment>
					<Header as="h4" content="stack trace" color="teal" />
					<code style={{ marginTop: "10px" }}>{commonStore.error.details}</code>
				</Segment>
			)}
		</Segment>
	);
});
