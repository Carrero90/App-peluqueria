let pagina = 1;
const cita = {
    nombre:'',
    fecha: '',
    hora: '',
    servicios: []
}

document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();
});

function iniciarApp() {
    mostrarServicios();

    // mostrar el Div actual segun el tab al que se presiona
    mostrarSeccion();

    //oculta o muestra la seccion segun al tab al que se presiona
    cambiarSeccion();

    //paginacion siguiente y anterior
    paginaSiguiente();

    paginaAnterior();

    //comprueba la pagina actual para ocultar o mostrar la paginacion
    botonesPaginador();

    //muestra el resumen de la cita o mensaje de error en caso de no pasar la vaidacion
    mostrarResumen();

    // almacena el nombre de la cita en el objeto
    nombreCita();

    //Almacena la fecha de la cita en el Objeto
    fechacita();

    //deshabilita dias pasados
    deshabilitarFechaAnterior();

    //almacena la hora de la cita en el objeto
    horaCita();
}

function mostrarSeccion() {
    
     //eliminar mostrar-seccion  de la seccion anterior
     const seccionAnterior = document.querySelector('.mostrar-seccion');
     if(seccionAnterior){
        seccionAnterior.classList.remove('mostrar-seccion');
     }
     

     const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

    // eliminar la clase de actual en el tab anterior
    const tabAnterior = document.querySelector('.tabs .actual')
    if(tabAnterior){
        tabAnterior.classList.remove('actual');
     }
   

    // resalta el tab actual
    const tab = document.querySelector(`[data-paso='${pagina}']`);
    tab.classList.add('actual');
} 

function cambiarSeccion() {
    const enlaces = document.querySelectorAll('.tabs button');

    enlaces.forEach(enlace => {
        enlace.addEventListener('click', e => {
            e.preventDefault();
            pagina = parseInt(e.target.dataset.paso);

        
            // // agrega mostrar-seccion donde dimos click
            // const seccion = document.querySelector(`#paso-${pagina}`);
            // seccion.classList.add('mostrar-seccion');
           
            // //agregar la clase actual en el tab
            // const tab = document.querySelector(`[data-paso='${pagina}']`);
            // tab.classList.add('actual');

            //llamar la funcion de mostrar seccion
            mostrarSeccion();
            botonesPaginador();
        })
    })
}

async function mostrarServicios() {
    try {
        const resultado = await fetch('./servicios.json');
        const db = await resultado.json();

        const {servicios} = db;

        //Generar el HTML
        servicios.forEach(servicio => {
            const {id, nombre, precio} = servicio;

            //Dom Scripting
            //Generar nombre de servicio
            const nombreServicio = document.createElement('P');
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add('nombre-servicio');
            
            //Generar Precio del servicio
            const precioServicio = document.createElement('P');
            precioServicio.textContent = `$ ${precio}`;
            precioServicio.classList.add('precio-servicio');
            
            //Generar Div contenedor de servicio
            const servicioDiv = document.createElement('DIV');
            servicioDiv.classList.add('servicio');

            //selecciona un servicio para la cita
            servicioDiv.onclick = seleccionarServicio;


            //Inyectar precio y nombre al DIV de servicio
            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);
            servicioDiv.dataset.idServicio = id;

            //Inyectar en el HTML
            document.querySelector('#servicios').appendChild(servicioDiv);

        });

    } catch (error) {
        console.log(error);
    }
}

function seleccionarServicio(e) {
    
    let elemento;
    //forzar que el elemneto al cual le damos click sea el div

    if(e.target.tagName === 'P') {
        elemento = e.target.parentElement;
        
    }else {
        elemento = e.target;
    }
        
    if(elemento.classList.contains('seleccionado')) {
        elemento.classList.remove('seleccionado');

        const id = parseInt( elemento.dataset.idServicio );

        eliminarServicio(id);
    } else {
        elemento.classList.add('seleccionado');
           
        const servicioObj = {
            id = parseInt( elemento.dataset.idServicio ),
            nombre: elemento.firstElementChild.textContent,
            precio: elemento.firstElementChild.nextElementSibling.textContent
        }

        // console.log(servicioObj);

        agregarServicio(servicioObj);
    }
    
}

function eliminarServicio(id) {
    const { servicios } = cita;
    cita.servicios = servicios.filter( servicio => servicio.id !== id);
    console.log(cita);
}


function agregarServicio(servicioObj){
    const { servicios } = cita;
    cita.servicios = [...servicios, servicioObj];
    console.log(cita);
}


function paginaSiguiente() {
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', () => {
        pagina++;
        

        botonesPaginador();
    });
}

function paginaAnterior() {
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', () => {
        pagina--;
        

        botonesPaginador();
    });
}

function botonesPaginador() {
    const paginaSiguiente = document.querySelector('#siguiente');
    const paginaAnterior = document.querySelector('#anterior');

    if(pagina === 1){
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');
        
    }else if(pagina === 3) {
        paginaSiguiente.classList.add('ocultar');
        paginaAnterior.classList.remove('ocultar');

         // estamos en la pagina 3, carga el resumen de la cita
         mostrarResumen();
    }else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }

    mostrarSeccion(); //cambia la seccion que se muestra por el de la pagina
}

