// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Get the current URL.
 *
 * @param {function(string)} callback called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
	var queryInfo = {
		active: true,
		currentWindow: true
	};

	chrome.tabs.query(queryInfo, (tabs) => {
		var tab = tabs[0];
		var url = tab.url;
		console.assert(typeof url == 'string', 'tab.url should be a string');

		callback(url);
	});
}

// This is the main listener for the extension DOM place other listeners in here
document.addEventListener('DOMContentLoaded', () => {
	getCurrentTabUrl((url) => {
		var dropdown = document.getElementById('dropdown');

		document.getElementById('formSubmit').addEventListener('click', runParseScript);
	});
});

// This is a function that executes when the hot keys Ctrl+Shift+Y are pressed
chrome.commands.onCommand.addListener(function (command) {
	runParseScript();
});

function runParseScript(){
	// Can add different checks to determine which website you are on (i.e. Google, Monster, Indeed)
	var script = parseJobListing_Google();
	chrome.tabs.executeScript({
		code: script
	});
}

/**
 * Grabs the values on the DOM and converts it into a string to return
 *
 * @return {string} The return parameter so that chrome can run the script
 */
function parseJobListing_Google() {
	var script = "var job = {companyName: 'Google', title: document.getElementsByClassName('card-company-name-panel')[0].textContent, location: document.getElementsByClassName('details-location')[0].textContent, url: window.location.href};console.log(job);"
	return script;
}
