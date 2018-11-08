var Chart = {
	margin: null,
	chartWidth: null,
	chartHeight: null,
	barWidth: 13,
	svg: null,

	fileName: null,
	data: null,
	isNumerical: null,
	isOrdinalNumerical: null,
	isBinary: null,
	group1: [],
	group2: [],
	barChartData: null,

	init: function(margin, className) {
		var self = this;
		var height = $("." + className).height();
		var width = $("." + className).width();

		self.margin = margin;
		self.svg = d3.select("." + className + " svg");
		self.chartHeight = height - self.margin.top - self.margin.bottom;
		self.chartWidth = width - self.margin.left - self.margin.right;
	},
	draw: function(URL, callback = null) {
		var self = this;

		d3.csv(URL, function(data) {
			self.removeCharts();
			self.clearData();

			var strings = URL.split("/");
			self.fileName = strings[strings.length - 1];
			self.loadData(data);
			self.retrieveObjects();
			self.drawCharts();
			self.initTooltip();
			if (callback) callback();
		});
	},
	removeCharts: function() {
		var self = this;
		self.svg.selectAll("*").remove();
	},
	clearData: function() {
		var self = this;

		self.fileName = null;
		self.group1 = [];
		self.group2 = [];
		self.data = null;
		self.isNumerical = null;
		self.isOrdinalNumerical = null;
		self.isBinary = null;
		self.barChartData = null;
	},
	loadData: function(data) {
		var self = this;
		self.isNumerical = true;
		self.isBinary = true;
		self.data = data;

		for (var i = 0; i < self.data.length; i++) {
			if (isNaN(self.data[i].attributeValue))
				self.isNumerical = false;
			if (self.data[i].attributeValue != "0" && self.data[i].attributeValue != "1")
				self.isBinary = false;
		}

		if (self.isBinary) {
			self.isNumerical = false;
		}
		if (self.isNumerical) {
			for (var i = 0; i < self.data.length; i++)
				self.data[i].attributeValue = +self.data[i].attributeValue;

			if (OrdinalAttributes.list.indexOf(self.fileName) != -1)
				self.isOrdinalNumerical = true;
			else
				self.isOrdinalNumerical = false;
		}
		if (self.isBinary) {
			for (var i = 0; i < self.data.length; i++) {
				if (self.data[i].attributeValue == "0")
					self.data[i].attributeValue = false;
				if (self.data[i].attributeValue == "1")
					self.data[i].attributeValue = true;
			}
		}
	},
	retrieveObjects: function() {
		var self = this;
		var dataByGroup = d3.nest()
			.key(function(d) { return d.newGroupName; })
			.entries(self.data);
		self.group1 = dataByGroup[0].values;
		self.group2 = dataByGroup[1].values;
	},
	getAllDistinctValues: function(barChartData) {
		var self = this;
		var isNumerical = self.isNumerical
		var isOrdinalNumerical = self.isOrdinalNumerical;
		var hasDiscretized = isNumerical && !isOrdinalNumerical;
		var allDistinctValues = [];

		if (isNumerical) {
			var minBinIndex = barChartData[0].value;
			var maxBinIndex = barChartData[barChartData.length - 1].value;

			for (var i = minBinIndex; i <= maxBinIndex; i++) {
				var currentBinName = i;
				allDistinctValues.push(currentBinName)
			}
		}

		else if (!isNumerical) {
			allDistinctValues = barChartData.map(function(d) { return d.value });
		}

		return allDistinctValues;
	},
	drawCharts: function() {
		var self = this;

		var chartGroup = self.svg.append("g")
			.attr("class", "chart-group");
		var barChartData = self.computeBarChartData();
		var allDistinctValues = self.getAllDistinctValues(barChartData);
		var isNumerical = self.isNumerical
		var isOrdinalNumerical = self.isOrdinalNumerical;
		var hasDiscretized = isNumerical && !isOrdinalNumerical;
		self.barChartData = barChartData;

		// draw bar chart
		var xScale = d3.scaleBand()
			.domain(allDistinctValues)
			.range([0, self.chartWidth])
			.padding(0.3);
		var yScale = d3.scaleLinear()
			.domain([0, 1]) // probability
			.range([self.chartHeight, 0]);

		// check which bar width to use
		var barWidth = (xScale.bandwidth() / 2 < self.barWidth) ? xScale.bandwidth() / 2 : self.barWidth;
	
		// bars
		var barGroups = chartGroup.selectAll(".bar-group")
			.data(barChartData)
			.enter()
			.append("g")
			.attr("class", "bar-group")
			.attr("transform", function(d) {
				var stringOfValue = String(d.value);
				var xTranslate = xScale(stringOfValue) + xScale.bandwidth() / 2;
				return "translate(" + xTranslate + ",0)";
			});
		barGroups.each(function(d) {
				var group1BarX = (d.proportion.group1 == 0) ? -barWidth / 2 : -barWidth;
				var group2BarX = (d.proportion.group2 == 0) ? -barWidth / 2 : 0;

				d3.select(this)
					.append("rect")
					.attr("class", "bar")
					.attr("x", group1BarX)
					.attr("y", yScale(d.proportion.group1))
					.attr("width", barWidth)
					.attr("height", self.chartHeight - yScale(d.proportion.group1))
					.style("fill", "steelblue");
				d3.select(this)
					.append("rect")
					.attr("class", "bar")
					.attr("x", group2BarX)
					.attr("y", yScale(d.proportion.group2))
					.attr("width", barWidth)
					.attr("height", self.chartHeight - yScale(d.proportion.group2))
					.style("fill", "pink");
			});

		// draw axis
		var xAxis = d3.axisBottom(xScale);
		if (hasDiscretized && self.isNumerical) {
			var min = barChartData[0].min;
			var max = barChartData[0].max;
			var binNumber = barChartData[0].binNumber;
			var interval = (max - min) / binNumber;

			xAxis.tickFormat(function(d) {
				var factor = 100;
				while (interval * factor < 1)
					factor = factor * 10;

				var binIndex = d;
				var minString = Math.round((min + interval * binIndex) * factor) / factor;
				var maxString = Math.round((min + interval * binIndex + interval) * factor) / factor;
				return minString + " - " + maxString;
			});
		}
		if (!hasDiscretized && self.isNumerical) {
			xAxis.ticks(barChartData.length)
		}
		var yAxis = d3.axisLeft(yScale)
			.ticks(3)
			.tickFormat(function(d) { return d * 100 + "%"; });

		var xAxis = chartGroup.append("g")
			.attr("class", "axis x")
			.attr("transform", "translate(0" + ", " + self.chartHeight + ")")
			.call(xAxis);
		var yAxis = chartGroup.append("g")
			.attr("class", "axis y")
			.call(yAxis);

		var bbox = chartGroup.node().getBBox();
		var yLabel = yAxis.append("text")
			.attr("x", 0)
			.attr("y", 0)
			.attr("dy", -40)
			.attr("transform", "translate(0, " + (bbox.height / 2 - 10) + ") rotate(-90)")
			.style("text-anchor", "middle")
			.style("fill", "black")
			.style("font-size", 15)
			.text("Proportion");

		var xAxisTextSVG = chartGroup.selectAll(".axis.x text");
		if (self.isXAxisTextOverlapped(xAxisTextSVG) || hasDiscretized) {
			chartGroup.selectAll(".axis.x text")
				.attr("y", 0)
			    .attr("x", 9)
			    .attr("dy", ".35em")
			    .attr("transform", "rotate(90)")
			    .style("text-anchor", "start");
		}

		var bbox = chartGroup.select(".axis.x").node().getBBox();
		var text = self.data[0].newAttributeName;
		var xLabelFontSize = text.length > 55 ? 12 : 15;

		var xLabel = xAxis.append("text")
			.attr("x", bbox.width / 2)
			.attr("y", bbox.height + 10)
			.style("text-anchor", "middle")
			.style("alignment-baseline", "hanging")
			.style("fill", "black")
			.style("font-size", xLabelFontSize)
			.text(text);

		// draw legend
		var group1Name = self.group1[0].newGroupName;
		var group2Name = self.group2[0].newGroupName;
		var group1FontSize = group1Name.length > 55 ? 12 : 15;
		var group2FontSize = group2Name.length > 55 ? 12 : 15;

		if (group1FontSize == 12 || group2FontSize == 12) {
			group1FontSize = 12;
			group2FontSize = 12;
		}

		chartGroup.append("circle")
			.attr("cx", 20)
			.attr("cy", -40)
			.attr("r", 8)
			.style("fill", "steelblue")
		chartGroup.append("text")
			.attr("x", 35)
			.attr("y", -38)
			.style("fill", "black")
			.style("alignment-baseline", "middle")
			.style("font-size", group1FontSize)
			.style("font-family", "Arial")
			.text(group1Name);
		chartGroup.append("circle")
			.attr("cx", 20)
			.attr("cy", -20)
			.attr("r", 8)
			.style("fill", "pink")
		chartGroup.append("text")
			.attr("x", 35)
			.attr("y", -17)
			.style("fill", "black")
			.style("alignment-baseline", "middle")
			.style("font-size", group2FontSize)
			.style("font-family", "Arial")
			.text(group2Name);
		chartGroup.attr("transform", "translate(" + self.margin.left + "," + (self.margin.top + 40) + ")");

		// adjust height
		var bbox = chartGroup.node().getBBox();
		var svg = chartGroup.node().parentNode;
		d3.select(svg)
			.style("height", bbox.height + self.margin.top + self.margin.bottom / 2 - 7);
	},
	initTooltip: function() {
		var self = this;

		self.svg.selectAll(".bar").on("mouseenter", function(d) {
			d3.selectAll(".bar")
				.style("stroke", "none");
			d3.select(this)
				.style("stroke", "red")
				.style("stroke-width", 2);

			var isNumerical = self.isNumerical
			var isOrdinalNumerical = self.isOrdinalNumerical;
			var hasDiscretized = isNumerical && !isOrdinalNumerical;
			var value = d.value;
			var isGroup1 = d3.select(this).style("fill") == "steelblue";
			var percent = isGroup1 ? Math.round(d.proportion.group1 * 100 * 100) / 100 + "%" : Math.round(d.proportion.group2 * 100 * 100) / 100 + "%";
			var groupName = isGroup1 ? self.group1[0].newGroupName : self.group2[0].newGroupName;
			var text = percent + " of " + groupName;

			if (self.isNumerical && !hasDiscretized)
				text += " have a value of " + value;
			if (!self.isNumerical && !self.isBinary)
				text += " have the value \"" + value + "\"";
			if (self.isNumerical && hasDiscretized) {
				var min = self.barChartData[0].min;
				var max = self.barChartData[0].max;
				var binNumber = self.barChartData[0].binNumber;
				var interval = (max - min) / binNumber;
				var binIndex = d.value;
				var minString = Math.round((min + interval * binIndex) * 100) / 100;
				var maxString = Math.round((min + interval * binIndex + interval) * 100) / 100;
				text += " have a value between " + minString + " and " + maxString;
			}
			if (self.isBinary) {
				var attributeName = self.barChartData[0].newAttributeName;
				var trueText = "";
				var notText = "";

				if (attributeName.indexOf("is") != -1) {
					trueText = attributeName.replace("is", "are");
					notText = attributeName.replace("is", "are not");
				}
				if (attributeName.indexOf("has") != -1) {
					trueText = attributeName.replace("has", "have")
					notText = attributeName.replace("has", "do not have");
				}

				if (value == true)
					text += " " + trueText;
				if (value == false)
					text += " " + notText;
			}

			var bbox = this.getBoundingClientRect();
			$("#tooltip")
				.css("display", "block")
				.html(text);

			var tooltipWidth = $("#tooltip").width();
			var tooltipHeight = $("#tooltip").height();
			$("#tooltip")
				.css("top", bbox.y - tooltipHeight - 10)
				.css("left", bbox.x - tooltipWidth / 2)
		});

		self.svg.selectAll(".bar").on("mouseleave", function() {
			d3.selectAll(".bar")
				.style("stroke", "none");
			$("#tooltip").css("display", "none");
		});
	},
	computeBarChartData: function() {
		var self = this;

		// determine the number of bins
		var meanSampleSize = (self.group1.length + self.group2.length) / 2;
		var refBinNumber = Math.min(Math.ceil(Math.sqrt(meanSampleSize)), 20);
		var allObjects = self.group1.concat(self.group2);
		var nestedData = d3.nest().key(function(d) { return d.attributeValue; }).object(allObjects);
		var allDistinctValues = Object.keys(nestedData);

		var isNumerical = self.isNumerical
		var isOrdinalNumerical = self.isOrdinalNumerical;
		var needDiscretization = isNumerical && !isOrdinalNumerical;
		var binNumber =  needDiscretization ? refBinNumber : allDistinctValues.length;
		var barChartData = {};

		var min = d3.min(allObjects, function(d) { return d.attributeValue });
		var max = d3.max(allObjects, function(d) { return d.attributeValue });

		// count for group 1
		for (var i = 0; i < self.group1.length; i++) {
			var currentObject = self.group1[i];
			var currentValue = isNumerical && needDiscretization
							 ? self.convertValueToBinIndex(currentObject.attributeValue, min, max, binNumber)
							 : currentObject.attributeValue;

			if (!(currentValue in barChartData)) {
				barChartData[currentValue] = {
					value: currentValue,
					proportion: { group1: 0, group2: 0 },
					count: { group1: 0, group2: 0 }
				};

				if (needDiscretization) {
					barChartData[currentValue].binNumber = binNumber;
					barChartData[currentValue].min = min;
					barChartData[currentValue].max = max;
				}
			}

			barChartData[currentValue].proportion.group1++;
			barChartData[currentValue].count.group1++;
		}

		// count for group 2
		for (var i = 0; i < self.group2.length; i++) {
			var currentObject = self.group2[i];
			var currentValue = isNumerical && needDiscretization
							 ? self.convertValueToBinIndex(currentObject.attributeValue, min, max, binNumber) 
							 : currentObject.attributeValue;

			if (!(currentValue in barChartData)) {
				barChartData[currentValue] = {
					value: currentValue,
					proportion: { group1: 0, group2: 0 },
					count: { group1: 0, group2: 0 }
				};

				if (needDiscretization) {
					barChartData[currentValue].binNumber = binNumber;
					barChartData[currentValue].min = min;
					barChartData[currentValue].max = max;
				}
			}

			barChartData[currentValue].proportion.group2++;
			barChartData[currentValue].count.group2++;
		}

		// calculate proportion
		var barChartArray = [];
		for (var value in barChartData) {
			barChartData[value].proportion.group1 = barChartData[value].proportion.group1 / self.group1.length;
			barChartData[value].proportion.group2 = barChartData[value].proportion.group2 / self.group2.length;
		}
		for (var value in barChartData)
			barChartArray.push(barChartData[value]);

		// sort bar charts for categorical
		if (isNumerical) {
			barChartArray.sort(function(a, b) { return +a.value - +b.value; });
		}
		if (!isNumerical) {
			for (var i = 0; i < barChartArray.length; i++)
				barChartArray[i].probDiff = barChartArray[i].proportion.group1 - barChartArray[i].proportion.group2;
			barChartArray.sort(function(a, b) { return a.probDiff - b.probDiff; });
		}

		return barChartArray;
	},
	convertValueToBinIndex: function(currentValue, minValue, maxValue, binNumber) {
		var interval = (maxValue - minValue) / binNumber;
		var binIndex = Math.floor((currentValue - minValue) / interval);
		if (binIndex >= binNumber)
			binIndex = binNumber - 1;

		return binIndex;
	},
	isXAxisTextOverlapped: function(xAxisTextSVG) {
		var previousEndX = 0;
		var isOverlapped = false;

		xAxisTextSVG.each(function() {
			var bbox = this.getBoundingClientRect();
			var currentStartX = bbox.x;

			if (previousEndX > currentStartX) {
				isOverlapped = true;
				return;
			}

			previousEndX = bbox.x + bbox.width;
		});

		return isOverlapped;
	}
}