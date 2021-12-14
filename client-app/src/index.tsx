import React from "react";
import ReactDOM from "react-dom";
import "./app/layout/styles.css";
import "semantic-ui-css/semantic.min.css";
import App from "./app/layout/App";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById("root")
);

reportWebVitals();
