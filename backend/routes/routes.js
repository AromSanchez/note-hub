import express from 'express';
import {
    getAllTask,
    getTask,
    createTask,
    updateTask,
    deleteTask,
    getTaskStats
} from '../controllers/TaskController.js';

// Creando router de Express
const ruta = express.Router();

// Implementación de rutas utilizando encadenamiento de métodos
ruta.get('/', getTaskStats);


ruta.route('/:id').get(getTask).put(updateTask) .delete(deleteTask);

export default ruta;