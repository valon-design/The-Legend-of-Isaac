import Phaser from 'phaser'


import { debugDraw } from '../utils/debug'

import { createAdventurerAnims } from '../anims/AdventurerAnims'
import { createChestAnims } from '../anims/TreasureAnims'
import { createEnemyAnims } from '../anims/EnemyAnims'

import Enemy from '../enemies/Enemy'
import Adventurer from '../characters/Adventurer'
import Chest from '../items/Chest'
import Lever from '../items/Lever'

import { sceneEvents } from '../events/EventCenter'



export default class Game extends Phaser.Scene {


    static map: Phaser.Tilemaps.Tilemap
    private spawnPoint!: Phaser.Types.Tilemaps.TiledObject
    private spawnPoint2!: Phaser.Types.Tilemaps.TiledObject
    private spawnPoint3!: Phaser.Types.Tilemaps.TiledObject
    private spawnPoint4!: Phaser.Types.Tilemaps.TiledObject
    private direction!: number
    private closedDoor1Collidor!: Phaser.Physics.Arcade.Collider
    private closedDoor1!: Phaser.Tilemaps.TilemapLayer
    static adventurer: Adventurer
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    private keyboard!: Phaser.Input.Keyboard.KeyboardPlugin
    private playerEnemiesCollider!: Phaser.Physics.Arcade.Collider
    private knives!: Phaser.Physics.Arcade.Group
    private enemies!: Phaser.Physics.Arcade.Group
    private swordHitbox!: Phaser.GameObjects.Rectangle
    static openendChests = 0



    constructor() {
        super('game')
    }



    preload() {
        this.cursors = this.input.keyboard.createCursorKeys()
        this.keyboard = this.input.keyboard
    }



