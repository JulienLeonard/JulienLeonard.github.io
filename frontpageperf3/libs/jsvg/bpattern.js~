//
// abstract interface for bpattern computation
//
function bpattern(side,inodes) {
    this.lastindex = 1;
    this.nodes = inodes;
    this.side = side;

	this.iter = function(quadtree,canvas) {
		return [];
	}
}

//
// default bpattern packing
//

function plug(c1,c2,side) {
	return {c1: c1, c2: c2, side: side}
}

function bpatternparrot(inodes) {
    this.lastindex = 1;
    this.nodes     = inodes;
	this.front     = [plug(inodes[0],inodes[1],1.0),plug(inodes[0],inodes[1],-1.0)];
	this.nsubiter  = 10;
	this.nsubpattern = 100;

	this.iter = function(quadtree,canvas) {
		result = [];

		for (var i = 0; i < this.nsubpattern; i++)
		{
			var nend     = this.nsubiter;
			var oldfront = this.front.slice(0,nend);
			this.front   = this.front.slice(nend);
		
			for (var ifront = 0; ifront < oldfront.length; ++ifront) {
				var lastplug = oldfront[ifront];
				var c1 = lastplug.c1;
				var c2 = lastplug.c2;
				var side = lastplug.side;
				var newr = mymax([c1.r,c2.r])*0.99;
			
				if (newr > 0.05) {
					var newnode = circles2tangent(c1,"OUT",c2,"OUT",newr,side);
					if (!checkcollisionquadtree(quadtree,newnode)) {
						this.nodes.push(newnode);
						// quadtree.insert(newnode);
						insertquadtree(quadtree,newnode);

						// var ncolor = d3.hsl(((this.nodes.length + 10)%(600))/(600)*360.0, 1.0, 0.5);
						var ncolor = myhsla(((this.nodes.length + 10)%(60000))/(60000), 1.0, 0.5,1.0);
						drawcircle(canvas,circle(newnode.x,newnode.y,newnode.r),ncolor);

						var newfront = [plug(newnode,c1,-side)].concat(this.front.slice(0));
						this.front = newfront;
						newfront = [plug(c2,newnode,-side)].concat(this.front.slice(0));
						this.front = newfront;

						result.push(newnode);
					}
				}
			}
		}

		return result;
	}
}

function bpatternpacking(inodes) {
    this.lastindex = 1;
    this.nodes     = inodes;
    this.front     = [plug(inodes[0],inodes[1],1.0),plug(inodes[0],inodes[1],-1.0)];
    this.nsubiter  = 1000;

    this.iter = function(quadtree,canvas) {
	result = [];
	var iiter = 0;
	for (iiter = 0; iiter < this.nsubiter; iiter++) {
	    if (this.front.length > 0) {
		var lastplug = this.front[0];
		this.front = this.front.slice(1);
		var c1 = lastplug.c1;
		var c2 = lastplug.c2;
		var side = lastplug.side;
		var newr = mymax([c1.r,c2.r])*rand(0.9,0.97);
		
		if (newr > 0.3) {
		    var newnode = circles2tangent(c1,"OUT",c2,"OUT",newr,side);
		    if (!checkcollisionquadtree(quadtree,newnode)) {
			this.nodes.push(newnode);
			quadtree.insert(newnode);
			
			var ncolor = myhsla(((this.nodes.length + 10)%(60000))/(60000), 1.0, 0.5,1.0);
			drawcircle(canvas,circle(newnode.x,newnode.y,newnode.r),ncolor);

			this.front.push(plug(newnode,c1,-side));
			this.front.push(plug(c2,newnode,-side));
			this.front.push(plug(newnode,c1,side));
			this.front.push(plug(c2,newnode,side));

			result.push(newnode);
		    }
		}
	    }
	}

	return result;
    }
}

