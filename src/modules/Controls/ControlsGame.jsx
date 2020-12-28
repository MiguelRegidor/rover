import React from 'react'
import Swal from 'sweetalert2'
/** Mòdul per gestionar els controls del simulador */
const ControlsGame = props =>{   

    /** Funció per gestionar el diàleg de reinici del simulador */
    const restartGame = () => {
        const {resetGame} = props
        Swal.fire({
            title: 'Vols reiniciar la simulació?',
            text: "Perdràs les dades de la simulació actual",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, tornem a començar!',
            cancelButtonText: 'No, seguiré endavant!'
          }).then((result) => {
            if (result.isConfirmed) {
                resetGame(true)
              Swal.fire(
                'Nova simulació iniciada!',
                'S\'ha traslladat el rover a la nova posició.',
                'success'
              )
            }
          })
    }
    
    return (
        <div className="cntButonsGame">
            <button
            onClick={restartGame}
            >            
            reinicia simulació
            </button>            
        </div>
    )
}

export default ControlsGame