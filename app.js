//Eider Arango Amaya
//Este es el proyecto para el primer bonus. La idea es que en lugar de crear un archivo
//con los datos del estudiante y el curso en donde se matriculo se muestren estos
//datos en el navegador.

const argv = require('yargs');//To work with command line.
const p = require('path');//To work with path.
const express = require('express');//To work with express.
const app = express();
const port = 3000;
const cursos = require(p.join(__dirname, 'data', 'cursos.js'));//Requiring the cursos file.

let infoCursos = [];
var matricula = "";

//https://khaledgarbaya.net/articles/how-to-create-a-node-js-command-line-tool-with-yargs-middleware
//https://github.com/yargs/yargs
//https://coderwall.com/p/_ppzrw/be-careful-with-settimeout-in-loops
//https://github.com/yargs/yargs/issues/225

//https://medium.com/programming-sage/handlebars-in-node-js-tutorial-a30a41fc6206
//https://handlebarsjs.com/builtin_helpers.html

app.set('views', p.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//Declaracion de las funciones requeridas en el programa.
function showCursos() {
    console.log('En tu navegador dirigete a http://localhost:3000 o 127.0.0.1:3000 para conocer mas detalles');

    for (let i = 0; i < cursos.length; i++) {
        let infoCurso = `El curso de ${cursos[i].name} con id:${cursos[i].id} tiene una duracion de ${cursos[i].duration} semanas y tiene un precio de ${cursos[i].price} pesos`;
        infoCursos.push(infoCurso);

        // setTimeout(function () {
        //     let infoCurso = `El curso de ${cursos[i].name} con id:${cursos[i].id} tiene una duracion de ${cursos[i].duration} semanas y tiene un precio de ${cursos[i].price} pesos`;
        //     infoCursos.push(infoCurso);
        //     console.log(infoCurso);
        // }, 2000 * (i + 1));
    }

}

function verificarCurso(id, name, cedula) {
    //Se busca el curso por id dentro del arreglo cursos.
    var curso = cursos.find(c => c.id === id);
    if (curso) {//En caso de que se ingrese un id de curso valido.
        matricula = `El estudiante ${name} con CC:${cedula} ha sido matriculado en el curso ${curso.name} con una duracion de ${curso.duration} semanas y un costo de ${curso.price} pesos.`;
        console.log('Incripcion correcta, en tu navegador ingresa localhost:3000/inscripciones o 127.0.0.1:3000/inscripciones para ver la inscripcion');

    }
    else {
        matricula = 'El ID ingresado no corresponde a ninguno de nuestros cursos';
        console.log(matricula);
    }
}


argv
    .command('$0', 'Default command', () => { }, (argv) => {//Comando por defecto, sin ningun commando.
        showCursos();
    })
    .command('cursos', 'Despliega todos los cursos disponibles', () => {//Comando para listar los cursos.
        showCursos();
    })
    .command('inscribir', 'Inscripcion a un curso', (yargs) => {//Comando para realizar la inscripcion.
        //Inscribir command options
        return yargs
            .option('id', { alias: 'i', require: true })
            .option('name', { alias: 'n', require: true })
            .option('cedula', { alias: 'c', require: true });
    }, ({ id, name, cedula }) => {
        verificarCurso(id, name, cedula);
        showCursos();

    })
    .argv;




app.get('/', (req, res) => {
    res.render('index.hbs', { title: 'Cursos disponibles', cursos: infoCursos });
});

app.get('/inscripciones', (req, res) => {
    res.render('inscripciones.hbs', { title: 'Inscripciones realizadas por los estudiantes:', matricula: matricula });
});

app.use((req, res) => {//Si obtenemos una ruta diferente
    console.log('pagina no existe');
    res.write('<h1>Error 404, Pagina no existe</h1>');
    res.end();
});

app.listen(port);





