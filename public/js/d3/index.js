var nodeColorArray = [];
var colorPointer = 0;

function selectionChange(sel){
console.log("in start of selectionChange");
    var value = sel.options[sel.selectedIndex].value;
    var nodeToFind = _nodes.filter(function(n) { 
      return n.assigned == value 
    })[0];
    
    collapse(root);
    expandParent(nodeToFind);
    
    update(root);
    centerNode(nodeToFind);
console.log("in end of selectionChange");
}

function expandParent(n) {
console.log("in start of expandParent");
 
  if (n._children) {
    n.children = n._children;
    //d.children.forEach(expand);
    n._children = null;
console.log("in end of expandParent");
  }
  
  if (n.parent){
    expandParent(n.parent);
  }
}

// Get JSON data
treeData = NSDocFlowJSON;
console.log("treeData="+treeData);

    // Calculate total nodes, max label length
    var totalNodes = 0;
    var maxLabelLength = 0;
    // variables for drag/drop
    var selectedNode = null;
    var draggingNode = null;
    // panning variables
    var panSpeed = 200;
    var panBoundary = 20; // Within 20px from edges will pan when dragging.
    // Misc. variables
    var i = 0;
    var duration = 750;
    var root;

    var margin = {top: -205, right: -200, bottom: -205, left: -200};
    
    // size of the diagram
    var viewerWidth = $("div-tree").width();
    var viewerHeight = $("div-tree").height();

    viewerWidth = viewerWidth - margin.right - margin.left;
    viewerHeight = viewerHeight - margin.top - margin.bottom;
    
    var tree = d3.layout.tree()
        .size([viewerHeight, viewerWidth]);

    // define a d3 diagonal projection for use by the node paths later on.
    var diagonal = d3.svg.diagonal()
        .projection(function(d) {
            console.log("in start of diagonal projection");
            return [d.y, d.x];
        });

    // A recursive helper function for performing some setup by walking through all nodes
    function visit(parent, visitFn, childrenFn) {
        console.log("in start of visit");
        if (!parent) return;

        visitFn(parent);

        var children = childrenFn(parent);
        if (children) {
            var count = children.length;
            for (var i = 0; i < count; i++) {
                visit(children[i], visitFn, childrenFn);
            }
        }
       console.log("in end of visit");
    }

    // Call visit function to establish maxLabelLength
    visit(treeData, function(d) {
console.log("in start of visit max len func"+d.assigned);
        totalNodes++;
        maxLabelLength = Math.max(d.assigned.length, maxLabelLength);

    }, function(d) {
        return d.children && d.children.length > 0 ? d.children : null;
    });


    // sort the tree according to the node names

    function sortTree() {
console.log("in start of sortTree");
        tree.sort(function(a, b) {
            return b.assigned.toLowerCase() < a.assigned.toLowerCase() ? 1 : -1;
        });
    }
    // Sort the tree initially incase the JSON isn't in a sorted order.
    sortTree();

    // TODO: Pan function, can be better implemented.

    function pan(domNode, direction) {
console.log("in start of pan");
        var speed = panSpeed;
        if (panTimer) {
            clearTimeout(panTimer);
            translateCoords = d3.transform(svgGroup.attr("transform"));
            if (direction == 'left' || direction == 'right') {
                translateX = direction == 'left' ? translateCoords.translate[0] + speed : translateCoords.translate[0] - speed;
                translateY = translateCoords.translate[1];
            } else if (direction == 'up' || direction == 'down') {
                translateX = translateCoords.translate[0];
                translateY = direction == 'up' ? translateCoords.translate[1] + speed : translateCoords.translate[1] - speed;
            }
            scaleX = translateCoords.scale[0];
            scaleY = translateCoords.scale[1];
            scale = zoomListener.scale();
            svgGroup.transition().attr("transform", "translate(" + translateX + "," + translateY + ")scale(" + scale + ")");
            d3.select(domNode).select('g.node').attr("transform", "translate(" + translateX + "," + translateY + ")");
            zoomListener.scale(zoomListener.scale());
            zoomListener.translate([translateX, translateY]);
            panTimer = setTimeout(function() {
                pan(domNode, speed, direction);
            }, 50);
        }
console.log("in start of pan");
    }

    // Define the zoom function for the zoomable tree
    function zoom() {
console.log("in start of zoom");
console.log("d3.event.translate==="+d3.event.translate);
console.log("d3.event.scale==="+d3.event.scale);
        svgGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
console.log("in end of zoom");
    }



         

    // define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents
