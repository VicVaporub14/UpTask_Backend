import { Request, Response } from "express"
import User from "../models/User"
import Project from "../models/Project"

export class TeamMemberController {
    static findMemberByEmail = async (request: Request, response: Response) => {
        const { email } = request.body

        // Fin User
        const user = await User.findOne({email}).select('id email name')
        if (!user) {
            const error = new Error('Usuario no encontrado')
            response.status(404).json({error: error.message})
            return
        }
        response.json(user)
    }

    static getProjectTeam = async (request: Request, response: Response) => {
        const project = await Project.findById(request.project.id).populate({
            path: 'team',
            select: 'id name email'
        })

        response.json(project.team)
    }


    static addMemberById = async (request: Request, response: Response) => {
        const { id } = request.body
        const user = await User.findById(id).select('id')
        if (!user) {
            const error = new Error('Usuario no encontrado')
            response.status(404).json({error: error.message})
            return
        }
        if (request.project.team.some(team => team.toString() === user.id.toString())) {
            const error = new Error('Ese Usuario ya existe en el proyecto')
            response.status(409).json({error: error.message})
            return
        }
        request.project.team.push(user.id)
        await request.project.save()

        response.send('Usuario agregado correctamente')
    }

    static removeMemberById = async (request: Request, response: Response) => {
        const { userId } = request.params
        
        if (!request.project.team.some(member => member.toString() === userId)) {
            const error = new Error('El usuario no existe en el proyecto')
            response.status(409).json({error: error.message})
            return
        }

        request.project.team = request.project.team.filter(member => member.toString() !== userId)
        await request.project.save()
        
        response.send('Usuario eliminado correctamente')
    }

}