document.addEventListener('DOMContentLoaded', function () {

	showBlockedSites();

	function showBlockedSites(){

		var html = '<div id="search-blacklist" class="sect" style="padding-top:4px"><div class="sectHdr"><h2>Blacklist Websites</h2></div><div class="subsect">Filter annoying websites from your Google Search results.<br><br>To add a site to your blacklist, click the dropdown menu to the right of the site address on the search results page, and select <b>Block &ltexamplesite.com&gt</b>.</div><div class="subsect"><div class="subsect"><a href="https://github.com/jlegrone/google-search-blacklist" id="">View Project on Github</a></div><table id="chrome_blacklist_addon_table"></table><div style="clear:both"></div></div></div>';

		$('#srhSec').prepend(html);

		chrome.storage.sync.get("blacklist", getBlacklistData);

		function getBlacklistData(result){
			
			if (result.blacklist && result.blacklist.length > 0){
				var blacklist = result.blacklist;
				$('#chrome_blacklist_addon_table').html('<tr><th>Manage Blacklisted Sites</th><th></th></tr>');
			}
			else {
				$('#chrome_blacklist_addon_table').css('display','none');
				return;
			}

			blacklist.sort();

			for (var i = 0; i < blacklist.length; i++){
				$('#chrome_blacklist_addon_table').append('<tr><td>' + blacklist[i] + '</td><td><a href="#" role="button" class="chrome_blacklist_addon_remove_link" data-domain="' + blacklist[i] + '">remove from blacklist</a></td></tr>');
			}

			$(".chrome_blacklist_addon_remove_link").on("click", function(e){
				e.preventDefault();
			    unBlacklist($(this).data('domain'));
			    $(this).parents('tr').remove();
			});
		}
	}	

	function unBlacklist(site){

		chrome.storage.sync.get("blacklist", storeNewData);
		
		function storeNewData(result){

			var blacklist = result.blacklist;

			if ($.inArray(site, blacklist) != -1){
				blacklist = $.grep(blacklist, function(value) {
				  return value != site;
				});
			}
			else {
				console.log('This site is not in the blacklist.');
				return;
			}

			chrome.storage.sync.set({'blacklist': blacklist}, function() {
		  		// success
		  		console.log(result);
			});

		}

	}

}, false);
