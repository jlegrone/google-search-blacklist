document.addEventListener('DOMContentLoaded', function () {

	init();

	// chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
 //    	console.log('Page uses History API and we heard a pushSate/replaceState.');
 //    	// do your thing
 //  	});

	$(window).on("popstate", function(){
	    console.log('popstate');
	    window.setTimeout(init, 1000);
	});

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
			var blacklist = result.blacklist;
			var hidden = [];

			for (var i = 0; i < blacklist.length; i++){
				$("cite:contains(" + blacklist[i] + ")").each(function(index){
					$(this).parents("div.g").hide();
					hidden.push(blacklist[i]);
				});
			}

			if (hidden.length > 0){
				if (hidden.length == 1){
					var message = hidden.length + ' result ';
				}
				else {
					var message = hidden.length + ' results ';
				}
				$('#resultStats').append('<nobr>' + message + '<a href="https://www.google.com/preferences#search-blacklist" target="_blank">filtered</a></nobr>');
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

		// var btns = $("li.blacklist_button"); // .each().on('click', function(){console.log('hello')})

		$( "a.blacklist_button" ).each(function(index) {
		    $(this).on("click", function(){
		        blacklist($(this).data('domain'));
		    });
		});
	}

	function blacklist(site){

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
		  		// success
		  		console.log(result);
			});

		}

	}

}, false);
