var TaskDone = {
	init: function() {
		var self = this;

		self.injectCode();
	},
	injectCode: function() {
		$("#container").html(taskDoneHTML);
	}
}