import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { Grid, Loader } from "semantic-ui-react";
import { PagingParams } from "../../../app/models/pagination";
import { useStore } from "../../../app/stores/store";
import ActivityFilters from "./ActivityFilters";
import ActivityList from "./ActivityList";
import ActivityListItemPlaceholder from "./ActivityListItemPlaceholder";

export default observer(function ActivityDashboard() {
	const { activityStore } = useStore();
	const { loadActivities, activityRegistry, loadingInitial, setPagingParams, pagination } = activityStore;
	const [loadingNext, setLoadingNext] = useState(false);

	function handleGetNext() {
		setLoadingNext(true);
		setPagingParams(new PagingParams(pagination!.currentPage + 1));
		loadActivities().then(() => setLoadingNext(false));
	}

	// fetch activities from API server if not already loaded (if size of registry is 0 or 1 in case one was just created)
	useEffect(() => {
		if (activityRegistry.size <= 1) loadActivities();
	}, [activityRegistry.size, loadActivities]);

	return (
		<Grid>
			<Grid.Column width="10">
				{loadingInitial && !loadingNext ? (
					<>
						<ActivityListItemPlaceholder />
						<ActivityListItemPlaceholder />
					</>
				) : (
					<InfiniteScroll pageStart={0} loadMore={handleGetNext} hasMore={!loadingNext && !!pagination && pagination.currentPage < pagination.totalPages} initialLoad={false}>
						<ActivityList />
					</InfiniteScroll>
				)}
			</Grid.Column>
			<Grid.Column width="6">
				<ActivityFilters />
			</Grid.Column>
			<Grid.Column width={10}>
				<Loader active={loadingNext}></Loader>
			</Grid.Column>
		</Grid>
	);
});
