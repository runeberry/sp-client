import Phaser from 'phaser';
import * as s from './scenes';

function run()
{
  var config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 300 },
        debug: false,
      },
    },
    scene: [
      s.BootScene,
      s.DemoGameScene,
    ],
  };

  return new Phaser.Game(config);
}

export default run;