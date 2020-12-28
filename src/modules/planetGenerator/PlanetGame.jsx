import React,{Component} from 'react'
import Swal from 'sweetalert2'
import ControlsGame from './../Controls/ControlsGame'
import ControlsVehicle from './../Controls/ControlsVehicle'
import PanelInfo from './../PanelInfo/Panel'
import './planetStyles.css'

/** Mòdul principal del simulador */
class PlanetGame extends Component {
    constructor(){
        super();
        this.canvasRef = React.createRef();
        this.areaDivider = 5; // àrea per la divisió del planeta en cel·les        
        this.wide_planet = 200;
        this.height_planet = 200;            
        this.sizeAreaDivider = 10; // mida de la cel·la en px
        this.speedMovements = 200;
        this.obstacleColor = 'red';
        this.gridColor = 'green'
        this.planetColor = 'brown';
        this.pathColor = 'brown'; // definir color en cas de voler deixar un rastre del camí del rover        
        this.state = {
            titleApp: 'Mars Rover Mission',
            wide_planet: this.wide_planet / this.areaDivider, 
            height_planet: this.height_planet/ this.areaDivider,
            rockets: 50, // número d'obstacles            
            tableHeight: 0,
            tableWidth: 0,                        
            areas: [],
            obstacles: [],            
            lastOrders: '',
            roverState:{
                direction: 'N',
                pos_x: 0,
                pos_y: 0,
                color: '#000',                
                directions: ['N','W','E','S'],
                directionsLabels: ['Nord','Oest','Est','Sud']
            }
        }

        this.setVehicleDirection = this.setVehicleDirection.bind(this);
        this.defineTable = this.defineTable.bind(this);
        this.setOrders = this.setOrders.bind(this);
        this.sendOrders = this.sendOrders.bind(this);
    }
    /**
     * Crea el taulell del simulador.
     * 
     * @param reset - assigna la opció de reinici del simulador
     */
    defineTable(reset=false){
        if(reset){
            let {roverState} = this.state;
            roverState.direction = 'N';
            this.setState({roverState})
        }
        let tableHeightCalculated = this.height_planet * 2 + (this.sizeAreaDivider*2);
        let tableWidthCalculated = this.wide_planet * 2 + (this.sizeAreaDivider*2);
        this.setState({
            ...this.state,
            tableHeight: tableHeightCalculated,
            tableWidth: tableWidthCalculated
        }, () => {
            const canvas = this.canvasRef.current;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = this.planetColor;              
            ctx.fillRect(0, 0, tableHeightCalculated, tableWidthCalculated)   
            this.createAreasMapPlanet();
        });
    }
        
    /**
     * Definim les areas que composen el taulell de simulació 200x200
     * cada quadre equival a 5x5m de planeta 40x40
     * 
     * En base al número d'àreas treiem els obstacles aleatoris controlats per la variable del simulador roverState (rockets)
     * @param areas 
     */
    defineObstacles = (areas) => {
        const {rockets} = this.state
        let auxObstacles = [];
        
            for (let aux = 0; aux < rockets;aux++){
                let min = Math.ceil(0);
                let max = areas.length;            
                let auxObs = Math.floor(Math.random() * (max - min + 1)) + min;
                let locateObstacle = auxObstacles.find(o => o === auxObs);
                
                if (!locateObstacle ){
                    auxObstacles.push(auxObs)
                }else{
                    aux--;
                }
            }           
            this.setState({
                ...this.state,
                obstacles: auxObstacles
            }, () => {
                this.createGameBoard(areas)
            })
    }
    
    /** Defineix les areas del taulell de simulació */
    createAreasMapPlanet(){
        const {tableHeight, tableWidth} = this.state
        let auxAreas = [];
        for(let y = this.sizeAreaDivider; y < tableHeight - this.sizeAreaDivider; y = y + this.sizeAreaDivider){
            for(let x = this.sizeAreaDivider; x < tableWidth - this.sizeAreaDivider; x = x + this.sizeAreaDivider){
                
                let itemArea = {
                    coord_x: x,
                    coord_y: y                    
                }       
                auxAreas.push(itemArea)     
                
            }            
        }

        this.setState({
            ...this.state,
            areas: auxAreas
        }, () => {
            this.defineObstacles(auxAreas)
        })       

    }