console.log("in start of zoomListener ");
    var zoomListener = d3.behavior.zoom().scaleExtent([0.1, 3]).on("zoom", zoom);
console.log("in start of zoomListener ===="+zoomListener );
    // define the baseSvg, attaching a class for styling and the zoomListener
    var baseSvg = d3.select("#div-tree").append("svg:svg")
         .attr("width", viewerWidth)
         .attr("height", viewerHeight)
         .attr("class", "overlay")
         .call(zoomListener)
        

    // Define the drag listeners for drag/drop behaviour of nodes.
    dragListener = d3.behavior.drag()
        .on("dragstart", function(d) {
            if (d == root) {
                return;
            }
            dragStarted = true;
            nodes = tree.nodes(d);
            d3.event.sourceEvent.stopPropagation();
            // it's important that we suppress the mouseover event on the node being dragged. Otherwise it will absorb the mouseover event and the underlying node will not detect it d3.select(this).attr('pointer-events', 'none');
        })
        .on("drag", function(d) {
            if (d == root) {
                return;
            }
            if (dragStarted) {
                domNode = this;
                initiateDrag(d, domNode);
            }

            // get coords of mouseEvent relative to svg container to allow for panning
            relCoords = d3.mouse($('svg').get(0));
            if (relCoords[0] < panBoundary) {
                panTimer = true;
                pan(this, 'left');
            } else if (relCoords[0] > ($('svg').width() - panBoundary)) {

                panTimer = true;
                pan(this, 'right');
            } else if (relCoords[1] < panBoundary) {
                panTimer = true;
                pan(this, 'up');
            } else if (relCoords[1] > ($('svg').height() - panBoundary)) {
                panTimer = true;
                pan(this, 'down');
            } else {
                try {
                    clearTimeout(panTimer);
                } catch (e) {

                }
            }

            d.x0 += d3.event.dy;
            d.y0 += d3.event.dx;
            var node = d3.select(this);
            node.attr("transform", "translate(" + d.y0 + "," + d.x0 + ")");
            updateTempConnector();
        }).on("dragend", function(d) {
            if (d == root) {
                return;
            }
            domNode = this;
            if (selectedNode) {
                // now remove the element from the parent, and insert it into the new elements children
                var index = draggingNode.parent.children.indexOf(draggingNode);
                if (index > -1) {
                    draggingNode.parent.children.splice(index, 1);
                }
                if (typeof selectedNode.children !== 'undefined' || typeof selectedNode._children !== 'undefined') {
                    if (typeof selectedNode.children !== 'undefined') {
                        selectedNode.children.push(draggingNode);
                    } else {
                        selectedNode._children.push(draggingNode);
                    }
                } else {
                    selectedNode.children = [];
                    selectedNode.children.push(draggingNode);
                }
                // Make sure that the node being added to is expanded so user can see added node is correctly moved
                expand(selectedNode);
                sortTree();
                endDrag();
            } else {
                endDrag();
            }
        });

    function endDrag() {
        selectedNode = null;
        d3.selectAll('.ghostCircle').attr('class', 'ghostCircle');
        d3.select(domNode).attr('class', 'node');
        // now restore the mouseover event or we won't be able to drag a 2nd time
        d3.select(domNode).select('.ghostCircle').attr('pointer-events', '');
        updateTempConnector();
        if (draggingNode !== null) {
            update(root);
            centerNode(draggingNode);
            draggingNode = null;
        }
    }

    // Helper functions for collapsing and expanding nodes.

    function collapse(d) {
console.log("in start of collapse");
        if (d.children) {
            d._children = d.children;
            d._children.forEach(collapse);
            d.children = null;
        }
console.log("in end of collapse");
    }

    function expand(d) {
console.log("in start of expand");
        if (d._children) {
            d.children = d._children;
            d.children.forEach(expand);
            d._children = null;
        }
console.log("in end of expand");
    }

    var overCircle = function(d) {
        selectedNode = d;
        updateTempConnector();
    };
    var outCircle = function(d) {
        selectedNode = null;
        updateTempConnector();
    };

    // Function to update the temporary connector indicating dragging affiliation
    var updateTempConnector = function() {
        var data = [];
        if (draggingNode !== null && selectedNode !== null) {
            // have to flip the source coordinates since we did this for the existing connectors on the original tree
            data = [{
                source: {
                    x: selectedNode.y0,
                    y: selectedNode.x0
                },
                target: {
                    x: draggingNode.y0,
                    y: draggingNode.x0
                }
            }];
        }
        var link = svgGroup.selectAll(".templink").data(data);

        link.enter().append("path")
            .attr("class", "templink")
            .attr("d", d3.svg.diagonal())
            .attr('pointer-events', 'none');

        link.attr("d", d3.svg.diagonal());

        link.exit().remove();
    };

    // Function to center node when clicked/dropped so node doesn't get lost when collapsing/moving with large amount of children.

    function centerNode(source) {
console.log("in start of centerNode");
        scale = zoomListener.scale();
        x = -source.y0;
        y = -source.x0;
        x = x * scale + viewerWidth / 2;
        y = y * scale + viewerHeight / 2;
        d3.select('g').transition()
            .duration(duration)
            .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
        zoomListener.scale(scale);
        zoomListener.translate([x, y]);
console.log("in end of centerNode");
    }

    // Toggle children function

    function toggleChildren(d) {
console.log("in start of toggleChildren");
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else if (d._children) {
            d.children = d._children;
            d._children = null;
        }
console.log("in end of toggleChildren");
        return d;
    }

    // Toggle children on click.

    function click(d) {
console.log("in start of click");
console.log("d3.event.defaultPrevented=="+d3.event.defaultPrevented);
        if (d3.event.defaultPrevented) return; // click suppressed
tooltipdiv.style("opacity", 0.5)
                      .style("visibility", "hidden");
console.log("in start of click before toggle");
        d = toggleChildren(d);
console.log("in start of click after toggle");
tooltipdiv.style("opacity", 0.5)
                      .style("visibility", "hidden");
console.log("in start of click before upadte");
        update(d);
console.log("in start of click after upadte");
tooltipdiv.style("opacity", 0.5)
                      .style("visibility", "hidden");
console.log("in start of click before centernode");
        centerNode(d);
        tooltipdiv.style("opacity", 0.5)
                      .style("visibility", "hidden");
console.log("in end of click");
        }


    function update(source) {
console.log("in start of update");
        // Compute the new height, function counts total children of root node and sets tree height accordingly.
        // This prevents the layout looking squashed when new nodes are made visible or looking sparse when nodes are removed
        // This makes the layout more consistent.
        var levelWidth = [1];
        var childCount = function(level, n) {

            if (n.children && n.children.length > 0) {
                if (levelWidth.length <= level + 1) levelWidth.push(0);

                levelWidth[level + 1] += n.children.length;
                n.children.forEach(function(d) {
                    childCount(level + 1, d);
                });
            }
        };
        childCount(0, root);
        var newHeight = d3.max(levelWidth) * 25; // 25 pixels per line  
        tree = tree.size([newHeight, viewerWidth]);

        // Compute the new tree layout.
        var nodes = tree.nodes(root).reverse(),
            links = tree.links(nodes);

        // Set widths between levels based on maxLabelLength.
        nodes.forEach(function(d) {
            d.y = (d.depth * (maxLabelLength * 10)); //maxLabelLength * 10px
            // alternatively to keep a fixed scale one can set a fixed depth per level
            // Normalize for fixed-depth by commenting out below line
            // d.y = (d.depth * 500); //500px per level.
        });
     // we are adding the color div here
                                          
                                                                                          
        // Update the nodesÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦
        node = svgGroup.selectAll("g.node")
            .data(nodes, function(d) {
                return d.id || (d.id = ++i);
            });
        var ChildNode = NSTranId;
        console.log("ChildNode="+ChildNode);
        // Enter any new nodes at the parent's previous position.
        var nodeEnter = node.enter().append("g")
            .call(dragListener)
            .attr("class", "node")
            .attr("transform", function(d) {
                return "translate(" + source.y0 + "," + source.x0 + ")";
            })
             
     
            .on('click', click)

            .on("contextmenu", function(d) {
                                                                mouseout(); 
                                                                 //stop showing browser menu
                                                                 d3.event.preventDefault();  
                                                                navigatediv = d3.select("body").append("div")
                                                                                      .attr("class","navdiv")  
                                                                                      .attr("id","navdivid")  
                                                                                      .style("visibility", "visible")
                                                                                      .style("top", d3.event.pageY + "px")
                                                                                      .style("left", d3.event.pageX + "px")
//https://system.na1.netsuite.com/core/media/media.nl?id=7670&c=TSTDRV990882&h=1cea4222209f211440d6
                                                                                      .html("<div class='popupmain'><div class='arrowimg'><img src='https://system.na1.netsuite.com/c.TSTDRV1174726/suitebundle37771/Document%20Flow/img/popup_arrow.png' width='28' height='11' /></div><div class='popupbox'><div class='popupheader'><div class='headertext'><a href="+d.href+" target=_blank>Open</a></div></div></div></div>");
// target=_self   -----------Open link in same tab                                                                target=_blank--------------------------------------------Open link in new tab

                                                                                       var ulId = document.getElementById("navdivid");
                                                                                       if(ulId)
                                                                                       {
                                                                                                  document.getElementById("navdivid").addEventListener("mouseenter",navigatemouseenter,true);
                                                                                                  document.getElementById("navdivid").addEventListener("mouseleave",navigatemouseleave,true);
                                                                                        }
                                                              })//End of contextmenu, rightclick func
                .on("mouseover", function(d){
                                                                tooltipdiv = d3.select("body")
                                                                                 .append("div")
                                                                                 .attr("class", "tooltip")
                                                                                    
                                                                            if(d.name=="customer") { customerHtml(d); }
                                                                            else {transactionHtml(d);}

                                                                })//End of mouse over func
                .on("mouseout", mouseout);//End of mouse out func

function customerHtml(d)
{
                    tooltipdiv
                                .style("visibility", "visible")
                                .style("top", d3.event.pageY + "px")
                                .style("left", d3.event.pageX + "px")
//https://system.na1.netsuite.com/core/media/media.nl?id=7670&c=TSTDRV990882&h=1cea4222209f211440d6
//https://system.na1.netsuite.com/core/media/media.nl?id=7671&c=TSTDRV990882&h=b6c288de58891da0f502
                                //.html("<div class='popupmain'><div class='arrowimg'><img src='https://system.na1.netsuite.com/c.TSTDRV1174726/suitebundle37771/Document%20Flow/img/popup_arrow.png' width='28' height='11' /></div><div class='popupbox1'><div class='popupheader1'><div class='headericon'><img src='https://system.na1.netsuite.com/c.TSTDRV1174726/suitebundle37771/Document%20Flow/img/popuptitle-ARROW.png' width='22' height='22' /></div><div class='headertext'>Customer</div></div><div class='popupcontent'><p><font color='#00B9B8'>Customer Id: </font>"+d.assigned+"</p></div></div></div>");
								.html("<div class='popupmain'><div class='arrowimg'><img src='https://system.na1.netsuite.com/c.TSTDRV1174726/suitebundle37771/Document%20Flow/img/popup_arrow.png' width='28' height='11' /></div><div class='popupbox1'><div class='popupheader1'><div class='headericon'><img src='https://system.na1.netsuite.com/c.TSTDRV1174726/suitebundle37771/Document%20Flow/img/popuptitle-ARROW.png' width='22' height='22' /></div><div class='headertext'>Customer</div></div><div class='popupcontent'><p><font color='#00B9B8'>Purchase Order: </font>"+d.assigned+"</p></div></div></div>");
}//End of customerHTML
function transactionHtml(d)
{
var date1 = d.date;
/*var datetime = d.date.split(' ');
var date1 = "";
var time1 = "";
var ampm1 = "";
if(datetime[0] != '' && datetime[0] != null && datetime[0] != 'undefined')
{
     date1 = datetime[0];
}
if(datetime[1] != '' && datetime[1] != null && datetime[1] != 'undefined')
{
     time1 = datetime[1];
}
if(datetime[2] != '' && datetime[2] != null && datetime[2] != 'undefined')
{
     ampm1 = datetime[2];
}*/
   tooltipdiv
                                .style("visibility", "visible")
                                .style("top", d3.event.pageY + "px")
                                .style("left", d3.event.pageX + "px")
//https://system.na1.netsuite.com/core/media/media.nl?id=7670&c=TSTDRV990882&h=1cea4222209f211440d6
//https://system.na1.netsuite.com/core/media/media.nl?id=7671&c=TSTDRV990882&h=b6c288de58891da0f502
//                                .html("<div class='popupmain'><div class='arrowimg'><img src='https://system.na1.netsuite.com/c.TSTDRV1174726/suitebundle37771/Document%20Flow/img/popup_arrow.png' width='28' height='11' /></div><div class='popupbox1'><div class='popupheader1'><div class='headericon'><img src='https://system.na1.netsuite.com/c.TSTDRV1174726/suitebundle37771/Document%20Flow/img/popuptitle-ARROW.png' width='22' height='22' /></div><div class='headertext'>"+d.name+"</div></div><div class='popupcontent'><p><font color='#00B9B8'>Trans. Id: </font>"+d.assigned+"<br><font color='#00B9B8'>Date: </font>"+date1+"<br><font color='#00B9B8'>Time: </font>"+time1+" "+ampm1+"<br><font color='#00B9B8'>Status: </font>"+d.status+"</p></div></div></div>");
 .html("<div class='popupmain'><div class='arrowimg'><img src='https://system.na1.netsuite.com/c.TSTDRV1174726/suitebundle37771/Document%20Flow/img/popup_arrow.png' width='28' height='11' /></div><div class='popupbox1'><div class='popupheader1'><div class='headericon'><img src='https://system.na1.netsuite.com/c.TSTDRV1174726/suitebundle37771/Document%20Flow/img/popuptitle-ARROW.png' width='22' height='22' /></div><div class='headertext'>"+d.name+"</div></div><div class='popupcontent'><p><font color='#00B9B8'>Trans. Id: </font>"+d.assigned+"<br><font color='#00B9B8'>Date: </font>"+date1+"<br><font color='#00B9B8'>Status: </font>"+d.status+"</p></div></div></div>");
}//End of transactionHTML

function navigatemouseenter(){}

function navigatemouseleave(){element = document.getElementById("navdivid");if(element){element.parentNode.removeChild(element);}}
               
function mouseout(){   tooltipdiv.style("opacity", 0.5)    .style("visibility", "hidden");    }

        nodeColorArray = [];
        colorPointer = 0;

        nodeEnter.append("circle")
            .attr('class', 'nodeCircle')
            .attr("r", 0)
            .style("fill", function(d) {        return d.name ? "lightsteelblue" : "";      })

            .style("stroke", function(d) { 
console.log("in stroke");
                                                  if(ChildNode != " " && ChildNode != null && ChildNode != "undefined" && ChildNode != "::" && ChildNode === d.assigned )
                                                  {return d.assigned === ChildNode ? "red" : "";}
                                                  else if(ChildNode == "::" && d.name === "customer"){return d.name === "customer" ? "red" : "";}

                                                  else{
                                                  if(d.name === "customer"){ return d.name ? "mediumseagreen" : "";}
                                                  else if(d.name === "Opportunity"){ return d.name  ? "darkslateblue" : "";}
                                                  else if(d.name === "Estimate"){ return d.name  ? "olive" : "";}
                                                  else if(d.name === "Quote"){ return d.name  ? "olive" : "";}
                                                  else if(d.name === "Sales Order"){ return d.name  ? "teal" : "";}
                                                  else if(d.name === "Item Shipment"){ return d.name  ? "saddlebrown" : "";}
                                                  else if(d.name === "Invoice"){ return d.name  ? "black" : "";}
                                                  else if(d.name === "Payment"){ return d.name  ? "tomato" : "";}
                                                  else if(d.name === "Cash Sale"){ return d.name  ? "magenta" : "";}
                                                  else if(d.name === "Purchase Order"){ return d.name  ? "orangered" : "";}
                                                  else if(d.name === "Assembly Build"){ return d.name  ? "mediumblue" : "";}
                                                  else if(d.name === "Work Order"){ return d.name  ? "darkgreen" : "";}
                                                  else if(d.name === "Packing List"){ return d.name  ? "indigo" : "";}
                                                  else if(d.name === "Item Receipt"){ return d.name  ? "darkorange" : "";}
                                                  else if(d.name === "Return Authorization"){ return d.name  ? "deeppink" : "";}
                                                  else if(d.name === "Bill Payment"){ return d.name  ? "lime" : "";}
                                                  else if(d.name === "Bill"){ return d.name  ? "dimgray" : "";}
                                                  else if(d.name === "Currency Revaluation"){ return d.name  ? "crimson" : "";}
                                                   }
console.log("end stroke");
                    });

   

             nodeEnter.append("text")
            .attr("x", function(d) {
                return d.children || d._children ? -10 : 10;
            })
            .attr("dy", ".35em")
            .attr('class', 'nodeText')
            .attr("text-anchor", function(d) {
                return d.children || d._children ? "end" : "start";
            })
            .text(function(d) {
                return d.assigned;
            })
            .style("fill-opacity", 0);
            

        // phantom node to give us mouseover in a radius around it
        nodeEnter.append("circle")
            .attr('class', 'ghostCircle')
            .attr("r", 30)
            .attr("opacity", 0.2) // change this to zero to hide the target area
        .style("fill", "red")
            .attr('pointer-events', 'mouseover')
            .on("mouseover", function(node) {
                overCircle(node);
            })
            .on("mouseout", function(node) {
                outCircle(node);
            });

        // Update the text to reflect whether node has children or not.
        node.select('text')
            .attr("x", function(d) {
                return d.children || d._children ? -10 : 10;
            })
            .attr("text-anchor", function(d) {
                return d.children || d._children ? "end" : "start";
            })
            .text(function(d) {
                return d.assigned;
            });

        // Change the circle fill depending on whether it has children and is collapsed
        node.select("circle.nodeCircle")
            .attr("r", 4.5)
            .style("fill", function(d) {
            //    return d._children ? "lightsteelblue" : "#fff";

                                                  if(ChildNode != " " && ChildNode != null && ChildNode != "undefined" && ChildNode != "::" && ChildNode === d.assigned )
                                                  { return d._children ? "red" : "#fff"; }
                                                  else if(ChildNode == "::" && d.name === "customer"){return d._children ? "red" : "#fff";}
                                                  else{
                                                    if(d.name === "customer"){ return d._children ? "mediumseagreen" : "";}
                                                  else if(d.name === "Opportunity"){ return d._children ? "darkslateblue" : "";}
                                                  else if(d.name === "Estimate"){ return d._children ? "olive" : "";}
                                                  else if(d.name === "Quote"){ return d._children ? "olive" : "";}
                                                  else if(d.name === "Sales Order"){ return d._children ? "teal" : "";}
                                                  else if(d.name === "Item Shipment"){ return d._children ? "saddlebrown" : "";}
                                                  else if(d.name === "Invoice"){ return d._children ? "black" : "";}
                                                  else if(d.name === "Payment"){ return d._children ? "tomato" : "";}
                                                  else if(d.name === "Cash Sale"){ return d._children ? "magenta" : "";}
                                                  else if(d.name === "Purchase Order"){ return d._children ? "orangered" : "";}
                                                  else if(d.name === "Assembly Build"){ return d._children ? "mediumblue" : "";}
                                                  else if(d.name === "Work Order"){ return d._children ? "darkgreen" : "";}
                                                  else if(d.name === "Packing List"){ return d._children ? "indigo" : "";}
                                                  else if(d.name === "Item Receipt"){ return d._children ? "darkorange" : "";}
                                                  else if(d.name === "Return Authorization"){ return d._children ? "deeppink" : "";}
                                                  else if(d.name === "Bill Payment"){ return d._children ? "lime" : "";}
                                                  else if(d.name === "Bill"){ return d._children ? "dimgray" : "";}
                                                  else if(d.name === "Currency Revaluation"){ return d._children ? "crimson" : "";}
                                                   }
            });
        
        // Change the circle fill depending on whether it has children and is collapsed
        node.select("text")
            .style("fill", function(d) {
            
                                                 if(ChildNode != " " && ChildNode != null && ChildNode != "undefined" && ChildNode != "::" && ChildNode === d.assigned )
                                                  {return d.assigned === ChildNode ? "red" : "";}
                                                  else if(ChildNode == "::" && d.name === "customer"){return d.assigned ? "red" : "";}

                                                  else{
                                                  if(d.name === "customer"){ return d.assigned ? "mediumseagreen" : "";}
                                                  else if(d.name === "Opportunity"){ return d.assigned ? "darkslateblue" : "";}
                                                  else if(d.name === "Estimate"){ return d.assigned ? "olive" : "";}
                                                  else if(d.name === "Quote"){ return d.assigned ? "olive" : "";}
                                                  else if(d.name === "Sales Order"){ return d.assigned ? "teal" : "";}
                                                  else if(d.name === "Item Shipment"){ return d.assigned ? "saddlebrown" : "";}
                                                  else if(d.name === "Invoice"){ return d.assigned ? "black" : "";}
                                                  else if(d.name === "Payment"){ return d.assigned ? "tomato" : "";}
                                                  else if(d.name === "Cash Sale"){ return d.assigned ? "magenta" : "";}
                                                  else if(d.name === "Purchase Order"){ return d.assigned ? "orangered" : "";}
                                                  else if(d.name === "Assembly Build"){ return d.assigned ? "mediumblue" : "";}
                                                  else if(d.name === "Work Order"){ return d.assigned ? "darkgreen" : "";}
                                                  else if(d.name === "Packing List"){ return d.assigned ? "indigo" : "";}
                                                  else if(d.name === "Item Receipt"){ return d.assigned ? "darkorange" : "";}
                                                  else if(d.name === "Return Authorization"){ return d.assigned ? "deeppink" : "";}
                                                  else if(d.name === "Bill Payment"){ return d.assigned ? "lime" : "";}
                                                  else if(d.name === "Bill"){ return d.assigned ? "dimgray" : "";}
                                                  else if(d.name === "Currency Revaluation"){ return d.assigned ? "crimson" : "";}
                                                   }
            });

        // Transition nodes to their new position.
        var nodeUpdate = node.transition()
            .duration(duration)
            .attr("transform", function(d) {
                return "translate(" + d.y + "," + d.x + ")";
            });

        // Fade the text in
        nodeUpdate.select("text")
            .style("fill-opacity", 1);

        // Transition exiting nodes to the parent's new position.
        var nodeExit = node.exit().transition()
            .duration(duration)
            .attr("transform", function(d) {
                return "translate(" + source.y + "," + source.x + ")";
            })
            .remove();

        nodeExit.select("circle")
            .attr("r", 0);

        nodeExit.select("text")
            .style("fill-opacity", 0);

        // Update the links
        var link = svgGroup.selectAll("path.link")
            .data(links, function(d) {
                return d.target.id;
            });

        // Enter any new links at the parent's previous position.
        link.enter().insert("path", "g")
            .attr("class", "link")
            .attr("d", function(d) {
                var o = {
                    x: source.x0,
                    y: source.y0
                };
                return diagonal({
                    source: o,
                    target: o
                });
            });

        // Transition links to their new position.
        link.transition()
            .duration(duration)
            .attr("d", diagonal);

        // Transition exiting nodes to the parent's new position.
        link.exit().transition()
            .duration(duration)
            .attr("d", function(d) {
                var o = {
                    x: source.x,
                    y: source.y
                };
                return diagonal({
                    source: o,
                    target: o
                });
            })
            .remove();

        // Stash the old positions for transition.
        nodes.forEach(function(d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });
      
      return nodes;
    }


    // Append a group which holds all nodes and which the zoom Listener can act upon.
    var svgGroup = baseSvg.append("g");

                                          
    // Define the root
    root = treeData;
    root.x0 = viewerHeight / 2;
    root.y0 = 0;

    // Layout the tree initially and center on the root node.
    var _nodes = update(root);
    centerNode(root);
// });
