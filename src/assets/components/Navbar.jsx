import React from 'react'

export const Navbar = () => {
   return (
      <div>
         <nav className="navbar" role="navigation" aria-label="main navigation">
            <div className="navbar-brand">
               <a className="navbar-item" href="https://bulma.io" id='logoWeb'>
                  <img src="../public/kanban_logo.png" alt="Logo" />
               </a>

               <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                  <span aria-hidden="true"></span>
                  <span aria-hidden="true"></span>
                  <span aria-hidden="true"></span>
                  <span aria-hidden="true"></span>
               </a>
            </div>

            <div id="navbarBasicExample" className="navbar-menu">
               <div className="navbar-start">
                  <a className="navbar-item">
                     Tablero
                  </a>

                  <a className="navbar-item">
                     Tareas
                  </a>

                  <div className="navbar-item has-dropdown is-hoverable">
                     <a className="navbar-link">
                        Otros
                     </a>

                     <div className="navbar-dropdown">
                        <a className="navbar-item">
                           About
                        </a>
                        <a className="navbar-item is-selected">
                           Jobs
                        </a>
                        <a className="navbar-item">
                           Contact
                        </a>
                     </div>
                  </div>
               </div>

               <div className="navbar-end">
                  <div className="navbar-item">
                     <div className="buttons">
                        <a className="button is-primary">
                           <strong>Cerrar</strong>
                        </a>
                        <a className="button is-light">
                           Iniciar sesión
                        </a>
                     </div>
                  </div>
               </div>
            </div>
         </nav>
      </div>
   )
}
