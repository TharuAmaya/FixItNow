//Data display
const Task =require("../Model/TaskModel");

const getAllTasks = async (req, res, next) => {

    let Tasks;
  //Get all tasks
  try {
    tasks = await Task.find();
  } catch (error) {
    console.log("Error fetching tasks:", error);
  }
  //Not found
  if (!tasks) {
    return res.status(404).json({ message: "No tasks found" });
  }
  //Display tasks
  return res.status(200).json({ tasks });
};

//Data insertion
const createTask = async (req, res, next) => {
  const { taskId, customerName, serviceType, assignedTechnician, status, urgency, createdAt } 
  = req.body;

  let newTask;

  try {
    newTask = new Task({
      taskId,
      customerName,
      serviceType,
      assignedTechnician,
      status,
      urgency,
      createdAt
    });
    await newTask.save();
    //return res.status(201).json({ message: "Task created successfully", task: newTask });
  } catch (error) {
    console.log("Error creating task:", error);
    return res.status(404).json({ message: "Error creating task" });
  }

  //Not inserted tasks
  if (!newTask) {
    return res.status(404).json({ message: "Task creation failed" });
  }
  return res.status(200).json({ message: "Task created successfully", newTask });
};

//Get by ID
/*const getTaskById = async (req, res, next) => {
  const id = req.params.id;

  let task;
  try {
    task = await Task.findById(id);
  } catch (error) {
    console.log("Error fetching task:", error);
  }

  //Not found
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }
  //Display task
  return res.status(200).json({ task });
};

//Update task details
const updateTask = async (req, res, next) => {
  const id = req.params.id;
  const { customerName, serviceType, assignedTechnician, status, urgency, createdAt } = req.body;

  let task;
  try {
    task = await Task.findByIdAndUpdate(id, {
      customerName,
      serviceType,
      assignedTechnician,
      status,
      urgency,
      createdAt
    });
    task = await task.save();
  } catch (error) {
    console.log("Error updating task:", error);
    return res.status(500).json({ message: "Error updating task" });
  }
  return res.status(200).json({ message: "Task updated successfully", task });
};*/

//Get by taskId
const getTaskById = async (req, res, next) => {
  const id = req.params.id;

  let task;
  try {
    // Find by taskId instead of _id
    task = await Task.findOne({ taskId: id });
  } catch (error) {
    console.log("Error fetching task:", error);
  }

  //Not found
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }
  //Display task
  return res.status(200).json({ task });
};

//Update task details by taskId
const updateTask = async (req, res, next) => {
  const id = req.params.id;
  const { customerName, serviceType, assignedTechnician, status, urgency, createdAt } = req.body;

  let task;
  try {
    // Find and update by taskId
    task = await Task.findOneAndUpdate(
      { taskId: id },
      {
        customerName,
        serviceType,
        assignedTechnician,
        status,
        urgency,
        createdAt
      },
      { new: true }
    );
  } catch (error) {
    console.log("Error updating task:", error);
    return res.status(500).json({ message: "Error updating task" });
  }
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }
  return res.status(200).json({ message: "Task updated successfully", task });
};

//Delete task details
/*const deleteTask = async (req, res, next) => {
  const id = req.params.id;

  let task;

  try {
    task = await Task.findByIdAndDelete(id);
  } catch (error) {
    console.log("Error deleting task:", error);
    return res.status(500).json({ message: "Error deleting task" });
  }
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }
  return res.status(200).json({ message: "Task deleted successfully", task });
};*/

const deleteTask = async (req, res, next) => {
  const id = req.params.id;

  let task;

  try {
    // Delete by taskId, not _id
    task = await Task.findOneAndDelete({ taskId: id });
  } catch (error) {
    console.log("Error deleting task:", error);
    return res.status(500).json({ message: "Error deleting task" });
  }
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }
  return res.status(200).json({ message: "Task deleted successfully", task });
};

exports.createTask = createTask;
exports.getAllTasks = getAllTasks;
exports.getTaskById = getTaskById;
exports.updateTask = updateTask;
exports.deleteTask = deleteTask;
//pass: jZNDaJYNepJtgziG