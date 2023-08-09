const navbar_default_style = 
` <a class="navbar-brand" href="#">N&#x2022;I&#x2022;L's Dev Resources</a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
	<span class="navbar-toggler-icon"></span>
  </button>

  <div class="collapse navbar-collapse" id="navbarSupportedContent">
	<ul class="navbar-nav mr-auto">
	  <li class="nav-item">
		<a class="nav-link" href="../index.html">Home</a>
	  </li>	  	  
	  <li class="nav-item">
		<a class="nav-link" href="https://github.com/NotImplementedLife" target="_blank" style="color:black !important;">Github
			<svg width="16" height="16" fill="currentColor" class="bi bi-link" viewBox="0 0 16 16">
			<path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9c-.086 0-.17.01-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z"/>
			<path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4.02 4.02 0 0 1-.82 1H12a3 3 0 1 0 0-6H9z"/>
			</svg>
		</a>
	  </li>
	  <!--li class="nav-item">
		<a class="nav-link disabled" href="#">Disabled</a>
	  </li-->
	</ul>
	<form class="form-inline my-2 my-lg-0" action="/search.html" method="GET">
	  <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" name="key">
	  <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
	</form>
  </div>`;

async function load_navbar(nav, style) {
	nav.addClass("navbar navbar-expand-lg navbar-light bg-light navbar-custom");		
	nav.html(style);
}

$(document).ready(function(){
	load_navbar($("#navbar"), navbar_default_style);
});
