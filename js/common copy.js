$(document).ready(function() {
    //jQuery.getJSON('/json/caniuse.json', useJSON);
    
    jQuery.getJSON('http://query.yahooapis.com/v1/public/yql', {
        "q": "select * from json where url = 'https://raw.github.com/Fyrd/caniuse/master/data.json'",
        "format": "json",
        "jsonCompat": "new"
    }, useJSON);

});

function useJSON(data) {

    var DESKTOP_TITLE = '<h3>Desktop</h3>';
    var MOBILE_TITLE = '<h3>Mobile / Tablet</h3>';
    var LEGEND = '<ul class="legend"><li class="key">Supported:</li><li class="yes">Yes</li><li class="no">No</li><li class="almost">Partially</li><li class="unknown">Unknown</li></ul>'

    var BROWSERS = ['chrome','firefox','ie','opera','safari','ios_saf','android','op_mob','and_chr','and_ff'];

    var agents = data.agents || data.query.results.json.agents,
        data = data.data || data.query.results.json.data;


    var title;

    var $caniuseTables = $('.caniuse'),
        $table,
        featureName,
        feature;

    var completeHtml = '',
        browserHtml = '',
        mobileHtml = '';

    var currentBrowser;

                var html,
                    support;

    for (var i = 0, l = $caniuseTables.length; i < l; i++) {
        $table = $caniuseTables.eq(i);

        featureName = $table.data('feature') || "unknown";
        feature = data[featureName] || null;

        if (feature) {

            // feature name
            title = '<h2>' + feature.title + '</h2>';

            for (var j=0, bl = BROWSERS.length; j < bl; j++) {
                
                currentBrowser = BROWSERS[j];
                
                if (agents[currentBrowser]) {

                    support = findSupport(feature.stats[BROWSERS[j]]);

                    html = '<li title="' + agents[currentBrowser].browser;
                    html += '"class="icon-' + currentBrowser;
                    html += ' ' + support.result + '"><span class="version">';
                    html += (support.result !== 'no') ? support.version : 'No';
                    html +='</span></li>';

                    if (agents[currentBrowser].type === 'desktop') {
                        browserHtml += html;
                    } else if (agents[currentBrowser].type === 'mobile') {
                        mobileHtml += html;
                    }
                }
            }

            completeHtml = title + DESKTOP_TITLE + '<ul class="browsers">' + browserHtml + '</ul>';
            completeHtml += MOBILE_TITLE + '<ul class="mobiles">' + mobileHtml + '</ul>';
            completeHtml += LEGEND;
            completeHtml += '<p class="stats">Stats from <a href="http://caniuse.com/#feat=';
            completeHtml += featureName + '" target="_blank">caniuse.com</a></p>';
            $table.html(completeHtml);
        }
    }
}

function findSupport(browser) {

    var results = ['yes', 'almost', 'polyfill', 'no', 'unknown'],
        version = "-1";

    for (var i = 0; i < results.length; i++) {
        version = find(results[i].substr(0,1), browser);

        if (version !== "-1") {
            return {
                'result': results[i],
                'version': (version !== '0') ? version : '&nbsp;'
            };
        }
    }

    return {
        'result': 'no',
        'version': 'N/A'
    }

}

function find(needle, haystack) {

    var result = '-1',
        version = 0;

    for (item in haystack) {
        if (haystack.hasOwnProperty(item) && haystack[item] === needle) {

            version = item.split('-')[0];

            if (result == '-1' || parseFloat(result) > parseFloat(version)) {
                result = version;
            }
        }
    }

    return result;
}