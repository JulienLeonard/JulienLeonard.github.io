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

	return result;
}

function resetviewbox(canvas,viewbox) {
	canvas.attr("viewBox", viewbox.join(" "));
}

function startanim(fframe) {
	d3.timer(fframe);
}