function bpatternpackingalternate(plugs,ratios) {
    this.lastindex = 1;
    // this.nodes = new Array(100000);
    // this.nodesindex = 0;
    // this.nodes     = inodes;
    // this.front     = [plug(inodes[0],inodes[1],1.0),plug(inodes[0],inodes[1],-1.0)];

    // this.front = plugs;
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
	// this.mmaplist = [];
	this.mratioindex = 0;
	var i = 0;
	for (i = 0; i < ratios.length - 1; i++) {
	    var ratio1  = ratios[i];
	    var ratio1b = ratios[i+1];
	    var ratio2  = ratio1/ratio1b;
	    var ratio3  = ratio1b/ratio1;
	    
	    // this.mmap[ratio1]             = lcircular(ratios,i+1);
	    this.mmap.set(this.ratioround(ratio1),ratio1b);
	    this.mmap.set(this.ratioround(ratio2),ratio1b);
	    this.mmap.set(this.ratioround(ratio3),ratio1b);

	    // this.mmaplist.push(ratio1);
	    // this.mmaplist.push(ratio2);
	    // this.mmaplist.push(ratio3);
	}

	// this.mmaplist.sort();
	// console.log("init list",this.mmaplist);
    };


    // this.ratioindex = function(ratio) {
    // 	var index0 = 0;
    // 	var index1 = this.mmaplist.length-1;

    // 	if (ratio < this.mmaplist[index0]) {
    // 	    return 0;
    // 	}
    // 	if (ratio > this.mmaplist[index1]) {
    // 	    return index1 + 1;
    // 	}
	
    // 	while (true) {
    // 	    var midindex = Math.floor((index0 + index1)/2);
    // 	    var rmiddle  = this.mmaplist[midindex] 
    // 	    if (ratio < rmiddle) {
    // 		index1 = midindex;
    // 	    } else {
    // 		index0 = midindex;
    // 	    }

    // 	    if (index1 - index0 < 2) {
    // 		break
    // 	    }
    // 	}
	
    // 	// console.log("ratioindex input",ratio,"result",index0);
    // 	return index0;
    // }
    
    // this.checkpreviousratios = function(ratio) {
    // 	var rindex = this.ratioindex(ratio);
    // 	var index0 = rindex;
    // 	if (index0 ==  this.mmaplist.length) {
    // 	    index0 = index0 - 1;
    // 	}
	
    // 	var r0 = this.mmaplist[index0];
    // 	if (Math.abs(r0 - ratio) < 0.00001) {
    // 	    // console.log("return known ratio r0",r0,"ratio",ratio);
    // 	    return [this.mmap[r0],null];
    // 	}

    // 	var index1 = rindex+1;
    // 	if (index1 < this.mmaplist.length) {
    // 	    var r1 = this.mmaplist[index1];
    // 	    if (Math.abs(r1 - ratio) < 0.00001) {
    // 		// console.log("return known ratio r1",r1,"ratio",ratio);
    // 		return [this.mmap[r1],null];
    // 	    }
    // 	}
    // 	return [null,rindex];
    // }

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
    
    // this.nextratio  = function(ratio) {
    // 	var vnextratio = this.checkpreviousratiosmap(ratio);
    // 	if (vnextratio == null) {
    // 	    vnextratio = lcircular(this.mratios,this.mratioindex);
    // 	    this.mmap[this.ratioround(ratio)] = vnextratio;
    // 	    // console.log("add ratio ",ratio," at index ", rindex+1, "list", this.mmaplist);
    // 	    // this.mmaplist.splice(rindex+1,0,ratio);
    // 	    this.mratioindex += 1;
    // 	}
    // 	return vnextratio;
    // };
    
    this.radiusf   = function(r1,r2) {
	var cr = r1/r2;
        var rr = r2;
        if (cr > 1.0) {
            cr = 1.0/cr;
            rr = r1;
	}
        //var result = this.nextratio(cr)
        //return r2 * result;
	// var vnextratio = this.checkpreviousratiosmap(cr);
	var crround = this.ratioround(cr);
	var vnextratio = null;
	if (this.mmap.has(crround)) {
	    vnextratio = this.mmap.get(crround);
	} else {
	    vnextratio = lcircular(this.mratios,this.mratioindex);
	    this.mmap.set(crround,vnextratio);
	    // console.log("add ratio ",ratio," at index ", rindex+1, "list", this.mmaplist);
	    // this.mmaplist.splice(rindex+1,0,cr);
	    this.mratioindex += 1;
	}
	return vnextratio * r2;
    };

    // this.getlastplug = function() {
    // 	var lastplug = null;
    // 	if (this.front.length > 0) {
    // 	    lastplug = this.front[0];
    // 	    // this.front = this.front.slice(1);
    // 	    this.front.shift();
    // 	}
    // 	return lastplug;
    // }

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

    
    // this.updatewithnewnode = function(c1,c2,side,newnode) {
    // 	// this.nodes.push(newnode);
    // 	this.front = [plug(newnode,c1,-side)].concat(this.front);
    // 	this.front.push(plug(newnode,c2,side));
    // }

    this.updatewithnewnode = function(c1,c2,side,newnode) {
	this.frontfrontindex += -1;
	this.front[this.frontfrontindex] = plug(newnode,c1,-side);
	// this.front = [plug(newnode,c1,-side)].concat(this.front);
	this.frontbackindex += 1;
	// this.front.push(plug(newnode,c2,side));
	this.front[this.frontbackindex] = plug(newnode,c2,side);
    }
    
    this.updateresult = function(result,newnode) {
	result.push(newnode);
	return result;
    }
    
    // this.iter = function(ccolgrid,canvas,niter) {
    this.iter = function(cquadtree,niter) {
	// console.log("todo iter",niter);
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
		    // if (!ccolgrid.collide(newnode)) {
		    if (!checkcollisionquadtree(cquadtree,newnode)) {
			// ccolgrid.add(newnode);
			insertquadtree(cquadtree,newnode);
			this.updatewithnewnode(c1,c2,side,newnode);
			// result = this.updateresult(result,newnode);
			this.result[this.resultindex] = newnode;
			this.resultindex += 1;
		    }
		}
	    }
	}

	// console.log("size front",this.frontbackindex - this.frontfrontindex,"size mmap ratio",Object.keys(this.mmap).length)
	return [this.result,this.resultindex];
    }
}


