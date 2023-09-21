let props = {
    piezas: [],
    contadorPieza: 0
};
const tablero = document.getElementById('canvas');
const tableroAttr = tablero.getBoundingClientRect();

const NUM_COLUMNAS = 14;
const NUM_FILAS = 21;

const PIXEL_VISIBLE = 'pixel visible fila-pieza';
const PIXEL_INVISIBLE = 'pixel invisible fila-pieza';

let idPieza = 1;
let tamItemX = 0, tamItemY = 0, inicioX = 0, inicioY = 0, finalY = 0;
let scrollX = 0;
let piezaActual = [];
let startX = 0;

const botonInteraccion = document.getElementById('boton-interaccion');

const consultarPiezas = async () => {
    return fetch('piezas.json').then(response => response.json());
}

document.addEventListener('keydown', function(event) {
    const pieza = document.getElementById(idPieza);
    const piezaAttr = pieza.getBoundingClientRect();

    // Mover hacia la derecha
    if (event.key === 'ArrowRight' || event.key === 'D' || event.key === 'd') {
        if (parseInt(tableroAttr.left + tableroAttr.width) > parseInt(piezaAttr.left + piezaAttr.width)) {
            pieza.style.left = (piezaAttr.x+tamItemX)+'px';
        }
    } 
    // Mover hacia la izquierda
    else if (event.key === 'ArrowLeft' || event.key === 'A' || event.key === 'a') {
        if (parseInt(inicioX) < parseInt(piezaAttr.x)) {
            pieza.style.left = (piezaAttr.x-tamItemX)+'px';
        }
    } 
    // Mover hacia abajo
    else if (event.key === 'ArrowDown' || event.key === 'S' || event.key === 's') {
        if (parseInt(finalY) > parseInt(piezaAttr.y+piezaAttr.height+(piezaAttr.height/2))) {
            pieza.style.top = `${piezaAttr.top+tamItemY}px`;
        }
    }
    // Rotar pieza hacia la derecha
    else if (event.key === 'e' || event.key === 'E') {
        pieza.innerHTML = '';
        const cantidadElementosX = piezaActual.length;
        const cantidadElementosY = piezaActual[0].length;

        const piezasInvertidas = [];

        // rotación del elemento
        for (let i = cantidadElementosY-1; i > -1 ; i--) {
            const pixelAux = [];
            for (let j = 0; j < cantidadElementosX; j++) {
                pixelAux.push(piezaActual[j][i]);
            }
            piezasInvertidas.push(pixelAux);
        }
        crearPieza(pieza, piezasInvertidas);
    }
    // Rotar pieza hacia la izquierda
    else if (event.key === 'q' || event.key === 'Q') {
        pieza.innerHTML = '';
        const cantidadElementosX = piezaActual.length;
        const cantidadElementosY = piezaActual[0].length;

        const piezasInvertidas = [];

        // rotación del elemento
        debugger;
        for (let i = 0; i < cantidadElementosY ; i++) {
            const pixelAux = [];
            for (let j = cantidadElementosX-1; j > -1; j--) {
                pixelAux.push(piezaActual[j][i]);
            }
            piezasInvertidas.push(pixelAux);
        }
        crearPieza(pieza, piezasInvertidas);
    }
});

document.addEventListener('touchstart', function(event) {
    // Registra las coordenadas iniciales al tocar la pantalla
    startX = event.touches[0].clientX;
});

document.addEventListener('dblclick', () => {
    const pieza = document.getElementById(idPieza);
    pieza.innerHTML = '';
    const cantidadElementosX = piezaActual.length;
    const cantidadElementosY = piezaActual[0].length;

    const piezasInvertidas = [];

    // rotación del elemento
    for (let i = cantidadElementosY-1; i > -1 ; i--) {
        const pixelAux = [];
        for (let j = 0; j < cantidadElementosX; j++) {
            pixelAux.push(piezaActual[j][i]);
        }
        piezasInvertidas.push(pixelAux);
    }
    crearPieza(pieza, piezasInvertidas);
});

