// <script type="text/javascript" src="./d3.v3/d3.v3.min.js"></script>
// <script type="text/javascript" src="myd3.js"></script>
// <script type="text/javascript" src="sylvester.js"></script>
// <script type="text/javascript" src="myquadtree.js"></script>
// <script type="text/javascript" src="utils.js"></script>
// <script type="text/javascript" src="geoutils.js"></script>
// <script type="text/javascript" src="bpattern.js"></script>
// <script type="text/javascript" src="bpatternbao.js"></script>


var canvasname    = "migration3";
var quadtree      = null;
var lastpatternid = 0;
var patterns    = [];
var canvas = null;

function fdraw(canvas,pattern,lastindex) {
	var ncolor = d3.hsl((((lastindex+2)%41)/41)*360.0, 1.0, 0.5);
	var newnode  = pattern.nodes[pattern.nodes.length-1];
	var lastnode = pattern.nodes[pattern.nodes.length-2];

	// drawcircle(canvas,lastnode,ncolor);
	
	var seg = [ccenter(newnode),ccenter(lastnode)];
	var ccircles = linecircles(seg[0],seg[1],5);
	for (var ic = 0; ic < ccircles.length; ic++) {
		var ccircle = ccircles[ic];
		// console.log(" ccircle ", ccircle.x,"",ccircle.y);
		var light = 0.0;
		if (lcircular(pattern.sides,lastindex+1) < 0) {
			light = 1.0;
		}
		// drawcircle(canvas,new Circle(ccircle.x,ccircle.y,newnode.r/2.0),ncolor);
		drawcircle(canvas,new Circle(ccircle.x,ccircle.y,newnode.r/2.0),d3.hsl(0.0,1.0,1.0));
	}
}


function context () {

	initrandomseed(0);

	var w = 900,
		h = 900,
	    background = "#333366";
	

	canvas = initcanvas(canvasname,w,h,background);

	var iter = 0;
	var maxiter = 15300;
	var viewbox0 = [];


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

		var newnodes = [new Circle(-1.0,0.0,1.0),new Circle(1.0,0.0,1.0)];
		// var newnodes = [new Circle(eventcoords[0]-1.0,eventcoords[1],1.0),new Circle(eventcoords[0]+1.0,eventcoords[1],1.0)];

		// drawcircle(canvas,circle(eventcoords[0],eventcoords[1],10.0),d3.hsl(myrandom() * 360.0, 1,1));
		if (!checkcollisionquadtree(quadtree,newnodes[0],0.001) && !checkcollisionquadtree(quadtree,newnodes[1],0.001)) {

			var inode = 0;
			for (inode = 0; inode < newnodes.length; inode++) {
				// var ncolor = d3.hsl(myrandom()*360.0, 1.0, 0.5);
				var ncolor = d3.hsl((1%1600/(1600))*360.0, 1.0, 1.0);
				insertquadtree(quadtree,newnodes[inode]);
				drawcircle(canvas,newnodes[inode],ncolor);
			}

			var side = 1.0;
			if (patterns.length % 2 == 0) {
				side = 1.0;
			}

			// function(lastindex) {return d3.hsl(((lastindex+10)%(41))/(41)*360.0, 1.0, ((lastindex+10)%(10))/(10));},
			var bside = new BS();
			bside.push(100).push(2);
			var sides = bside.list();


			// color: function(lastindex) {return d3.hsl(((lastindex)%(28))/(28)*360.0, 1.0,0.7);},
			// function(lastindex) {return d3.hsl((100.0 + 50.0*lcircular(sides,lastindex+1)), 1.0,0.7);},
			   
			var newpattern = new bpatternbaoswitch(sides,
												   lconcat(samples(1.0,1.0,75),samples(1.0,1.0,75)),
												   newnodes,
												   fdraw);
			patterns.push(newpattern);

			// maxiter = (sides.length-2)*30;
		}
	};


	// document.getElementsByTagName("body")[0].addEventListener("touchstart",touchdrawcircle,false);
	// var body = document.getElementsByTagName("body")[0];
	// body.addEventListener("mousedown",touchdrawcircle,false);


	canvas.on("mousedown",touchdrawcircle, false);
	canvas.on("touchstart",touchdrawcircle, false);


	quadtree = initquadtree();
	console.log("quadtree " + quadtree);


	viewbox0 = mergeviewboxes(circleviewbox(new Circle(0.0,0.0,10.0)),circleviewbox(new Circle(10.0,1.0,10.0)));
 

	function iterframe() {

		if (iter <= maxiter && patterns.length > 0) {
			// console.log("iter ",iter);
			lastpatternid += 1;
			lastpattern = lcircular(patterns,lastpatternid);
			result = lastpattern.iter(quadtree,canvas);

			for (var iresult = 0; iresult < result.length; iresult++) {
				var nnewnode = result[iresult];
				viewbox0 = mergeviewboxes(circleviewbox(nnewnode),viewbox0);
			}
			iter += result.length;
		}
	
		if (patterns.length > 0) {
			// var qcircles = quadtree.circles();
			// console.log("quadtree.circles",qcircles.length);
			// for (var ic = 0; ic < qcircles.length; ic++) {
			// 	drawcircle(canvas,circle(qcircles[ic].x,qcircles[ic].y,qcircles[ic].radius * 0.5),d3.hsl(0.0,1.0,0.5));
			// }

			if (false) {
				var allquads = quadtree.leaves();
				// console.log("quadtree.quads",allquads.length);
				for (var iquad = 0; iquad < allquads.length; iquad++) {
					var quad = allquads[iquad];
					if (quad.isdrawn != true) {
						var p1 = new Point(quad.xmin,quad.ymin);
						var p2 = new Point(quad.xmax,quad.ymin);
						var p3 = new Point(quad.xmax,quad.ymax);
						var p4 = new Point(quad.xmin,quad.ymax);
						// console.log("quad i ",iquad, " descr ",quad.descr());

						var segs = [[p1,p2],[p2,p3],[p3,p4],[p4,p1]];
						for (iseg = 0; iseg < segs.length; iseg++) {
							var seg = segs[iseg];
							var ccircles = linecircles(seg[0],seg[1],10);
							for (var ic = 0; ic < ccircles.length; ic++) {
								var ccircle = ccircles[ic];
								// console.log(" ccircle ", ccircle.x,"",ccircle.y);
								drawcircle(canvas,new Circle(ccircle.x,ccircle.y,0.1),d3.hsl(180.0,1.0,1.0));
							}
						}
						quad.isdrawn = true;
					}
				}
			}
		}



		var viewviewbox = convertviewboxwidthheight(expandviewbox(viewbox0,1.5));
		resetviewbox(canvas,viewviewbox);

		return (iter >= maxiter);
	}

	return iterframe;
}

startanim(context());

