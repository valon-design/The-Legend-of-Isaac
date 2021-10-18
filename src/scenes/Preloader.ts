import Phaser from "phaser"


import WebFontFile from "../fonts/WebFontFile"



export default class Preloader extends Phaser.Scene {


    constructor() {
        super('preloader')
    }



    preload() {
        //Titelbild
        this.load.image('titelbild', 'titelbild/titelbild.png')
        this.load.image('titelbild2', 'titelbild/titelbild2.png')

        //NPC
        this.load.image('dorfbewohner', 'characters/dorfbewohner.png')
        this.load.image('dorfbewohner2', 'characters/dorfbewohner2.png')
        this.load.image('dorfbewohner3', 'characters/dorfbewohner3.png')

        //Character
        this.load.spritesheet('adventurer', 'characters/adventurer.png', {
            frameWidth: 32,
            frameHeight: 32,
        })

        //Dialog Text
        this.load.image('box1', 'dialog/box1.png')
        this.load.image('box2', 'dialog/box2.png')
        this.load.image('box3', 'dialog/box3.png')
        this.load.image('box4', 'dialog/box4.png')
        this.load.image('box5', 'dialog/box5.png')
        this.load.image('box6', 'dialog/box6.png')

        //Items
        this.load.atlas('treasure', 'items/treasure.png', 'items/treasure.json')
        this.load.image('leverOff', 'items/leverOff.png')
        this.load.image('leverOn', 'items/leverOn.png')

        //Map
        this.load.image('tiles', 'tiles/dungeon-2.png')
        this.load.image('tiles1', 'tiles/dungeon-01.png')
        this.load.image('tiles3', 'tiles/Overworld.png')
        this.load.tilemapTiledJSON('dungeon-2', 'tiles/dungeon-2.json')

        //Leben
        this.load.image('ui-heart-full', 'ui/ui_heart_full.png')
        this.load.image('ui-heart-empty', 'ui/ui_heart_empty.png')

        //Enemy
        this.load.atlas('wesen', 'enemies/wesen.png', 'enemies/wesen.json')

        //Messer
        this.load.image('knive', 'weapons/knife2.png')
        this.load.image('knive2', 'weapons/knife.png')

        //Münze
        this.load.atlas('coin', 'items/coin.png', 'items/coin.json')

        //Font
        this.load.addFile(new WebFontFile(this.load, 'Press Start 2P'))
    }

    create() {
        this.scene.start('menu')
    }
}