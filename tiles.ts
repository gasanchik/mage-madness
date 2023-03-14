namespace customTiles {
    export let loadedLevel: gameAssets.LevelData
    export const tileSizePixels: number = 8
    export const tileSize: Vector2 = new Vector2(tileSizePixels, tileSizePixels)
    export let loadingNewLevel: boolean = true

    export function tilePositionToPixelPosition(tilePosition: Vector2): Vector2 {
        return tilePosition.multiply(tileSizePixels, true)
    }

    export function pixelPositionToTilePosition(pixelPosition: Vector2): Vector2 {
        return pixelPosition.divide(tileSizePixels, true).round(1)
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