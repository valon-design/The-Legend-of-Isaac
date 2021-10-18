import Phaser from "phaser"

const createEnemyAnims = (anims: Phaser.Animations.AnimationManager) => {


    anims.create({
        key: 'wesen-idle',
        frames: anims.generateFrameNames('wesen', { start: 0, end: 3, prefix: 'necromancer_idle_anim_f', suffix: '.png' }),
        frameRate: 10,
        repeat: -1
    })

    anims.create({
        key: 'wesen-run',
        frames: anims.generateFrameNames('wesen', { start: 0, end: 3, prefix: 'necromancer_run_anim_f', suffix: '.png' }),
        frameRate: 10,
        repeat: -1
    })

}

export {
    createEnemyAnims
}