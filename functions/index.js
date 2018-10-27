const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

/**
 * Function to delete all the tasks of a list if the list has been deleted
 */
exports.handleDeleteTasksList = functions.database.ref('lists/{listKey}').onDelete((event) => {
    const listKey = event.params.listKey;
    const promises = [];
    return admin.database().ref('tasks').once('value', (tasks) => {
      const tasksObject = tasks.val();
      const taskList = Object.keys(tasksObject).map(taskKey => Object.assign(tasksObject[taskKey], { key : taskKey }));
      taskList.forEach(task => {
        if (task.list === listKey) {
          promises.push(admin.database().ref(`tasks/${task.key}`).remove());
        }
      });
    }).then(() => {
      return Promise.all(promises);
    })
  })