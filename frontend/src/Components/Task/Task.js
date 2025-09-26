import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Task(props) {

    const{taskId,
      customerName,
      serviceType,
      assignedTechnician,
      status,
      urgency,
      createdAt} = props.task;

const history = useNavigate();

/*const deleteHandler = async() => {
  await axios.delete(`http://Localhost:5000/tasks/${taskId}`)
  .then(res => res.data)
  .then(() => history("/"))
  .then(() => history("/overview"))
}*/
const deleteHandler = async () => {
      const confirmDelete = window.confirm("Are you sure you want to delete this task?");
      if (!confirmDelete) return;

      try {
        await axios.delete(`http://localhost:5000/tasks/${taskId}`);
        window.alert("Task deleted successfully!");
        history("/overview");
      } catch (error) {
        window.alert("Failed to delete task.");
        console.error(error);
      }
    };

  return (
    <div>
      <h2>Task Display</h2>
      <br />
      <h1>Task ID: {taskId}</h1>
      <h1>Customer Name: {customerName}</h1>
      <h1>Service Type: {serviceType}</h1>
      <h1>Assigned Technician: {assignedTechnician}</h1>
      <h1>Status: {status}</h1>
      <h1>Urgency: {urgency}</h1>
      <h1>Created At: {createdAt}</h1>
      <Link to={`/overview/${taskId}`}>Update Task</Link>
      <button onClick={deleteHandler}>Delete Task</button>
    </div>
  );
}

export default Task;