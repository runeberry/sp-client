// copied from sp-tools

export interface TileInfo {
  name: string,
  tileId: string,
  collision: boolean
}

export interface MapChunk {
  v: number
  id: number
  x: number
  y: number
  w: number
  h: number
  tileRef: { [key: number]: TileInfo }
  tiles: MapTile[]
}

export interface MapTile {
  id: number
  objects: MapObject[] | undefined
}

export interface MapObject {
  id: number
}