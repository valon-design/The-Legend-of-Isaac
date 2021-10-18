import Phaser from 'phaser'


import Preloader from './scenes/Preloader'
import Game from './scenes/Game'
import GameUI from './scenes/GameUI'
import LevelFinishedScene from './scenes/LevelFinishedScene'
import Menu from './scenes/Menu'
import GameOver from './scenes/GameOver'


import { Plugin as NineSlicePlugin } from 'phaser3-nineslice'

export default new Phaser.Game({
	type: Phaser.AUTO,
	width: window.innerWidth * 0.5,
	height: window.innerHeight * 0.5,
	pixelArt: true,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
			debug: false
		}
	},
	plugins: {
		global: [NineSlicePlugin.DefaultCfg]
	},
	scene: [Preloader, Menu, Game, GameUI, GameOver, LevelFinishedScene],
	scale: {
		zoom: 2
	}
})
