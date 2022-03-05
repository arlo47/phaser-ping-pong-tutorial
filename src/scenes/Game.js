import Phaser from 'phaser'
import { GameBackground } from '../consts/SceneKeys'
import { White } from '../consts/Colors'

export default class Game extends Phaser.Scene {

  
  init() {
    this.paddleRightVelocity = new Phaser.Math.Vector2(0, 0)
    this.leftScore = 0
    this.rightScore = 0
  }

  preload() {

  }

  create() {
    this.scene.run(GameBackground)
    this.scene.sendToBack(GameBackground)

    this.physics.world.setBounds(-100, 0, 1000, 500)

    this.ball = this.add.circle(400, 250, 10, White, 1)
    this.physics.add.existing(this.ball) // add physics to the ball
    this.ball.body.setCircle(10)
    this.ball.body.setBounce(1, 1)

    this.ball.body.setCollideWorldBounds(true, 1, 1) // add collision between the ball & world

    this.paddleLeft = this.add.rectangle(50, 250, 30, 100, White, 1)
    this.physics.add.existing(this.paddleLeft, true) // add physics to the left paddle

    this.physics.add.collider(this.paddleLeft, this.ball) // add collision between the paddle & ball


    // RIGHT PADDLE
    this.paddleRight = this.add.rectangle(750, 250, 30, 100, White, 1)
    this.physics.add.existing(this.paddleRight, true)
    this.physics.add.collider(this.paddleRight, this.ball)

    const scoreStyle = {
      fontSize: 48
    }

    this.leftScoreLabel = this.add.text(300, 40, '0', scoreStyle)
      .setOrigin(0.5, 0.5)
    this.rightScoreLabel = this.add.text(500, 40, '0', scoreStyle)
      .setOrigin(0.5, 0.5)

    this.cursors = this.input.keyboard.createCursorKeys()

    this.time.delayedCall(1500, () => this.resetBall())
  }

  update() {
    this.processPlayerInput()
    this.updateAI()
    this.checkScore()
  }

  processPlayerInput() {
    /** @type {Phaser.Physics.Arcade.StaticBody} */
    const body = this.paddleLeft.body;
    if(this.cursors.up.isDown) {
      // we made the paddle a static body, so it cannot be pushed by the ball. 
      // We cannot use setVelocityY on static bodies, so we manually change the y value
      this.paddleLeft.y -= 10     
      // we also must update the bounding box (body) using this function, 
      // since it is a static body
      body.updateFromGameObject()
    } else if (this.cursors.down.isDown) {
      this.paddleLeft.y += 10
      body.updateFromGameObject()
    }

    this.paddleRight.y += this.paddleRightVelocity.y
    this.paddleRight.body.updateFromGameObject()
  }

  checkScore() {
    if (this.ball.x < -30) {
      // scored on left side, reset to center
      this.resetBall()
      this.incrementScore('right')
    } else if (this.ball.x > 830) {
      // scored on right side, reset to center
      this.resetBall()
      this.incrementScore('left')
    }
  }

  updateAI() {
    const diff = this.ball.y - this.paddleRight.y;
    const aiSpeed = 3;

    if (Math.abs(diff) < 10) {
      return
    }

    if (diff < 0) {
      // ball is below paddle
      this.paddleRightVelocity.y = -aiSpeed

      if (this.paddleRightVelocity.y < -10) {
        this.paddleRightVelocity.y = -10
      }
    } else if (diff > 0) {
      // ball is above paddle
      this.paddleRightVelocity.y = aiSpeed

      if (this.paddleRightVelocity.y > 10) {
        this.paddleRightVelocity.y = 10
      }
    }
  }

  incrementScore(side) {
    if (side === 'left') {
      this.leftScore += 1;
      this.leftScoreLabel.text = this.leftScore.toString()
    } else if (side === 'right') {
      this.rightScore += 1;
      this.rightScoreLabel.text = this.rightScore.toString()
    }
    
  }

  resetBall() {
    this.ball.setPosition(400, 250)
    const angle = Phaser.Math.Between(0, 360)
    const vec = this.physics.velocityFromAngle(angle, 300)

    this.ball.body.setVelocity(vec.x, vec.y)
  }
}