document.addEventListener('touchmove', function(event) {
    const scrollX = event.touches[0].clientX - startX;
    const sensibilidad = 100;

    const pieza = document.getElementById(idPieza);
    const piezaAttr = pieza.getBoundingClientRect();

    if (scrollX > sensibilidad) {
        if (parseInt(tableroAttr.left + tableroAttr.width) > parseInt(piezaAttr.left + piezaAttr.width)) {
            pieza.style.left = (piezaAttr.x+tamItemX)+'px';
        }
    } 
    // Movimiento hacia la izquierda
    else if (scrollX < -sensibilidad) {
        if (parseInt(inicioX) < parseInt(piezaAttr.x)) {
            pieza.style.left = (piezaAttr.x-tamItemX)+'px';
        }
    }
});

const crearPieza = (pieza, arrPiezas) => {
    piezaActual = [];
    let filaPieza = null;
    for (let i = 0; i < arrPiezas.length; i++) {
        let itemPieza = [];
        for (let j = 0; j < arrPiezas[i].length; j++) {
            if (j == 0) {
                filaPieza = document.createElement("div");
                filaPieza.style.height = `${tamItemY}px`;
                pieza.appendChild(filaPieza);
            }

            const pixel = document.createElement('div');
            pixel.id = `${idPieza}-${i}-${j}`;
            pixel.style.width = `${tamItemX}px`;
            pixel.style.height = `100%`;
            if (arrPiezas[i][j]) {
                pixel.className = PIXEL_VISIBLE;
                pixel.style.backgroundColor = props.piezas[props.contadorPieza].background;
            } else {
                pixel.className = PIXEL_INVISIBLE;
            }
            itemPieza.push(arrPiezas[i][j])
            filaPieza.appendChild(pixel);
        }
        piezaActual.push(itemPieza);
    }
}

const controllerTetris = () => {
    const pieza = document.createElement("div");
    pieza.className = 'pieza';
    pieza.id = idPieza;
    pieza.style.top = `${inicioY}px`;
    pieza.style.left = `${tableroAttr.left+(NUM_COLUMNAS/2-1)*tamItemX}px`;
    tablero.appendChild(pieza);

    crearPieza(pieza, props.piezas[props.contadorPieza].value);

    setTimeout(() => {
        const intervalPieza = setInterval(() => {
            const piezaAttr = pieza.getBoundingClientRect();
            if ((piezaAttr.y + piezaAttr.height) < (tableroAttr.y + tableroAttr.height - tamItemY)) {
                pieza.style.top = (piezaAttr.y+tamItemY)+'px';
            } else {
                idPieza++;
                props.contadorPieza = props.contadorPieza < (props.piezas.length-1) ? ++props.contadorPieza : 0;
                clearInterval(intervalPieza);
                controllerTetris();
            }
        }, 500);
    }, 800);
}

const stylesTablero = () => {
    for (let i = 0; i < NUM_COLUMNAS*NUM_FILAS; i++) {
        const cuadricula = document.createElement("div");
        cuadricula.className = 'cuadricula';
        cuadricula.id = `cuadricula${(i+1)}`;
        tablero.appendChild(cuadricula);
    }
    tamItemX = tableroAttr.width / NUM_COLUMNAS;
    tamItemY = tableroAttr.height / NUM_FILAS;

    const cuadriculaInicial = document.getElementById('cuadricula1').getBoundingClientRect();
    inicioX = cuadriculaInicial.x;
    inicioY = cuadriculaInicial.y;

    finalY = tableroAttr.height + tableroAttr.y;
}

const audio = () => {
    Swal.fire({
        title: 'Deseas activar el audio?',
        padding: '3em',
        color: '#716add',
        background: '#fff url(./assets/trees.png)',
        backdrop: `
            rgba(0,0,123,0.4)
            left top
            no-repeat
        `,
        showDenyButton: true,
        confirmButtonText: 'Música para mis oidos',
        denyButtonText: 'No',
    }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            const audio = new Audio('assets/sonidoTetris.mp3');

            audio.play(); // Reproduce el audio
            audio.addEventListener('ended', function () {
                audio.currentTime = 0;
                audio.play();
            });
        }
        controllerTetris();
    });
}

const init = async () => {
    props.piezas = await consultarPiezas();
    stylesTablero();
    audio();
}

init();