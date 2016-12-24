// <script type="text/javascript" src="./d3.v3/d3.v3.min.js"></script>
// <script type="text/javascript" src="myd3.js"></script>
// <script type="text/javascript" src="sylvester.js"></script>
// <script type="text/javascript" src="myquadtree.js"></script>
// <script type="text/javascript" src="utils.js"></script>
// <script type="text/javascript" src="geoutils.js"></script>
// <script type="text/javascript" src="bpattern.js"></script>
// <script type="text/javascript" src="bpatternbao.js"></script>


var canvasname    = "curvy";
var quadtree      = null;
var lastpatternid = 0;
var patterns      = [];
var canvas        = null;
var realcanvas    = null;

var circledata = [ [ [-1.0,0.0,0.5], [1.0,1.0,1.0,1.0] ],
	       [ [1.0,0.0,0.5], [1.0,1.0,1.0,1.0] ],
	       [ [2.22044604925e-16,1.73205080757,1.0], [1.0,1.0,1.0,1.0] ],
	       [ [3.4450928484e-16,3.73205080757,1.0], [1.0,1.0,1.0,1.0] ],
	       [ [0.151319123304,5.72631822267,1.0], [1.0,1.0,1.0,1.0] ],
	       [ [0.453089920189,7.70342074559,1.0], [1.0,1.0,1.0,1.0] ],
	       [ [0.903582463942,9.65202446826,1.0], [1.0,1.0,1.0,1.0] ],
	       [ [1.50021426781,11.5609588544,1.0], [1.0,1.0,1.0,1.0] ],
	       [ [2.23956508932,13.4192807756,1.0], [1.0,1.0,1.0,1.0] ],
	       [ [3.11739653711,15.2163372436,1.0], [1.0,1.0,1.0,1.0] ],
	       [ [4.12867636789,16.9418264797,1.0], [1.0,1.0,1.0,1.0] ],
	       [ [5.26760733416,18.5858569703,1.0], [1.0,1.0,1.0,1.0] ],
	       [ [6.52766041746,20.1390041711,1.0], [1.0,1.0,1.0,1.0] ],
	       [ [7.90161225651,21.5923645338,1.0], [1.0,1.0,1.0,1.0] ],
	       [ [9.38158655575,22.9376065468,1.0], [1.0,1.0,1.0,1.0] ],
	       [ [10.9590992368,24.1670184961,1.0], [1.0,1.0,1.0,1.0] ],
	       [ [12.6251070744,25.2735526732,1.0], [1.0,1.0,1.0,1.0] ],
	       [ [14.3700595371,26.2508657771,1.0], [1.0,1.0,1.0,1.0] ],
	       [ [17.9978475364,27.9358447776,3.0], [1.0,1.0,1.0,1.0] ],
	       [ [21.7427220069,29.3415172858,1.0], [1.0,1.0,1.0,1.0] ],
	       [ [23.6151592421,30.0443535398,1.0], [1.0,1.0,1.0,1.0] ],
	       [ [25.5354058076,30.6035074792,1.0], [1.0,1.0,1.0,1.0] ],
	       [ [27.4924537267,31.0157737065,1.0], [1.0,1.0,1.0,1.0] ],
	       [ [29.4750840563,31.2787888705,1.0], [1.0,1.0,1.0,1.0] ],
	       [ [31.4719311994,31.3910452144,1.0], [1.0,1.0,1.0,1.0] ],
		   [ [33.4715480605,31.3518992194,1.0], [1.0,1.0,1.0,1.0] ] ];


function context () {

    background = Color.prototype.black();
    
    canvas = initcanvas(canvasname,background);

    var niter = 0;
    var viewbox0 = [];

    viewbox0 = mergeviewboxes(circleviewbox(new Circle(0.0,1.0,1.0)),circleviewbox(new Circle(2.0,3.0,1.0)));

    console.log("init viewbox0",viewbox0);

    function iterframe() {

	var ncircles = 2;
	
	if (iter < circledata.length) {
	    if ((iter % 1000) == 0) {
		console.log("iter ",iter);
	    }
	    
	    for (var iresult = 0; iresult < ncircles && iresult + niter < circledata.length ; iresult++) {
		var newnodedata = circledata[iresult];
		var newnode   = newdatanode[0];
		var newcolor  = newdatanode[1];
		drawcircle(canvas,circle(newnode[0],newnode[1],newnode[2]),Color(newcolor[0],newcolor[1],newcolor[2],newcolor[3]));
		viewbox0 = mergeviewboxes(circleviewbox(nnewnode),viewbox0);
	    }
	    iter += result.length;
	}
	
	var viewviewbox = squareviewbox(expandviewbox(viewbox0,1.1));
	

	resetviewbox(canvas,viewviewbox);

	if (iter >= maxiter) {
	    // var data = canvas.toDataURL();
	    // var win = window.open();
	    // win.document.write("<img src='" + data + "'/>");
            // Canvas2Image.saveAsPNG(renderer.view);
	    // console.log("iter maxiter stops");
	}

	return relaunchloop(iter < maxiter,iterframe);
    }

    return iterframe;
}

function main() {
    startanim(context())
}

// startanim(context());

window.addEventListener('load', main);
window.addEventListener('resize', resizeCanvas);
