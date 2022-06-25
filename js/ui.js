




(async function build_ui() {		
	let projects = await db_get_projects();
	console.log(projects);
	for(x in projects)
	{
		var prj = projects[x];
		$('body').append(generate_card(prj,default_card_style));
	}
})();	