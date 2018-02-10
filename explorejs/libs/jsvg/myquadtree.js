
function Quad(xmin,ymin,xmax,ymax,errormargin)
{
    this.xmin = xmin;
    this.xmax = xmax;
    this.ymin = ymin;
    this.ymax = ymax;
    this.xmiddle = (xmin+xmax)/2.0;
    this.ymiddle = (ymin+ymax)/2.0;    
    this.nsubquadsperside = 2;
    this.subquadslength = this.nsubquadsperside * this.nsubquadsperside;
    this.subquads  = new Array(this.subquadslength);
    this.subquadsdone = false;
    this.MAXCIRCLENUMBER = 50;
    this.circlemap = new Array(this.MAXCIRCLENUMBER);
    this.circlemapindex = 0;

    this.errormargin = errormargin
    this.xmaxerror = (this.xmax *(1.0 + errormargin));
    this.xminerror = (this.xmin *(1.0 - errormargin));
    this.ymaxerror = (this.ymax *(1.0 + errormargin));
    this.yminerror = (this.ymin *(1.0 - errormargin));
}

// Quad.prototype.leaves = function() {
//     var result = []
//     if (this.subquadsdone) {
// 	for (var isubquad = 0; isubquad < this.subquadslength; isubquad++) {
// 	    var csubquad = this.subquads[isubquad];
// 	    result = result.concat(csubquad.leaves());
// 	}
//     } else {
// 	result.push(this);
//     }
//     return result;
// }

Quad.prototype.descr = function() {
	return "- xmin " + this.xmin + " xmax " + this.xmax + " ymin " + this.ymin + " ymax " + this.ymax;
};

// Quad.prototype.circles = function() {
//     var result = [];
//     if (this.subquadsdone) {
// 	for (var isubquad = 0; isubquad < this.subquadslength; isubquad++) {
// 	    var csubquad = this.subquads[isubquad];
// 	    result = result.concat(csubquad.circles());
// 	}
//     }
//     result = result.concat(this.circlemap);
//     return result;
// };

Quad.prototype.intersect = function(circle) {
    var cx = circle.x;
    var cy = circle.y;
    var cr = circle.r;
    var xmin = cx - cr;
    var ymin = cy - cr;
    var xmax = cx + cr;
    var ymax = cy + cr;
	
    var result = false;
    if ((xmin <= this.xmaxerror) && (xmax >= this.xminerror) && (ymin <= this.ymaxerror) && (ymax >= this.yminerror)) {
	result = true;
    }

    return result;
};

Quad.prototype.add = function(circle) {
/* NO INCREASE OF THE QUADTREE
    if (!this.intersect(circle)) {
	var xmin = circle.x - circle.r;
	var ymin = circle.y - circle.r;
	var xmax = circle.x + circle.r;
	var ymax = circle.y + circle.r;

	if (xmin < this.xmin) {this.xmin = xmin;}
	if (ymin < this.ymin) {this.ymin = ymin;}
	if (xmax > this.xmax) {this.xmax = xmax;}
	if (ymax > this.ymax) {this.ymax = ymax;}
        
	this.insert(circle);
    } else { */
	this.addwithoutcheck(circle);
    // }
};

// TODO        
// Quad.prototype.pop = function(push) {
// 	if (push in this.circlemap) {
// 	   this.circlemap.pop(push)
// 		}
// 	for subquad in this.subquads:
//             subquad.pop(push)

Quad.prototype.addwithoutcheck = function(circle) {
    if (this.subquadsdone) {
	this.dispatch(circle);
    } else {
	this.insert(circle);
    }
};
        
Quad.prototype.dispatch = function(circle) {
// NO NEED TO CHECK: checked before call    if (this.subquadsdone) {
	for (var isubquad = 0; isubquad < this.subquadslength; isubquad++) {
	    var subquad = this.subquads[isubquad];
	    if (subquad.intersect(circle)) {
		subquad.addwithoutcheck(circle);
	    }
	}
    // }
};

Quad.prototype.ncircles = function() {
    return this.circlemapindex;
};

Quad.prototype.insert = function(circle) {
    // console.log("insert",circle.descr(),this.descr());
    this.circlemap[this.circlemapindex] = circle;
    this.circlemapindex += 1;
    
    if (this.circlemapindex == this.MAXCIRCLENUMBER && (this.xmax - this.xmin) > 0.0001) {
	this.split();
    }
};

// Quad.prototype.split = function() {
//     var middlex = (this.xmin + this.xmax)/2.0;
//     var middley = (this.ymin + this.ymax)/2.0;
        
//     this.subquads[0]=(new Quad(this.xmin,this.ymin,middlex,middley) );
//     this.subquads[1]=(new Quad(this.xmin,middley,middlex, this.ymax) );
//     this.subquads[2]=(new Quad(middlex,middley,this.xmax, this.ymax) );
//     this.subquads[3]=(new Quad(middlex,this.ymin,this.xmax, middley) );

//     this.subquadsdone = true;
    
