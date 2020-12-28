import React from 'react'
/** Mòdul per gestionar l'apartat llegenda */
const Legend = props => {

    return (
        <div className="cntLegend">
            <div className="titleLegend">
                Llegenda:
            </div>
            <div className="cntLegendItem">
                <div className="icoRover"></div>
                <div className="cntTextItemLegend">rover</div>
            </div>
            <div className="cntLegendItem">
                <div className="icoObstacle"></div>
                <div className="cntTextItemLegend">obstacle</div>
            </div>
            <div className="cntLegendItem">
                <div className="icoCasella"></div>
                <div className="cntTextItemLegend">casella 5 metres</div>
            </div>
        </div>
    )
}

export default Legend