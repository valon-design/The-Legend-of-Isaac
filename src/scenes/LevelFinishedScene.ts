import Phaser from 'phaser'


import WebFontFile from "../fonts/WebFontFile"

import Game from '../scenes/Game'



export default class LevelFinishedScene extends Phaser.Scene {

    private keyboard!: Phaser.Input.Keyboard.KeyboardPlugin
    static level = 0


    constructor() {
        super('level-finished')
    }


    preload() {
        this.keyboard = this.input.keyboard
        this.load.addFile(new WebFontFile(this.load, 'Press Start 2P'))
    }



    create(data: { coins: number } = { coins: 0 }) {

        const width = this.scale.width
        const height = this.scale.height



        this.add.text(width * 0.5, height * 0.5, 'Du hast das Dorf gerettet!', {
            fontSize: '15px',
            fontFamily: '"Press Start 2p"'
        }).setOrigin(0.5, 0.5).setResolution(10)



        this.add.text(width * 0.5, height * 0.6, `Du hast insgesamt ${data.coins} Münzen gesammelt!`, {
            fontSize: '15px',
            fontFamily: '"Press Start 2p"'
        }).setOrigin(0.5, 0.5).setResolution(10)



        this.add.text(width * 0.5, height * 0.7, 'Drücke die Entertaste um nochmals zu spielen', {
            fontSize: '15px',
            fontFamily: '"Press Start 2p"'
        }).setOrigin(0.5, 0.5).setResolution(10)
    }



    update() {
        const space = this.keyboard.addKey('SPACE')
        if (Phaser.Input.Keyboard.JustDown(space)) {
            this.scene.start('game')
            this.scene.stop('level-finished')
        }
    }
}