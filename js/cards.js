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
  <img class="card-img-top" src="res/@(type).png">
  <div class="card-body">
	<h5 class="project_name card-title text-center">
		<span class="project_status @(status)" title="@(status)"></span>
		@(name)
		<span class="project_platform @(platform)"></span>		
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
	  </div>
	  <!--div class="modal-footer">
		<button type="button" class="btn btn-primary">Save changes</button>
		<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
	  </div-->
	</div>
  </div>`;


function generate_card(proj, card_style) {
	var html = card_style;
	for(property in proj) {
		var token = `@(${property})`;
		var value = proj[property];
		html = html.replaceAll(token, value);
	}
	var obj = $(html);
	$('span.cuteness-alert.true', obj).prop("title", "Cuteness alert : this project contains cats");	
	return obj;
}