//     for (var icircle = 0; icircle < this.circlemapindex; icircle++) {
// 	var ccircle = this.circlemap[icircle];
// 	this.dispatch(ccircle);
//     }

//     this.circlemapindex = 0;
// };

Quad.prototype.split = function() {
    var incrx = (this.xmax - this.xmin) / (this.nsubquadsperside);
    var incry = (this.ymax - this.ymin) / (this.nsubquadsperside);
    // console.log("split",this.xmax-this.xmin,this.ymax-this.ymin);
    
    var qi = 0;
    var qj = 0;
    var ncx = 0.0;
    var ncy = 0.0;

    var cx = this.xmin;
    var cy = this.ymin;
    for (qi = 0; qi < this.nsubquadsperside;qi++) {
	cy = this.ymin;
	if (qi < this.nsubquadsperside - 1) {
	    ncx = cx + incrx;
	} else {
	    ncx = this.xmax;
	}
	for (qj = 0; qj < this.nsubquadsperside;qj++) {
	    if (qj < this.nsubquadsperside - 1) {
		ncy = cy + incry;
	    } else {
		ncy = this.ymax;
	    }
	    this.subquads[qi * this.nsubquadsperside + qj] = (new Quad(cx,cy,ncx,ncy,this.errormargin));
	    // console.log("subquad created",qi * this.nsubquadsperside + qj,"cx,cy,ncx,ncy",cx,cy,ncx,ncy);
	    cy = ncy;
	}
	cx = ncx;
    }
    
    this.subquadsdone = true;
    
    for (var icircle = 0; icircle < this.circlemapindex; icircle++) {
	var ccircle = this.circlemap[icircle];
	this.dispatch(ccircle);
    }

    this.circlemapindex = 0;
};

Quad.prototype.hascollision = function(newcircle) {
    /* NO NEED TO CHECK: checked before  */
    // if (!this.intersect(newcircle)) {
    // 	return false;
    // }

    // console.log("hascollision",newcircle,this.descr());
    
    var errormargin = this.errormargin;
    
    if (this.subquadsdone) {
	for (var isubquad = 0; isubquad < this.subquadslength; isubquad++) {
	    var subquad = this.subquads[isubquad];
	    if (subquad.intersect(newcircle)) {
		if (subquad.hascollision(newcircle, errormargin)) {
		    return true;
		}
	    }
	}
	return false;

	// var is0 = true;
	// var is1 = true;
	// var is2 = true;
	// var is3 = true;
	// if ((newcircle.x - newcircle.r) > this.xmiddle * (1.0 + errormargin) ) {
	//     is0 = false;
	//     is2 = false;
	// } else {
	//     if ((newcircle.x + newcircle.r) < this.xmiddle * (1.0 - errormargin)) {
	// 	is1 = false;
	// 	is3 = false;
	//     }
	// }
	// if ((newcircle.y - newcircle.r) > this.ymiddle * (1.0 + errormargin)) {
	//     is0 = false;
	//     is1 = false;
	// } else {
	//     if ((newcircle.y + newcircle.r) < this.ymiddle * (1.0 - errormargin)) {
	// 	is2 = false;
	// 	is3 = false;
	//     }
	// }
	// if (is0) {
	//     var subquad = this.subquads[0];
	//     if (subquad.hascollision(newcircle, errormargin)) {
	// 	return true;
	//     }
	// }
	// if (is1) {
	//     var subquad = this.subquads[1];
	//     if (subquad.hascollision(newcircle, errormargin)) {
	// 	return true;
	//     }
	// }
	// if (is2) {
	//     var subquad = this.subquads[2];
	//     if (subquad.hascollision(newcircle, errormargin)) {
	// 	return true;
	//     }
	// }
	// if (is3) {
	//     var subquad = this.subquads[3];
	//     if (subquad.hascollision(newcircle, errormargin)) {
	// 	return true;
	//     }
	// }
	// return false;

    }
    else
    {
	for (var icircle = 0; icircle < this.circlemapindex; icircle++) {
	    var ccircle = this.circlemap[icircle];
	    if (arecirclescolliding(newcircle,ccircle,errormargin)) {
		return true;
	    }
	}
    }
    return false;
}

// Quad.prototype.mayintersect = function(newcircle) {
//     var result = []
//     if (this.intersect(newcircle)) {
// 	if (this.subquads.length) {
// 	    for (var isubquad = 0; isubquad < this.subquads.length; isubquad++) {
// 		var subquad = this.subquads[isubquad];
// 		if (subquad.intersect(newcircle)) {
// 		    var subresult = subquad.mayintersect(newcircle);
// 		    result = result.concat(subresult);
// 		}
// 	    }
// 	}
// 	else
// 	{
// 	    result = result.concat(this.circlemap);
// 	}
//     }
//     return result;
// };

// Quad.prototype.bbox = function() {
// 	return [this.xmin,this.ymin,this.xmax,this.ymax];
// }

