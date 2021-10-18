import Phaser from 'phaser'

import WebFontFile from "../fonts/WebFontFile"



export default class GameOver extends Phaser.Scene {

    private keyboard!: Phaser.Input.Keyboard.KeyboardPlugin



    constructor() {
        super('game-over')
    }


    preload() {
        this.load.addFile(new WebFontFile(this.load, 'Press Start 2P'))
        this.keyboard = this.input.keyboard
    }



    create() {

        const width = this.scale.width
        const height = this.scale.height


        this.add.text(width * 0.5, height * 0.3, 'Game Over', {
            fontSize: '35px',
            fontFamily: '"Press Start 2p"'
        }).setOrigin(0.5, 0.5).setResolution(10)


        this.add.text(width * 0.5, height * 0.6, 'Tippe auf Enter um', {
            fontSize: '25px',
            fontFamily: '"Press Start 2p"'
        }).setOrigin(0.5, 0.5).setResolution(10)


        this.add.text(width * 0.5, height * 0.67, 'nochmals zu spielen', {
            fontSize: '25px',
            fontFamily: '"Press Start 2p"',
        }).setOrigin(0.5, 0.5).setResolution(10)
    }




    update() {
        const space = this.keyboard.addKey('SPACE')
        if (Phaser.Input.Keyboard.JustDown(space)) {
            this.scene.start('game')
            this.scene.stop('game-over')
        }
    }
}