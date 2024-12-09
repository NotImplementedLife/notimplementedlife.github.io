<?php
$projects = json_decode(file_get_contents('database/projects.json'), true);
$updates = json_decode(file_get_contents('database/updates.json'), true);

usort($updates, function ($a, $b) { return -strcmp($a['timestamp'], $b['timestamp']); });

function get_project_by_name($name) {
	global $projects;
	for($i=0;$i<count($projects);++$i) {
		if($projects[$i]['internal-name']==$name){
			return $projects[$i];
		}		
	}
	return null;
}

function date_str($date){
	$d = strtotime($date);
	return date('Y-m-d H:i:s', strtotime($date));	
}

function format_interval($time_left) {
	$format_string = "";
	$weeks = (int) ($time_left->d / 7);
	$days = (int) ($time_left->d - ($weeks * 7));
	if ($time_left->y > 0) $format_string = "%y year(s), %m month(s) ago";
	elseif ($time_left->m > 0) $format_string = "%m month(s) ago";
	elseif ($weeks > 0) $format_string = "$weeks week(s) ago";
	elseif ($time_left->d > 0) $format_string = "$days day(s) ago";
	elseif ($time_left->h > 0) $format_string = "%h hour(s) and %i minute(s) ago";
	elseif ($time_left->i > 0) $format_string = "%i minute(s) ago";
	else $format_string = "%s second(s)";
	return $time_left->format($format_string);
}

function time_diff($date) {
	$d = new DateTime(date('Y-m-d H:i:s', strtotime($date)));
	$n = new DateTime('now');
	$interval = date_diff($d, $n);	
	return format_interval($interval);
}

function get_updates_of_project($name) {
	global $updates;
	$result = array();
	foreach($updates as $update) {
		if($update['project']==$name){
			array_push($result, $update);
		}
	}
	usort($result, function ($a, $b) { return -strcmp($a['timestamp'], $b['timestamp']); });
	return $result;
}

$ROOT = '';

//var_dump($updates);
?>

<?php function navbar() { ob_start(); global $ROOT; ?>
	<nav class="navbar navbar-expand-lg navbar-light navbar-custom" style="background:#ffffffc0; backdrop-filter: blur(5px); z-index:10;">
	  <a class="navbar-brand" href="#">notimplementedlife.github.io</a>
	  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
		<span class="navbar-toggler-icon"></span>
	  </button>

	  <div class="collapse navbar-collapse" id="navbarSupportedContent">
		<ul class="navbar-nav mr-auto">
		  <li class="nav-item">
			<a class="nav-link" href="<?php echo $ROOT . "/index.html" ?>">Home</a>
		  </li>
		  <!--li class="nav-item">
			<a class="nav-link" href="/archive.html">Archive</a>
		  </li>
		  <li class="nav-item">
			<a class="nav-link" href="/categories.html">Categories</a>
		  </li-->
		  <li class="nav-item dropdown">
			<a class="nav-link dropdown-toggle" href="#" id="navbarProjects" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
			  Projects
			</a>			
			<div class="dropdown-menu" aria-labelledby="navbarProjects w-100">
				<div>
				<?php global $projects; for($i=0;$i<count($projects)&&$i<5;++$i){
					$project = $projects[$i];?>
					
					<a class="dropdown-item" href="<?php echo $ROOT ?>/projects/<?php echo $project['internal-name'] ?>.html">
						<div class="project_card simple clickable" meta="<?php echo $project['internal-name'] ?>">
							<span class="project_status <?php echo $project['status'] ?>" title="<?php echo $project['status'] ?>"></span>
							<span class="project_name"><?php echo $project['name'] ?></span>
							<span class="project_platform <?php echo $project['platform'] ?>"></span>		
						</div>				
					</a>
					
				<?php } ?>
				</div>			
			  <div class="dropdown-divider"></div>		  
			  <a class="dropdown-item" href="<?php echo $ROOT."/projects.html"?>">View all projects...</a>
			</div>		
		  </li>
		  <li class="nav-item">
			<a class="nav-link" href="<?php echo $ROOT."/dev.html"?>"">Development</a>
		  </li>
		  <li class="nav-item">
			<a class="nav-link" href="<?php echo $ROOT."/about.html"?>"">About</a>
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
		<form class="form-inline my-2 my-lg-0" onsubmit="return perform_search(event);">
		  <input class="form-control mr-sm-2" type="search" name="key" placeholder="Search" aria-label="Search">
		  <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
		</form>
	  </div>  
	</nav>
<?php return ob_get_clean(); } ?>

