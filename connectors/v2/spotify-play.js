'use strict';

/* global Connector, MetadataFilter */

Connector.getArtist = function() {
	return findIframeElement('#track-artist a').first().text();
};

Connector.getTrack = function() {
	return findIframeElement('#track-name a').first().text();
};

Connector.getDuration = function() {
	let durationStr = findIframeElement('#track-length').text();
	return Connector.stringToSeconds(durationStr);
};

Connector.getCurrentTime = function() {
	let currentTimeStr = findIframeElement('#track-current').text();
	return Connector.stringToSeconds(currentTimeStr);
};

Connector.isPlaying = function() {
	let playButton = findIframeElement('#play-pause');
	return playButton.hasClass('playing');
};

Connector.getTrackArt = function() {
	let backgroundStyle = findIframeElement('.sp-image-img')
		.css('background-image');
	let backgroundUrl = /^url\((['"]?)(.*)\1\)$/.exec(backgroundStyle);
	return backgroundUrl ? backgroundUrl[2] : null;
};

Connector.getUniqueID = function() {
	let trackUrl = findIframeElement('#track-name a').attr('href');
	if (trackUrl) {
		return trackUrl.split('/').pop();
	}

	return null;
};

Connector.filter = MetadataFilter.getRemasteredFilter();

/**
 * Find element in player iframe content.
 * @param  {String} selector CSS selector
 * @return {Object} Found element
 */
function findIframeElement(selector) {
	return $('#app-player').contents().find(selector);
}

var onPlayerLoaded = function() {
	console.log('Web Scrobbler: player loaded, setting up observer');
	var observer = new MutationObserver(Connector.onStateChanged);
	var observeTarget = $('#app-player').get(0).contentDocument.getElementById('wrap');
	var config = {
		childList: true,
		subtree: true,
		attributes: true,
		characterData: true
	};
	observer.observe(observeTarget, config);
};

// wait for player to load
$('#app-player').on('load', onPlayerLoaded);
