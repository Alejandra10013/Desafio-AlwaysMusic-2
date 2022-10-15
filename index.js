const { Client } = require("pg");

const client = new Client({
    connectionString: "postgresql://postgres:12345@localhost:5432/alwaysMusic"
})

client.connect();

const nuevoEstudiante = async (nombre, rut, curso, nivel) => {
    try {
        const res = await client.query(`insert into estudiantes(nombre, rut, curso, nivel) values('${nombre}', '${rut}', '${curso}', '${nivel}') RETURNING *`);
        console.log(`El estudiante ${res.rows[0].nombre} agregado con exito.`);
        client.end();
    } catch (error) {
        client.end();
        console.log(error);
    }
};

const consultaEstudiantePorRut = async (rut) => {
    try {
        const res = await client.query(`select * from estudiantes where rut = '${rut}'`);
        console.log(res.rows[0]);
        client.end();
    } catch (error) {
        client.end();
        console.log(error.code);
    }
};

const estudiantesRegistrados = async () => {
    try {
        const res = await client.query("select * from estudiantes");
        console.log(res.rows);
    } catch (error) {
        console.log(error.code);
    }
    client.end();
};

const actualizarEstudiante = async (nombre, rut, curso, nivel) => {
    try {
        const res = await client.query(`update estudiantes set nombre ='${nombre}', curso ='${curso}', nivel ='${nivel}' where rut ='${rut}' returning *;`);
        console.log(`El registro del estudiante ${res.rows[0].nombre} editado con exito.`);
    } catch (error) {
        console.log(error);
    }
    client.end();
};

const eliminarEstudiante = async (rut) => {
    try {
        const res = await client.query(`delete from estudiantes where rut = '${rut}' returning * ;`)
        console.log(`Registro de estudiante con rut ${res.rows[0].rut} eliminado.`);
    } catch (error) {
        console.log(error);
    }
    client.end();
};

const args = process.argv.slice(2);
let comando = args[0];
let arg1 = args[1];
let arg2 = args[2];
let arg3 = args[3];
let arg4 = args[4];

switch (comando) {
    case "nuevo":
        nuevoEstudiante(arg1, arg2, arg3, arg4);
        break;

    case "consulta":
        estudiantesRegistrados();
        break;

    case "editar":
        actualizarEstudiante(arg1, arg2, arg3, arg4)
        break;

    case "rut":
        consultaEstudiantePorRut(arg1)
        break;

    case "eliminar":
        eliminarEstudiante(arg1)
        break;

    default:
        break;
}