    create() {

        this.scene.run('game-ui')
        this.scene.run('dialogBox')

        createEnemyAnims(this.anims)
        createAdventurerAnims(this.anims)
        createChestAnims(this.anims)





        //map
        Game.map = this.make.tilemap({ key: 'dungeon-2' })
        const tileset1 = Game.map.addTilesetImage('dungeon2', 'tiles')
        const tileset2 = Game.map.addTilesetImage('dungeon1', 'tiles1')
        const tileset3 = Game.map.addTilesetImage('zelda_like', 'tiles3')
        //ground
        const groundLayer = Game.map.createLayer('Ground', [tileset1, tileset2, tileset3])
        const groundLayer2 = Game.map.createLayer('Ground2', [tileset1, tileset2, tileset3])

        //Safety layer 
        const killLayer = Game.map.createLayer('Killlayer', [tileset1, tileset2, tileset3])
        killLayer.setCollisionByProperty({ collides: true, collides1: true, collide2: true })
        //debugDraw(killLayer, this)
        //walls
        const wallsLayer2 = Game.map.createLayer('Walls2', [tileset1, tileset2, tileset3])
        wallsLayer2.setCollisionByProperty({ collides1: true, collide2: true })
        //debugDraw(wallsLayer2, this)
        const wallsLayer = Game.map.createLayer('Walls', [tileset1, tileset2, tileset3])
        wallsLayer.setCollisionByProperty({ collides: true, collides1: true, collide2: true })
        //debugDraw(wallsLayer, this)





        //Door
        const openDoor1 = Game.map.createLayer('OpenDoor1', [tileset1, tileset2, tileset3])
        this.closedDoor1 = Game.map.createLayer('ClosedDoor1', [tileset1, tileset2, tileset3])
        this.closedDoor1.setCollisionByProperty({ collides1: true })
        //Door openend
        const openDoor1Collision = Game.map.createFromObjects('Interactive', {
            name: 'OpenDoor1'
        })

        this.physics.world.enable(openDoor1Collision, 1)

        openDoor1Collision.forEach(obj => {
            obj.body.position.y += obj['displayHeight']
            obj['visible'] = false
        })




        //Chests + lever
        const chests = this.physics.add.staticGroup({
            classType: Chest
        })
        const levers = this.physics.add.staticGroup({
            classType: Lever
        })

        const chestLayer = Game.map.getObjectLayer('Chests')
        chestLayer.objects.forEach(obj => {
            if (obj.type === 'treasure') {
                chests.get(obj.x! + obj.width! * 0.5, obj.y! - obj.height! * 0.5)

            }

            if (obj.type === 'lever') {
                levers.get(obj.x! + obj.width! * 0.5, obj.y! - obj.height! * 0.5, 'leverOff')
            }
        })






        //player
        this.spawnPoint = Game.map.findObject('Objects', obj => obj.name === 'Spawn Point')
        this.spawnPoint2 = Game.map.findObject('Objects', obj => obj.name === 'Spawn Point2')
        Game.adventurer = this.add.adventurer(this.spawnPoint2.x, this.spawnPoint2.y, 'adventurer')



        //camera
        this.cameras.main.setBounds(800, 0, 480, 320)
        this.cameras.main.setZoom(2)
        this.cameras.main.startFollow(Game.adventurer, true)


        //enemies
        this.enemies = this.physics.add.group({
            classType: Enemy,
            createCallback: (go) => {
                const enemy = go as Enemy
                enemy.body.onCollide = true
                enemy.body.setSize(enemy.width * 0.8, enemy.height * 0.8)
                enemy.body.offset.y = 5
            }
        })
        const enemyLayer = Game.map.getObjectLayer('Enemies')
        enemyLayer.objects.forEach(enemyObj => {
            this.enemies.get(enemyObj.x! + enemyObj.width! * 0.5, enemyObj.y! - enemyObj.height! * 0.5)
        })



        //NPC
        const b = this.keyboard.addKey('b')
        this.spawnPoint3 = Game.map.findObject('Objects', obj => obj.name === 'Spawn Point3')
        this.spawnPoint4 = Game.map.findObject('Objects', obj => obj.name === 'Spawn Point4')
        //NPC1
        const NPCobj1 = Game.map.findObject('NPC', obj => obj.name === 'NPC1')
        const NPC1 = this.physics.add.staticSprite(NPCobj1.x!, NPCobj1.y!, 'dorfbewohner2')
        var NPC1dialog = 1 // Max is 3

        var s1 = this.add.rectangle(NPC1.x, NPC1.y, NPC1.height * 2, NPC1.height * 2)
        this.physics.world.enable(s1, Phaser.Physics.Arcade.STATIC_BODY)

        NPC1.body.setSize(NPC1.width * 0.8, NPC1.height * 0.6).setOffset(0, 12)
        this.physics.add.overlap(Game.adventurer, s1, () => {

            this.add.image(NPC1.x, NPC1.y + 40, `box${NPC1dialog}`).setScale(0.3)
            if (NPC1dialog < 3 && Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
                console.log('lol')
                NPC1dialog++
            }
            if (NPC1dialog > 1 && Phaser.Input.Keyboard.JustDown(b)) {
                console.log('lol')
                NPC1dialog--
            }

            if (NPC1dialog === 3) {
                this.cameras.main.fade(3000, 16.5, 2.0, 1.2)

                this.time.addEvent({
                    delay: 3000,
                    callback: () => {
                        this.cameras.main.fadeIn(1000);
                        this.cameras.main.setBounds(0, 0, 640, 480)
                        Game.adventurer.setPosition(this.spawnPoint.x, this.spawnPoint.y)

                    },
                    loop: false
                })
            }


        })
        this.physics.add.collider(Game.adventurer, NPC1)


        //NPC2
        const NPCobj2 = Game.map.findObject('NPC', obj => obj.name === 'NPC2')
        //NPCGroup.get(NPCobj1.x!, NPCobj1.y!, )
        const NPC2 = this.physics.add.staticSprite(NPCobj2.x!, NPCobj2.y! + 15, 'dorfbewohner2')
        var NPC2dialog = 4 // Max is 6
        var s2 = this.add.rectangle(NPC2.x, NPC2.y, NPC2.height * 2, NPC2.height * 2)
        this.physics.world.enable(s2, Phaser.Physics.Arcade.STATIC_BODY)

        NPC2.body.setSize(NPC2.width * 0.8, NPC2.height * 0.6).setOffset(0, 12)
        this.physics.add.overlap(Game.adventurer, s2, () => {

            this.add.image(NPC2.x, NPC2.y - 29, `box${NPC2dialog}`).setScale(0.3)
            if (NPC2dialog < 6 && Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
                console.log('lol')
                NPC2dialog++
            }
            if (NPC2dialog > 3 && Phaser.Input.Keyboard.JustDown(b)) {
                console.log('lol')
                NPC2dialog--
            }
            if (Adventurer.openchest > 6) {
                this.scene.start('level-finished', {
                    coins: Adventurer.coins
                })
                this.scene.stop('game')
            }

        })
        this.physics.add.collider(Game.adventurer, NPC2)

        //NPC3
        const NPCobj3 = Game.map.findObject('NPC', obj => obj.name === 'NPC3')
        //NPCGroup.get(NPCobj1.x!, NPCobj1.y!, )
        const NPC3 = this.physics.add.staticSprite(this.spawnPoint3.x!, this.spawnPoint3.y!, 'dorfbewohner3')

        //NPC4
        const NPCobj4 = Game.map.findObject('NPC', obj => obj.name === 'NPC4')
        //NPCGroup.get(NPCobj1.x!, NPCobj1.y!, )
        const NPC4 = this.physics.add.staticSprite(this.spawnPoint4.x!, this.spawnPoint4.y!, 'dorfbewohner')
        this.physics.add.collider(NPC4, Game.adventurer)



        //knifes
        this.knives = this.physics.add.group({
            classType: Phaser.Physics.Arcade.Image,
            //maxSize: 3,
            key: 'knive'
        })
        Game.adventurer.setKnives(this.knives)





        //collidors
        this.physics.add.collider(Game.adventurer, wallsLayer)
        this.physics.add.collider(Game.adventurer, wallsLayer2)
        this.playerEnemiesCollider = this.physics.add.collider(this.enemies, Game.adventurer, this.handlePlayerEnemyCollision, undefined, this)
        //Door1
        this.closedDoor1Collidor = this.physics.add.collider(Game.adventurer, this.closedDoor1)
        //Door opened
        this.physics.add.collider(Game.adventurer, openDoor1Collision)
        //Chests + switch
        this.physics.add.collider(Game.adventurer, chests, this.handlePlayerChestCollision, undefined, this)
        this.physics.add.collider(Game.adventurer, levers, this.handlePlayerLeverCollision, undefined, this)
        //Enemies + world
        this.physics.add.collider(this.enemies, wallsLayer)
        this.physics.add.collider(this.enemies, wallsLayer2)
        this.physics.add.collider(this.enemies, this.closedDoor1)
        this.physics.add.collider(this.enemies, chests)
        this.physics.add.collider(this.enemies, levers, this.handlePlayerLeverCollision, undefined, this)
        this.physics.add.collider(this.enemies, openDoor1Collision)
        this.physics.add.collider(this.enemies, this.enemies)
        this.physics.add.collider(this.enemies, killLayer, this.handleEnemyWallCollision, undefined, this)
        //knive
        this.physics.add.collider(this.knives, wallsLayer, this.handleKnifeWallCollision, undefined, this)
        this.physics.add.collider(this.knives, this.enemies, this.handleKniveEnemyCollision, undefined, this)


    }



