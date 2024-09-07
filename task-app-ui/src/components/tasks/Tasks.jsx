import React from "react";
import useTasks from "../../scripts/hooks/useTasks";
import "././../../styles/components/cards/Cards.css";
import "./Tasks.css";

const Tasks = () => {
  const { taskList } = useTasks();
  return (
    <div className="tasks-container">
      {taskList.map((task) => (
        <div className="card-task" key={task.id}>
          <small>{task.status}</small>
          <small>{task.priority}</small>
          <h5>{task.title}</h5>
          <p>{task.description}</p>
          <small>Criado em: {task.createdAt}</small>
          <small>Atualizado em: {task.updatedAt}</small>
        </div>
      ))}
    </div>
  );
};

export default Tasks;
