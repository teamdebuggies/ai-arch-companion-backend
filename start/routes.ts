/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

const HomeController = () => import('#controllers/home_controller')
const LangGraphsController = () => import('#controllers/lang_graphs_controller')
const GithubController = () => import('#controllers/github_controller')

//routes

router.get('/', [HomeController, 'index'])

router.post('/agents/process', [LangGraphsController, 'handle'])
router.post('/github/create-project', [GithubController, 'createProjectRepository'])
