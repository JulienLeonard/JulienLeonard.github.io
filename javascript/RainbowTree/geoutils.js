function Point(x,y) {
	this.x = x;
	this.y = y;
}

function Circle(x,y,r) {
	this.x = x;
	this.y = y;
	this.r = r;
	this.width  = r*2.0;
	this.height = r*2.0;
	this.radius = r;
}

function circle(x,y,r)
{
	return new Circle(x,y,r)
}

function cscale(circle,v)
{
	return (new Circle(circle.x,circle.y,circle.r*v));
}

function rectangle(x,y,width,height) {
	return {x: x, y: y, width: width, height: height};
}


function vrotate(v,angle) {
    var si = Math.sin(angle);
    var co = Math.cos(angle);
	return $V([v.e(1)*co-v.e(2)*si,v.e(1)*si+v.e(2)*co]);
}

function adjcircle(c,r,angle) {
	var center = $V([c.x,c.y]);
	var v = vrotate($V([c.r + r, 0.0]),angle);
	var newcenter = center.add(v);
	return (new Circle(newcenter.e(1),newcenter.e(2),r));
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
        console.log("cosv ",cosv);
		if (cosv < -1.0) {
			cosv = -1.0;
		} else {
			cosv = 1.0;
		}
	}
    var angle = Math.acos( cosv ) * side;
	var vnew = s3.rotate(angle,$V([0.0,0.0])).toUnitVector().multiply(l2);
    var newcenter = $V([x2,y2]).add(vnew);
    return (new Circle(newcenter.e(1),newcenter.e(2),radius));
}

function circles2tangent2(c1,type1,c2,type2,radius,side) {
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
        console.log("cosv ",cosv);
		return [];
	}
    var angle = Math.acos( cosv ) * side;
	var vnew = s3.rotate(angle,$V([0.0,0.0])).toUnitVector().multiply(l2);
    var newcenter = $V([x2,y2]).add(vnew);
    return [new circle(newcenter.e(1),newcenter.e(2),radius)];
}


function circleviewbox(c) {
	return [c.x - c.r/2.0, c.y - c.r/2.0, c.x + c.r/2.0, c.y + c.r/2.0];
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

// preserve center
function squareviewbox(v)
{
	var x0 = v[0];
	var y0 = v[1];
	var x1 = v[2];
	var y1 = v[3];

	var width  = x1 - x0;
	var height = y1 - y0;
	var xcenter = (x1 + x0)/2.0;
	var ycenter = (y1 + y0)/2.0;

	var maxr = mymax([width,height])/2.0;

	return [xcenter-maxr, ycenter - maxr, xcenter + maxr, ycenter + maxr];
}

function convertviewboxwidthheight(v) {
	var x0 = v[0];
	var y0 = v[1];
	var x1 = v[2];
	var y1 = v[3];
	return [x0,y0,x1-x0,y1-y0];
}

function arecirclescolliding(c1,c2) {
	var dx = c1.x - c2.x;
	var dy = c1.y - c2.y;
	var radii = c1.radius + c2.radius;
	return ((( dx * dx )  + ( dy * dy )) - (radii * radii)) < -0.000001;
}

function computecirclesviewbox(circles) {
	var v0 = circleviewbox(circles[0])

	for (var icircle = 1; icircle < circles.length; ++icircle) {
		v0 = mergeviewboxes(v0,circleviewbox(circles[icircle]));
	}
		
	return v0;
}

function checkcirclescollision(circles,circle,errormargin) {
	
	var r = circle.r,
		nx1 = circle.x - r,
		nx2 = circle.x + r,
		ny1 = circle.y - r,
		ny2 = circle.y + r;


	for (var index = 0; index < circles.length; ++index) {
		var ccircle = circles[index];
		var collision = arecirclescolliding(circle,ccircle,errormargin);
		if (collision) {
			return true;
		}
	}
	return false;
}

function checkcollisionquadtree(tree,c,errormargin) {
	var items = tree.retrieve(c);
	for(var j = 0; j < items.length; j++)
	{
		var item = items[j];
                        
		if(c == item)
		{
			return true;
		} 

		var colliding = arecirclescolliding(c,item,errormargin);
        
		if(colliding)
		{
			return true;
		}
	}
	return false;
}

function collidings(tree,c,errormargin) {
	var result = []
	var items = tree.retrieve(c);
	for(var j = 0; j < items.length; j++)
	{
		var item = items[j];
                        
		if(c != item)
		{
			var colliding = arecirclescolliding(c,item,errormargin);
        
			if(colliding)
			{
				result.push(item);
			}
		}
	}
	return result;
}

// function insertquadtree(tree,c) {
// 	tree.insert(c);
// }

// function checkcollisionquadtree(tree,c,errormargin) {
// 	return tree.iscolliding(c,errormargin);
// }

// function collidings(tree,c,errormargin) {
// 	return tree.collidings(c,errormargin);
// }

// function insertquadtree(tree,c) {
// 	tree.add(c);
// }


function circlepoints(c,npoints,angle0) {
	var result = [];
	
	var center = $V([c.x,c.y]);
	
	var v0 = $V([c.r,0.0]);

	var angles = samples(0.0,2*3.141569,npoints);
	var ia = 0;
	for (ia = 0; ia < angles.length; ia++) {
		var ext    = center.add(vrotate(v0,angles[ia] + angle0));
		result.push(ext);
	}
	return result;
}

function linepoints(p1,p2,npoints) {
	var result = [];
	var xs = samples(p1.x,p2.x,npoints);
	var ys = samples(p1.y,p2.y,npoints);
	
	for (var i = 0; i < npoints; i++) {
		result.push(new Point(xs[i],ys[i]));
	}
	return result;
}

function linecircles(p1,p2,ncircles) {
	var result = [];
	var centers = linepoints(p1,p2,ncircles);

	var v = $V([p1.x-p2.x,p1.y-p2.y]);
    var l = v.modulus();

	var newr = l/ncircles;

	for (var icenter = 0; icenter < centers; icenter++) {
		var ccenter = centers[icenter];
		result.push(new Circle(ccenter.x,center.y,newr));
	}
	return result;
}
