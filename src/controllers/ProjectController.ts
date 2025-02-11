import type { Request, Response } from "express"
import Project from "../models/Project";
import Task from "../models/Task";

export class ProjectController {
    
    static createProject = async (req: Request, res: Response) => {
        const project = new Project(req.body)

        // Se asigna el creador del proyecto
        project.manager = req.user.id

        try {
            await project.save()
            res.send('Proyecto creado exitosamente')
        } catch (error) {
            console.log(error);
        }
    }

    static getAllProjects = async (req: Request, res: Response) => {
        try {
            const projects = await Project.find({
                $or: [
                    {manager: {$in: req.user.id}},
                    {team: {$in: req.user.id}}
                ]
            })
            res.json(projects)
        } catch (error) {
            console.log(error);
        }
    }

    static getProjectById = async (req: Request, res: Response) => {
        const { id } = req.params
        try {
            const project = await Project.findById(id).populate('tasks')
            if (!project) {
                const error = new Error('Proyecto no encontrado')
                res.status(404).json({error: error.message})
                return
            }

            // Si el usuario no es igual al project manager && Si el usuario no pertenece al teamProject(true)
            if (project.manager.toString() !== req.user.id.toString() && !project.team.includes(req.user.id)) { 
                const error = new Error('Accion no valida')
                res.status(403).json({error: error.message})
                return
            }

            res.json(project)
        } catch (error) {
            console.log(error);
        }
    }

    static updateProject = async (req: Request, res: Response) => {
        try {
            req.project.projectName = req.body.projectName
            req.project.clientName = req.body.clientName
            req.project.description = req.body.description

            await req.project.save()
            res.send('Proyecto Actualizado')
        } catch (error) {
            console.log(error);
        }
    }

    static deleteProject = async (req: Request, res: Response) => {
        try {
            // **Eliminar todas las tareas asociadas a este proyecto**
            // await Task.deleteMany({ project: id })
            await req.project.deleteOne()
            res.send('Proyecto Eliminado')
        } catch (error) {
            console.log(error);
        }
    }
}