    /**
     * Comprova les ordres introduïdes
     * @param {*} orders string amb les ordres entrades per l'usuari
     */
    checkOrders(orders){
        let {lastOrders} = this.state
        return new Promise ((resolve,rejected) => {
            if(orders === ''){
                resolve(false)
            }
            let validOrders = ['F','R','L']
            let passChecks = true;
            for (let i = 0; i < orders.length; i++){                
                let order = orders.charAt(i);
                let passFilterOrders = validOrders.find(x => x === order);                
                if(passFilterOrders === undefined){ //&& passFilterOrders                    
                    passChecks = false;
                }            
                
            }
            if(passChecks){
                lastOrders = orders    
                this.setState({
                    ...this.state,
                    lastOrders
                }, () => {
                    resolve(passChecks);
                })
            }else{
                resolve(passChecks);
            }

        })
    }
        
    /**
    * Crea el taulell de simulació i els obstacles generats 
    * @param {*} gameAreas array amb les àrees que componen el planeta
    */
    createGameBoard = (gameAreas) => {
        const {obstacles} = this.state
        let canvas = this.canvasRef.current;
        let ctx = canvas.getContext('2d');

        gameAreas.map((area,key) => {            
            ctx.strokeStyle = this.gridColor;        
            let auxObstacle = obstacles.find(o => o === key)               
            if(auxObstacle){
                ctx.fillStyle = this.obstacleColor;                    
                ctx.fillRect(area.coord_x,area.coord_y,this.sizeAreaDivider,this.sizeAreaDivider)
            }else{
                ctx.strokeRect(area.coord_x,area.coord_y,this.sizeAreaDivider,this.sizeAreaDivider)                    
                } 
        })
        this.initialPositionRover();
    }
    
    /**
    * Actualitza el taulell de simulació amb la posicio del rover
    * @param {*} roverState - dades actuals del rover
    * @param {*} lastPosition - última posicio vàlida del rover, dona la possibilitat de pintar el camí recorregut del rover, 
    */
    updatePanelGame(roverState,lastPosition = false){        
        let canvas = this.canvasRef.current;
        let ctx = canvas.getContext('2d');
        
        ctx.fillStyle = roverState.color;
        ctx.fillRect(roverState.pos_x,roverState.pos_y,this.sizeAreaDivider,this.sizeAreaDivider)
        /** Opció per dibuixar el rastre del rover */
        if(lastPosition){
            ctx.fillStyle = this.pathColor;                    
            ctx.strokeStyle = this.gridColor;
            ctx.fillRect(lastPosition.pos_x,lastPosition.pos_y,this.sizeAreaDivider,this.sizeAreaDivider)
            ctx.strokeRect(lastPosition.pos_x,lastPosition.pos_y,this.sizeAreaDivider,this.sizeAreaDivider)
        }        
    }