    private swordRange() {
        if (Game.adventurer.scaleX < 0) {
            this.direction = -10
        } else {
            this.direction = 10
        }
        this.swordHitbox = this.add.rectangle(Game.adventurer.x + this.direction, Game.adventurer.y + 5, 15, 15 /*,0xff0000, 0.5 */)
        this.physics.world.enable(this.swordHitbox)
        this.physics.add.overlap(this.swordHitbox, this.enemies, this.handleKniveEnemyCollision, undefined, this)
        Game.adventurer.swordSwung()
        setTimeout(() => {
            this.swordHitbox.destroy()
        }, 500)
    }



    private handleEnemyWallCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
        this.enemies.killAndHide(obj1)
        this.enemies.killAndHide(obj2)
        obj1.destroy()
        obj2.destroy()
    }




    private handleKnifeWallCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
        this.knives.killAndHide(obj1)
        obj1.destroy()
    }



    private handleKniveEnemyCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
        this.knives.killAndHide(obj1)
        this.enemies.killAndHide(obj2)
        obj2.destroy(true)
        obj1.destroy(true)
    }



    private handlePlayerEnemyCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
        const enemy = obj2 as Enemy

        const dx = Game.adventurer.x - enemy.x
        const dy = Game.adventurer.y - enemy.y
        const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(100)
        Game.adventurer.handleDamage(dir)

        sceneEvents.emit('player-health-changed', Game.adventurer.health)
        if (Game.adventurer.health <= 0) {
            this.playerEnemiesCollider.destroy()
        }
    }



    private handlePlayerChestCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
        const chest = obj2 as Chest
        Game.adventurer.setChest(chest)
    }



    private handlePlayerLeverCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
        const lever = obj2 as Lever
        Game.adventurer.setLever(lever)
    }





    update(t: number, dt: number) {


        if (Game.adventurer) {
            Game.adventurer.update(this.cursors, this.keyboard)
        }

        //swinging sword
        if (Game.adventurer.pressedE) {
            this.swordRange()
        }

        //Opening doors
        let i = Game.adventurer.whichDoor()
        switch (i) {
            case 1:
                if (this.closedDoor1['visible'] === true) {
                    this.closedDoor1['visible'] = false
                    this.closedDoor1Collidor.destroy()
                }
                break
            default:
                break;
        }

    }
}
