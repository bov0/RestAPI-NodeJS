import { getConnection } from "../database/database";
//const fs = require('node:fs');
//const multer = require('multer');

//const upload = multer({ dest: './static/img' });

const obtenerRelojes = async (req, res) => {
    try {
        const connection = await getConnection();
        const resultado = await connection.query("SELECT relojes.id, relojes.modelo, relojes.precio, relojes.imagen, relojes.imagenblob, marcas.nombre AS marca_nombre FROM relojes JOIN marcas ON relojes.id_marca = marcas.id");
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const obtenerRelojesOrdenados = async (req, res) => {
    try {
        const connection = await getConnection();
        const resultado = await connection.query("SELECT * FROM relojes ORDER BY precio DESC");
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const obtenerReloj = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await getConnection();
        const resultado = await connection.query("SELECT * FROM relojes WHERE id = ?", id);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const agregarReloj = async (req, res) => {
    try {
        const { modelo, precio, id_marca } = req.body;
        const imagen = req.file ? req.file.originalname : null;

        if (!modelo || modelo.trim() === "") {
            return res.status(400).json({ message: "Solicitud incorrecta, 'modelo' es obligatorio y no puede estar vacío" });
        }

        if (precio === undefined || isNaN(parseFloat(precio)) || parseFloat(precio) < 0) {
            return res.status(400).json({ message: "Solicitud incorrecta, 'precio' debe ser un número no negativo" });
        }

        if (id_marca === undefined) {
            return res.status(400).json({ message: "Solicitud incorrecta, 'id_marca' es obligatorio" });
        }

        const connection = await getConnection();
        const marcaExistente = await connection.query("SELECT id FROM marcas WHERE id = ?", id_marca);

        if (marcaExistente.length === 0) {
            return res.status(400).json({ message: "Solicitud incorrecta, 'id_marca' no existe" });
        }

        const imagenblob = req.file ? guardarImagen(req.file) : null;

        const reloj = { modelo, precio, imagen, imagenblob, id_marca };
        await connection.query("INSERT INTO relojes SET ?", reloj);
        res.json({ message: "Reloj agregado exitosamente" });
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
};

const actualizarReloj = async (req, res) => {
    try {
        const { modelo, precio, id_marca } = req.body;

        const connection = await getConnection();
        const marcaExistente = await connection.query("SELECT id FROM marcas WHERE id = ?", id_marca);

        if (marcaExistente.length === 0) {
            return res.status(400).json({ message: "Solicitud incorrecta, 'id_marca' no existe" });
        }

        const imagen = req.file ? req.file.originalname : null;
        const imagenblob = req.file ? req.file.path : null;
        const { id } = req.params;

        if (!modelo || modelo.trim() === "") {
            return res.status(400).json({ message: "Solicitud incorrecta, 'modelo' es obligatorio y no puede estar vacío" });
        }

        if (precio === undefined || isNaN(parseFloat(precio)) || parseFloat(precio) < 0) {
            return res.status(400).json({ message: "Solicitud incorrecta, 'precio' debe ser un número no negativo" });
        }

        if (id_marca === undefined) {
            return res.status(400).json({ message: "Solicitud incorrecta, 'id_marca' es obligatorio" });
        }

        const reloj = { modelo, precio, imagen, imagenblob, id_marca };
        const resultado = await connection.query("UPDATE relojes SET ? WHERE id = ?", [reloj, id]);
        res.json(resultado);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
};


const eliminarReloj = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await getConnection();
        
        const buscarID = (await connection.query("SELECT COUNT (*) FROM relojes WHERE id = ?", id))[0]['COUNT (*)'];

        if (buscarID > 0) {
            const resultado = await connection.query("DELETE FROM relojes WHERE id = ?", id);
            res.json({ message: "Eliminado reloj con id " + id + " correctamente" });
        } else {
            res.json({ message: "No se ha encontrado reloj con id " + id });
        }
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

function guardarImagen(img) {
    //añadir sufijo para no tener problemas subiendo la misma imagen en local
    const prefijo = Date.now();
    const nombreImagen = `${prefijo}-${img.originalname}`;
    const ruta = `./static/img/${nombreImagen}`;
    //fs.renameSync(img.path, ruta);
    return nombreImagen;
}

// Ruta para manejar la subida de archivos
/*
const subirImagenReloj = async (req, res, next) => {
    try {
        upload.single('imagenblob')(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                return res.status(500).json({ message: "Error al subir la imagen" });
            } else if (err) {
                return res.status(500).json({ message: "Error al procesar la solicitud" });
            }
            next(); //parecido a un break
        });
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
};
*/

export const metodos = {
    obtenerRelojes,
    obtenerReloj,
    agregarReloj,
    eliminarReloj,
    actualizarReloj,
    obtenerRelojesOrdenados,
//    subirImagenReloj
};