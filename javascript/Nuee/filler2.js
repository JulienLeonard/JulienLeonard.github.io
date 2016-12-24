// with d3.js

function mymax(values) {
	return d3.max(values)
}

function mymin(values) {
	return d3.min(values)
}

var ndrawcircles = 0;
function drawcircle(svg,circle,color) {
	/*
	d3.select("#circle" + ndrawcircles).attr("cx", circle.x)
		.attr("cy", circle.y)
		.style("fill", d3.rgb(color[0],color[1],color[2]))
		.attr("r", circle.r);
		ndrawcircles++; */
	/*
	svg.append("circle").attr("cx", circle.x)
		.attr("cy", circle.y)
		.style("fill", d3.rgb(color[0],color[1],color[2]))
		.attr("r", circle.r);*/
	
svg.append("circle").attr("cx", circle.x)
		.attr("cy", circle.y)
		.style("fill", color)
	    .attr("r", 0.0)
	    .transition()
	    .attr("r", circle.r)
	    .transition()
	    .attr("r", 0.0)
	    .transition()
	.attr("r", circle.r)
	    .transition()
	    .attr("r", 0.0)
	    .transition()
	.attr("r", circle.r)
	    .transition()
	    .attr("r", 0.0)
	    .transition()
	.attr("r", circle.r)
	    .transition()
	    .attr("r", 0.0)
	    .transition()
	.attr("r", circle.r)
	    .transition()
	    .attr("r", 0.0)
	    .transition()
	.attr("r", circle.r)
	    .transition()
	    .attr("r", 0.0)
	    .transition()
	.attr("r", circle.r)
	    .transition()
	    .attr("r", 0.0)
	    .transition()
	.attr("r", circle.r)
	    .transition()
	    .attr("r", 0.0)
	    .transition()
	.attr("r", circle.r);
	
}

function initcanvas(w,h,background) {
	var svg = d3.select("#filler2").append("svg")
		.attr("version","1.1")
		.attr("width", w)
		.attr("height", h)
		.attr("style","background: " + background);

	var index = 0;
	for (index = 0; index < 0; index++) {
		svg.append("circle")
			.attr("cx", 0.0)
			.attr("cy", 0.0)
			.style("fill", d3.rgb(0.0,0.0,0.0))
			.attr("r", 0.0)
			.attr("id","circle" + index);
	}

	return svg;
}

function resetviewbox(svg,viewbox) {
	svg.attr("viewBox", viewbox.join(" "));
}

function startanim(fframe) {
	d3.timer(fframe);
}


function circle(x,y,r) {
	return {x: x, y: y, r: r, width: r*2.0, height: r*2.0, radius: r};
}

function rectangle(x,y,width,height) {
	return {x: x, y: y, width: width, height: height};
}


function vrotate(v,angle) {
    var si = Math.sin(angle);
    var co = Math.cos(angle);
	return $V([v.e(1)*co-v.e(2)*si,v.e(1)*si+v.e(2)*co]);
}

function circles2tangent(c1,type1,c2,type2,radius,side) {
    var x1 = c1.x, y1 = c1.y, r1 = c1.r;
    var x2 = c2.x, y2 = c2.y ,r2 = c2.r;

	var s3 = $V([x1-x2,y1-y2]);
    var l3 = s3.modulus();
    isens = 1.0;
	if (type1 == "IN" || type2 == "IN") {
		isens = -1.0;
	}
    var l1 = r1 + isens*radius;
    var l2 = r2 + radius;
    var cosv = (l3 * l3 - l1 * l1 + l2 * l2)/(2.0 * l2 * l3);
	if (cosv < -1.0 || cosv > 1.0) {
        consol.log("cosv ",cosv);
        return [];
	}
    var angle = Math.acos( cosv ) * side;
	var vnew = s3.rotate(angle,$V([0.0,0.0])).toUnitVector().multiply(l2);
    var newcenter = $V([x2,y2]).add(vnew);
    return circle(newcenter.e(1),newcenter.e(2),radius);
}


