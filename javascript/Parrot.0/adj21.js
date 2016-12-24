function mymax(values) {
	var res = values[0];
	var index = 1;
	for (index = 1; index < values.length; index++) {
		if (res < values[index]) {
			res = values[index]; 
		}
	}

	return res;
}

function mymin(values) {
	var res = values[0];
	var index = 1;
	for (index = 1; index < values.length; index++) {
		if (res > values[index]) {
			res = values[index]; 
		}
	}

	return res;
}

function drawcircle(svg,circle,color) {
	var myCircle = new Path.Circle(new Point(circle.x, circle.y), circle.r);
	myCircle.fillColor = color;
}

function initcanvas(w,h,background) {
	// todo
}

function resetviewbox(svg,viewbox) {
	// todo
	// svg.attr("viewBox", viewbox.join(" "));
	project.view.center = {x: viewbox[0] + viewbox[2]/2.0, y: viewbox[1] + viewbox[3]/2.0};
	// project.view.size = {width: viewbox[2], height: viewbox[3]};
	// project.view.bound = viewbox;
	project.view.zoom = 800/viewbox[2];
}

function startanim(fframe) {
	function onFrame(event) {
		fframe();
	}
}


function circle(x,y,r) {
	return {x: x, y: y, r: r, width: r*2.0, height: r*2.0, radius: r};
}

function rectangle(x,y,width,height) {
	return {x: x, y: y, width: width, height: height};
}


function circles2tangent(c1,type1,c2,type2,radius,side) {
    var x1 = c1.x, y1 = c1.y, r1 = c1.r;
    var x2 = c2.x, y2 = c2.y ,r2 = c2.r;

	var p1 = new Point(x1,y1);
	var p2 = new Point(x2,y2);

	var v = p1 - p2;
    var l3 = v.length;
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
	v.angle = v.angle + angle  * 360.0/ (2*3.141569)
	var vnew = v.normalize() * l2;
    var newcenter = p2 + vnew;
    return circle(newcenter.x,newcenter.y,radius);
}


var seed = 1;
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
        
		colliding = ((( dx * dx )  + ( dy * dy )) - (radii * radii)) < -0.0001;
        
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

var c1 = circle(0,0,1);
var c2 = circle(1.5,0,0.5);
drawcircle(canvas,c1,[255,255,255]);
drawcircle(canvas,c2,[255,255,255]);
quadtree.insert(c1);
quadtree.insert(c2);

var front = [[c1,c2,1.0],[c2,c1,-1.0]];
nodes.push(c1);
nodes.push(c2);

var iter = 0;
var maxiter = 20000;
var viewbox0 = computeviewbox(nodes);
var ntimer = 0;

function iterframe() {
	if (iter <= maxiter) {
		if (front.length > 0) {
			// front.reverse();
			console.log("size front " + front.length);
			var nend = mymax([front.length,20]);
			var oldfront = front.slice(0,nend);
			front = front.slice(nend);
			var ifront = 0;
			for (ifront = 0; ifront < oldfront.length; ++ifront) {
				var lastcouple = oldfront[ifront];
				var c1 = lastcouple[0];
				var c2 = lastcouple[1];
				var side = lastcouple[2];
				var newr = mymax([c1.r,c2.r])*rand(1.1,0.9);
				var nratio = 0.9;
				if (Math.ceil(ntimer / 100) % 3 == 0) {
					nratio = 1.0;
				}
				if (side < 0.0) {
					newr = newr * nratio;
				}
				if (rand(0.0,1.0) < 0.0) {
					newr = 3.0 * newr;
				}

				if (newr > 0.001 * (convertviewboxwidthheight(viewbox0)[2])) {
					var newnode = circles2tangent(lastcouple[0],"OUT",lastcouple[1],"OUT",newr,side);
					if (!checkcollisionquadtree(quadtree,newnode)) {
						nodes.push(newnode);
						var ncolor = [255,255,255];
						if (rand(0.0,1.0) < 0.1) {
							ncolor = [255,125,0];
						}

						quadtree.insert(newnode);
						viewbox0 = mergeviewboxes(nodeviewbox(newnode),viewbox0);
						drawcircle(canvas,newnode,ncolor);
						front.push([c2,newnode,-side]);
						if (rand(0.0,1.0) < 0.4 && nratio < 1.0) {
							if (side > 0.0) {
								var newfront = [[newnode,c1,-side]].concat(front.slice(0));
								front = newfront;
							} else {
								var newfront = [[c2,newnode,-side]].concat(front.slice(0));
								front = newfront;
							}
							// front.push([c2,newnode,side]);
						}
					}
				}

				iter++;
				var viewviewbox = convertviewboxwidthheight(expandviewbox(viewbox0,1.1));
				resetviewbox(canvas,viewviewbox);
				front = front.slice(front.length-20);
			}
			ntimer++;
		}
	}
	return (iter >= maxiter);
}

// startanim(iterframe);
function onFrame(event) {
	iterframe();
}


