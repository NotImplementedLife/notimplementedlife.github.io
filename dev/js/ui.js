const footer =
`<div class="jumbotron" style="margin:0; margin-top:15vh; min-height:50vh">		
	<div class="container">
		<div class="row">
			<div class="col-md-3"></div>
			<div class="col-md-3">
				<h4>Contact</h4>
				Discord (NotImpLife#1049)<br/>				
				<a href="https://twitter.com/NotImpLife">Twitter</a><br/>
				
			</div>
			<div class="col-md-3">
				<h4>Also on</h4>				
				<a href="https://gbatemp.net/members/notimplife.553721/">GBATemp</a><br/>				
				<a href="https://github.com/NotImplementedLife">GitHub</a><br/>
				<a href="https://notimplementedlife.itch.io">itch.io</a><br/>
				<a href="https://www.youtube.com/channel/UC-0C58sSNynr5kTgT24NXqQ">Youtube</a><br/>				
			</div>
		</div>
	</div>	
</div>`;



async function build_ui() {				
	
	$(document).ready(async function(){		
						
		$('body').append(footer);		
	});
		
}

build_ui();	