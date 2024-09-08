import React from "react";
import useTasks from "../../scripts/hooks/useTasks";
import "././../../styles/components/cards/Cards.css";
import "././../../styles/components/buttons/StatusAndPriorityButtons.css";
import "./Tasks.css";

const Tasks = () => {
  const { taskList, formatStatus, formatPriority } = useTasks();
  return (
    <div className="tasks-container">
      {taskList.map((task) => (
        <div className="card-task" key={task.id}>
          <div className="card-info-s-p">
            <small className={`status status-${task.status}`}>
              {formatStatus(task.status)}
            </small>
            <small className={`priority priority-${task.priority}`}>
              {formatPriority(task.priority)}
            </small>
          </div>
          <h5>{task.title}</h5>
          <p>
            {task.description.length > 150
              ? task.description.substring(0, 150) + "..."
              : task.description}
          </p>

          <small>Criado em: {task.createdAt}</small>
          <small>Atualizado em: {task.updatedAt}</small>
        </div>
      ))}
    </div>
  );
};

export default Tasks;
