
function plug(c1,c2,side) {
	return {c1: c1, c2: c2, side: side}
}

function bpatternpackingalternate(plugs,ratios) {
    this.lastindex = 1;
    var frontsize = 20000;
    this.front = new Array(frontsize);
    this.frontfrontindex = frontsize / 2;
    this.frontbackindex  = frontsize / 2;

    var i = 0;
    for (i = 0; i < plugs.length; i++) {
	this.front[this.frontbackindex] = plugs[i];
	this.frontbackindex += 1;
    }
    
    this.minsize = 0.01;
    this.maxsize = 0.5;
    
    this.initratios = function(ratios) {
	this.mratios = ratios;
	this.mmap = new Map();
	this.mratioindex = 0;
	var i = 0;
	for (i = 0; i < ratios.length - 1; i++) {
	    var ratio1  = ratios[i];
	    var ratio1b = ratios[i+1];
	    var ratio2  = ratio1/ratio1b;
	    var ratio3  = ratio1b/ratio1;
	    
	    this.mmap.set(this.ratioround(ratio1),ratio1b);
	    this.mmap.set(this.ratioround(ratio2),ratio1b);
	    this.mmap.set(this.ratioround(ratio3),ratio1b);
	}
    };

    this.ratioround = function(ratio) {
	return Math.round(ratio * Math.pow(10, 6)) / Math.pow(10, 6);
    }

    this.initratios(ratios);

    this.checkpreviousratiosmap = function(ratio) {
	var rratio = this.ratioround(ratio); 
	if  (self.mmap.has(rratio)) {
	    return self.mmap.get(rratio)
	}
	return null;
    }
        
    this.radiusf   = function(r1,r2) {
	var cr = r1/r2;
        var rr = r2;
        if (cr > 1.0) {
            cr = 1.0/cr;
            rr = r1;
	}
	var crround = this.ratioround(cr);
	var vnextratio = null;
	if (this.mmap.has(crround)) {
	    vnextratio = this.mmap.get(crround);
	} else {
	    vnextratio = lcircular(this.mratios,this.mratioindex);
	    this.mmap.set(crround,vnextratio);
	    this.mratioindex += 1;
	}
	return vnextratio * r2;
    };

    this.getlastplug = function() {
	var lastplug = null;
	if (this.frontfrontindex != this.frontbackindex) {
	    lastplug = this.front[this.frontfrontindex];
	    // this.front = this.front.slice(1);
	    // this.front.shift();
	    this.frontfrontindex += 1;
	}
	return lastplug;
    }

    this.updatewithnewnode = function(c1,c2,side,newnode) {
	this.frontfrontindex += -1;
	this.front[this.frontfrontindex] = plug(newnode,c1,-side);
	this.frontbackindex += 1;
	this.front[this.frontbackindex] = plug(newnode,c2,side);
    }
    
    this.updateresult = function(result,newnode) {
	result.push(newnode);
	return result;
    }
    
    this.iter = function(cquadtree,niter) {
	this.result = new Array(niter);
	this.resultindex = 0;
	var iiter = 0;
	for (iiter = 0; iiter < niter; iiter++) {
	    var lastplug = this.getlastplug();
	    if (lastplug) {
		var c1 = lastplug.c1;
		var c2 = lastplug.c2;
		var side = lastplug.side;
		var newr = this.radiusf(c1.r,c2.r);
		if (newr > this.minsize && newr < this.maxsize) {
		    var coords = circles2tangentoptim(c1,c2,newr,side);
		    var newnode = new Circle(coords[0],coords[1],coords[2]);
		    if (!checkcollisionquadtree(cquadtree,newnode)) {
			insertquadtree(cquadtree,newnode);
			this.updatewithnewnode(c1,c2,side,newnode);
			this.result[this.resultindex] = newnode;
			this.resultindex += 1;
		    }
		}
	    }
	}
	return [this.result,this.resultindex];
    }
}
