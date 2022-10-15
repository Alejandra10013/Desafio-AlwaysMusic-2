const { Pool } = require("pg");

const option = {
    user: "postgres",
    host: "127.0.0.1",
    database: "alwaysMusic",
    password: "12345",
    port: 5432,
    max: 20,
    idleTimeoutMillis: 5000,
    connectionTimeoutMillis: 2000,
}

const pool = new Pool(option)

const nuevoEstudiante = async (nombre, rut, curso, nivel) => {
    pool.connect(async (err, client, release) => {
        if (err) {
            console.log("Error en la conexion: " + err.code);
        } else {
            const queryInsert = {
                name: "ingresarRegistro",
                text: "insert into estudiantes (nombre, rut, curso, nivel) values ($1, $2, $3, $4) RETURNING *",
                values: [nombre, rut, curso, nivel],
            }
            try {
                const res = await client.query(queryInsert);
                console.log(`El estudiante ${res.rows[0].nombre} fue agregado con exito.`);
            } catch (error) {
                console.log("Error! Código: " + error.code);
            }
            release()
            pool.end()
        }
    })
};

const consultaEstudiantePorRut = async (rut) => {
    pool.connect(async (err, client, release) => {
        if (err) {
            console.log("Error en la conexion: " + err.code);
        } else {
            const querySelectWhere = {
                name: "consultaPorRut",
                text: "select * from estudiantes where rut = $1",
                values: [rut],
            }
            try {
                const res = await client.query(querySelectWhere);
                console.log(res.rows[0]);
            } catch (error) {
                console.log("Error! Código: " + error.code);
            }
            release()
            pool.end()
        }
    })
};

const estudiantesRegistrados = async () => {
    pool.connect(async (err, client, release) => {
        if (err) {
            console.log("Error en la conexion: " + err.code);
        } else {
            const querySelectAll = {
                name: "consultaRegistros",
                text: "select * from estudiantes",
                values: [],
            }
            try {
                const res = await client.query(querySelectAll);
                console.log(res.rows);
            } catch (error) {
                console.log("Error! Código: " + error.code);
            }
            release()
            pool.end()
        }
    })
};

const actualizarEstudiante = async (nombre, rut, curso, nivel) => {
    pool.connect(async (err, client, release) => {
        if (err) {
            console.log("Error en la conexion: " + err.code);
        } else {
            const queryUpdate = {
                name: "editarRegistro",
                text: "update estudiantes set nombre = $1, curso = $3, nivel = $4 where rut = $2 returning *;",
                values: [nombre, rut, curso, nivel],
            }
            try {
                const res = await client.query(queryUpdate);
                console.log(`El registro del estudiante ${res.rows[0].nombre} editado con exito.`);
            } catch (error) {
                console.log("Error! Código: " + error.code);
            }
            release()
            pool.end()
        }
    })
};

const eliminarEstudiante = async (rut) => {
    pool.connect(async (err, client, release) => {
        if (err) {
            console.log("Error en la conexion: " + err.code);
        } else {
            const queryDelete = {
                name: "eliminarRegistro",
                text: "delete from estudiantes where rut = $1 returning *;",
                values: [rut],
            }
            try {
                const res = await client.query(queryDelete)
                console.log(`Registro de estudiante con rut ${res.rows[0].rut} eliminado.`);
            } catch (error) {
                console.log("Error! Código: " + error.code);
            }
            release()
            pool.end()
        }
    })
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
        // Exito | node index.js nuevo 'Juan Diaz' '12.345.678-9' 'Piano' '8'
        // Error | node index.js nuevo 'Juan Diaz' '12.345.678-9' 'Piano' 
        break;

    case "consulta":
        estudiantesRegistrados();
        // Exito | node index.js consulta
        // Error | se modifica la query para que arroje un error 
        break;

    case "editar":
        actualizarEstudiante(arg1, arg2, arg3, arg4)
        // Exito | node index.js editar 'Juan Diaz' '12.345.678-9' 'Piano' '8'
        // Error | node index.js editar 'Juan Diaz' '12.345.678-9' 'Piano' 
        break;

    case "rut":
        consultaEstudiantePorRut(arg1)
        // Exito | node index.js rut '12.345.678-9'
        // Error | node index.js rut '11.345.678-9'
        break;

    case "eliminar":
        eliminarEstudiante(arg1)
        // Exito | node index.js eliminar '12.345.678-9'
        // Error | se modifica la query para que arroje un error 
        break;

    default:
        break;
}