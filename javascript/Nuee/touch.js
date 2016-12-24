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

var quadtree    = null;
var lastpattern = 0;
var lastindexs  = [];
var nodess      = [];
var sides       = [];
var nsubiter    = 2;

function context () {
	var canvasname = "touch";

	initrandomseed(2);

	var w = 600,
		h = 600,
	    background = "#141414";
	

	var canvas = initcanvas(canvasname,w,h,background);

	// var touchdrawcircle = function(event) {
	// 		for (var i = 0; i < event.touches.length; i++) {
	// 			var touch = event.touches[i];
	// 			drawcircle(canvas,circle(touch.pageX, touch.pageY,1.0),ncolor);
	// 			// ctx.beginPath();
	// 			// ctx.arc(touch.pageX, touch.pageY, 20, 0, 2*Math.PI, true);
	// 			// ctx.fill();
	// 			// ctx.stroke();
	// 		}
	// };

	var touchdrawcircle = function(event) {
		var eventcoords = d3.mouse(this);
		// console.log(eventcoords);
		// var nnewnode = circle(eventcoords[0],eventcoords[1],5.0);

		var newnodes = [circle(eventcoords[0]-1,eventcoords[1],1.0),circle(eventcoords[0]+1,eventcoords[1],1.0)];

		// drawcircle(canvas,circle(eventcoords[0],eventcoords[1],10.0),d3.hsl(myrandom() * 360.0, 1,1));
		if (!checkcollisionquadtree(quadtree,newnodes[0]) && !checkcollisionquadtree(quadtree,newnodes[1])) {


			var inode = 0;
			for (inode = 0; inode < newnodes.length; inode++) {
				var ncolor = d3.hsl(myrandom()*360.0, 1.0, 0.5);
				quadtree.insert(newnodes[inode]);
				drawcircle(canvas,newnodes[inode],ncolor);
			}

			var side = 1.0;
			if (nodess.length % 2 == 0) {
				side = 1.0;
			}
			
			nodess.push(newnodes)
			lastindexs.push(1);
			sides.push(side);
		}
	};


	// document.getElementsByTagName("body")[0].addEventListener("touchstart",touchdrawcircle,false);
	// var body = document.getElementsByTagName("body")[0];
	// body.addEventListener("mousedown",touchdrawcircle,false);


	canvas.on("mousedown",touchdrawcircle, false);
	canvas.on("touchstart",touchdrawcircle, false);


	var bounds = new rectangle(-10000,-10000, 10000, 10000);

	quadtree = new QuadTree(bounds, false, 7);


	var iter = 0;
	var maxiter = 15000;
	var viewbox0 = [];

	viewbox0 = mergeviewboxes(circleviewbox(circle(0.0,0.0,100.0)),circleviewbox(circle(50.0,1.0,100.0)));
 
	// var radiuss = [1.0,1.23,1.23,1.0,0.7,0.7,1.0,1.0];
	// var radiuss = [1.0,1.1,1.1,1.0,0.9,0.9,1.0];
	// var radiuss = [1.0,1.1,1.2,1.3,1.4,1.5,1.6,1.7,1.8,1.9,2.0,1.9,1.8,1.7,1.6,1.5,1.4,1.3,1.2,1.1,1.0];
	var nradiuss = lconcat(samples(1.0,1.0,20),samples(1.0,1.0,20));
	var ncolor1 = d3.hsl(0.0*360.0, 1, 0.5);
	var ncolor2 = d3.hsl(0.2*360.0, 1, 0.5);
	var ncolor3 = d3.hsl(0.4*360.0, 1, 0.5);
	var ncolor4 = d3.hsl(0.6*360.0, 1, 0.5);
	var ncolors = [ncolor1,ncolor2,ncolor3,ncolor3,ncolor3,ncolor3,ncolor3,ncolor1];
	var radiuss = [1.0,2.5];
	var factor = 1.0;

	var ncollisions = 0;

	function iterframe() {

		if (iter <= maxiter && nodess.length > 0) {
			var lastindex = 0;
			var isubiter  = 0;
			var maxnsubiter = nsubiter;
			lastpattern += 1;
			for (isubiter = 0; isubiter < maxnsubiter; isubiter++) {

				// lastpattern += 1;
				lastpattern = lastpattern % lastindexs.length;
				var lastindex = lastindexs[lastpattern];
				var nodes = nodess[lastpattern];
				var side = sides[lastpattern];
				// console.log(" lastindexs " + lastindexs +  " lastpattern "+lastpattern+" lastindex "+lastindex+" nodes "+nodes);

				var newfactor = rand(0.9,1.1);
				if (lastindex <0) {
					   continue
				}
				var lastnode = nodes[lastindex];
				var newr = 2.5 * newfactor * rand(0.8,1.2) * lcircular(nradiuss,nodes.length);
				var bignode = circle(lastnode.x,lastnode.y,lastnode.r + newr * 2.0);

				var ccollidings = collidings(quadtree,bignode);
				var icol = 0;
				var found = false;
				
				for (icol = 0; icol < ccollidings.length; icol++) {
					if (lastnode != ccollidings[icol] && ccollidings[icol].r < 0.5)
					{
						var nnewnode = circles2tangent(lastnode,"OUT",ccollidings[icol],"OUT",newr,side);
						if (nnewnode.x != NaN) {
							if (!checkcollisionquadtree(quadtree,nnewnode)) {
								ncollisions = 0;
								nodes.push(nnewnode);
									
								var ncolor = d3.hsl((lastindex%(60))/(60)*360.0, 1.0, 0.5);
									
								quadtree.insert(nnewnode);
								nodess[lastpattern] = nodes;

								viewbox0 = mergeviewboxes(circleviewbox(nnewnode),viewbox0);
								drawcircle(canvas,circle(nnewnode.x,nnewnode.y,nnewnode.r),ncolor);
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
							var nnewnode = circles2tangent(lastnode,"OUT",ccollidings[icol],"OUT",newr,side);
							if (nnewnode.x != NaN) {
								if (!checkcollisionquadtree(quadtree,nnewnode)) {
									ncollisions = 0;
									nodes.push(nnewnode);
									nodess[lastpattern] = nodes;
									
									var ncolor = d3.hsl((lastindex%(60))/(60)*360.0, 1.0, 0.5);
									
									quadtree.insert(nnewnode);
									viewbox0 = mergeviewboxes(circleviewbox(nnewnode),viewbox0);
									drawcircle(canvas,circle(nnewnode.x,nnewnode.y,nnewnode.r),ncolor);
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
					// maxnsubiter = 3 * nsubiter;
				} else {
					lastindex = nodes.length-1;
				}
				lastindexs[lastpattern] = lastindex

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