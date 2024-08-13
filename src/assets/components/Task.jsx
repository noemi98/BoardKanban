import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const TaskBoard = () => {
   const [tasks, setTasks] = useState([]);
   const [assignedTasks, setAssignedTasks] = useState({});
   const [isCheckboxActive, setIsCheckboxActive] = useState({});

   useEffect(() => {
      axios.get('../../db.json')
         .then(response => {
            setTasks(response.data.tasks);
            setIsCheckboxActive(response.data.tasks.reduce((acc, task) => {
               acc[task.id] = false; // Todos los checkboxes comienzan desactivados
               return acc;
            }, {}));
         })
         .catch(error => {
            console.error('Error fetching tasks:', error);
         });
   }, []);

   const categoryNames = ["Por hacer", "En proceso", "Hecho"];

   const handlePlusClick = (categoryIndex) => {
      // Activa todos los checkboxes
      setIsCheckboxActive((prev) => {
         const newState = { ...prev };
         tasks.forEach(task => {
            if (!Object.values(assignedTasks).flat().some(t => t.id === task.id)) {
               newState[task.id] = true;
            }
         });
         return newState;
      });
   };

   const handleTaskCheckboxChange = (taskId, categoryIndex) => {
      // Asigna la tarea a la categoría y desactiva el checkbox
      const selectedTask = tasks.find(task => task.id === taskId);

      setAssignedTasks((prev) => {
         const newAssignedTasks = { ...prev };
         if (!newAssignedTasks[categoryIndex]) {
            newAssignedTasks[categoryIndex] = [];
         }
         newAssignedTasks[categoryIndex].push(selectedTask);
         return newAssignedTasks;
      });

      setIsCheckboxActive((prev) => ({
         ...prev,
         [taskId]: false, // Desactiva el checkbox para la tarea seleccionada
      }));
   };

   const handleTaskClick = (taskId, categoryIndex) => {
      // Elimina la tarea de la categoría y activa su checkbox nuevamente
      setAssignedTasks((prev) => {
         const newAssignedTasks = { ...prev };
         newAssignedTasks[categoryIndex] = newAssignedTasks[categoryIndex].filter(task => task.id !== taskId);
         return newAssignedTasks;
      });

      setIsCheckboxActive((prev) => ({
         ...prev,
         [taskId]: true, // Activa el checkbox nuevamente
      }));
   };

   const handleTaskRightClick = (event, taskId, categoryIndex) => {
      event.preventDefault();
      // Mueve la tarea a la siguiente categoría
      const nextCategoryIndex = (categoryIndex + 1) % categoryNames.length;

      setAssignedTasks((prev) => {
         const newAssignedTasks = { ...prev };
         // Elimina la tarea de la categoría actual
         newAssignedTasks[categoryIndex] = newAssignedTasks[categoryIndex].filter(task => task.id !== taskId);

         // Añade la tarea a la siguiente categoría
         if (!newAssignedTasks[nextCategoryIndex]) {
            newAssignedTasks[nextCategoryIndex] = [];
         }
         newAssignedTasks[nextCategoryIndex].push(tasks.find(task => task.id === taskId));
         return newAssignedTasks;
      });
   };

   return (
      <div className="columns p-4">
         <div className="column is-one-quarter" id="panel-task">
            <div className="box">
               <h2 className="title is-4">Listado de Tareas</h2>
            </div>
            <div className="box task-container">
               {tasks.map(task => (
                  <div key={task.id} className='task-box'>
                     <label className='checkbox'>
                        <input
                           type='checkbox'
                           checked={!isCheckboxActive[task.id]}
                           onChange={() => handleTaskCheckboxChange(task.id)}
                           disabled={!isCheckboxActive[task.id]}
                        />
                        <span className='subtitle is-6'>{task.title}</span>
                     </label>
                  </div>
               ))}
            </div>
         </div>

         <div className="column" id="panel-board">
            <div className="box">
               <h2 className="title">Tablero Kanban</h2>
            </div>
            <div className="table-container">
               <table className="table is-fullwidth">
                  <thead>
                     <tr>
                        {categoryNames.map((name, index) => (
                           <th key={index} style={{
                              textAlign: 'center',
                              backgroundColor: 'white',
                              borderRadius: '15px',
                              boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px'
                           }}>{name}</th>
                        ))}
                     </tr>
                  </thead>
                  <tbody>
                     <tr>
                        {categoryNames.map((_, categoryIndex) => (
                           <td key={categoryIndex} style={{ height: '80vh', textAlign: 'center' }}>
                              <div className='pb-4'>
                                 <button
                                    className="button is-primary is-rounded is-small"
                                    id="plus"
                                    style={{ opacity: 0.7 }}
                                    onClick={() => handlePlusClick(categoryIndex)}
                                 >
                                    <span className='has-text-primary-20-invert'>+</span>
                                 </button>
                              </div>

                              {assignedTasks[categoryIndex] && assignedTasks[categoryIndex].map((task, taskIndex) => (
                                 <div
                                    key={taskIndex}
                                    className='task-box-2'
                                    onClick={() => handleTaskClick(task.id, categoryIndex)}
                                    onContextMenu={(event) => handleTaskRightClick(event, task.id, categoryIndex)}
                                 >
                                    <span className='subtitle is-6'>{task.title}</span>
                                 </div>
                              ))}
                           </td>
                        ))}
                     </tr>
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   );
};
