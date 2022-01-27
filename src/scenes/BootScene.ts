import Phaser from 'phaser';

export class BootScene extends Phaser.Scene
{
  private loadingText!: Phaser.GameObjects.Text;
  private button!: Phaser.GameObjects.Shape;

  constructor()
  {
    super('Boot');
  }

  public init(): void
  {

  }

  public preload(): void
  {

  }

  public create(): void
  {
    this.loadingText = this.add.text(16, 16, 'Loading...');

    this.button = this.add.rectangle(300, 300, 200, 100, 0xFF0000)
      .setInteractive();

    this.button.on('pointerdown', () =>
    {
      console.log('Clicked the rectangle!');
      this.scene.start('DemoGame');
    });
  }

  public override update(time: number, delta: number): void
  {
  }
}