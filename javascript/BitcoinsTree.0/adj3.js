
function circle(x,y,r) {
	return {x: x, y: y, r: r};
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

function drawcircle(svg,circle,color) {
	svg.append("circle")
		.attr("cx", circle.x)
		.attr("cy", circle.y)
		.style("fill", color)
		.attr("r", circle.r);
}


var w = 400,
    h = 300;

var nodes = [];
var colors = color = d3.scale.category20();
var q = d3.geom.quadtree()
	.extent([-10,-10],[w+10,h+10])
	.x(function(d) { return d.x; })
	.y(function(d) { return d.y; })([]);

function rand(min, max) {
	return Math.random() * (max - min) + min;
}

function nodeviewbox(node) {
	return [node.x - node.r/2.0, node.y - node.r/2.0, node.x + node.r/2.0, node.y + node.r/2.0]
	
}

function mergeviewboxes(v0,v1) {
	var x01 = v0[0];
	var y01 = v0[1];
	var x02 = v0[2];
	var y02 = v0[3];

	var x11 = v1[0];
	var y11 = v1[1];
	var x12 = v1[2];
	var y12 = v1[3];

	var x0r = d3.min([x01,x11]);
	var y0r = d3.min([y01,y11]);
	var x1r = d3.max([x02,x12]);
	var y1r = d3.max([y02,y12]);

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

function convertviewboxwidthheight(v) {
	var x0 = v[0];
	var y0 = v[1];
	var x1 = v[2];
	var y1 = v[3];
	return [x0,y0,x1-x0,y1-y0];
}

function viewboxsize(v) {
	var x0 = v[0];
	var y0 = v[1];
	var x1 = v[2];
	var y1 = v[3];
	return d3.max([x1-x0,y1-y0]);
}

var svg = d3.select("#adj3").append("svg")
	.attr("version","1.1")
    .attr("width", w)
    .attr("height", h)
	.attr("style","background: black");


var c1 = circle(0,0,1);
var c2 = circle(2,0,1);
drawcircle(svg,c1,d3.rgb(255,0,255));
drawcircle(svg,c2,d3.rgb(255,0,255));


var front = [[c1,c2,1.0],[c1,c2,-1.0]];
// var sides = [1.0,-1.0];
var sides = [-1.0];
nodes.push(c1);
nodes.push(c2);

var iter = 0;
var maxiter = 1000;
var viewbox = computeviewbox(nodes);
d3.timer(function() {
		if (iter <= maxiter) {
			if (front.length > 0) {
				// front.reverse();
				var oldfront = front.slice(0);
				front = [];
				var ifront = 0;
				for (ifront = 0; ifront < d3.min([oldfront.length,100000]); ++ifront) {
					var lastcouple = oldfront[ifront];
					var c1 = lastcouple[0];
					var c2 = lastcouple[1];
					var side = lastcouple[2];
					var newr = d3.min([c1.r,c2.r])*rand(1.2,0.9);
					if (newr > d3.max([viewboxsize(viewbox)*0.002])) {
						var newnode = circles2tangent(lastcouple[0],"OUT",lastcouple[1],"OUT",newr,side);
						if (!checkcollision(nodes,newnode)) {
							nodes.push(newnode);
							// viewbox = mergeviewboxes(viewbox,nodeviewbox(newnode));
							drawcircle(svg,newnode,d3.rgb(rand(0.0,255.0),rand(0.0,255.0),rand(0.0,255.0)));
							front.push([c2,newnode,-side]);
							if (rand(0.0,1.0) < 0.1) {
								front.push([newnode,c1,-side]);
								front.push([c2,newnode,side]);
							}
							//front.push([newnode,c2,side]);
							// front.push([c1,newnode,-side]);
						}
					}
					iter++;
				}
				viewbox = convertviewboxwidthheight(expandviewbox(computeviewbox(nodes.slice(0)),1.1));
				svg.attr("viewBox", viewbox.join(" "));
			}
		}
		return (iter >= maxiter);
	});


function checkcollision(nodes,node) {
	node.collision = false;

	console.log("check collision");

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
			l = Math.sqrt(x * x + y * y),
			r = node.r + cnode.r;
		if (l - r < -0.0001 * l) {
			return true;
		}
	}
	return false;
}

