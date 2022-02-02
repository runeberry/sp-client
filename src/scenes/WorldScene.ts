import Phaser from "phaser";
import { Direction, GridEngineConfig } from "grid-engine";
import { SimScene } from ".";
import * as m from '../map';

export class WorldScene extends SimScene
{
  private tileSize = 16;

  private player!: Phaser.GameObjects.Sprite;
  private camera!: Phaser.Cameras.Scene2D.Camera;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor()
  {
    super('World');
  }

  public override preload(): void
  {
    super.preload();

    this.load.image('tiles', '/assets/sim/tiles.png');
    this.load.image('objects', '/assets/sim/objects.png');
    this.load.json('map-data', 'assets/sim/map-01.json');
    this.load.spritesheet('terra', 'assets/sim/char-1.png',
      { frameWidth: 16, frameHeight: 32 });
  }

  public override create(): void
  {
    super.create();

    // Read map data
    const mapChunk = this.cache.json.get('map-data') as m.MapChunk;

    // Set visible map boundaries
    const mapWidth = mapChunk.w * this.tileSize;
    const mapHeight = mapChunk.h * this.tileSize;
    this.physics.world.setBounds(0, 0, mapWidth, mapHeight);

    // Draw map
    const layer0data = this.toPhaserData(mapChunk);
    const map0 = this.make.tilemap({ data: layer0data, tileWidth: this.tileSize, tileHeight: this.tileSize });
    const tiles0 = map0.addTilesetImage('tiles');
    const layer0 = map0.createLayer(0, tiles0, 0, 0);

    const layer1data = this.toPhaserObjectTiles(mapChunk);
    const map1 = this.make.tilemap({ data: layer1data, tileWidth: this.tileSize, tileHeight: this.tileSize });
    const tiles1 = map1.addTilesetImage('objects');
    const layer1 = map1.createLayer(0, tiles1, 0, 0);

    // Create player
    this.player = this.add.sprite(0, 0, 'terra', 8);

    // Create controls
    this.cursors = this.input.keyboard.createCursorKeys();

    // Lock player to grid
    const gridEngineConfig: GridEngineConfig = {
      characters: [
        {
          id: 'player',
          sprite: this.player,
          speed: 6,
          startPosition: { x: 30, y: 20 },
          walkingAnimationMapping: {
            up: { leftFoot: 1, standing: 0, rightFoot: 2 },
            down: { leftFoot: 9, standing: 8, rightFoot: 10 },
            left: { leftFoot: 17, standing: 16, rightFoot: 18 },
            right: { leftFoot: 25, standing: 24, rightFoot: 26 },
          },
        },
      ],
    };

    this.gridEngine.create(map0, gridEngineConfig);

    // Setup the camera to follow the player
    this.camera = this.cameras.main;
    this.camera.setBounds(
      this.physics.world.bounds.x,
      this.physics.world.bounds.y,
      this.physics.world.bounds.width,
      this.physics.world.bounds.height);
    this.camera.startFollow(this.player);
    this.camera.setZoom(2);
  }

  public override update(time: number, delta: number): void
  {
    super.update(time, delta);

    if (this.cursors.left.isDown)
    {
      this.gridEngine.move('player', Direction.LEFT);
    }
    else if (this.cursors.right.isDown)
    {
      this.gridEngine.move('player', Direction.RIGHT);
    }
    else if (this.cursors.up.isDown)
    {
      this.gridEngine.move('player', Direction.UP);
    }
    else if (this.cursors.down.isDown)
    {
      this.gridEngine.move('player', Direction.DOWN);
    }
  }

  // this needs to map the MapChunk data to an index on the tilesheet
  private toPhaserData(mapChunk: m.MapChunk): number[][]
  {
    const data: number[][] = [];

    let i = 0;
    for (let row = 0; row < mapChunk.h; row++)
    {
      data[row] = [];
      for (let col = 0; col < mapChunk.w; col++)
      {
        const tileData = mapChunk.tiles[i++];
        const tileRef = mapChunk.tileRef[tileData.id];
        const index = tileRef.tileId.split(':')[1]; // tileId format is: "layer#:index#"
        data[row][col] = parseInt(index) - 1; // convert 1-index to 0-index
      }
    }

    return data;
  }

  private toPhaserObjectTiles(mapChunk: m.MapChunk): number[][]
  {
    const data: number[][] = [];

    let i = 0;
    for (let row = 0; row < mapChunk.h; row++)
    {
      data[row] = [];
      for (let col = 0; col < mapChunk.w; col++)
      {
        const tileData = mapChunk.tiles[i++];

        if (tileData.objects && tileData.objects[0])
        {
          const tileRef = mapChunk.tileRef[tileData.objects[0].id];
          const index = tileRef.tileId.split(':')[1]; // tileId format is: "layer#:index#"
          data[row][col] = parseInt(index) - 1; // convert 1-index to 0-index
        }
        else
        {
          data[row][col] = -1; // No object here
        }
      }
    }

    return data;
  }
}