var ExampleOne = {
	chartMargin: { top: 30, left: 70, bottom: 30, right: 30 },

	init: function() {
		var self = this;

		self.injectCode();
		self.initNextBehaviour();
		self.initBackBehaviour();
		Chart.init(self.chartMargin, "chart");
		Chart.draw("/csv/introduction_data.csv");
	},
	injectCode: function() {
		$("#container").html(exampleOneHTML);
	},
	initNextBehaviour: function() {
		$("input[type=radio][name=choice]").change(function() {
			$(".next-button").addClass("active");
			$(".next-button.active").click(clickNextButton);
		});

		function clickNextButton() {
			ExampleTwo.init();
		}
	},
	initBackBehaviour: function() {
		$(".back-button").click(clickBackButton);

		function clickBackButton() {
			Introduction.init();
		}
	}
}