<?php function page_frame($content, $css, $js) { ob_start(); ?>
	<!DOCTYPE html>
	<html>	
		<head>
			<meta charset="UTF-8"/>
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			
			<meta http-equiv='cache-control' content='no-cache'>
			<meta http-equiv='expires' content='0'>
			<meta http-equiv='pragma' content='no-cache'>
			
			<link rel="me" href="https://retrochat.online/@NotImplementedLife"/>
			<link rel="stylesheet" href="<?php echo $css?>/style.css"/>
			
			<style>
				body {
					background: #20001E;
					height: 100vh;
					margin: 0; 
					padding 0;												
				}		
				main {					
					overflow-y:auto;
					display:fixed;
					top:0; left:0;
					width:100%;
					height:100%;
					background-attachment: fixed;
					background-image: url('/res/bg.jpeg');
					background-size: cover;
					background-repeat: no-repeat;
					background-position: center;
				}
				a {
					color:#800000;
				}
			</style>
		</head>
		<body>		
			<main>
				<?php echo navbar(); ?>				
				
				<div class="container" style="background:#ffffffc0; border-radius:5px; padding:20px; min-height:80%; margin-top:50px; backdrop-filter: blur(5px);">
					<div id="context">
						<?php echo $content?>
					</div>			
				</div>
			</main>
			<div class="modal" tabindex="-1" role="dialog" id="modal_presentation"></div>			
		</body>	
					
		<script src="<?php echo $js?>/dependencies/jquery.min.js"></script>
		<script src="<?php echo $js?>/dependencies/bootstrap.min.js"></script>			
	</html>
<?php return ob_get_clean(); } ?>

<?php function write_page($path, $content, $iframe, $css, $js) {
	global $ROOT;
	$url = 'build/' . $path . '.html';
	file_put_contents($url, page_frame($content, $css, $js));
	echo '<a href='.$url.'>'.$url.'</a>';
	
	if ($iframe) {
		echo '<br/><iframe src='.$url.' style="width:100%; height:80%;">'.$url.'</iframe>';
	}	
} ?>

<?php function update_card($update) { ob_start(); ?>
	<?php $project_name = $update['project']==null ? "" :  $update['project'];
	?>
	<?php //var_dump($update['project']==null) ?>
	<?php //var_dump($update) ?>
	<div>
		<hr/>
		<?php if($update['project']!=null) { 
			$project = get_project_by_name($update['project']); 		
			//var_dump($project)
			
			?>
			<div class="project_card basic">
				<a href="./projects/<?php echo $project['internal-name']; ?>.html">
					<span class="project_status <?php echo $project['status']; ?>"></span> <?php echo $project['name']; ?>					
				</a>
			</div>
		<?php } ?>
		<h4><?php echo $update['title'] ?></h4>
		<p><i><?php echo date_str($update['timestamp'])?> (<?php echo time_diff($update['timestamp'])?>)</i></p>
		<p><?php echo $update['description'] ?></p>
	</div>			
<?php return ob_get_clean(); } ?>


<?php function home_page() { ob_start(); ?>
	<div class="home">	
	<p align="center">
		<img src="/res/pp_nil.jpg" style="border-radius:50%;"/>
	</p>
	<h2 align="center">NotImplementedLife</h2>		
	
	
	<div class="row">
		<div class="col-md-6"><a href="https://discord.com/users/792512288769703938" class="fa fa-discord" style="color:#800000"> NotImpLife#1049</a></div>
		<div class="col-md-6"><a href="https://twitter.com/NotImpLife" class="fa fa-twitter" style="color:#800000"> NotImpLife</a></div>
	</div>				
	<div class="row">		
		<div class="col-md-6"><a rel="me" href="https://retrochat.online/@NotImplementedLife" class="fa fa-mastodon" style="color:#800000"> @NotImplementedLife@retrochat.online</a></div>
		<div class="col-md-6"><a href="mailto: not.implemented.life@gmail.com" class="fa fa-google" style="color:#800000"> not.implemented.life@gmail.com</a></div>
	</div>				
	<div class="row">
		<div class="col-md-6"><a href="https://gbatemp.net/members/notimplife.553721/" style="color:#800000"> GBATemp</a></div>
		<div class="col-md-6"><a href="https://github.com/NotImplementedLife" class="fa fa-github" style="color:#800000"> GitHub</a></div>
	</div>				
	<div class="row">
		<div class="col-md-6"><a href="https://notimplementedlife.itch.io" class="fa fa-itch-io" style="color:#800000"> itch.io</a></div>
		<div class="col-md-6"><a href="https://www.youtube.com/channel/UC-0C58sSNynr5kTgT24NXqQ" class="fa fa-youtube" style="color:#800000"> Youtube</a></div>
	</div>	
	
	<h3>Latest Updates</h3>	
	
	<?php 	
		global $updates;
		for($i=0;$i<count($updates) && $i<5;++$i) {			
			echo update_card($updates[$i]);
		}
	?>	
</div>
<?php return ob_get_clean(); } ?>