    /** Posiciona el rover en el punt de sortida */
    initialPositionRover(){
        let {roverState, obstacles, areas} = this.state;

        let min = Math.ceil(0);
        let max = areas.length;            
        let positionOk = 0;
        
        do{
            let auxObs = Math.floor(Math.random() * (max - min + 1)) + min;
            let locateObstacle = obstacles.find(o => o === auxObs);
            if (!locateObstacle){                
                positionOk = auxObs                
            }            
        }while(positionOk === 0)

        if(areas[positionOk]){
            roverState.pos_y = areas[positionOk].coord_y;
            roverState.pos_x = areas[positionOk].coord_x; 
        }

        /** correccio de la direcció inicial en cas de limit superior 
         * per que no quedi a ran dels limits del planeta
        */       
        if(roverState.pos_y === 10){
            roverState.pos_y += this.sizeAreaDivider;
            roverState.direction = 'S'
        }else if(roverState.pos_y === 400){
            roverState.pos_y -= this.sizeAreaDivider;
            roverState.direction = 'N'
        }

        if(roverState.pos_x === 10){
            roverState.pos_x += this.sizeAreaDivider;            
        }else if(roverState.pos_x === 400){
            roverState.pos_x -= this.sizeAreaDivider;            
        }

        /**  Actualiza dades i crida al següent pas */
        this.setState({
            ...this.state,
            roverState
        }, () => this.updatePanelGame(roverState))

    }

    
    /**
     * Funció per gestionar el moviment del rover tenin en compte la direcció actual del vehicle.
     * @param {*} move - Clau del moviment seleccionat per l'usuari
     */
    moveRover(move = ''){        
        let lastPosition = {}
        let {roverState,obstacles} = this.state
        
        /** Guardat de les posicions actuals del rover abans de gestionar el moviment */
        lastPosition.pos_x = roverState.pos_x;
        lastPosition.pos_y = roverState.pos_y;                
        /* Avaluació de les accions en base a la direcció actual del rover */
        let new_x,new_y,moviment;
        switch(roverState.direction){
            case 'N':               
               /* Avaluació de les accions en base al moviment solicitat */
                switch(move){
                    case 'F':                     
                        new_y = roverState.pos_y - this.sizeAreaDivider;
                        new_x = roverState.pos_x;
                        moviment = 'frontal'
                        break;
                    case 'L':                    
                        new_x = roverState.pos_x - this.sizeAreaDivider;
                        new_y = roverState.pos_y;
                        moviment = 'cap a l\'esquerra'
                        break;
                    case 'R':
                        new_x = roverState.pos_x + this.sizeAreaDivider;
                        new_y = roverState.pos_y;
                        moviment = 'cap a la dreta'
                        break;
                    default:
                        break;
                }
                break;
            case 'S':                     
                switch(move){
                    case 'F':
                        new_y = roverState.pos_y  + this.sizeAreaDivider;
                        new_x = roverState.pos_x;
                        moviment = 'frontal'
                        break;
                    case 'L':                    
                        new_x = roverState.pos_x + this.sizeAreaDivider;
                        new_y = roverState.pos_y;
                        moviment = 'cap a l\'esquerra'
                        break;
                    case 'R':
                        new_x = roverState.pos_x - this.sizeAreaDivider;
                        new_y = roverState.pos_y;
                        moviment = 'cap a la dreta'
                        break;
                    default:
                        break;                        
                }     
                    break;                       
            case 'E':                
                switch(move){
                    case 'F':
                        new_y = roverState.pos_y;
                        new_x = roverState.pos_x + this.sizeAreaDivider;
                        moviment = 'frontal'
                        break;
                    case 'L':                    
                        new_x = roverState.pos_x;
                        new_y = roverState.pos_y - this.sizeAreaDivider;
                        moviment = 'cap a l\'esquerra'
                        break;
                    case 'R':
                        new_x = roverState.pos_x;
                        new_y = roverState.pos_y + this.sizeAreaDivider;
                        moviment = 'cap a la dreta'
                        break;
                    default:
                        break;
                    }                       
                break;           
            case 'W':
                switch(move){
                    case 'F':
                        new_y = roverState.pos_y;
                        new_x = roverState.pos_x - this.sizeAreaDivider;
                        moviment = 'frontal'
                        break;
                    case 'L':                    
                        new_x = roverState.pos_x;
                        new_y = roverState.pos_y + this.sizeAreaDivider;
                        moviment = 'cap a l\'esquerra'
                        break;
                    case 'R':
                        new_x = roverState.pos_x;
                        new_y = roverState.pos_y - this.sizeAreaDivider;
                        moviment = 'cap a la dreta'
                        break;
                    default:
                        break;
                }                        
                break;
            default:
                break;
        }
        
        /**
        * Fem els controls de posició per evitar colisions o sortides dels limits
        * @param {*} next_x - propera posicio X del rover
        * @param {*} next_y - propera posicio Y del rover    
        */
        this.controlPlanetLimits(new_x,new_y)
            .then(passLimitsChecks =>{
                if(passLimitsChecks){                          
                    /** No hi ha risc de sortida dels límits */  
                    this.preventColision(new_x,new_y,obstacles)
                        .then(passPreventColision =>{
                            if(passPreventColision){
                                /** No hi ha risc de colisió */
                                roverState.pos_y = new_y;
                                roverState.pos_x = new_x;
                                this.setState({
                                    ...this.state,
                                    roverState
                                }, this.updatePanelGame(roverState,lastPosition) )
                            }else{
                                /** Colisio detectada */
                                clearInterval(this.timerActionsId)
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Ups...',
                                    text: `S'ha evitat un accident, s'ha trobat un obstacle en l'últim moviment ${moviment} !`,
                                    position: 'top-end',
                                })
                                .then(result =>{
                                    this.setFocusInput();
                                })
                            }
                                })
                }else{
                    /** Sortida dels límits detectada */
                    clearInterval(this.timerActionsId)
                        Swal.fire({
                            icon: 'info',
                            title: 'Ups...',
                            text: `Has arribat als límits del planeta, en l'últim moviment ${moviment}, la seqüència s'ha avortat! Pots canviar la direcció del rover per tornar enrere.`,
                            position: 'top-end',
                            })
                            .then(result =>{
                                this.setFocusInput();                                
                            })
                }                        
            })
    }

    
    /**
    * Funcio de control per evitar sortir dels limits del planeta
    * @param {*} next_x - propera posicio X del rover
    * @param {*} next_y - propera posicio Y del rover    
    */
    controlPlanetLimits(next_x,next_y){
        return new Promise((resolve,rejected) => {
            if(next_x < 10 || next_x > 400 || next_y < 10 || next_y > 400){
                resolve(false);
            }else{
                resolve(true);
            }
        })
    }
    
    
    /**
    * Funcio de control per evitar colisionar amb els obstacles del planeta 
    * @param {*} next_x - propera posicio X del rover
    * @param {*} next_y - propera posicio Y del rover
    * @param {*} obstacles - array obstacles generats
    */
    preventColision(next_x,next_y,obstacles){
        let {areas} = this.state
        return new Promise((resolve,rejected) => {
            let indexNextArea = areas.indexOf(areas.find(x => x.coord_x === next_x && x.coord_y === next_y));
            let posObstacle = obstacles.find(x => x === indexNextArea)
            if(!posObstacle){
                resolve(true);
            }else{
                resolve(false);
            }
        })
    }

    /** Funció per gestionar les ordres rebudes i llançar els moviments del rover */
    launchMovements(orders){
        let count = 0;
        let sizeOrders = orders.length;                
        this.timerActionsId = setInterval(() => {
            this.moveRover(orders.charAt(count))
            count++;
            /** Control de sortida del temporitzador un cop finalitzades les ordres */
            if(count === sizeOrders){
                clearInterval(this.timerActionsId)                                
                this.setState({
                    ...this.state,
                    lastOrders:''
                })
                this.setFocusInput();
            }
          }, this.speedMovements);          
    }

    /** Funció per gestionar el canvi de direcció del rover */
    setVehicleDirection(directionMovement) {
        let {roverState} = this.state
        roverState.direction = directionMovement;
        this.setState({
            ...this.state,
            roverState            
        })
    }

    /** Gestiona el contingut de les ordres que entra l'usuari
     *  
     */
    setOrders(inputOrdersText){               
        let textOrders = inputOrdersText.target.value
        let lastOrders = textOrders.toUpperCase();        
        this.setState({
            ...this.state,
            lastOrders
        })
        
    }
    /** Funció que envia les ordres introduïdes */
    sendOrders(){
        let {lastOrders} = this.state
        this.checkOrders(lastOrders)
                .then(resOrders => {
                    if(resOrders === true){                        
                        let timerInterval;
                        Swal.fire({
                            title: 'Transmetent ordres al rover',                            
                            timer: 1000,
                            timerProgressBar: true,
                            position: 'bottom',
                            didOpen: () => {
                            Swal.showLoading()
                            timerInterval = setInterval(() => {
                                const content = Swal.getContent()
                                if (content) {
                                const b = content.querySelector('b')
                                if (b) {
                                    b.textContent = Swal.getTimerLeft()
                                }
                                }
                            }, 100)
                            },
                            willClose: () => {
                            clearInterval(timerInterval)
                            }
                        }).then(() => {
                            this.launchMovements(lastOrders);                                                  
                        })
                    }else{
                        Swal.fire({
                            icon: 'error',
                            title: 'Ups...',
                            text: 'No s\'han entrat ordres vàlides',
                            position: 'top',
                            
                          })
                          .then(result =>{
                            this.setState({
                                ...this.state,                                
                                lastOrders:''                                
                            });
                            this.setFocusInput();
                        })
                    }
                })
    }

    /* Funció que selecciona el focus a la caixa d'entrada d'ordres */
    setFocusInput(){
        document.getElementById("inputOrders").focus();
    }
    
    /** Funció que engega el simulador */
    componentDidMount(){        
        this.defineTable();   
        this.setFocusInput();        
    }

    render(){    
        const {roverState, titleApp, lastOrders, tableHeight, tableWidth } = this.state           
            return (
                <div className="cntPlanetGame">                    
                <div className="cntGame">
                    <div className="titleGame">{`${titleApp} - ${this.wide_planet}x${this.height_planet}m`}</div>
                    <canvas id="canvas" ref={this.canvasRef} height={`${tableHeight}px`} width={`${tableWidth}px`} />                    
                </div>
                <div className="cntControls">
                    <div className="cntInputOrders">
                        <input placeholder="esperant instruccions" id="inputOrders" name="lastOrders" type="text" value={lastOrders} onChange={this.setOrders}/>
                        <button name="sendOrders" type="button" onClick={this.sendOrders} >enviar instruccions</button>
                    </div>           
                    <div className="cntInstructions">
                        <div>F: Davant | L: Esquerra | R: Dreta</div>
                    </div>
                    <div className="PanelsVehicle">
                        <PanelInfo roverInfo={roverState}/>
                        <ControlsVehicle roverInfo={roverState}  changeDirection={this.setVehicleDirection} />
                    </div>
                    <ControlsGame resetGame={this.defineTable}/>
                </div>
                </div>
            )        
    }
    
}

export default PlanetGame