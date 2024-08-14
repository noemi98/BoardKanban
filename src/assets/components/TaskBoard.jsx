import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Task } from './Task';

export const TaskBoard = () => {
   //FILTRO DE TAREAS POR SPACE
   const { spaceId } = useParams(); // Obtener spaceId de la URL
   const [tasks, setTasks] = useState([]);

   const fetchTasks = async () => {
      try {
         const response = await axios.get(`http://localhost:3000/tasks?spaceId=${spaceId}`);
         setTasks(response.data);
         //console.log(response.data);
      } catch (error) {
         console.error("Error obteniendo las tareas:", error);
      }
   };

   useEffect(() => {
      fetchTasks(); // Cargar tareas
   }, [spaceId]);


   const [isModalOpen, setModalOpen] = useState(false);
   const [isModalCatOpen, setModalCatOpen] = useState(false);

   const toggleModalOpen = () => {
      setModalOpen(!isModalOpen);
   }
   const toggleModalCatOpen = () => {
      setModalCatOpen(!isModalCatOpen);
   }

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

   const isTaskDisabled = (task) => {
      // Verifica si la tarea está en cualquier categoría
      return Object.values(assignedTasks).flat().some(t => t.id === task.id);
   };

   const handleTaskSelect = (task) => {
      const newAssignedTasks = { ...assignedTasks }; //Copia del estado (oper propa)
      if (!newAssignedTasks[selectedCategoryIndex]) {
         newAssignedTasks[selectedCategoryIndex] = [];
      }
      newAssignedTasks[selectedCategoryIndex].push(task);

      setAssignedTasks(newAssignedTasks);

      //Bloqueo y tache
      setTasks(prevTasks =>
         prevTasks.map(t =>
            t.id === task.id ? { ...t, isChecked: true } : t
         )
      );

      setActiveCheckboxes(false);
      setSelectedCategoryIndex(null);
   };

   const isTaskAssigned = (task) => {
      /*return Object.values(assignedTasks).some(
         tasksInCategory => tasksInCategory.includes(task)
      );*/
      return Object.values(assignedTasks).flat().includes(task);
   };

   // Remover tarea de la categoría
   const handleTaskRemove = (task, categoryIndex) => {
      const newAssignedTasks = { ...assignedTasks };
      newAssignedTasks[categoryIndex] = newAssignedTasks[categoryIndex].filter(t => t !== task);
      setAssignedTasks(newAssignedTasks);
      // Asegúrate de que el estado del checkbox refleje los cambios
      setTasks(prevTasks =>
         prevTasks.map(t =>
            t.id === task.id ? { ...t, isChecked: false } : t
         )
      );
   };

   // Modificación en el checkbox para que esté vinculado al estado de la tarea
   const handleTaskChange = (task) => {
      if (task.isChecked) {
         handleTaskRemove(task, selectedCategoryIndex);
      } else {
         handleTaskSelect(task);
      }
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
         <Task
            toggleModalOpen={() => { }}
            activeCheckboxes={activeCheckboxes}
            handleTaskChange={handleTaskChange}
            tasks={tasks}
         />
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
                        <div className="control ">
                           <input
                              className="input is-text"
                              type="number"
                              value={categoryCount}
                              onChange={handleCategoryCountChange}
                              min="3"
                           />
                        </div>
                     </div>
                     <div className="columns is-multiline">
                        {categoryNames.map((name, index) => (
                           <div key={index} className="column is-half">
                              <div className="field">
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
                           </div>
                        ))}
                     </div>
                  </section>
                  <footer className="modal-card-foot">
                     <button className="button is-success" onClick={handleCreateBoard}>Crear</button>&nbsp;
                     <button className="button" onClick={toggleModalCatOpen}>Cancelar</button>
                  </footer>
               </div>
            </div>
         )}
      </div>
   );
}
