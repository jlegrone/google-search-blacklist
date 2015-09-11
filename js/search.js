document.addEventListener('DOMContentLoaded', function () {

	// This part of the script triggers when page is done loading

	function init(){
		removeBlockedSites();
		addMenuItems();
	}

	function removeBlockedSites(){

		chrome.storage.sync.get("blacklist", getBlacklistData);

		function getBlacklistData(result){

			if (!result.blacklist || result.blacklist.length < 1){
				return;
			}
			blacklist = result.blacklist;
			var hidden = [];

			for (var i = 0; i < blacklist.length; i++){
				$("cite:contains(" + blacklist[i] + ")").each(function(index){
					$(this).parents("div.g").hide();
					hidden.push(blacklist[i]);
				});
			}

			// Notify that some results have been filtered from search
			if (hidden.length > 0){
				if (hidden.length == 1){
					var message = hidden.length + ' result ';
				}
				else {
					var message = hidden.length + ' results ';
				}

				$('#resultStats').html($('#resultStats').html() + '<span id="googleBlacklistStats"></span>');
				$('#googleBlacklistStats').html('<nobr>' + message + '<a href="https://www.google.com/preferences#search-blacklist" target="_blank" title="Edit Blacklist">filtered</a><span id="blacklist-hidden-sites">: ' + hidden.join(", ") + '</span></nobr>');
			}
		}
	}	
	
	function addMenuItems(){
		var ulists = $("div.action-menu-panel.ab_dropdown ul");
		var domain, ul;	

		for (var n = 0; n < ulists.length; n++){
			ul = $(ulists[n]);
			domain = ul.parents("div.action-menu.ab_ctl").siblings("cite._Rm")[0].textContent;
			domain = domain.replace(/.*?:\/\//g, "").split(/(?:\/| )+/)[0];
			ul.append('<li class="action-menu-item ab_dropdownitem" role="menuitem"><a class="fl blacklist_button" href="#" onmousedown="" tabindex="-1" data-domain="' + domain + '">Block ' + domain + '</a></li>');
		}

		$( "a.blacklist_button" ).each(function(index) {
		    $(this).on("click", function(){
		        blacklistSite($(this).data('domain'));
		    });
		});
	}

	function blacklistSite(site){

		chrome.storage.sync.get("blacklist", storeNewData);
		
		function storeNewData(result){

			if (result.blacklist){
				var blacklist = result.blacklist;
			}
			else {
				var blacklist = [];
			}

			if ($.inArray(site, blacklist) == -1){
				blacklist.push(site);
			}
			else {
				console.log('This site is already blacklisted.');
				return;
			}

			chrome.storage.sync.set({'blacklist': blacklist}, function() {
		  		// remove newly blocked site by reinitializing
		  		init();
			});

		}

	}

	var resultNodes = [];

	var observer = new MutationObserver(function(mutations) {

		resultNodes = [];

	    mutations.forEach(function(mutation) {

	    	if (mutation.target.className == 'g' && mutation.attributeName == '__sp_done'){
	    		resultNodes.push(mutation.target);
	    	}

	    });

	    if (resultNodes.length > 0){
	    	process(resultNodes);
	    }

	});

	observer.init = function(){
		this.observe(document.getElementById('search'), {
	    	attributes: true,
	    	subtree: true
		});
	};

	function process(nodes){
		// pause MutationObserver while manipulating DOM
		observer.disconnect();

		// perform operations
		init();

		// reinitialize MutationObserver
		observer.init();
	}

	observer.init();

}, false);
