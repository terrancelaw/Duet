var Introduction = {
	chartMargin: { top: 30, left: 70, bottom: 30, right: 30 },

	init: function() {
		var self = this;

		self.injectCode();
		self.initNextBehaviour();
		Chart.init(self.chartMargin, "chart");
		Chart.draw("/csv/introduction_data.csv");
	},
	injectCode: function() {
		$("#container").html(introductionHTML);
	},
	initNextBehaviour: function() {
		$(".next-button.active").click(clickNextButton);

		function clickNextButton() {
			ExampleOne.init();
		}
	}
}