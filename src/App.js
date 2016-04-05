import React, { Component } from 'react';
import '../node_modules/purecss/build/pure-min.css';
import './app.css';
import 'd3';
import graphData from './data/data.json';

export default class App extends React.Component {
	constructor(props) {
		super(props);
		// Init the state.
		this.state = {
			show: {
				topic: true,
				person: true,
				company: true,
				vertical: false
			},
			graph: Object.assign({}, graphData),
			degree: 2
		};
		// In ES6 we have to bind this to functions
		this.handleCheck = this.handleCheck.bind(this);
		this.handleDegreeChange = this.handleDegreeChange.bind(this);
		this.filterGraphForNewState = this.filterGraphForNewState.bind(this);
		this.updateGraph = this.updateGraph.bind(this);
	}	
	componentDidMount() {
		this.updateGraph();
	}
	handleCheck(event) {
		this.state.show[event.target.value] = event.target.checked;
		this.filterGraphForNewState();
		this.updateGraph();
	}
	filterGraphForNewState(){
		let nodes = []
		graphData.nodes.forEach((node) => {
			if (this.state.show[node.group] === true && node.distance <= this.state.degree) {
				nodes.push(node);
			}
		})
		this.state.graph.nodes = nodes;
		let nodeIds = nodes.map((node) => {
			return node.id;
		})
		let links = [];
		graphData.links.forEach((link) => {
			if (nodeIds.indexOf(link.source.id) > -1 && nodeIds.indexOf(link.target.id) > -1) {
				links.push(link);
			}
		})		
		this.state.graph.links = links;		
	}
	handleDegreeChange(event) {
		if (event.target.value === 'increment') {
			this.setState({'degree': this.state.degree += 1});
		} else {
			if (this.state.degree == 0) return;
			this.setState({'degree': this.state.degree -= 1});
		}
		this.filterGraphForNewState();
		this.updateGraph();		
	}
	updateGraph() {
		var width = document.body.clientWidth,
			height = 500;

		// Set a color scheme to draw from
		var color = d3.scale.ordinal()
			.domain(["topic", "person", "company", "vertical"])
			.range(["#fa544d", "#61DCAD" , "#F69657", "#4A4BA1"]);		

		// Create the force function to push stuff around
		var force = d3.layout.force()
			.charge(-250)
			.linkDistance(100)
			.size([width, height]);

		// grab the svg element rendered from the react render.
		var svg = d3.select("svg")
			.attr("width", width)
			.attr("height", height);

		// Add the force to nodes and edges
		let graph = this.state.graph;
		force
			.nodes(graph.nodes)
			.links(graph.links)
			.start();

		// first remove all existing nodes and labels
		svg.selectAll(".node").remove();
		svg.selectAll("text.label").remove();
		svg.selectAll(".link").remove();

		// Add all the edges 
		var link = svg.selectAll(".link")
			.data(graph.links)
			.enter().append("line")
			.attr("class", "link")
			.style("stroke-width", function(d) {
				return 1;
			});

		// Add all the nodes
		var node = svg.selectAll(".node")
			.data(graph.nodes)
			.enter().append("circle")
			.attr("class", "node")
			.attr("r", function(d) {
				return 8*Math.sqrt(1/(1+d.distance));
			})
			.style("fill", function(d) {
				return color(d.group);
			})
			.call(force.drag);


		// Add text labels
		var texts = svg.selectAll("text.label")
			.data(graph.nodes)
			.enter().append("text")
			.attr("class", "label")
			.attr("fill", function(d) {
				return color(d.group);
			})
			.text(function(d) {  return d.name;  });

		// Position everything on the svg canvas
		force.on("tick", function() {
			link.attr("x1", function(d) {
					return d.source.x;
				})
				.attr("y1", function(d) {
					return d.source.y;
				})
				.attr("x2", function(d) {
					return d.target.x;
				})
				.attr("y2", function(d) {
					return d.target.y;
				});

			node.attr("cx", function(d) {
					return d.x;
				})
				.attr("cy", function(d) {
					return d.y;
				});
			texts.attr("transform", function(d) {
				let offsetX = d.x + 5;
				let offsetY = d.y - 5;
				return "translate(" + offsetX + "," + offsetY + ")";
			});               				
		});		
	}
	render() {
		return ( 
			<div className="main-container">
				<fieldset>
					<label>SHOW: </label>
					<label style={{'color':'#fa544d'}}><input type="checkbox" onChange={this.handleCheck} value={'topic'} defaultChecked={this.state.show.topic} /> Topics</label>
					<label style={{'color':'#61DCAD'}}><input type="checkbox" onChange={this.handleCheck} value={'person'} defaultChecked={this.state.show.person} /> People</label>
					<label style={{'color':'#F69657'}}><input type="checkbox" onChange={this.handleCheck} value={'company'} defaultChecked={this.state.show.company} /> Companies</label>
					<label style={{'color':'#4A4BA1'}}><input type="checkbox" onChange={this.handleCheck} value={'vertical'} defaultChecked={this.state.show.vertical} /> Verticals</label>
					<button value={'decrement'} onClick={this.handleDegreeChange}>-</button>
					<button value={'increment'} onClick={this.handleDegreeChange}>+</button>
					<label style={{'paddingRight':'10px'}}>{this.state.degree} degrees</label>
				</fieldset>
				<svg ref={(svg) => this.svg = svg}></svg>
			</div>
		);
	}
}