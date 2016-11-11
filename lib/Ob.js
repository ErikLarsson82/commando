define('Ob', [
  'Flogger',
], function (
  Flogger
) {

  class SceneManager {
    constructor() {
      this.scenes = []
      this.currentScene = null

      this.logger = new Flogger.Logger('Ob.SceneManager')

      this.logger.debug('constructor')
    }
    changeScene(sceneName, nextSceneParams) {
      this.logger.debug('changeScene', `sceneName: '${sceneName}'`, 'nextSceneParams:', nextSceneParams)

      nextSceneParams = nextSceneParams || {}
      if (this.currentScene) {
        this.currentScene.destroy(nextSceneParams)
      }
      this.currentScene = this.scenes.find(function (scene) {
        return scene.name === sceneName
      })

      if (!this.currentScene) {
        this.logger.error(`No scene with name '${sceneName}'`)
      }

      this.currentScene.create(nextSceneParams)
    }
    setScenes(scenes) {
      this.logger.debug('setScenes', scenes)

      if (!(scenes instanceof Array)) {
        this.logger.error(`scenes must be of type Array`)
      }

      this.scenes = scenes

      this.scenes.forEach(function (scene) {
        scene.sceneManager = this
      }.bind(this))
    }
    update() {
      this.logger.debug('update', arguments)

      this.currentScene.update.apply(this.currentScene, arguments)
    }
    draw() {
      this.logger.debug('draw', arguments)

      this.currentScene.draw.apply(this.currentScene, arguments)
    }
  }

  class Scene {
    constructor(config) {
      this.name = config.name
      this.ownCreate = config.create
      this.ownUpdate = config.update
      this.ownDraw = config.draw
      this.ownDestroy = config.destroy

      this.logger = new Flogger.Logger(`Ob.Scene (${this.name})`)

      this.logger.debug('constructor', config)
    }
    changeScene(sceneName, nextSceneParams) {
      this.sceneManager.changeScene(sceneName, nextSceneParams)
    }
    create() {
      this.logger.debug('create', arguments)

      this.ownCreate && this.ownCreate.apply(this, arguments)
    }
    update() {
      this.logger.debug('update', arguments)

      this.ownUpdate && this.ownUpdate.apply(this, arguments)
    }
    draw() {
      this.logger.debug('draw', arguments)

      this.ownDraw && this.ownDraw.apply(this, arguments)
    }
    destroy() {
      this.logger.debug('destroy', arguments)

      this.ownDestroy && this.ownDestroy.apply(this, arguments)
    }
  }

  const Ob = {
    SceneManager: SceneManager,
    Scene: Scene,
  }

  return Ob
})