import Phaser from 'phaser';
import { DemoGameScene } from './scenes';

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
    scene: new DemoGameScene(),
  };

  return new Phaser.Game(config);
}

export default run;