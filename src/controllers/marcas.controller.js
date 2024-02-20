import { getConnection } from "../database/database";
const fs = require('node:fs');

const obtenerMarcas = async (req, res) => {
    try {
        const connection = await getConnection();
        const resultado = await connection.query("SELECT id, nombre FROM marcas");
        console.log(resultado);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const obtenerMarca = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await getConnection();
        const resultado = await connection.query("SELECT id, nombre FROM marcas WHERE id = ?", id);
        console.log(resultado);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const metodos = {
    obtenerMarcas,
    obtenerMarca
};