var seed = 2;
function myrandom() {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

function rand(min, max) {
	return myrandom() * (max - min) + min;
}

function nodeviewbox(node) {
	return [node.x - node.r/2.0, node.y - node.r/2.0, node.x + node.r/2.0, node.y + node.r/2.0]
	
}

function mergeviewboxes(v0,v1) {
	if (v1.length <= 0) {
		return v0;
	}
	var x01 = v0[0];
	var y01 = v0[1];
	var x02 = v0[2];
	var y02 = v0[3];

	var x11 = v1[0];
	var y11 = v1[1];
	var x12 = v1[2];
	var y12 = v1[3];

	var x0r = mymin([x01,x11]);
	var y0r = mymin([y01,y11]);
	var x1r = mymax([x02,x12]);
	var y1r = mymax([y02,y12]);

	return [x0r,y0r,x1r,y1r];
}

function computeviewbox(nodes) {

	var v0 = nodeviewbox(nodes[0])
	var inode = 1;
	for (inode = 1; inode < nodes.length; ++inode) {
		v0 = mergeviewboxes(v0,nodeviewbox(nodes[inode]));
	}
		
	return v0;
}

function expandviewbox(v,amount) {
	var x0 = v[0];
	var y0 = v[1];
	var x1 = v[2];
	var y1 = v[3];
	var width  = (x1 - x0)*amount;
	var height = (y1 - y0)*amount;
	var xc = (x0 + x1)/2.0;
	var yc = (y0 + y1)/2.0;
	return [xc-width/2.0,yc-height/2.0,xc+width/2.0,yc+height/2.0];
}

function centerviewbox(v,center) {
	var x0 = v[0];
	var y0 = v[1];
	var x1 = v[2];
	var y1 = v[3];
	
	var nw0 = center[0] - x0;
	var nw1 = x1- center[0];
	var nw = mymax([nw0,nw1]);
	
	var nh0 = center[1] - y0;
	var nh1 = y1- center[1];
	var nh = mymax([nh0,nh1]);

	return [center[0]-nw,center[1]-nh,center[0]+nw,center[1]+nh];
}

function convertviewboxwidthheight(v) {
	var x0 = v[0];
	var y0 = v[1];
	var x1 = v[2];
	var y1 = v[3];
	return [x0,y0,x1-x0,y1-y0];
}

function checkcollision(nodes,node) {
	var r = node.r,
		nx1 = node.x - r,
		nx2 = node.x + r,
		ny1 = node.y - r,
		ny2 = node.y + r;


	var index;
	for (index = 0; index < nodes.length; ++index) {
		var cnode = nodes[index];
		var x = node.x - cnode.x,
			y = node.y - cnode.y,
			l = x * x + y * y,
			r = (node.r + cnode.r) * (node.r + cnode.r);
		if (l - r < -0.001 * l) {
			return true;
		}
	}
	return false;
}

function checkcollisionquadtree(tree,c) {

	var items = tree.retrieve(c);
	var len = items.length;
	for(var j = 0; j < len; j++)
	{
		var item = items[j];
                        
		if(c == item)
		{
			return true;
		} 

		var dx = c.x - item.x;
		var dy = c.y - item.y;
		var radii = c.radius + item.radius;                
        
		colliding = ((( dx * dx )  + ( dy * dy )) - (radii * radii)) < -0.000001;
        
		if(colliding)
		{
			return true;
		}
	}
	return false;
}


var w = 900,
	h = 900,
	background = "#141414";

var canvas = initcanvas(w,h,background);

var bounds = new rectangle(-10000,-10000, 10000, 10000);

var quadtree = new QuadTree(bounds, false, 7);

var nodes = []

var iter = 0;
var maxiter = 200000;
var viewbox0 = [];

var nemptynewcounter = 0;
var nemptynewmax = 100;

function addlights() {
	var nsubiter = 0;
	var nnew = 0;
	for (nsubiter = 0; nsubiter < 1; nsubiter++) {
		var newnode = circle(myrandom(),myrandom(),0.05);
		if (!checkcollisionquadtree(quadtree,newnode)) {
			nodes.push(newnode);
			nnew++;

			var hue = myrandom() * 360.0;
			var ncolor = d3.hsl(hue, 1,0.5);
			var bcolor = d3.hsl(hue, 0.1,0.1);
			var mcolor = d3.hsl(hue, 0.9,0.9);
			
			
			quadtree.insert(newnode);
			viewbox0 = mergeviewboxes(nodeviewbox(newnode),viewbox0);
			drawcircle(canvas,circle(newnode.x,newnode.y,newnode.r * 0.5),bcolor);
			drawcircle(canvas,circle(newnode.x,newnode.y,newnode.r * 0.2),ncolor);
			drawcircle(canvas,circle(newnode.x,newnode.y,newnode.r * 0.1),mcolor);
		}
		iter++;
	}

	var viewviewbox = convertviewboxwidthheight(expandviewbox(viewbox0,1.1));
	resetviewbox(canvas,viewviewbox);
	return nnew;
}

function adddust() {
	var nsubiter = 0;
	var nnew = 0;
	for (nsubiter = 0; nsubiter < 1; nsubiter++) {
		var newnode = circle(myrandom(),myrandom(),0.01);
		if (!checkcollisionquadtree(quadtree,newnode)) {
			nodes.push(newnode);
			nnew++;

			var hue = myrandom() * 360.0;
			var ncolor = d3.hsl(hue, 1,0.5);
			var bcolor = d3.hsl(hue, 0.1,0.1);
			var mcolor = d3.hsl(hue, 0.9,0.9);
			
			quadtree.insert(newnode);
			viewbox0 = mergeviewboxes(nodeviewbox(newnode),viewbox0);
			drawcircle(canvas,circle(newnode.x,newnode.y,newnode.r * 0.5),bcolor);
			drawcircle(canvas,circle(newnode.x,newnode.y,newnode.r * 0.2),ncolor);
			drawcircle(canvas,circle(newnode.x,newnode.y,newnode.r * 0.1),mcolor);
		}
		iter++;
	}

	var viewviewbox = convertviewboxwidthheight(expandviewbox(viewbox0,1.1));
	resetviewbox(canvas,viewviewbox);
	return nnew;
}



var phase = 0;

function iterframe() {
	if (iter <= maxiter) {
		if (phase == 0) {
			var nnew = addlights();
			if (nnew == 0) {
				nemptynewcounter++;
			} else {
				nemptynewcounter = 0;
			}

			if (nemptynewcounter >= nemptynewmax) {
				phase++;

				quadtree = new QuadTree(bounds, false, 7);
				
				var i = 0;
				for (i=0; i < nodes.length; i++) {
					var newnode = nodes[i];
					quadtree.insert(circle(newnode.x,newnode.y,newnode.r * 0.5));
				}
			}
		} else {
			adddust();
		}
	}
	
	return (iter >= maxiter);
}

startanim(iterframe);


