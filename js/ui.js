(async function build_ui() {		
	let projects = await db_get_projects();
	let updates = await db_get_updates();
	
	updates.sort(function(a,b){  
		return new Date(b.timestamp) - new Date(a.timestamp);
	});
	
	for(i in updates) {
		var u_elem = generate_update(updates[i],update_style);		
		$("#updates_feed").append(u_elem);
	}
})();	