const footer =
`<div class="jumbotron" style="margin:0; margin-top:15vh; min-height:50vh;" id="footer">		
	<div class="container">
		<div class="row">
			<div class="col-md-1"></div>
			<div class="col-md-5">
				<h4>Contact</h4>
				<a href="https://discord.com/users/792512288769703938" class="fa fa-discord" style="color:white"> NotImpLife#1049</a><br/>
				<a href="https://twitter.com/NotImpLife" class="fa fa-twitter" style="color:white"> NotImpLife</a><br/>
				<a rel="me" href="https://retrochat.online/@NotImplementedLife" class="fa fa-mastodon" style="color:white"> @NotImplementedLife@retrochat.online</a><br/>
				<a href="mailto: not.implemented.life@gmail.com" class="fa fa-google" style="color:white"> not.implemented.life@gmail.com</a><br/>
			</div>
			<div class="col-md-4">
				<h4>Also on</h4>
				<a href="https://gbatemp.net/members/notimplife.553721/" style="color:white"> GBATemp</a><br/>				
				<a href="https://github.com/NotImplementedLife" class="fa fa-github" style="color:white"> GitHub</a><br/>				
				<a href="https://notimplementedlife.itch.io" class="fa fa-itch-io" style="color:white"> itch.io</a><br/>
				<a href="https://www.youtube.com/channel/UC-0C58sSNynr5kTgT24NXqQ" class="fa fa-youtube" style="color:white"> Youtube</a><br/>								
			</div>
		</div>
	</div>	
</div>`;

let projects = [];
let updates = [];

async function build_ui() {		
	projects = await db_get_projects();
	updates = await db_get_updates();
	
	updates.sort(function(a,b){  
		return new Date(b.timestamp) - new Date(a.timestamp);
	});
	
	for(i in updates) {
		if(updates[i].project != null) {
			for(j in projects) {				
				if(projects[j]["internal-name"] == updates[i].project) {					
					updates[i].project = projects[j];
					break;
				}
			}
		}
		var u_elem = await generate_update(updates[i],update_style);				
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
	
		let p_elem = await generate_card(projects[i], card_card_style);
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
	
	$(document).ready(async function(){
		$('.project_card.clickable').click(async function(){
			proj_name = $(this).attr("meta");			
			var project = null;
			for(var i in projects) {
				if(projects[i]["internal-name"]==proj_name) {
					project = projects[i];
					break;
				}
			}
			//alert(JSON.stringify(project));
			let card = await generate_card(project, modal_card_style)
			$('#modal_presentation').html(card);
			$('#modal_presentation').modal({});
			
		});
		
		$('#modal_presentation').on('shown.bs.modal', function () {
			  $('#myInput').trigger('focus')
			})
			
		$('body').append(footer);		
	});
		
}

build_ui();	