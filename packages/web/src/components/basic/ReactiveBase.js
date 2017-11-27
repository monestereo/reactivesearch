import React, { Component } from "react";
import { Provider } from "react-redux";
import Appbase from "appbase-js";

import configureStore from "@appbaseio/reactivecore";
import types from "@appbaseio/reactivecore/lib/utils/types";
import URLParamsProvider from "./URLParamsProvider";

const URLSearchParams = require("url-search-params");

class ReactiveBase extends Component {
	constructor(props) {
		super(props);

		this.type = props.type ? props.type : "*";

		const credentials = props.url && props.url.trim() !== "" && !props.credentials
			? "user:pass"
			: props.credentials;

		const config = {
			url: props.url && props.url.trim() !== "" ? props.url : "https://scalr.api.appbase.io",
			app: props.app,
			credentials: props.credentials,
			type: this.type
		};

		this.params = new URLSearchParams(window.location.search);
		let selectedValues = {};

		try {
			for(let key of this.params.keys()) {
				selectedValues = { ...selectedValues, [key]: { value: JSON.parse(this.params.get(key)) } };
			}
		} catch(e) {
			selectedValues = {};
		};

		const appbaseRef = new Appbase(config);
		this.store = configureStore({ config, appbaseRef, selectedValues });
	}

	render() {
		return (
			<Provider store={this.store}>
				<URLParamsProvider params={this.params}>
					{this.props.children}
				</URLParamsProvider>
			</Provider>
		);
	}
}

ReactiveBase.propTypes = {
	type: types.type,
	url: types.url,
	credentials: types.credentials,
	app: types.app,
	children: types.children
}

export default ReactiveBase;