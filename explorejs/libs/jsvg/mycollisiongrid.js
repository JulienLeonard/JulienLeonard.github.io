function Colgrid(xmin,ymin,xmax,ymax)
{
    this.xmin = xmin;
    this.xmax = xmax;
    this.ymin = ymin;
    this.ymax = ymax;
    this.ixmin = Math.floor(xmin * 10.0) - 1;
    this.ixmax = Math.ceil (xmax * 10.0) + 1;
    this.iymin = Math.floor(ymin * 10.0) - 1;
    this.iymax = Math.ceil (xmax * 10.0) + 1;
    // this.cellsize = 0.1;

    this.iwidth  = this.ixmax - this.ixmin;
    this.iheight = this.iymax - this.iymin;
    
    this.mgrid      = new Array(this.iwidth * this.iheight);
    this.mgridindex = new Array(this.iwidth * this.iheight);
    this.maxncircles = 0;
    
    var i = 0;
    var j = 0;
    for (i = 0; i < this.iwidth; i++) {
	for (j = 0; j < this.iheight; j++) {
	    var celli = i * this.iheight + j;
	    // this.mgrid[celli]      = new Array(100);
	    this.mgrid[celli] = null;
	    this.mgridindex[celli] = 0;
	}
    }

    this.collide = function(circle) {
	var cxmin = circle.x - circle.r;
	var cymin = circle.y - circle.r;
	var cxmax = circle.x + circle.r;
	var cymax = circle.y + circle.r;

	var icxmin = Math.floor(cxmin * 10.0) - this.ixmin;
	var icxmax = Math.ceil(cxmax * 10.0)  - this.ixmin;
	var icymin = Math.floor(cymin * 10.0) - this.iymin;
	var icymax = Math.ceil(cymax * 10.0)  - this.iymin;

	var i = 0;
	var j = 0;
	for (i = icxmin; i < icxmax; i++) {
	    for (j = icymin; j < icymax; j++) {
		var celli = i * this.iheight + j;
		var cell = this.mgrid[celli];
		var cci = 0;
		if (this.mgridindex[celli] > 0) {
		    for (cci = 0; cci < this.mgridindex[celli]; cci++) {
			var cc = cell[cci];
			if (arecirclescolliding(circle,cc)) {
			    return true;
			}
		    }
		}
	    }
	}
	return false;
    }

    this.add = function(circle) {
	var cxmin = circle.x - circle.r;
	var cymin = circle.y - circle.r;
	var cxmax = circle.x + circle.r;
	var cymax = circle.y + circle.r;

	var icxmin = Math.floor(cxmin * 10.0) - this.ixmin;
	var icxmax = Math.ceil(cxmax * 10.0)  - this.ixmin;
	var icymin = Math.floor(cymin * 10.0) - this.iymin;
	var icymax = Math.ceil(cymax * 10.0)  - this.iymin;

	var i = 0;
	var j = 0;
	for (i = icxmin; i < icxmax; i++) {
	    for (j = icymin; j < icymax; j++) {
		var celli = i * this.iheight + j;
		var gridindex = this.mgridindex[celli];
		if (gridindex == 0) {
		    this.mgrid[celli] = new Array(10);
		}
		this.mgrid[celli][gridindex] = circle;
		this.mgridindex[celli] += 1;
		//if (gridindex + 1 > this.maxncircles) {
		//    this.maxncircles = gridindex + 1;
		//    console.log("this.maxncircles",this.maxncircles,"ncells",(icxmax - icxmin)*(icymax - icymin));
		//}
	    }
	} 	
    }
}




