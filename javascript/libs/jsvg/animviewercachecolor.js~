// <script type="text/javascript" src="./d3.v3/d3.v3.min.js"></script>
// <script type="text/javascript" src="myd3.js"></script>
// <script type="text/javascript" src="sylvester.js"></script>
// <script type="text/javascript" src="myquadtree.js"></script>
// <script type="text/javascript" src="utils.js"></script>
// <script type="text/javascript" src="geoutils.js"></script>
// <script type="text/javascript" src="bpattern.js"></script>
// <script type="text/javascript" src="bpatternbao.js"></script>

// canvasname() and circledata() must come from the data script
//


var canvasname    = canvasname();
var quadtree      = null;
var lastpatternid = 0;
var patterns      = [];
var canvas        = null;
var realcanvas    = null;

var circledata = circledata();
var colorlist  = buildcolorcache(colorcache());

function buildcolorcache(rawcolorcache) {
    var result = [];
    for (var iresult = 0; iresult < rawcolorcache.length ; iresult++) {
	var rawcolor = rawcolorcache[iresult];
	result.push(Color.prototype.rgba(rawcolor[0],rawcolor[1],rawcolor[2],rawcolor[3]));
    }
    return result;
}

function getcolorfromcache(index) {
    return colorlist[index];
}

function context () {

    background = Color.prototype.grey(0.9);
    
    canvas = initcanvas(canvasname,background);

    var niter = 0;
    var viewbox0 = [];
    var ncircles = 1.5;

    viewbox0 = mergeviewboxes(circleviewbox(new Circle(0.0,1.0,1.0)),circleviewbox(new Circle(2.0,3.0,1.0)));

    console.log("init viewbox0",viewbox0);

    function iterframe() {

	console.log("iterframe",ncircles);

	ncircles = Math.pow(ncircles,1.01);
	var incircles = Math.round(ncircles);
	if (incircles > 1000) {
	    incircles = 1000;
	}
	
	
	if (niter < circledata.length) {
	    if ((niter % 1000) == 0) {
		console.log("niter ",niter," circledata.length ",circledata.length);
	    }
	    
	    for (var iresult = 0; iresult < incircles && iresult + niter < circledata.length ; iresult++) {
		var newdatanode = circledata[niter + iresult];
		var newnode = circle(newdatanode[0],newdatanode[1],newdatanode[2]);
		// var newcolor = Color.prototype.rgba(newdatanode[3],newdatanode[4],newdatanode[5],newdatanode[6])
		var newcolor = getcolorfromcache(newdatanode[3]);
		drawcircle(canvas,newnode,newcolor);
		viewbox0 = mergeviewboxes(circleviewbox(newnode),viewbox0);
	    }
	    niter += incircles;
	}
	
	var viewviewbox = squareviewbox(expandviewbox(viewbox0,1.1));
	

	resetviewbox(canvas,viewviewbox);

	if (niter >= circledata.length) {
	    // var data = canvas.toDataURL();
	    // var win = window.open();
	    // win.document.write("<img src='" + data + "'/>");
            // Canvas2Image.saveAsPNG(renderer.view);
	    // console.log("iter maxiter stops");
	}

	return relaunchloop(niter < circledata.length,iterframe);
    }

    return iterframe;
}

function main() {
    startanim(context())
}

// startanim(context());

window.addEventListener('load', main);
window.addEventListener('resize', resizeCanvas);


