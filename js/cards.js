const default_card_style = 
`<div class="project_card clickable" meta="@(internal-name)">
	<span class="project_status @(status)"></span>
	<span class="project_name">@(name)</span>
	<span class="project_platform @(platform)"></span>			
</div>`;

const simple_card_style = 
`<div class="project_card simple clickable" meta="@(internal-name)">
	<span class="project_status @(status)" title="@(status)"></span>
	<span class="project_name">@(name)</span>
	<span class="project_platform @(platform)"></span>		
</div>`;

const card_card_style =
`<div class="project_card card col-md-3 clickable" style="cursor:pointer" meta="@(internal-name)">
  @(elem_icon)
  <img class="card-img-top" src="res/@(type).png">
  <div class="card-body">
	<h5 class="project_name card-title text-center">
		<span class="project_status @(status)" title="@(status)"></span>
		@(name)
		<span class="project_platform @(platform)" style="display:inline-block"></span>		
	</h5>								
  </div>
</div>`;

const modal_card_style =
`<div class="project_card modal modal-dialog" role="document">
	<div class="modal-content">
	  <div class="modal-header">
		<h5 class="modal-title">@(name)</h5>
		<button type="button" class="close" data-dismiss="modal" aria-label="Close">
		  <span aria-hidden="true">&times;</span>
		</button>
	  </div>
	  <div class="modal-body">
		<span class="project_status @(status)"></span>
		<span class="project_platform @(platform)"></span>			
		<span class="cuteness-alert @(cats)"></span>			
		<p>@(description)</p>
		<hr/>
		@(links)
	  </div>
	  <div class="modal-footer">		
		<!--button type="button" class="btn btn-primary">Save changes</button>
		<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button-->
	  </div>
	</div>
  </div>`;


function generate_card(proj, card_style) {
	var html = card_style;
	for(property in proj) {
		var token = `@(${property})`;
		var value = proj[property];
		html = html.replaceAll(token, value);
	}
	
	if(proj.icon!=null) {
		html = html.replaceAll("@(elem_icon)",`<img src="data:image/png;base64,${proj.icon}"/>`);
	}
	else {
		html = html.replaceAll("@(elem_icon)","");
	}
	
	if(proj.ref!=null) {
		var urls = $("<div>");
		urls.append("<h4>External links</h4>")
		for(var name in proj.ref) {
			var caption = name;			
			var url = proj.ref[name];			
			
			if(caption=="github") caption="Source code";
			urls.append(`<a href='${url}'>${caption}</a><br/>`);
		}
		html = html.replaceAll("@(links)",urls[0].outerHTML);
	}
	else {
		html = html.replaceAll("@(links)","");
	}
	
	var obj = $(html);
	$('span.cuteness-alert.true', obj).prop("title", "Cuteness alert : this project contains cats");	
	return obj;
}