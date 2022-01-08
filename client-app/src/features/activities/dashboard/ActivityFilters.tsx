import { observer } from "mobx-react-lite";
import React from "react";
import Calendar from "react-calendar";
import { Header, Menu } from "semantic-ui-react";
import { Filters } from "../../../app/common/enums/Filters";
import { useStore } from "../../../app/stores/store";

export default observer(function ActivityFilters() {
	const {
		activityStore: { predicate, setPredicate },
	} = useStore();
	return (
		<>
			<Menu vertical size="large" style={{ width: "100%", marginTop: 25 }}>
				<Header icon="filter" attached color="teal" content="Filters" />
				<Menu.Item content="All Activities" active={predicate.has(Filters.all)} onClick={() => setPredicate(Filters.all, "true")} />
				<Menu.Item content="I'm going" active={predicate.has(Filters.isGoing)} onClick={() => setPredicate(Filters.isGoing, "true")} />
				<Menu.Item content="I'm hosting" active={predicate.has(Filters.isHost)} onClick={() => setPredicate(Filters.isHost, "true")} />
			</Menu>
			<Header />
			<Calendar onChange={(date: Date) => setPredicate(Filters.startDate, date as Date)} value={predicate.get(Filters.startDate) || new Date()} />
		</>
	);
});
