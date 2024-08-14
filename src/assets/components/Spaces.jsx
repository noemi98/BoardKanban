import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

import Swal from 'sweetalert2';

export const Spaces = () => {
   const [isModalOpen, setModalOpen] = useState(false);
   const toggleModalOpen = () => {
      setModalOpen(!isModalOpen);
   }

   //GET SPACES
   const [spaces, setSpaces] = useState([]);
   const fetchSpaces = async () => {
      try {
         const response = await axios.get('http://localhost:3000/spaces');
         setSpaces(response.data);
      } catch (error) {
         console.error("Error obteniendo los espacios:", error);
      }
   };

   useEffect(() => {
      fetchSpaces(); // Cargar SPACES
   }, []);

   //HOOK PARA LA NAVEGACION Y CLIC
   const navigate = useNavigate();
   const handleSpaceClick = (spaceId) => {
      navigate(`/tablero/${spaceId}`); // Navegar al tablero con el spaceId
   };

   //PARA EDITAR Y ELIMINAR
   const [isEditing, setIsEditing] = useState(false);
   const [currentSpace, setCurrentSpace] = useState(null);

   const handleEdit = (space) => {
      setCurrentSpace(space);
      setIsEditing(true);
      setModalOpen(true);
   };

   const handleSaveEdit = () => {
      fetch(`http://localhost:3000/spaces/${currentSpace.id}`, {
         method: 'PUT',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(currentSpace),
      })
         .then(response => response.json())
         .then(data => {
            // Actualiza tu lista de spaces o maneja la actualización en el estado
            setSpaces(prevSpaces => prevSpaces.map(space =>
               space.id === data.id ? data : space
            ));
   
            // Mostrar alerta de éxito
            Swal.fire({
               title: 'Éxito',
               text: 'El espacio de trabajo se ha actualizado correctamente.',
               icon: 'success',
               confirmButtonText: 'Aceptar'
            });
   
            setModalOpen(false);
         })
         .catch(error => {
            console.error('Error al actualizar el espacio:', error);
            // Mostrar alerta de error
            Swal.fire({
               title: 'Error',
               text: 'Hubo un problema al actualizar el espacio de trabajo. Inténtalo de nuevo.',
               icon: 'error',
               confirmButtonText: 'Aceptar'
            });
         });
   };
   

   const handleSaveCreate = () => {
      fetch('http://localhost:3000/spaces', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(currentSpace),
      })
         .then(response => response.json())
         .then(data => {
            // Actualiza tu lista de spaces o maneja la actualización en el estado
            setSpaces(prevSpaces => [...prevSpaces, data]);
   
            // Mostrar alerta de éxito
            Swal.fire({
               title: 'Éxito',
               text: 'El espacio de trabajo se ha creado correctamente.',
               icon: 'success',
               confirmButtonText: 'Aceptar'
            });
   
            setModalOpen(false);
         })
         .catch(error => {
            console.error('Error al crear el espacio:', error);
            // Mostrar alerta de error
            Swal.fire({
               title: 'Error',
               text: 'Hubo un problema al crear el espacio de trabajo. Inténtalo de nuevo.',
               icon: 'error',
               confirmButtonText: 'Aceptar'
            });
         });
   };
   


   const handleDelete = (id) => {
      fetch(`http://localhost:3000/spaces/${id}`, {
         method: 'DELETE',
      })
         .then(() => {
            // Actualiza la lista de espacios después de la eliminación
            setSpaces(prevSpaces => prevSpaces.filter(space => space.id !== id));
         })
         .catch(error => {
            console.error('Error al eliminar el espacio:', error);
         });
   };

   return (
      <div className='p-5'>
         <div className='box'>
            <div className="field" style={{ textAlign: 'center' }}>
               <h1 className="subtitle">Listado de proyectos / espacios de trabajo</h1>
               <button className="button is-primary is-rounded is-small" onClick={toggleModalOpen} id="plus"><span className='has-text-primary-20-invert'>+</span></button>
            </div>
         </div>

         {/* Listar espacios guardados */}
         <div className='columns is-multiline'>
            {spaces.map((space) => (
               <div key={space.id} className='column is-one-quarter'>
                  <div className='box'>
                     <div className='pb-3'>
                        <button className="button is-small is-success" onClick={() => handleSpaceClick(space.id)}>
                           <span className="icon is-small">
                              <i className="fas fa-eye"></i>
                           </span>
                        </button>&nbsp;
                        <button className="button is-small is-warning" onClick={() => handleEdit(space)}>
                           <span className="icon is-small">
                              <i className="fas fa-edit"></i>
                           </span>
                        </button>&nbsp;
                        <button className="button is-small is-danger" onClick={() => handleDelete(space.id)}>
                           <span class="icon">
                              <i class="fas fa-trash"></i>
                           </span>
                        </button>
                     </div>
                     <h2 className='title is-4'>{space.title}</h2>
                     <p>{space.description}</p>
                  </div>
               </div>
            ))}
         </div>


         {isModalOpen && (
            <div className="modal is-active">
               <div className="modal-background" onClick={toggleModalOpen}></div>
               <div className="modal-card">
                  <header className="modal-card-head">
                     <p className="modal-card-title">{isEditing ? 'Editar espacio de trabajo' : 'Nuevo espacio de trabajo'}</p>
                     <button className="delete" aria-label="close" onClick={toggleModalOpen}></button>
                  </header>
                  <section className="modal-card-body">
                     <div className="field">
                        <label className="label">Título</label>
                        <div className="control">
                           <input className="input is-text" type="text" placeholder="Título del proyecto" value={currentSpace?.title || ''} onChange={(e) => setCurrentSpace({ ...currentSpace, title: e.target.value })} />
                        </div>
                     </div>
                     <div className="field">
                        <label className="label">Descripción</label>
                        <div className="control">
                           <textarea className="textarea is-text" placeholder="Descripción sobre el proyecto" rows={2} value={currentSpace?.description || ''} onChange={(e) => setCurrentSpace({ ...currentSpace, description: e.target.value })}></textarea>
                        </div>
                     </div>
                  </section>
                  <footer className="modal-card-foot">
                     <div className="buttons">
                        <button className="button is-success" onClick={isEditing ? handleSaveEdit : handleSaveCreate}> {isEditing ? 'Guardar Cambios' : 'Crear Espacio'}</button>
                        <button className="button" onClick={toggleModalOpen}>Cancelar</button>
                     </div>
                  </footer>
               </div>
            </div>
         )}
      </div>
   )
}