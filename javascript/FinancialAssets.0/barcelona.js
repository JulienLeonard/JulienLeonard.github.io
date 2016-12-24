// <script type="text/javascript" src="./d3.v3/d3.v3.min.js"></script>
// <script type="text/javascript" src="myd3.js"></script>
// <script type="text/javascript" src="sylvester.js"></script>
// <script type="text/javascript" src="QuadTree.js"></script>
// <script type="text/javascript" src="utils.js"></script>
// <script type="text/javascript" src="geoutils.js"></script>


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
	var canvasname = "barcelona";

	initrandomseed(2);

	var w = 900,
		h = 900,
		background = "#141414";

	var canvas = initcanvas(canvasname,w,h,background);

	var bounds = new rectangle(-10000,-10000, 10000, 10000);

	var quadtree = new QuadTree(bounds, false, 7);

	var nodes = [];

	var iter = 0;
	var maxiter = 4000;
	var viewbox0 = [];

	var newnodes = [circle(0.0,0.0,1.0),circle(2.0,0.0,1.0)];
	var inode = 0;
	for (inode = 0; inode < newnodes.length; inode++) {
		nodes.push(newnodes[inode]);
		quadtree.insert(newnodes[inode]);
		drawcircle(canvas,newnodes[inode],d3.hsl(myrandom() * 360.0, 1,1));
	}
	viewbox0 = mergeviewboxes(circleviewbox(newnodes[0]),circleviewbox(newnodes[1]));

	// var radiuss = [1.0,1.23,1.23,1.0,0.7,0.7,1.0,1.0];
	// var radiuss = [1.0,1.1,1.1,1.0,0.9,0.9,1.0];
	// var radiuss = [1.0,1.1,1.2,1.3,1.4,1.5,1.6,1.7,1.8,1.9,2.0,1.9,1.8,1.7,1.6,1.5,1.4,1.3,1.2,1.1,1.0];
	var nradiuss = lconcat(samples(1.0,4.0,10),samples(4.0,1.0,10));
	var ncolor1 = d3.hsl(0.0*360.0, 1, 0.5);
	var ncolor2 = d3.hsl(0.2*360.0, 1, 0.5);
	var ncolor3 = d3.hsl(0.4*360.0, 1, 0.5);
	var ncolor4 = d3.hsl(0.6*360.0, 1, 0.5);
	var ncolors = [ncolor1,ncolor2,ncolor3,ncolor3,ncolor3,ncolor3,ncolor3,ncolor1];
	var radiuss = [20.0,2.5];
	var factor = 1.0;

	var phases = [20,500];
	var iphase = 0;
	var ncollisions = 0;
	var lastnode = newnodes[0]; 
	var lastindex = 0;

	function iterframe() {
		if (iter <= maxiter) {
			
			if (iter >= phases[iphase]) {
				if (iphase < phases.length - 1) {
					iphase++;

					quadtree = new QuadTree(bounds, false, 7);

					var oldnodes = nodes.slice(0);
					var newnodes = [];
					var inode = 0;
					for (inode = 0; inode < oldnodes.length; inode++) {
						var newnode = circle(oldnodes[inode].x,oldnodes[inode].y,oldnodes[inode].r * 0.4);
						newnodes.push(newnode);
						quadtree.insert(newnode);
						// drawcircle(canvas,newnode,d3.hsl(0.0, 1.0, 0.5));
					}
					nodes = newnodes.slice(0);
					lastnode = nodes[0];
				} 
			}

			var isubiter = 0;
			for (isubiter = 0; isubiter < 1;isubiter++) {
				if (iphase == 0) {
					var newfactor = rand(0.9,1.1);
				} else { 
					var newfactor = rand(0.9,1.1);
				}
				var lastnode = nodes[lastindex];
				var newr = lcircular(radiuss,iphase)*newfactor * lcircular(nradiuss,iter);
				var bignode = circle(lastnode.x,lastnode.y,lastnode.r + newr * 2.0);
				var ccollidings = collidings(quadtree,bignode);
				var icol = 0;
				var found = false;
				
				for (icol = 0; icol < ccollidings.length; icol++) {
					if (lastnode != ccollidings[icol] && ccollidings[icol].r < 0.5)
					{
						var nnewnode = circles2tangent(lastnode,"OUT",ccollidings[icol],"OUT",newr,-1.0);
						if (nnewnode.x != NaN) {
							if (!checkcollisionquadtree(quadtree,nnewnode)) {
								ncollisions = 0;
								nodes.push(nnewnode);
									
								var ncolor = d3.hsl((nnewnode.r + 0.5)/2.0*360.0, 1.0, 0.5);
									
								quadtree.insert(nnewnode);
								viewbox0 = mergeviewboxes(circleviewbox(nnewnode),viewbox0);
								if (iphase != 0) {
									drawcircle(canvas,nnewnode,ncolor);
								}
								found = true;
								break;
							}
						}
					}
				} 

				if (!found) {
					for (icol = 0; icol < ccollidings.length; icol++) {
						if (lastnode != ccollidings[icol])
						{
							var nnewnode = circles2tangent(lastnode,"OUT",ccollidings[icol],"OUT",newr,-1.0);
							if (nnewnode.x != NaN) {
								if (!checkcollisionquadtree(quadtree,nnewnode)) {
									ncollisions = 0;
									nodes.push(nnewnode);
									
									var ncolor = d3.hsl((nnewnode.r + 0.5)/2.0*360.0, 1.0, 0.5);
									
									quadtree.insert(nnewnode);
									viewbox0 = mergeviewboxes(circleviewbox(nnewnode),viewbox0);
									if (iphase != 0) {
										drawcircle(canvas,circle(nnewnode.x,nnewnode.y,nnewnode.r*0.5),ncolor);
									}
									found = true;
									break;
								}
							}
						}
					} 
				}

				if (!found) {
					console.log("no newnode");
					lastindex = lastindex - 1;
				} else {
					lastindex = nodes.length-1;
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
