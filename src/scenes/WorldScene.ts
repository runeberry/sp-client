import Phaser from "phaser";
import * as m from '../map';

export class WorldScene extends Phaser.Scene
{
  private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private camera!: Phaser.Cameras.Scene2D.Camera;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor()
  {
    super('World');
  }

  public init(): void
  {

  }

  public preload(): void
  {
    this.load.image('tiles', '/assets/sim/tiles.png');
    this.load.image('objects', '/assets/sim/objects.png');
    this.load.json('map-data', 'assets/sim/map-01.json');
    this.load.spritesheet('terra', 'assets/sim/char-1.png',
      { frameWidth: 16, frameHeight: 32 });
  }

  public create(): void
  {
    // Read map data
    const mapChunk = this.cache.json.get('map-data') as m.MapChunk;

    // Set visible map boundaries
    this.physics.world.setBounds(0, 0, mapChunk.w * 16, mapChunk.h * 16);

    // Draw map
    const layer0data = this.toPhaserData(mapChunk);
    const map0 = this.make.tilemap({ data: layer0data, tileWidth: 16, tileHeight: 16 });
    const tiles0 = map0.addTilesetImage('tiles');
    const layer0 = map0.createLayer(0, tiles0, 0, 0);

    const layer1data = this.toPhaserObjectTiles(mapChunk);
    const map1 = this.make.tilemap({ data: layer1data, tileWidth: 16, tileHeight: 16 });
    const tiles1 = map1.addTilesetImage('objects');
    const layer1 = map1.createLayer(0, tiles1, 0, 0);

    // Create player
    this.player = this.physics.add.sprite(30, 30, 'terra', 8);

    const physicsGroup = this.physics.add.group({
      allowGravity: false,
      collideWorldBounds: true
    });
    physicsGroup.add(this.player);

    this.anims.create({
      key: 'walk-up',
      frames: this.anims.generateFrameNumbers('terra', { frames: [ 1, 0, 2, 0 ] }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'walk-down',
      frames: this.anims.generateFrameNumbers('terra', { frames: [ 9, 8, 10, 8 ] }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'walk-left',
      frames: this.anims.generateFrameNumbers('terra', { frames: [ 17, 16, 18, 16 ] }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'walk-right',
      frames: this.anims.generateFrameNumbers('terra', { frames: [ 25, 24, 26, 24 ] }),
      frameRate: 10,
      repeat: -1
    });

    // Create controls
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  public update(time: number, delta: number): void
  {
    if (this.cursors.left.isDown)
    {
      this.player.setVelocityX(-160);
      this.player.anims.play('walk-left', true);
    }
    else if (this.cursors.right.isDown)
    {
      this.player.setVelocityX(160);
      this.player.anims.play('walk-right', true);
    }
    else if (this.cursors.up.isDown)
    {
      this.player.setVelocityY(-160);
      this.player.anims.play('walk-up', true);
    }
    else if (this.cursors.down.isDown)
    {
      this.player.setVelocityY(160);
      this.player.anims.play('walk-down', true);
    }
    else
    {
      this.player.setVelocity(0);
      this.player.anims.pause();
    }

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