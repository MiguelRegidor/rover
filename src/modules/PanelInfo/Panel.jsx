import React,{useEffect, useState} from 'react'
import Legend from './Legend'
/** Mòdul per gestionar el panell d'informació del simulador */
const Panel = props => {
    const [textDirection,setTextDirection] = useState('');
    useEffect(()=>{
        const {roverInfo} = props
        if(roverInfo){
            setTextDirection(roverInfo.directionsLabels[roverInfo.directions.indexOf(roverInfo.direction)]);
        }
    },[props])
    return (
        <div className="cntPanelInfo">
            <div className="itemInfo">
                <div className="title">Direcció: </div>
                <div className="value">{textDirection}</div>
            </div>
            <div className="itemInfo">
                <div className="title">Ubicació(X): </div>
                <div className="value">{props.roverInfo.pos_x/2}</div>
            </div>
            <div className="itemInfo">
            <div className="title">Ubicació(Y): </div>
                <div className="value">{props.roverInfo.pos_y/2}</div>
            </div>
            <Legend {...props}/>
        </div>
    )
}

export default Panel