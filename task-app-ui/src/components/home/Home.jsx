import React from "react";
import { HiOutlinePlus } from "react-icons/hi";
import "././../../styles/components/cards/Cards.css";
import "././../../styles/components/buttons/PrimaryButtons.css";
import "././../../styles/components/buttons/StatusAndPriorityButtons.css";
import "././../../styles/components/modal/Modal.css";
import "././../../styles/icons/icons.css";
import "./Home.css";
import useTasks from "../../scripts/hooks/useTasks";
import Modal from "react-responsive-modal";
import { useFilterContext } from "../../scripts/services/filterContext/FilterContext";

const Home = () => {
  const { filteredTaskList } = useFilterContext();
  const {
    taskData,
    taskCounts,
    openModal,
    setTaskData,
    openOpenTaskModal,
    onCloseTaskModal,
    handleStatusChange,
    handlePriorityChange,
    createTaskData,
    formatStatus,
    formatPriority,
  } = useTasks();

  return (
    <div className="home-container">
      <div className="board-add-task">
        <small>Quadro</small>
        <button
          className="button-primary button-primary-home"
          onClick={openOpenTaskModal}
        >
          <span>Adicionar tarefa</span>
          <HiOutlinePlus className="icon-default" />
        </button>
        <button
          className="button-primary button-primary-home responsive-button"
          onClick={openOpenTaskModal}
        >
          <HiOutlinePlus className="icon-default" />
        </button>
      </div>
      <div className="board-cards-container">
        <div className="card-board">
          <p>Pendente</p>
          <h3>{taskCounts.pending}</h3>
        </div>
        <div className="card-board">
          <p>A fazer</p>
          <h3>{taskCounts.inProgress}</h3>
        </div>
        <div className="card-board">
          <p>Concluído</p>
          <h3>{taskCounts.completed}</h3>
        </div>
        <div className="card-board">
          <p>Total</p>
          <h3>{taskCounts.total}</h3>
        </div>
      </div>
      <Modal
        open={openModal}
        onClose={onCloseTaskModal}
        classNames={{ overlay: "custom-overlay", modal: "custom-modal" }}
        center
      >
        <h4>Adicionar tarefa</h4>
        <form className="main-form" onSubmit={createTaskData}>
          <label>Título</label>
          <input
            maxLength={255}
            className="form-input"
            type="text"
            value={taskData.title}
            onChange={(e) =>
              setTaskData({ ...taskData, title: e.target.value })
            }
            required
          />
          <label>Descrição</label>
          <textarea
            rows={7}
            className="form-input"
            type="text"
            value={taskData.description}
            onChange={(e) =>
              setTaskData({ ...taskData, description: e.target.value })
            }
          />
          <label>Status</label>
          <div className="status-buttons">
            <button
              type="button"
              className={`status-button ${
                taskData.status === "PENDING" ? "active" : ""
              }`}
              onClick={() => handleStatusChange("PENDING")}
            >
              <span>Pendente</span>
            </button>
            <button
              type="button"
              className={`status-button ${
                taskData.status === "IN_PROGRESS" ? "active" : ""
              }`}
              onClick={() => handleStatusChange("IN_PROGRESS")}
            >
              <span>Fazendo</span>
            </button>
            <button
              type="button"
              className={`status-button ${
                taskData.status === "COMPLETED" ? "active" : ""
              }`}
              onClick={() => handleStatusChange("COMPLETED")}
            >
              <span>Concluído</span>
            </button>
          </div>
          <label>Prioridade</label>
          <div className="priority-buttons">
            <button
              type="button"
              className={`priority-button ${
                taskData.priority === "LOW" ? "active" : ""
              }`}
              onClick={() => handlePriorityChange("LOW")}
            >
              <span>Baixa</span>
            </button>
            <button
              type="button"
              className={`priority-button ${
                taskData.priority === "MEDIUM" ? "active" : ""
              }`}
              onClick={() => handlePriorityChange("MEDIUM")}
            >
              <span>Média</span>
            </button>
            <button
              type="button"
              className={`priority-button ${
                taskData.priority === "HIGH" ? "active" : ""
              }`}
              onClick={() => handlePriorityChange("HIGH")}
            >
              <span>Alta</span>
            </button>
          </div>
          <div className="user-date-info">
            <small>
              <strong>Criado em:</strong>
            </small>
            <small>
              <strong>Atualizado em:</strong>
            </small>
          </div>
          <button className="button-primary" type="submit">
            Adicionar
          </button>
        </form>
      </Modal>
      <div className="tasks-container">
        {filteredTaskList.map((task) => (
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
              {task.description.length > 110
                ? task.description.substring(0, 110) + "..."
                : task.description}
            </p>

            <small className="created-update-lb">
              Criado em: {task.createdAt}
            </small>
            <small className="created-update-lb">
              Atualizado em: {task.updatedAt}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
