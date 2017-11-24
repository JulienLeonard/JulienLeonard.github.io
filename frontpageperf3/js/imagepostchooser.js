
// check if image is from outside
var imgelem = document.getElementsByTagName('img')[0];
var sourcepath = imgelem.getAttribute("src");
console.log("sourcepath",sourcepath);


// check if we are in a single post or elsewher
var elems = document.getElementsByTagName('div'), i;
var issingle = false;
for (i in elems) {
	if((' ' + elems[i].className + ' ').indexOf(' ' + "post-inner" + ' ') > -1) {
		console.log("we are in a single post");
		issingle = true;
		break;
	}
}

if (issingle) {
	var bigpath = sourcepath.replace("/thumbnails/","/pictures/");
	imgelem.setAttribute("src",bigpath);
}
