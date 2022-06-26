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
	
	var row = $("<div class='row'>");
	var k=0;
	for(i in projects) {		
		var add_it = $.urlParam('platform')==null && $.urlParam('type')==null;		
		if(!add_it && $.urlParam('platform')!=null) {
			platform = $.urlParam('platform');
			add_it = platform == projects[i].platform;
		}
		if(!add_it && $.urlParam('type')!=null) {
			type = $.urlParam('type');
			add_it = type == projects[i].type;
		}
		if(!add_it) continue;
	
		var p_elem = generate_card(projects[i], card_card_style);
		row.append(p_elem);		
		if(k%4==3) {
			$('#projects').append(row);
			row = $("<div class='row'>");
			k++;
		}
	}
	if($.urlParam('platform')!=null || $.urlParam('type')!=null)
		$('#FilterCategory').html("Filtered");
	$('#projects').append(row);
	
	$(document).ready(function(){
		$('.project_card.clickable').click(function(){
			proj_name = $(this).attr("meta");			
			var project = null;
			for(var i in projects) {
				if(projects[i]["internal-name"]==proj_name) {
					project = projects[i];
					break;
				}
			}
			//alert(JSON.stringify(project));
			$('#modal_presentation').html(generate_card(project, modal_card_style));
			$('#modal_presentation').modal({});
			
		});
		
		$('#modal_presentation').on('shown.bs.modal', function () {
			  $('#myInput').trigger('focus')
			})
	});
})();	