import Phaser from 'phaser'



import WebFontFile from "../fonts/WebFontFile"


export default class Menu extends Phaser.Scene {

    private keyboard!: Phaser.Input.Keyboard.KeyboardPlugin
    static level = 0

    constructor() {
        super('menu')
    }




    preload() {
        this.load.addFile(new WebFontFile(this.load, 'Press Start 2P'))
        this.keyboard = this.input.keyboard
    }




    create() {

        const width = this.scale.width
        const height = this.scale.height


        this.add.image(width * 0.5, height * 0.5, 'titelbild2').setOrigin(0.5, 0.5)
            .setScale(1.4)



        this.add.text(width * 0.5, height * 0.3, 'The legend of', {
            fontSize: '35px',
            fontFamily: '"Press Start 2p"'
        }).setOrigin(0.5, 0.5).setResolution(10)



        this.add.text(width * 0.5, height * 0.4, 'Isaac', {
            fontSize: '35px',
            fontFamily: '"Press Start 2p"',
        }).setOrigin(0.5, 0.5).setResolution(10)



        this.add.text(width * 0.5, height * 0.6, 'Tippe auf Enter um', {
            fontSize: '25px',
            fontFamily: '"Press Start 2p"'
        }).setOrigin(0.5, 0.5).setResolution(10)



        this.add.text(width * 0.5, height * 0.67, 'zu spielen', {
            fontSize: '25px',
            fontFamily: '"Press Start 2p"',
        }).setOrigin(0.5, 0.5).setResolution(10)
    }




    update() {
        const space = this.keyboard.addKey('SPACE')
        if (Phaser.Input.Keyboard.JustDown(space)) {
            this.scene.start('game')
        }
    }
}