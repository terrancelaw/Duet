var TrainingDone = {
	init: function() {
		var self = this;

		self.injectCode();
		self.initNextBehaviour();
	},
	injectCode: function() {
		$("#container").html(trainingDoneHTML);
	},
	initNextBehaviour: function() {
		$(".next-button.active").click(clickNextButton);

		function clickNextButton() {
			MCInterface.init("task")
		}
	}
}