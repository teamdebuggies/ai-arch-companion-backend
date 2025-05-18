import { inject } from '@adonisjs/core'
import { Octokit } from 'octokit'
import env from '#start/env'

export interface ProjectArtifacts {
  functionalDiagram: string
  infrastructureDiagram: string
  rationale: string
  terraform: string
  architecturalDecisionRecord: string
}

@inject()
export default class GithubService {
  private octokit: Octokit
  private owner: string

  constructor() {
    this.octokit = new Octokit({
      auth: env.get('GITHUB_TOKEN'),
    })
    this.owner = env.get('GITHUB_OWNER', 'teamdebuggies')
  }

  async createRepository(name: string) {
    const response = await this.octokit.rest.repos.createForAuthenticatedUser({
      name,
      description: 'Repository created by AI Arch Companion',
      private: false,
    })
    return response.data
  }

  async pushFileToRepository(repositoryName: string, filePath: string, content: string) {
    console.log('pushFileToRepository', repositoryName, filePath, content)
    const response = await this.octokit.rest.repos.createOrUpdateFileContents({
      owner: this.owner,
      repo: repositoryName,
      path: filePath,
      message: `Add ${filePath}`,
      content: Buffer.from(content).toString('base64'),
    })
    return response.data
  }

  async createProjectRepository(repositoryName: string, artifacts: ProjectArtifacts) {
    // 1. Create the repository
    const repoData = await this.createRepository(repositoryName)

    // 2. Prepare README content
    const readmeContent = `
      # ${repositoryName}

      ## Rationale
      ${artifacts.rationale}

      ## Architectural Decision Record (ADR)
      ${artifacts.architecturalDecisionRecord}
    `

    // 3. Push files
    await Promise.all([
      this.pushFileToRepository(repositoryName, 'README.md', readmeContent),
      this.pushFileToRepository(
        repositoryName,
        'diagrams/functional_diagram.md',
        artifacts.functionalDiagram
      ),
      this.pushFileToRepository(
        repositoryName,
        'diagrams/infrastructure_diagram.md',
        artifacts.infrastructureDiagram
      ),
      this.pushFileToRepository(repositoryName, 'terraform/main.tf', artifacts.terraform),
    ])

    return {
      repository: repoData,
      files: [
        'README.md',
        'diagrams/functional_diagram.md',
        'diagrams/infrastructure_diagram.md',
        'terraform/main.tf',
      ],
      message: 'Repository and files created successfully.',
    }
  }
}
