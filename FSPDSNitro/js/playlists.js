playlist_data = {};
selected_playlist = null;

const nitroRoot = "/nitro";

$(document).ready(function(){
	FS.mkdir(nitroRoot);	
	FS.mkdir(nitroRoot+"/data");
	FS.mkdir(nitroRoot+"/data/FSPDS");
	copyServerFileToFS("FSPDS7.elf", `/FSPDS7.elf`);
	copyServerFileToFS("FSPDS9.elf", `/FSPDS9.elf`);
	copyServerFileToFS("icon.bmp", `/icon.bmp`);
	create_playlist("flipnotes");
})


function create_playlist(name){
	if (name in playlist_data) {
		console.log(`Playlist "${name}" already exists.`);
		return;
	}
	
	const path = `${nitroRoot}/${name}`;
	
	playlist_data[name] = {
		'files' : [],
		'path'  : path		
	};
	
	playlists = $("#playlists");
	playlist = $(`<div name='pl_${name}'>${name}</div>`);
	
	
	FS.mkdir(path);
	playlists.append(playlist);	
	//console.log(playlists);
	
	select_playlist(name);
}

function select_playlist(name) {	
	if (!(name in playlist_data)) {
		console.log(`Playlist "${name}" does not exist.`);
		return;
	}		
	selected_playlist = name;		
	refreshPlaylist();
}

function refreshPlaylist(){
	const items = $("#playlist_items");
	items.html("");	
	const files = playlist_data[selected_playlist].files;	
	for (i in files){
		items.append($(`<li>${files[i].name}</li>`))
	}				
}

function addToPlaylist(file) {
	playlist_data[selected_playlist].files.push(file);
	refreshPlaylist();	
	hideDropArea();
}

const dropArea = document.getElementById('drop_area');
const fileInput = document.getElementById('file_input');

const body = document.body;
var isDropAreaDragging=false;

body.addEventListener("dragover", (e)=>{showDropArea()});
body.addEventListener("dragenter", (e)=>{showDropArea()});
body.addEventListener("dragleave", (e)=>{if(!isDropAreaDragging) hideDropArea()});
body.addEventListener("drop", (e)=>{hideDropArea(); preventDefaults(e);});

window.addEventListener("dragover",function(e){
  e = e || event;
  e.preventDefault();
},false);

window.addEventListener("drop",function(e){
  e = e || event;
  e.preventDefault();
},false);



function preventDefaults(e) { e.preventDefault(); e.stopPropagation(); }

dropArea.addEventListener('dragenter', (e) => { isDropAreaDragging=true; dropArea.classList.add('drag_over'); preventDefaults(e); });
dropArea.addEventListener('dragleave', (e) => { isDropAreaDragging=false; dropArea.classList.remove('drag_over'); hideDropArea(); preventDefaults(e); });
dropArea.addEventListener('dragover', (e) => {isDropAreaDragging=false; preventDefaults(e);});

dropArea.addEventListener('drop', handleDrop);

async function handleDrop(e) {
	console.log("Dropped");		
	preventDefaults(e);
	dropArea.classList.remove('drag_over');
	
	const files = e.dataTransfer.files;	
	if(files.length) {
		hideDropArea();
		fileInput.files = files;
		await handleFiles(files);
	}	
}

function hideDropArea() { if(playlist_data[selected_playlist].files.length>0) dropArea.setAttribute("hidden", 1); }
function showDropArea() { dropArea.removeAttribute("hidden"); }

async function handleFiles(files) {		
	for (const file of files) {
		
		const flipnotePath = playlist_data[selected_playlist].path+"/"+file.name;
		console.log(flipnotePath);				
		await copyFileToFS(file, flipnotePath);		
		addToPlaylist(file);		
	}	
}


function BinaryWriter() {
	this.data = []
	
	this.write_int = function(n) {
		this.data.push((n>> 0) & 0xFF);
		this.data.push((n>> 8) & 0xFF);
		this.data.push((n>>16) & 0xFF);
		this.data.push((n>>24) & 0xFF);				
	}	
	
	this.write_len_prefixed_string = function(s) {		
		const encoded = new TextEncoder().encode(s);
		this.write_int(encoded.length);		
		for(i in encoded) this.data.push(encoded[i]);
	}
	
	this.write_fixed_len_string = function(s, l) {
		s = new TextEncoder().encode(s);
		if(s.length < l)
			s += "\0".repeat(l-s.length)
		for(i=0;i<l;i++){
			this.data.push(s[i])
		}
	}
	
	this.get_bytes = function() { return Uint8Array.from(this.data); }
}

function create_index_file(){
	const bw = new BinaryWriter();
	keys = Object.keys(playlist_data);
	bw.write_int(keys.length);
	
	console.log(keys);
	for(const i in keys){		
		name = keys[i];
		bw.write_len_prefixed_string("/"+name+"/")
		
		const files = playlist_data[name].files;
		
		bw.write_int(files.length);
		for(const j in files) {
			console.log(files[j].name);
			bw.write_fixed_len_string(files[j].name, 24)
		}		
	}
	
	const bytes = bw.get_bytes();
	console.log(bytes)
	
	FS.writeFile(nitroRoot+"/data/FSPDS/locations", bytes);	
}