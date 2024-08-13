import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const TaskBoard = () => {
   const [isModalOpen, setModalOpen] = useState(false);
   const [isModalCatOpen, setModalCatOpen] = useState(false);

   const toggleModalOpen = () => {
      setModalOpen(!isModalOpen);
   }
   const toggleModalCatOpen = () => {
      setModalCatOpen(!isModalCatOpen);
   }

   // BD
   const [tasks, setTasks] = useState([]);
   useEffect(() => {
      axios.get('../../db.json')
         .then(response => {
            setTasks(response.data.tasks);
         })
         .catch(error => {
            console.error('Error fetching tasks:', error);
         });
   }, []);

   // Para las categorías del tablero
   const [categoryCount, setCategoryCount] = useState(3);
   const [categoryNames, setCategoryNames] = useState(["Por hacer", "En proceso", "Hecho"]);

   const handleCategoryCountChange = (event) => {
      const count = parseInt(event.target.value, 10);

      setCategoryCount(count);

      if (count > categoryNames.length) {
         const newCategories = [...categoryNames];
         while (newCategories.length < count) {
            newCategories.push("");
         }
         setCategoryNames(newCategories);
      } else if (count < categoryNames.length) {
         setCategoryNames(categoryNames.slice(0, count));
      }
   };

   const handleCategoryNameChange = (index, event) => {
      const newCategories = [...categoryNames];
      newCategories[index] = event.target.value;
      setCategoryNames(newCategories);
   };

   // Para dibujar la tabla según las categorías
   const handleCreateBoard = () => {
      // Cerrar el modal
      toggleModalCatOpen();
   };

   // Para activar el check de las tareas
   const [activeCheckboxes, setActiveCheckboxes] = useState(false);
   const [assignedTasks, setAssignedTasks] = useState({});
   const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(null);

   const handlePlusClick = (index) => {
      setActiveCheckboxes(true);
      setSelectedCategoryIndex(index);
   };

   const handleTaskSelect = (task) => {
      const newAssignedTasks = { ...assignedTasks };
      if (!newAssignedTasks[selectedCategoryIndex]) {
         newAssignedTasks[selectedCategoryIndex] = [];
      }
      newAssignedTasks[selectedCategoryIndex].push(task);
      setAssignedTasks(newAssignedTasks);

      setActiveCheckboxes(false);
      setSelectedCategoryIndex(null);
   };

   const isTaskAssigned = (task) => {
      return Object.values(assignedTasks).some(
         tasksInCategory => tasksInCategory.includes(task)
      );
   };

   // Remover tarea de la categoría
   const handleTaskRemove = (task, categoryIndex) => {
      const newAssignedTasks = { ...assignedTasks };
      newAssignedTasks[categoryIndex] = newAssignedTasks[categoryIndex].filter(t => t !== task);
      setAssignedTasks(newAssignedTasks);

      // Para desmarcar el checkbox al remover la tarea
      setActiveCheckboxes(false);
   };

   // Mover tarea a la siguiente categoría
   const handleTaskMoveToNext = (task, categoryIndex) => {
      const newAssignedTasks = { ...assignedTasks };
      newAssignedTasks[categoryIndex] = newAssignedTasks[categoryIndex].filter(t => t !== task);
      
      const nextCategoryIndex = (categoryIndex + 1) % categoryCount;
      if (!newAssignedTasks[nextCategoryIndex]) {
         newAssignedTasks[nextCategoryIndex] = [];
      }
      newAssignedTasks[nextCategoryIndex].push(task);
      setAssignedTasks(newAssignedTasks);
   };

   return (
      <div className="columns p-4">
         <div className="column is-one-quarter" id="panel-task">
            <div className="box">
               <h2 className="title is-4">Listado de Tareas</h2>
               <button className="button is-primary is-rounded is-small" onClick={toggleModalOpen} id="plus"><span className='has-text-primary-20-invert'>+</span></button>
            </div>
            <div className="box task-container">
               {tasks.map(task => (
                  <div key={task.id} className='task-box'>
                     <label className="checkbox">
                        <input type="checkbox" disabled={!activeCheckboxes || isTaskAssigned(task)} onChange={() => handleTaskSelect(task)} />
                        <span className='subtitle is-6'>{task.title}</span>
                     </label>
                  </div>
               ))}
            </div>
         </div>
         {isModalOpen && (
            <div className="modal is-active">
               <div className="modal-background" onClick={toggleModalOpen}></div>
               <div className="modal-card">
                  <header className="modal-card-head">
                     <p className="modal-card-title">Nueva tarea</p>
                     <button className="delete" aria-label="close" onClick={toggleModalOpen}></button>
                  </header>
                  <section className="modal-card-body">
                     <div className="field">
                        <label className="label">Título</label>
                        <div className="control">
                           <input className="input is-text" type="text" placeholder="Text input" />
                        </div>
                     </div>
                     <div className="field">
                        <label className="label">Descripción</label>
                        <div className="control">
                           <textarea className="textarea is-text" placeholder="Textarea" rows={2}></textarea>
                        </div>
                     </div>
                     <div className='columns'>
                        <div className='column is-half'>
                           <div className="field">
                              <label className="label">Vencimiento</label>
                              <div className="control">
                                 <input className="input is-text" type="date" placeholder="Text input" />
                              </div>
                           </div>
                        </div>
                        <div className='column is-half'>
                           <div className="field">
                              <label className="label">Importancia</label>
                              <div className="control">
                                 <div className="select is-fullwidth is-text">
                                    <select>
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
                     <div className="buttons">
                        <button className="button is-success">Guardar</button>
                        <button className="button" onClick={toggleModalOpen}>Cancelar</button>
                     </div>
                  </footer>
               </div>
            </div>
         )}
         <div className="column" id="panel-board">
            <div className="box header">
               <h2 className="title">Tablero Kanban</h2>
               <button className="button is-primary" onClick={toggleModalCatOpen}>Crear</button>
            </div>
            <div className='box tableroKanban'>
               <div className="table-container is-fullwidth">
                  <table className="table is-fullwidth table-kanban">
                     <thead>
                        <tr>
                           {categoryNames.map((name, index) => (
                              <th key={index} style={{
                                 textAlign: 'center',
                                 backgroundColor: '#EBECF0',
                                 height: '30px', 
                                 verticalAlign: 'middle'
                              }}>
                                 {name || `Categoría ${index + 1}`}
                              </th>
                           ))}
                        </tr>
                     </thead>
                     <tbody>
                        <tr>
                           {categoryNames.map((_, index) => (
                              <td key={index} style={{ height: '80vh', textAlign: 'center' }}>
                                 <div className='pb-4'>
                                    <button className="button is-primary is-rounded is-small" id="plus" style={{ opacity: 0.7 }} onClick={() => handlePlusClick(index)}>
                                       <span className='has-text-primary-20-invert'>+</span>
                                    </button>
                                 </div>
                                 {assignedTasks[index] && assignedTasks[index].map((task, taskIndex) => (
                                    <div 
                                       key={taskIndex} 
                                       className='task-box-2' 
                                       onClick={() => handleTaskRemove(task, index)}
                                       onContextMenu={(e) => {
                                          e.preventDefault(); 
                                          handleTaskMoveToNext(task, index);
                                       }}
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
         {isModalCatOpen && (
            <div className="modal is-active">
               <div className="modal-background" onClick={toggleModalCatOpen}></div>
               <div className="modal-card">
                  <header className="modal-card-head">
                     <p className="modal-card-title">Tablero Kanban</p>
                     <button className="delete" aria-label="close" onClick={toggleModalCatOpen}></button>
                  </header>
                  <section className="modal-card-body">
                     <div className="field">
                        <label className="label">Cantidad de Categorías</label>
                        <div className="control">
                           <input
                              className="input"
                              type="number"
                              value={categoryCount}
                              onChange={handleCategoryCountChange}
                              min="3"
                           />
                        </div>
                     </div>
                     {categoryNames.map((name, index) => (
                        <div key={index} className="field">
                           <label className="label">{`Nombre de Categoría ${index + 1}`}</label>
                           <div className="control">
                              <input
                                 className="input"
                                 type="text"
                                 value={name}
                                 onChange={(event) => handleCategoryNameChange(index, event)}
                                 placeholder={`Categoría ${index + 1}`}
                              />
                           </div>
                        </div>
                     ))}
                  </section>
                  <footer className="modal-card-foot">
                     <button className="button is-success" onClick={handleCreateBoard}>Crear</button>
                     <button className="button" onClick={toggleModalCatOpen}>Cancelar</button>
                  </footer>
               </div>
            </div>
         )}
      </div>
   );
}
