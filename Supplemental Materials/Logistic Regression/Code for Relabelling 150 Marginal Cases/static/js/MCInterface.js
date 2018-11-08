var MCInterface = {
	chartMargin: { top: 60, left: 60, bottom: 60, right: 60 },
	mode: null,
	done: false,
	fileName: null,

	init: function(mode) {
		var self = this;

		self.mode = mode;
		self.done = false;
		self.injectCode();
		Chart.init(self.chartMargin, "chart");

		var url = self.mode == "training" ? "/getTraining" : "/getTask";
		var folder = self.mode == "training" ? "/csv/training/" : "/csv/task1/";
		var totalNumberOfQuestions = self.mode == "training" ? 30 : 75;

		$.getJSON(url, function(result) {
			var fileName = result.nextFileName;
			var questionNumber = totalNumberOfQuestions - result.numberOfFileRemaining;
			var hasNext = result.hasNext;
			self.fileName = fileName;

			if (!hasNext)
				self.done = true;

			self.changeCount(questionNumber);
			self.initNextBehaviour();
			Chart.draw(folder + fileName);
	    });
	},
	changeCount: function(count) {
		var self = this;
		var text = self.mode == "training" ? "Practice Question " + count + " of 30" : "Question " + count + " of 75";

		$(".count").html(text);
	},
	injectCode: function() {
		$("#container").html(questionHTML);
	},
	initNextBehaviour: function() {
		var self = this;

		if (self.mode == "training" && self.done)
			$(".next-button").click(displayTrainingDone);
		else if (self.mode == "training" && !self.done)
			$(".next-button").click(getNextTraining);
		else if (self.mode == "task" && self.done) 
			$(".next-button").click(displayTaskDone);
		else if (self.mode == "task" && !self.done)
			$(".next-button").click(getNextTask);

		$("input[type=radio][name=choice]").change(function() {
			$(".next-button").addClass("active");
		});

		function displayTrainingDone() {
			if ($(".next-button").hasClass("active")) {
				TrainingDone.init();
			}
		}

		function displayTaskDone() {
			if ($(".next-button").hasClass("active")) {
				var data = {
					fileName: self.fileName,
					class: $("input[name='choice']:checked").val()
				};

				$.ajax({ url: "/saveClass", data: data, type: "POST", success: function() {
					TaskDone.init();
				}});
			}
		}

		function getNextTraining() {
			if ($(".next-button").hasClass("active")) {
				MCInterface.init("training");
			}
		}

		function getNextTask() {
			if ($(".next-button").hasClass("active")) {
				var data = {
					fileName: self.fileName,
					class: $("input[name='choice']:checked").val()
				};

				$.ajax({ url: "/saveClass", data: data, type: "POST", success: function() {
					MCInterface.init("task");
				}});
			}
		}
	}
}