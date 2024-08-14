import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export const Task = ({ activeCheckboxes, handleTaskChange, tasks }) => {
    const { spaceId } = useParams();

    const [isTaskModalOpen, setTaskModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentTask, setCurrentTask] = useState({
        id: null,
        title: '',
        description: '',
        dueDate: '',
        priority: 'Media'
    });

    const handleTaskModalToggle = () => {
        setTaskModalOpen(!isTaskModalOpen);
        if (!isTaskModalOpen) {
            setCurrentTask({
                id: null,
                title: '',
                description: '',
                dueDate: '',
                priority: 'Media',
                spaceId: spaceId
            });
            setIsEditMode(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentTask({ ...currentTask, [name]: value });
    };

    const handleSaveCreate = () => {
        if (isEditMode) {
            axios.put(`http://localhost:3000/tasks/${currentTask.id}`, currentTask)
                .then((response) => {
                    const updatedTask = response.data;
                    setTasks(prevTasks =>
                        prevTasks.map(task => task.id === updatedTask.id ? updatedTask : task)
                    );
                    handleTaskModalToggle();
                });
        } else {
            axios.post('http://localhost:3000/tasks', currentTask)
                .then((response) => {
                    const newTask = response.data;
                    setTasks(prevTasks => [...prevTasks, newTask]); // Aquí se asegura de añadir el nuevo task con ID
                    handleTaskModalToggle();
                });
        }
    };

    const handleEditTask = (task) => {
        setCurrentTask(task);
        setIsEditMode(true);
        setTaskModalOpen(true);
    };

    return (
        <div className="column is-one-quarter" id="panel-task">
            <div className="box">
                <h2 className="title is-4">Listado de Tareas</h2>
                <button className="button is-primary is-rounded is-small" onClick={handleTaskModalToggle} id="plus">
                    <span className='has-text-primary-20-invert'>+</span>
                </button>
            </div>
            <div className="box task-container">
                {tasks.map((task) => (
                    <div key={task.id} className='task-box' >
                        <label className="checkbox">
                            <input
                                type="checkbox"
                                checked={task.isChecked || false}
                                disabled={!activeCheckboxes || task.isAssigned}
                                onChange={() => handleTaskChange(task)}
                            />
                            <span className={`subtitle is-6 ${task.isChecked ? 'has-text-grey-light' : ''}`}
                                style={{ textDecoration: task.isChecked ? 'line-through' : 'none' }}>
                                &nbsp;{task.title}
                            </span>
                        </label>
                    </div>
                ))}
            </div>
            {isTaskModalOpen && (
                <div className="modal is-active">
                    <div className="modal-background" onClick={handleTaskModalToggle}></div>
                    <div className="modal-card">
                        <header className="modal-card-head">
                            <p className="modal-card-title">{isEditMode ? 'Editar tarea' : 'Nueva tarea'}</p>
                            <button className="delete" aria-label="close" onClick={handleTaskModalToggle}></button>
                        </header>
                        <section className="modal-card-body">
                            <div className="field">
                                <label className="label">Título</label>
                                <div className="control">
                                    <input className="input is-text" type="text" name="title"
                                        value={currentTask.title}
                                        onChange={handleInputChange}
                                        placeholder="Título de la tarea" />
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Descripción</label>
                                <div className="control">
                                    <textarea className="textarea is-text" name="description"
                                        value={currentTask.description}
                                        onChange={handleInputChange}
                                        placeholder="Descripción de la tarea" rows={2}></textarea>
                                </div>
                            </div>
                            <div className='columns'>
                                <div className='column is-half'>
                                    <div className="field">
                                        <label className="label">Vencimiento</label>
                                        <div className="control">
                                            <input className="input is-text" type="date" name="dueDate"
                                                value={currentTask.dueDate}
                                                onChange={handleInputChange}
                                                placeholder="Fecha de vencimiento" />
                                        </div>
                                    </div>
                                </div>
                                <div className='column is-half'>
                                    <div className="field">
                                        <label className="label">Importancia</label>
                                        <div className="control">
                                            <div className="select is-fullwidth is-text">
                                                <select name="priority"
                                                    value={currentTask.priority}
                                                    onChange={handleInputChange}>
                                                    <option>Urgente</option>
                                                    <option>Alta</option>
                                                    <option>Media</option>
                                                    <option>Baja</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <footer className="modal-card-foot">
                            <button className="button is-success" onClick={handleSaveCreate}>{isEditMode ? 'Guardar cambios' : 'Crear tarea'}</button>&nbsp;
                            <button className="button" onClick={handleTaskModalToggle}>Cancelar</button>
                        </footer>
                    </div>
                </div>
            )}

        </div>
    );
}
