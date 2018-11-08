var ExampleThree = {
	chartMargin: { top: 30, left: 70, bottom: 30, right: 30 },

	init: function() {
		var self = this;

		self.injectCode();
		self.initNextBehaviour();
		self.initBackBehaviour();
		Chart.init(self.chartMargin, "chart1");
		Chart.draw("/csv/example_data_similar.csv", function() {
			Chart.init(self.chartMargin, "chart2");
			Chart.draw("/csv/example_data_different.csv");
		});
	},
	injectCode: function() {
		$("#container").html(exampleThreeHTML);
	},
	initNextBehaviour: function() {
		$(".next-button.active").click(clickNextButton);

		function clickNextButton() {
			MCInterface.init("training");
		}
	},
	initBackBehaviour: function() {
		$(".back-button").click(clickBackButton);

		function clickBackButton() {
			ExampleTwo.init();
		}
	}
}