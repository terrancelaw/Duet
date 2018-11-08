var introductionHTML = "<div id='inner-container'>" +
							"<div class='title'>Do the two distributions look similar or different?</div>" +
							"<div class='introduction'>" +
								"<div>&nbsp;&nbsp;&nbsp;&nbsp;In each of the following tasks, we will show you a bar chart which describes the distributions of an attribute for two groups of objects.</div>" +
								"<div>&nbsp;&nbsp;&nbsp;&nbsp;The following is an example of the kind of charts you will see in each task. Each city in the following data set has a music concert rating that indicates the quality of music concerts in the city. This bar chart shows the distributions of music concert ratings for US cities and Chinese cities.</div>" +
								"<div class='chart'><svg></svg></div>" +
								"<div>&nbsp;&nbsp;&nbsp;&nbsp;Your task is to label the pink and blue distributions as <span>Similar</span>, <span>Different</span> or <span>Somewhere in the middle</span>.</div>" +
								"<div>&nbsp;&nbsp;&nbsp;&nbsp;You will first go through a training session with 30 labelling tasks. After that, we will ask you to label 75 distributions in the actual tasks.</div>" +
							"</div>" +
							"<div class='button-container'>" +
								"<button class='next-button active'>Next</button>" +
							"</div>" +
						"</div>";

var exampleOneHTML = "<div id='inner-container'>" +
						"<div class='title'>Here’s how it’ll go…</div>" +
						"<div class='example-one'>" +
							"<div style='font-weight:bold'>&nbsp;&nbsp;&nbsp;&nbsp;Imagine that you are analysing a dataset. You would like to tell your supervisor, Bob, some interesting findings after the analysis.</div>" +
							"<div>&nbsp;&nbsp;&nbsp;&nbsp;During your analysis, you see the following bar chart. Again, the following bar chart shows the distributions of music concert ratings for US cities and Chinese cities. Try to move your mouse cursor over a bar in the bar chart to see the percentage of cities that have a particular value of musical concert rating.</div>" +
							"<div>&nbsp;&nbsp;&nbsp;&nbsp;Would you say that the blue and pink distributions are <span>similar</span>, <span>different</span> or <span>somewhere in the middle</span>?</div>" +
							"<div>&nbsp;&nbsp;&nbsp;&nbsp;Choose your answer and click the next button to continue.</div>" +
							"<div class='MC-container'>" +
								"<div class='chart'><svg></svg></div>" +
								"<div class='answer'>" +
									"<div class='answer-container'>" +
										"<div class='answer-title'>Your answer:</div>" +
										"<div class='choice'>" +
											"<input type='radio' name='choice' id='similar' value='similar'>" +
											"<label for='similar'>Similar</label>" +
										"</div>" +
										"<div class='choice'>" +
											"<input type='radio' name='choice' id='different' value='different'>" +
											"<label for='different'>Different</label>" +
										"</div>" +
										"<div class='choice'>" +
											"<input type='radio' name='choice' id='middle' value='middle'>" +
											"<label for='middle'>Somewhere in the middle</label>" +
										"</div>" +
									"</div>" +
								"</div>" +
							"</div>" +
						"</div>" +
						"<div class='button-container'>" +
							"<button class='back-button active'>Back</button>" +
							"<button class='next-button'>Next</button>" +
						"</div>" +
					"</div>";

var exampleTwoHTML = "<div id='inner-container'>" +
						"<div class='title'>Here’s how it’ll go…</div>" +
						"<div class='example-two'>" +
							"<div class='chart'><svg></svg></div>" +
							"<div>&nbsp;&nbsp;&nbsp;&nbsp;As a rule of thumb, if you think that, after your analysis, you will tell your supervisor, Bob that the two distributions look really similar, you should label the distributions as <span>Similar</span>.</div>" +
							"<div>&nbsp;&nbsp;&nbsp;&nbsp;If you will tell Bob that music concert rating is a distinguishing attribute for US cities and Chinese cities, you should label the two distributions as <span>Different</span>.</div>" +
							"<div>&nbsp;&nbsp;&nbsp;&nbsp;If you can't tell whether the distributions are similar or different enough or if you are not sure whether you will tell Bob about the two distributions, you should label them as <span>Somewhere in the middle</span>.</div>" +
							"<div>&nbsp;&nbsp;&nbsp;&nbsp;Click the next button below to see some examples.</div>" +
						"</div>" +
					"<div class='button-container'>" +
						"<button class='back-button active'>Back</button>" +
						"<button class='next-button active'>Next</button>" +
					"</div>" +
				"</div>";

