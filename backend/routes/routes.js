import express from 'express';
import {
    getAllTask,
    getTask,
    createTask,
    updateTask,
    deleteTask
} from '../controllers/TaskController.js';

// Creando router de Express
const ruta = express.Router();

// Implementación de rutas utilizando encadenamiento de métodos
router.route('/')
    .get(getAllTask)
    .post(createTask);

router.route('/:id')
    .get(getTask)
    .put(updateTask)
    .delete(deleteTask);

export default ruta;