

function bpatternbao(side,inodes) {
    this.lastindex = 1;
    this.nodes = inodes;
    this.side = side;

	this.iter = function(quadtree,canvas) {
		var nsubiter  = 2;
		var isubiter  = 0;
		var maxnsubiter = nsubiter;
		var lastindex = this.lastindex;
		var nodes     = this.nodes;
		var side      = this.side;
		var result    = [];  
		var nradiuss = lconcat(samples(1.0,10.0,30),samples(10.0,1.0,30));
		var ncollisions = 0;
		
		for (isubiter = 0; isubiter < maxnsubiter; isubiter++) {
				
			if (lastindex > -1) {

				// lastpattern += 1;
				// console.log(" lastindexs " + lastindexs +  " lastpattern "+lastpattern+" lastindex "+lastindex+" nodes "+nodes);

				var newfactor = rand(0.9,1.1);
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
								this.nodess = nodes;
									
								var ncolor = d3.hsl(((lastindex + 10)%(60))/(60)*360.0, 1.0, 0.5);
									
								quadtree.insert(nnewnode);
								drawcircle(canvas,circle(nnewnode.x,nnewnode.y,nnewnode.r),ncolor);
								found = true;
								result = [nnewnode];
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
									this.nodess = nodes;
									
									var ncolor = d3.hsl(((lastindex+10)%(60))/(60)*360.0, 1.0, 0.5);

									quadtree.insert(nnewnode);
									drawcircle(canvas,circle(nnewnode.x,nnewnode.y,nnewnode.r),ncolor);
									found = true;
									result = [nnewnode];
									break;
								}
							}
						}
					} 
				}

				if (!found) {
					// console.log("no newnode");
					lastindex = lastindex - 1;
					// maxnsubiter = 3 * nsubiter;
				} else {
					lastindex = nodes.length-1;
				}
				this.lastindex = lastindex;
			}
		}
		return result;
	}
}



function bpatternbaoswitch(sides,nradiuss,fcolor,inodes) {
    this.lastindex = 1;
    this.nodes = inodes;
    this.sides = sides;

	this.iter = function(quadtree,canvas) {
		var nsubiter    = 1;
		var maxnsubiter = nsubiter;
		var lastindex = this.lastindex;
		var nodes     = this.nodes;
		var sides     = this.sides;
		var result    = [];  
		// var nradiuss = lconcat(samples(1.0,3.0,21),samples(3.0,1.0,21));
		var ncollisions = 0;
		
		for (var isubiter = 0; isubiter < maxnsubiter; isubiter++) {
				
			if (lastindex > -1) {

				// console.log("isubiter ",isubiter);
				var lastnode = nodes[lastindex];
				var newr = lcircular(nradiuss,nodes.length);
				var bigr = lastnode.r + newr * 2.0;
				var bignode = new Circle(lastnode.x,lastnode.y,bigr);
				var side = lcircular(sides,nodes.length);

				var ccollidings = collidings(quadtree,bignode,0.0001);
				var found = false;
				var incrradiusfactor = 1.0;
				
				// console.log("ccollidings ",ccollidings.length);

				for (var icol = 0; icol < ccollidings.length; icol++) {
					var ccolliding = ccollidings[icol];
					if (lastnode != ccolliding)
					{
						var nnewnode = circles2tangent(lastnode,"OUT",ccolliding,"OUT",newr,side);
						if (nnewnode.x != NaN) {
							if (!checkcollisionquadtree(quadtree,nnewnode,0.0001)) {
								ncollisions = 0;
								nodes.push(nnewnode);
								this.nodess = nodes;
									
								insertquadtree(quadtree,nnewnode);
								drawcircle(canvas,new Circle(nnewnode.x,nnewnode.y,nnewnode.r*incrradiusfactor),fcolor(lastindex));
								found = true;
								result = [nnewnode];
								break;
							}
						}
					}
				} 


				if (!found) {
					// console.log("no newnode");
					lastindex = lastindex - 1;
					// maxnsubiter = 3 * nsubiter;
				} else {
					lastindex = nodes.length-1;
				}
				this.lastindex = lastindex;
			}
		}
		return result;
	}
}