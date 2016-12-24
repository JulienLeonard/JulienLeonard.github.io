// <script type="text/javascript" src="./d3.v3/d3.v3.min.js"></script>
// <script type="text/javascript" src="myd3.js"></script>
// <script type="text/javascript" src="sylvester.js"></script>
// <script type="text/javascript" src="QuadTree.js"></script>
// <script type="text/javascript" src="utils.js"></script>
// <script type="text/javascript" src="geoutils.js"></script>
// <script type="text/javascript" src="bpattern.js"></script>
// <script type="text/javascript" src="bpatternbao.js"></script>


var canvasname    = "migration";
var quadtree      = null;
var lastpatternid = 0;
var patterns    = [];




function context () {

	initrandomseed(0);

	var w = 900,
		h = 900,
	    background = "#000000";
	

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
				// var ncolor = d3.hsl(myrandom()*360.0, 1.0, 0.5);
				var ncolor = d3.hsl((1%1600/(1600))*360.0, 1.0, 0.5);
				quadtree.insert(newnodes[inode]);
				drawcircle(canvas,newnodes[inode],ncolor);
			}

			var side = 1.0;
			if (patterns.length % 2 == 0) {
				side = 1.0;
			}

			// function(lastindex) {return d3.hsl(((lastindex+10)%(41))/(41)*360.0, 1.0, ((lastindex+10)%(10))/(10));},
			var sides = [];
			var iside = 0;
			var cside = 1.0;
			for (iside = 1; iside < 2; iside+=1) {
				var ine = 0;
				for (ine = 0; ine < 1; ine++) {
					sides = sides.concat(lfill(cside,iside*150));
					cside = -1.0 * cside;
			    }
				// sides = sides.concat(lfill(-cside,iside));
				
			}
			// sides = sides.concat(lfill(-1.0,12));

			var newpattern = new bpatternbaoswitch(sides,
												   lconcat(samples(1.0,1.0,10),samples(1.0,1.0,10)),
												   function(lastindex) {return d3.hsl(((lastindex)%(28))/(28)*360.0, 1.0,0.5);},
												   newnodes);
			patterns.push(newpattern);
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
	var maxiter = 1;
	var viewbox0 = [];

	viewbox0 = mergeviewboxes(circleviewbox(circle(0.0,0.0,10.0)),circleviewbox(circle(10.0,1.0,10.0)));
 

	function iterframe() {

		if (iter <= maxiter && patterns.length > 0) {
			lastpatternid += 1;
			lastpattern = lcircular(patterns,lastpatternid);
			result = lastpattern.iter(quadtree,canvas);
			var iresult = 0;
			for (iresult = 0; iresult < result.length; iresult++) {
				var nnewnode = result[iresult];
				// quadtree.insert(nnewnode);
				viewbox0 = mergeviewboxes(circleviewbox(nnewnode),viewbox0);
			}
			iter++;
		}

		var viewviewbox = convertviewboxwidthheight(expandviewbox(viewbox0,1.5));
		resetviewbox(canvas,viewviewbox);
	
		return (iter >= maxiter);
	}

	return iterframe;
}

startanim(context());