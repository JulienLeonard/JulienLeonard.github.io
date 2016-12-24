// <script type="text/javascript" src="./d3.v3/d3.v3.min.js"></script>
// <script type="text/javascript" src="myd3.js"></script>
// <script type="text/javascript" src="sylvester.js"></script>
// <script type="text/javascript" src="QuadTree.js"></script>
// <script type="text/javascript" src="utils.js"></script>
// <script type="text/javascript" src="geoutils.js"></script>

function sample(v1,v2,abs) {
	return v1 + (v2-v1) *abs;
}

function samples(v1,v2,nitems) {
	var result = [];
	var i = 0;
	for (i=0; i< nitems;i++) {
		var abs = i/nitems;
		result.push(sample(v1,v2,abs));
	}
	return result;
}

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

function rendercircle(canvas,newnode,ncolor) {
	if (newnode.r < 0.01) {
		var c = circle(newnode.x,newnode.y,newnode.r * 0.5);
		drawcircle(canvas,c,ncolor);
	} else {
		var c = circle(newnode.x,newnode.y,newnode.r * 0.4);
		var points = circlepoints(c,Math.floor(rand(3.0,8.0)),myrandom());
		var i = 0;
		drawcircle(canvas,circle(c.x,c.y,c.r*0.4),ncolor);
		for (i = 0;i< points.length;i++) {
			drawcircle(canvas,circle(points[i].e(1),points[i].e(2),c.r*0.4),ncolor);
		}

		var c = circle(newnode.x,newnode.y,newnode.r * 0.7);
		var points = circlepoints(c,Math.floor(rand(3.0,8.0)),myrandom());
		var i = 0;
		drawcircle(canvas,circle(c.x,c.y,c.r*0.4),ncolor);
		for (i = 0;i< points.length;i++) {
			drawcircle(canvas,circle(points[i].e(1),points[i].e(2),c.r*0.4),ncolor);
		}
	}
}

function context () {
	var canvasname = "mandalabug";

	initrandomseed(2);

	var w = 900,
		h = 900,
		background = "#141414";

	var canvas = initcanvas(canvasname,w,h,background);

	var bounds = new rectangle(-10000,-10000, 10000, 10000);

	var quadtree = new QuadTree(bounds, false, 7);

	var nodes = [];

	var iter = 0;
	var maxiter = 100000;
	var viewbox0 = [];

	var newnodes = [circle(0.0,0.0,1.0),circle(2.0,0.0,1.0)];
	var inode = 0;
	for (inode = 0; inode < newnodes.length; inode++) {
		nodes.push(newnodes[inode]);
		quadtree.insert(newnodes[inode]);
		drawcircle(canvas,newnodes[inode],d3.hsl(myrandom() * 360.0, 1,1));
	}
	viewbox0 = mergeviewboxes(circleviewbox(newnodes[0]),circleviewbox(newnodes[1]));

	var lastcouple = newnodes.slice(0);

	// var radiuss = [1.0,1.23,1.23,1.0,0.7,0.7,1.0,1.0];
	// var radiuss = [1.0,1.1,1.1,1.0,0.9,0.9,1.0];
	var radiuss = [1.0,1.05,1.1,1.05,1.0,0.95];
	// var radiuss = [1.0,1.05,1.0,0.95];
	var factor = 1.0;

	function iterframe() {
		if (iter <= maxiter) {
			
			var isubiter = 0;
			
			for (isubiter = 0; isubiter < 100;isubiter++) {
				factor = factor * 1.001;
				var newnode = circles2tangent(lastcouple[1],"OUT",lastcouple[0],"OUT",lcircular(radiuss,nodes.length)*factor,1.0);
				if (newnode.x != NaN) {
					if (!checkcollisionquadtree(quadtree,newnode)) {
						nodes.push(newnode);
	
						var ncolor = d3.hsl(newnode.r/2.0*360.0, 1, 0.5);
				
						quadtree.insert(newnode);
						viewbox0 = mergeviewboxes(circleviewbox(newnode),viewbox0);
						drawcircle(canvas,newnode,ncolor);

						lastcouple = [lastcouple[0],newnode];
					} else {
						var ccollidings = collidings(quadtree,newnode);
						if (ccollidings.length > 0) {
							// console.log("ccollidings " + ccollidings);
							// drawcircle(canvas,ccollidings[0],d3.hsl(myrandom() * 360.0, 1,0.5));
							lastcouple = [ccollidings[0],lastcouple[1]];
						}
					}
				}

				iter++;
			}
		}
		var viewviewbox = convertviewboxwidthheight(expandviewbox(viewbox0,1.5));
		resetviewbox(canvas,viewviewbox);

	
		return (iter >= maxiter);
	}

	return iterframe;
}

startanim(context());
