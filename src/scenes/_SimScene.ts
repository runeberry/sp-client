import Phaser from "phaser";
import { GridEngine } from 'grid-engine';

export class SimScene extends Phaser.Scene
{
  constructor(config: string | Phaser.Types.Scenes.SettingsConfig)
  {
    super(config);
  }

  //#region Plugins

  protected gridEngine!: GridEngine;

  //#endregion

  //#region Phaser lifecycle methods

  public init(): void
  {
  }

  public preload(): void
  {
  }

  public create(): void
  {
  }

  public override update(time: number, delta: number): void
  {
  }

  //#endregion
}