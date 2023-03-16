namespace customTiles {
    export let loadedLevel: gameAssets.LevelData
    export const tileSizePixels: number = 8
    export const tileSizePixelsHalf: number = tileSizePixels/2
    export const tileSize: Vector2 = {x: tileSizePixels, y: tileSizePixels}
    export let loadingNewLevel: boolean = true

    export function tilePositionToPixelPosition(tilePosition: Vector2): Vector2 {
        return Vector2Library.multiply(tilePosition, customTiles.tileSizePixels)
    }

    export function pixelPositionToTilePosition(pixelPosition: Vector2): Vector2 {
        return Vector2Library.floor(Vector2Library.divide(pixelPosition, customTiles.tileSizePixels))
    }

    export function tilePositionToTileIdx(tilePosition: Vector2): number {
        return (tilePosition.x + tilePosition.y * loadedLevel.width)
    }

    /*
    export function tileIdxToTilePosition(tileIdx: number): gameAssets.Position {
        let x: number = tileIdx - ()
        return {x: x, y: 1}
    }
    */

    export function loadLevel(level: number) {
        loadingNewLevel = true
        loadedLevel = gameAssets.levels[level]

        let colorMapPaletteImage: Image = loadedLevel.colorMapPaletteImage
        for (let y = 0; y < colorMapPaletteImage.height; y++) {
            let buffer: Buffer = utilities.getBufferFromImageY(y, colorMapPaletteImage)
            gameAssets.currentColorMapPalettes.push(buffer)
        }
        loadingNewLevel = false
    }
}