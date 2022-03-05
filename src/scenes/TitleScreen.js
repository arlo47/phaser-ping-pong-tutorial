import Phaser from 'phaser'
import { Game } from '../consts/SceneKeys'

export default class TitleScreen extends Phaser.Scene {
  constructor() {
    super()
  }

  preload() {

  }

  create() {
    const title = this.add.text(
      400, 
      250, 
      'IT\'S PONG MY DUDES!', 
      { fontSize: 50 }
    )

    title.setOrigin(0.5, 0.5)

    this.add.text(400, 300, 'Press SPACE to start.')
      .setOrigin(0.5)
  
    this.input.keyboard.once('keydown-SPACE', () => this.scene.start(Game))
  }
}