function QuadTree(xmin,ymin,xmax,ymax,errormargin) {
    this.errormargin = errormargin;
    this.rootquad = new Quad(xmin,ymin,xmax,ymax,errormargin);
};

QuadTree.prototype.add = function(circle) {
    this.rootquad.add(circle);
};

QuadTree.prototype.adds = function(circles) {
    for (var icircle = 0; icircle < circles.length; icircle++) {
	var ccircle = circles[icircle];
	this.add(ccircle);
    }
    return this;
};

QuadTree.prototype.iscollidingoptim = function(newcircle) {
    return this.rootquad.hascollision( newcircle );
};


// QuadTree.prototype.collidings = function(newcircle,errormargin) {
//     var result = [];
//     var circles = this.rootquad.mayintersect( newcircle );
//     for (var icircle = 0; icircle < circles.length; icircle++) {
// 	var ccircle = circles[icircle];
// 	if (arecirclescolliding(newcircle,ccircle,errormargin)) {
// 	    result.push(ccircle);
// 	}
//     }
//     return result;
// };
 
// QuadTree.prototype.circles = function() {
//     return this.rootquad.circles();
// };

// QuadTree.prototype.leaves = function() {
//     return this.rootquad.leaves();
// };
// xmin, ymin, axmax, ymax must be multiples of cellsize
function MetaQuadTree(xmin,ymin,xmax,ymax,cellsize,errormargin) {
    this.errormargin = errormargin;
    this.xmin = xmin;
    this.xmax = xmax;
    this.ymin = ymin;
    this.ymax = ymax;
    this.cellsize = cellsize;
    var ncellsx = Math.floor((xmax - xmin)/cellsize);
    var ncellsy = Math.floor((ymax - ymin)/cellsize);
    this.mquadtrees = new Array(ncellsx);
    var cellxmin = xmin;
    for (var i =0; i < ncellsx; i++) {
	// columns = []; 
	this.mquadtrees[i] = new Array(ncellsy);
	var cellxmax = cellxmin + cellsize;
	var cellymin = ymin; 
	for (var j = 0; j < ncellsy; j++) {
	    var cellymax = cellymin + cellsize;
	    // console.log("create quadtree",cellxmin,cellymin,cellxmax,cellymax);
	    this.mquadtrees[i][j] = new QuadTree(cellxmin,cellymin,cellxmax,cellymax,errormargin);
	    // columns[j] = new QuadTree(cellxmin,cellymin,cellxmax,cellymax,errormargin);
	    cellymin = cellymax;
	}
	// this.mquadtrees[i] = columns;
	cellxmin = cellxmax;
    }
};

MetaQuadTree.prototype.add = function(circle) {
    var xmin = (circle.x - circle.r) * (1.0 - this.errormargin);
    var xmax = (circle.x + circle.r) * (1.0 + this.errormargin);
    var ymin = (circle.y - circle.r) * (1.0 - this.errormargin);
    var ymax = (circle.y + circle.r) * (1.0 + this.errormargin);

    var cellmini =  Math.floor((xmin - this.xmin)/this.cellsize);
    var cellmaxi =  Math.floor((xmax - this.xmin)/this.cellsize);
    var cellminj =  Math.floor((ymin - this.ymin)/this.cellsize);
    var cellmaxj =  Math.floor((ymax - this.ymin)/this.cellsize);

    // console.log("cellmini",cellmini,"cellmaxi",cellmaxi,"cellminj",cellminj,"cellmaxj",cellmaxj);
    
    for (var i =cellmini; i < cellmaxi + 1; i++) {
	for (var j =cellminj; j < cellmaxj + 1; j++) {
	    this.mquadtrees[i][j].add(circle);
	}
    }
};

MetaQuadTree.prototype.adds = function(circles) {
    for (var icircle = 0; icircle < circles.length; icircle++) {
	var ccircle = circles[icircle];
	this.add(ccircle);
    }
    return this;
};

MetaQuadTree.prototype.iscollidingoptim = function(circle) {
    var xmin = (circle.x - circle.r) * (1.0 - this.errormargin);
    var xmax = (circle.x + circle.r) * (1.0 + this.errormargin);
    var ymin = (circle.y - circle.r) * (1.0 - this.errormargin);
    var ymax = (circle.y + circle.r) * (1.0 + this.errormargin);

    var cellmini =  Math.floor((xmin - this.xmin)/this.cellsize);
    var cellmaxi =  Math.floor((xmax - this.xmin)/this.cellsize);
    var cellminj =  Math.floor((ymin - this.ymin)/this.cellsize);
    var cellmaxj =  Math.floor((ymax - this.ymin)/this.cellsize);

    // console.log("cellmini",cellmini,"cellmaxi",cellmaxi,"cellminj",cellminj,"cellmaxj",cellmaxj);

    for (var i =cellmini; i < cellmaxi + 1; i++) {
	for (var j =cellminj; j < cellmaxj + 1; j++) {
	    var result = this.mquadtrees[i][j].iscollidingoptim(circle)
	    if (result) {return result;}
	}
    }
    return false;
};
