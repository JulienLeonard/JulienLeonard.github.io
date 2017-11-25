function drawcircle(canvas,circle,color) {
    // .style("fill", d3.rgb(color[0],color[1],color[2]))
	
	canvas.append("circle").attr("cx", circle.x)
		.attr("cy", circle.y)
		.style("fill", color)
		.attr("r", circle.r);
}

function initcanvas(canvasname,w,h,background) {
	var result = d3.select("#"+canvasname).append("svg")
		.attr("version","1.1")
		.attr("width", w)
		.attr("height", h)
		.attr("style","background: " + background);

	var onresize = function() {
		// console.log("resize");
		// get the size of the overall "post-inner" element
		var elems = document.getElementsByTagName('div'), i;
		for (i in elems) {
			if((' ' + elems[i].className + ' ').indexOf(' ' + "post-inner" + ' ') > -1) {
				// elems[i].innerHTML = content;
				// console.log("size of post-inner",elems[i].offsetWidth);
				var newsize = elems[i].offsetWidth;
				var svg = document.getElementsByTagName('svg')[0];
				svg.setAttribute("width",newsize);
				svg.setAttribute("height",newsize);
			}
		}
	};

	window.onresize = onresize;
	onresize();

	return result;
}

function resetviewbox(canvas,viewbox) {
	canvas.attr("viewBox", viewbox.join(" "));
}

function startanim(fframe) {
	d3.timer(fframe);
}
