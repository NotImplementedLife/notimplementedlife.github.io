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



async function build_ui() {				
	
	$(document).ready(async function(){		
						
		$('body').append(footer);		
	});
		
}

build_ui();	