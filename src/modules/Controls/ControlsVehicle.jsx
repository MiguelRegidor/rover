import React from 'react';
/** Mòdul per gestionar els controls del rover */
const ControlsVehicle = props => {
    const directions = props.roverInfo.directions;
    const directionsLabels =props.roverInfo.directionsLabels;
    /** Gestiona la solicitud de canvi de direcció del rover */
    const setDirection = directionSelected => {
        const {changeDirection} = props;
        changeDirection(directionSelected);
    }
    return (
        <div className="cntDirectionButtons">
            <div className="titleDirectionButtons">direcció rover</div>
            <div className="cntButtons">
            {
                directions.map((direction,key) =>{                        
                    return(
                        <div className={`cntButton ${direction}`} key={key}>                                                        
                                <button
                                    className={directions[key] ===  props.roverInfo.direction ? `${direction} active` : `${direction}`}
                                    name={directionsLabels[key]}
                                    onClick={() => setDirection(`${direction}`)}                                  
                                >{direction}</button>                                                                                            
                            </div>
                    )
                })
            }
            </div>
        </div>
    )
}

export default ControlsVehicle