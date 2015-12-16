var gulp = require('gulp');

module.exports = function createTaskArray(obj,type) {
  //Array of tasks that will run
  var taskArray = [];

  var task = obj.tasks;

  //Looping over all tasks and check if they are true
  for (var i in task) {
    if(task[i].run) {
      taskArray.push(task[i].name);
    }
  }
  //Returning array of tasks
  return gulp.start(taskArray);

}
