import os
import csv
from flask import Flask, jsonify, request
from random import shuffle

app = Flask(__name__, static_url_path="")
trainingFileList = []
taskFileList = []

@app.route("/")
def root():
    return app.send_static_file("index.html")

@app.route("/getTraining")
def getTraining():
    global trainingFileList

    nextFileName = trainingFileList.pop()
    numberOfFileRemaining = len(trainingFileList)
    response = {
        "nextFileName": nextFileName,
        "numberOfFileRemaining": numberOfFileRemaining,
        "hasNext": numberOfFileRemaining != 0
    }

    return jsonify(response)

@app.route("/getTask")
def getTask():
    global taskFileList

    nextFileName = taskFileList.pop()
    numberOfFileRemaining = len(taskFileList)
    response = {
        "nextFileName": nextFileName,
        "numberOfFileRemaining": numberOfFileRemaining,
        "hasNext": numberOfFileRemaining != 0
    }

    return jsonify(response)

@app.route("/saveClass", methods=['GET', 'POST'])
def saveClass():
    string = request.form["fileName"] + "," + request.form["class"] + "\n"
      
    file = open('static/generated/data.csv', 'a')
    file.write(string)
    file.close()

    return "saved row"

if __name__ == "__main__":
    trainingFileList = os.listdir(os.path.join(app.static_folder, 'csv/training'))
    taskFileList = os.listdir(os.path.join(app.static_folder, 'csv/task1'))

    if ".DS_Store" in trainingFileList:
        trainingFileList.remove(".DS_Store")
    if ".DS_Store" in taskFileList:
        taskFileList.remove(".DS_Store")

    shuffle(trainingFileList)
    shuffle(taskFileList)

    app.run()