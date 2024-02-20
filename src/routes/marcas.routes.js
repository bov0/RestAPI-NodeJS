import { Router } from "express";
import { metodos as marcaController } from "../controllers/marcas.controller";

const router = Router();

router.get("/", marcaController.obtenerMarcas);
router.get("/:id", marcaController.obtenerMarca);

export default router;
