// <script type="text/javascript" src="./d3.v3/d3.v3.min.js"></script>
// <script type="text/javascript" src="myd3.js"></script>
// <script type="text/javascript" src="sylvester.js"></script>
// <script type="text/javascript" src="QuadTree.js"></script>
// <script type="text/javascript" src="utils.js"></script>
// <script type="text/javascript" src="geoutils.js"></script>

function context () {
	var canvasname = "filler1";

	var w = 900,
		h = 900,
		background = "#141414";

	var canvas = initcanvas(canvasname,w,h,background);

	var bounds = new rectangle(-10000,-10000, 10000, 10000);

	var quadtree = new QuadTree(bounds, false, 7);

	var nodes = [];
		
	var iter = 0;
	var maxiter = 200000;
	var viewbox0 = [];

	function iterframe() {
		if (iter <= maxiter) {
			var nsubiter = 0;
			for (nsubiter = 0; nsubiter < 100; nsubiter++) {
				var newnode = circle(myrandom(),myrandom(),0.03);
				if (!checkcollisionquadtree(quadtree,newnode)) {
					nodes.push(newnode);
						
					var ncolor = d3.hsl(0.0, 1,1);

					quadtree.insert(newnode);
					viewbox0 = mergeviewboxes(circleviewbox(newnode),viewbox0);
					var c = circle(newnode.x,newnode.y,newnode.r * 0.5);
					drawcircle(canvas,c,ncolor);
				}
				iter++;
			}

			var viewviewbox = convertviewboxwidthheight(expandviewbox(viewbox0,1.1));
			resetviewbox(canvas,viewviewbox);
		}

		return (iter >= maxiter);
	}

	return iterframe;
}

startanim(context());