function mostrarResumen() {
    //destructuring
    const {nombre, fecha, hora, servicios} = cita;

    //seleccionar resumen
    const resumenDiv = document.querySelector('.contenido-resumen');

    //limpia el html previo
    while( resumenDiv.firstChild ) {
        resumenDiv.removeChild( resumenDiv.firstChild );
    }

    //validacion de objeto
    if(Object.values(cita).includes('')){
        const noServicios = document.createElement('P');
        noServicios.textContent = 'Faltan datos de Servicios, hora, fecha o nombre';

        noServicios.classList.add('invalidar-cita');

        //agregar a resumenDiv
        resumenDiv.appendChild(noServicios);
        
        return; 
     } 

     const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen de Cita';
    

    //mostrar el resumen
    const nombreCita = document.createElement('P');
    nombreCita.innerHTML = `<span>Nombre:</span> ${nombre}`;

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span> ${fecha}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora}`;

    const serviciosCita = document.createElement('DIV');
    serviciosCita.classList.add('resumen-servicios');

    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de Servicios';

    serviciosCita.appendChild(headingServicios);

    let cantidad = 0;

    //itterar sobre el arreglo de servicios
    servicios.forEach( servicio => {
        const {nombre, precio} = servicio;
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.textContent = precio;
        precioServicio.classList.add('precio');

        const totalServicio = precio.split('$');

        cantidad += parseInt( totalServicio[1].trim());

       //colocar texto y precio en el div
       contenedorServicio.appendChild(textoServicio);
       contenedorServicio.appendChild(precioServicio);

       serviciosCita.appendChild(contenedorServicio);
    });

    
    resumenDiv.appendChild(headingCita);
    resumenDiv.appendChild(nombreCita);
    resumenDiv.appendChild(fechaCita);
    resumenDiv.appendChild(horaCita);

    resumenDiv.appendChild(serviciosCita);
    
    const cantidadPagar = document.createElement('P');
    cantidadPagar.classList.add('total');
    cantidadPagar.innerHTML = ` <span>Total a Pagar:</span> $ ${cantidad}`;

    resumenDiv.appendChild(cantidadPagar);
    
}

function nombreCita() {
    const nombreInput = document.querySelector('#nombre');
    
    nombreInput.addEventListener('input', e => {
        const nombreTexto = e.target.value.trim();
        
        // validacion de que nombreTexto debe tener algo
        if( nombreTexto ==='' || nombreTexto.length < 3 ) {
            mostrarAlerta('Nombre no valido', 'error');
        }else {
            const alerta = document.querySelector('.alerta');
            if(alerta) {
                alerta.remove();
            }
            cita.nombre =  nombreTexto;
            
        }        
    });
}

function mostrarAlerta(mensaje, tipo) {

    // si hay una alerta previa, entonces no crear otra
    const alertaPrevia = document.querySelector('.alerta');
    if(alertaPrevia){
        return;
    }
    
    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');

    if(tipo === 'error') {
        alerta.classList.add('error');
    }

    // insertar en el html
    const formulario = document.querySelector('.formulario');
    formulario.appendChild( alerta );

    //eliminar la alerta despues de tres segundos
    setTimeout(() => {
        alerta.remove();
    }, 3000);
}

function fechacita(){
    const fechaInput =  document.querySelector('#fecha');
    fechaInput.addEventListener('input', e => {
        

        const dia = new Date(e.target.value).getUTCDay();

        if( [0, 6].includes(dia)) {
            e.preventDefault();
            fechaInput.value = '';
            mostrarAlerta('Fines de Semana no son permitidos', 'error'); 
        } else {
            cita.fecha = fechaInput.value;

            // console.log(cita);
        }
        

        // const opciones = {
        //     weekday: 'long',
        //     year: 'numeric',
        //     month: 'long'
        // }

        // console.log(dia.toLocaleString('es-Es', opciones));
    });
}

function deshabilitarFechaAnterior() {
    const inputFecha = document.querySelector('#fecha');

    const fechaAhora = new Date();
    const year = fechaAhora.getFullYear();
    const mes = fechaAhora.getMonth() + 1;
    const dia = fechaAhora.getDate() + 1;

    // formato deseado aaaa/mm/dd

    let fechaDeshabilitar;
    if ([10,11,12].includes(mes)){
        fechaDeshabilitar = `${year}-${mes}-${dia}`;
    }else{ // Añadimos el 0 para hacer el formato correcto
        fechaDeshabilitar = `${year}-0${mes}-${dia}`
    }

    inputFecha.min = fechaDeshabilitar;
    
   
}

function horaCita() {
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener ('input', e => {
        

        const horaCita = e.target.value;
        const hora = horaCita.split(':');
        

        if(hora[0] < 10 || hora[0] > 18) {
            mostrarAlerta('Hora No Válida', 'error');
            setTimeout(() => {
                inputHora.value = '';
            }, 3000);
            
        }else {
            cita.hora = horaCita;

            console.log(cita);
        }
    });
}