var exampleThreeHTML = "<div id='inner-container'>" +
							"<div class='title'>Here are some examples</div>" +
							"<div class='example-three'>" +
								"<div>&nbsp;&nbsp;&nbsp;&nbsp;The following shows the distributions of climate ratings for English-speaking and non-English-speaking cities (each city has a climate rating). You can see that English-speaking cities and non-English-speaking cities have fairly similar distributions of climate ratings. For both groups, many cities get a rating of 2 and fewer cities get a rating of 1 or 3. You probably want to tell Bob about the finding and label the following distributions as <span>Similar</span>.</div>" +
								"<div class='chart chart1'><svg></svg></div>" +
								"<div>&nbsp;&nbsp;&nbsp;&nbsp;On the other hand, looking at the following distributions, you observe that non-English-speaking cities seem to have a high corruption rating on average and English-speaking cities seem to have a low corruption rating on average, which sounds really interesting. You may want to tell Bob that corruption index is a distinguishing attribute for English-speaking cities and non-English-speaking cities and therefore label the following distributions as <span>Different</span>.</div>" +
								"<div class='chart chart2'><svg></svg></div>" +
								"<div>&nbsp;&nbsp;&nbsp;&nbsp;Again, if you are not sure whether the two distributions are similar or different enough for you tell Bob about them, you should label the distributions as <span>Somewhere in the middle</span>.</div>" +
								"<div>&nbsp;&nbsp;&nbsp;&nbsp;Click the next button to start the training session.</div>" +
							"</div>" +
							"<div class='button-container'>" +
								"<button class='back-button active'>Back</button>" +
								"<button class='next-button active'>Next</button>" +
							"</div>" +
						"</div>";

var trainingDoneHTML = "<div id='inner-container'>" +
							"<div class='title'>Great job!</div>" +
							"<div class='training-done'>" +
								"<div>You are done with the training.</div>" +
								"<div>Before you move on, recall the following rules of thumb:</div>" +
								"<div>1. Labelling two distributions as <span>Similar</span> when the two distributions are so similar that you want to tell your supervisor, Bob about it.</div>" +
								"<div>2. Labelling two distributions as <span>Different</span> when the attribute under consideration is highly distinguishing for the two groups of objects and you want to tell Bob about it.</div>" +
								"<div>3. Labelling two distributions as <span>Somewhere in the middle</span> when you can't tell whether the two distributions are similar or different enough.</div>" +
								"<div>Please also note that you can move your mouse cursor over a bar in the bar chart to see the percentage of objects that have a particular value.</div>" +
								"<div>Click the next button when you are ready to move on.</div>" +
							"</div>" +
							"<div class='button-container'>" +
								"<button class='next-button active'>Next</button>" +
							"</div>" +
						"</div>";

var questionHTML = "<div id='inner-container'>" +
						"<div class='title'>Do the two distributions look similar or different?</div>" +
						"<div class='count'>Question</div>" +
						"<div class='MC-interface'>" +
							"<div class='chart'><svg></svg></div>" +
							"<div class='answer'>" +
								"<div class='answer-container'>" +
									"<div class='answer-title'>Your answer:</div>" +
									"<div class='choice'>" + 
										"<input type='radio' name='choice' id='similar' value='S'>" +
										"<label for='similar'>Similar</label>" +
									"</div>" +
									"<div class='choice'>" +
										"<input type='radio' name='choice' id='different' value='D'>" +
										"<label for='different'>Different</label>" +
									"</div>" +
									"<div class='choice'>" +
										"<input type='radio' name='choice' id='middle' value='N'>" +
										"<label for='middle'>Somewhere in the middle</label>" +
									"</div>" +
								"</div>" +
							"</div>" +
						"</div>" +
						"<div class='button-container'>" +
							"<button class='next-button'>Next</button>" +
						"</div>" +
					"</div>";

var taskDoneHTML = "<div id='inner-container'>" +
						"<div class='title'>You are done with all the tasks. Thanks a lot for helping!</div>" +
					"</div>";