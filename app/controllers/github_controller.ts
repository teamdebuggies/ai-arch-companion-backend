import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import GithubService from '#services/github_service'

@inject()
export default class GithubController {
  constructor(private githubService: GithubService) {}

  public async createRepository({ request, response }: HttpContext) {
    const { name } = request.only(['name'])
    try {
      const repo = await this.githubService.createRepository(name)
      return response.ok(repo)
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }

  public async pushFile({ request, response }: HttpContext) {
    const { repositoryName, filePath, content } = request.only([
      'repositoryName',
      'filePath',
      'content',
    ])
    try {
      const result = await this.githubService.pushFileToRepository(
        repositoryName,
        filePath,
        content
      )
      return response.ok(result)
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }

  public async createProjectRepository({ request, response }: HttpContext) {
    const {
      architecturalDecisionRecord,
      functionalDiagram,
      infrastructureDiagram,
      rationale,
      terraform,
    } = request.only([
      'architecturalDecisionRecord',
      'functionalDiagram',
      'infrastructureDiagram',
      'rationale',
      'terraform',
    ])
    try {
      const result = await this.githubService.createProjectRepository(
        `TEST${Math.random().toString(36).substring(2, 15)}`,
        {
          architecturalDecisionRecord,
          functionalDiagram,
          infrastructureDiagram,
          rationale,
          terraform,
        }
      )
      return response.created(result) // Use 201 Created for successful resource creation
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }
}
