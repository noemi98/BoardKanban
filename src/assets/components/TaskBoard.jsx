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

   //BD
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

   //Para las categorías del tablero
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

   //Para dibujar la tabla según las categorías
   const handleCreateBoard = () => {
      // Cierra el modal después de crear el tablero
      toggleModalCatOpen();
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
                     <h2 className='subtitle is-6'>{task.title}</h2>
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
                     <div class="field">
                        <label class="label">Descripción</label>
                        <div class="control">
                           <textarea class="textarea is-text" placeholder="Textarea" rows={2}></textarea>
                        </div>
                     </div>
                     <div className='columns'>
                        <div className='column is-half'>
                           <div class="field">
                              <label class="label">Vencimiento</label>
                              <div class="control">
                                 <input className="input is-text" type="date" placeholder="Text input" />
                              </div>
                           </div>
                        </div>
                        <div className='column is-half'>
                           <div class="field">
                              <label class="label">Importancia</label>
                              <div class="control">
                                 <div class="select is-fullwidth is-text">
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
            <div className='box'>
               <div className="table-container is-fullwidth">
                  <table className="table is-fullwidth table-kanban">
                     <thead>
                        <tr>
                           {categoryNames.map((name, index) => (
                              <th key={index}>{name || `Categoría ${index + 1}`}</th>
                           ))}
                        </tr>
                     </thead>
                     <tbody>
                        <tr>
                           {categoryNames.map((_, index) => (
                              <td key={index} style={{ height: '80vh' }}></td>
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
                     <p className="modal-card-title">Categorías del tablero</p>
                     <button className="delete" aria-label="close" onClick={toggleModalCatOpen}></button>
                  </header>
                  <section className="modal-card-body">
                     <div className="field">
                        <label className="label">Cantidad de categorías</label>
                        <div className="control pb-4">
                           <input className="input is-text" type="number" min="3" value={categoryCount} onChange={handleCategoryCountChange} />
                        </div>

                        <div className="field" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                           {categoryNames.map((category, index) => (
                              <div className="control" key={index} style={{ flexGrow: 1 }}>
                                 <input className="input is-text" type="text" value={category} onChange={(event) => handleCategoryNameChange(index, event)}
                                    placeholder={`Categoría ${index + 1}`}
                                 />
                              </div>
                           ))}
                        </div>

                     </div>
                  </section>
                  <footer className="modal-card-foot">
                     <div className="buttons">
                        <button className="button is-success" onClick={handleCreateBoard}>Crear</button>
                        <button className="button" onClick={toggleModalCatOpen}>Cancelar</button>
                     </div>
                  </footer>
               </div>
            </div>
         )}
      </div>
   )
}
