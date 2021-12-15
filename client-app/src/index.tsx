import React from "react";
import ReactDOM from "react-dom";
import "./app/layout/styles.css";
import "semantic-ui-css/semantic.min.css";
import App from "./app/layout/App";
import reportWebVitals from "./reportWebVitals";
import { store, StoreContext } from "./app/stores/store";

ReactDOM.render(
	// provide context to the application
	<StoreContext.Provider value={store}>
		<App />
	</StoreContext.Provider>,
	document.getElementById("root")
);

reportWebVitals();
