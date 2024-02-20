import express from "express";
import morgan from "morgan";
import multer from 'multer';
// Routes
import relojRoutes from "./routes/relojes.routes";
import marcaRoutes from "./routes/marcas.routes";

const app = express();

// Configuración de Multer para manejar la carga de archivos y formularios multipart
//const upload = multer({ dest: './static/img' });

// Settings
const port = process.env.PORT || 4000;
app.set("port", port);

// Middlewares
app.use(morgan("dev"));
app.use(express.json());

// Middleware para manejar formularios multipart
app.use(upload.single('imagenblob'));

// Routes
app.use("/api/relojes", relojRoutes);
app.use('/api/marcas', marcaRoutes);

export default app;