<?php function project_page($project) { ob_start(); ?>	

	<?php //var_dump($project);?>
	<div class="project_card basic">
		<?php if(array_key_exists('icon', $project)){ ?>
		<img src="<?php echo $project['icon']; ?>" style="float:right; width:128px;">
		<?php } ?>
		<h1>		
			<span class="project_status <?php echo $project['status']?>"></span> <?php echo $project['name']?>
		</h1>			
		<h5>
			<span class="project_platform <?php echo $project['platform']?>"></span>
			<span class="cuteness-alert <?php echo $project['cats']?>"></span>
		</h5>
		<hr/>
		<p><?php echo $project['description']?></p>
		
		<?php if(array_key_exists('latest_version', $project) && $project['latest_version']!=null) { ?>
			<h2>Download</h2><hr/>
			<p>Latest version <b>$params.target.name$ $params.target.latest_version$</b> <a href="$params.target.download_link$">Download</a></p>			
		<?php } ?>

		<h2>External links</h2><hr/>
		<ul>
			<?php foreach($project['ref'] as $ref) {
				$platform = $ref['platform'];
				$url = $ref['url']; ?>			
				<li><a href="<?php echo $url;?>" target="_blank"><?php echo $platform;?></a></li>
			<?php }?>		
		</ul>
		

		<h2>Updates</h2><hr/>
		
		<?php $proj_updates = get_updates_of_project($project['internal-name']); ?>
		
		<?php 
			foreach($proj_updates as $update) {
				echo update_card($update);
			}
		?>
		<p><a href="../projects.html">Back to projects</a></p>
	</div>
<?php return ob_get_clean(); } ?>

<?php function project_card($project) { ob_start(); ?>	
	<div class="project_card card col-md-3 clickable" style="cursor:pointer" onclick="window.location='./projects/<?php echo $project['internal-name'] ?>.html'" meta="<?php echo $project['internal-name'] ?>">
	  <?php if(array_key_exists('icon', $project) && $project['icon']!=null){ ?>
		<img src="<?php echo $project['icon'] ?>">
	  <?php } ?>
	  <img class="card-img-top" src="/res/<?php echo $project['type'] ?>.png">
	  <div class="card-body">
		<h5 class="project_name card-title text-center">
			<span class="project_status <?php echo $project['status'] ?>" title="<?php echo $project['status'] ?>"></span>
			<?php echo $project['name'] ?>
			<span class="project_platform <?php echo $project['platform'] ?>" style="display:inline-block"></span>		
		</h5>								
	  </div>
	</div>
<?php return ob_get_clean(); } ?>

<?php function projects_page() { ob_start(); global $projects; ?>	
	
	<h3>Projects</h3>
	
	<div class='row'>
		<?php foreach($projects as $project) { 
			echo project_card($project);
		} ?>
	</div>
		
<?php return ob_get_clean(); } ?>


<?php function about_page() { ob_start(); global $projects; ?>	
	<div>
		<h3>Project information</h3>
		<hr/>
		<p>
			Learn about my <a href="#/projects">projects</a> in a more friendly presentation.
			Read the updates to check out the progress of each project. 
		
		</p>
		<h4>Project status</h4>
		<div class="project_card simple">
		<p><span class="project_status active">Active.</span>
			The app is currently in development. I'm working on it and it will most likely receive updates in the near future.
		</p>
		<p><span class="project_status stalled">Stalled.</span>
			The app has not been updated in quite some time due to various reasons, but I haven't give up yet on development. 
			I'm possibly waiting for a spring of inspiration, or the project has faced some struggles and I need to put more effort
			into researching the matter.
		</p>
		<p><span class="project_status inactive">Inactive.</span>
			The app is no longer maintained. It was probably an one-month jam game, a proof-of-concept or a thing I simply don't 
			want or don't have time to work on it. Completed projects could also fall in this category.
		</p>
		
		<h4>Target platform</h4>
		<p><span class="project_platform DotNet"></span>
			This is a .NET application written in C#.
		</p>
		<p><span class="project_platform GB"></span>
			This is a Game Boy homebrew project.
		</p>
		<p><span class="project_platform GBA"></span>
			This is a Game Boy Advance homebrew project.
		</p>
		<p><span class="project_platform GBC"></span>
			This is a Game Boy Color homebrew project.
		</p>		
		<p><span class="project_platform NDS"></span>
			This is a Nintendo DS(i) homebrew project.
		</p>
		
		</div>
	</div>
<?php return ob_get_clean(); } ?>

<?php function dev_page() { ob_start(); global $projects; ?>	
	<div>
		<h2>Development and tools</h2>
		<ul>
			<li><a href="/dev/gb2html" target="_blank">Game Boy (Advance) to HTML converter</a></li>
			<li><a href="/FSPDSNitro" target="_blank">FSPDSNitro</a></li>
		</ul>
	</div>
<?php return ob_get_clean(); } ?>

<?php
	write_page("index", home_page(), false, './css', './js');	
	write_page("projects", projects_page(), true, './css', './js');	
	write_page("dev", dev_page(), false, './css', './js');	
	write_page("about", about_page(), false, './css', './js');	
	
	foreach($projects as $project){					
		write_page('projects/' . $project['internal-name'], project_page($project), false, '../css', '../js'); 
	}
?>