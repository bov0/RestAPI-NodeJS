import { Router } from "express";
import { metodos as relojesController } from "./../controllers/relojes.controller";

const router = Router();

router.get("/", relojesController.obtenerRelojes);
router.get("/ordenados", relojesController.obtenerRelojesOrdenados);
router.get("/:id", relojesController.obtenerReloj);
router.post("/", relojesController.agregarReloj);
router.put("/:id", relojesController.actualizarReloj);
router.delete("/:id", relojesController.eliminarReloj);
//router.post("/id", relojesController.subirImagenReloj);

export default router;