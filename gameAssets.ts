class Vector2 {
    x: number
    y: number

    constructor(x: number = 1, y: number = 1) {
        this.x = x
        this.y = y
    }

    add(vector2: Vector2, createNewObject: boolean = false): Vector2 {
        let thisVector: Vector2 = this
        if (createNewObject) {
            thisVector = new Vector2(thisVector.x, thisVector.y)
        }
        thisVector.x += vector2.x
        thisVector.y += vector2.y
        return thisVector
    }

    multiply(vector2: Vector2 | number, createNewObject: boolean = false): Vector2 {
        let thisVector: Vector2 = this
        if (createNewObject) {
            thisVector = new Vector2(thisVector.x, thisVector.y)
        }
        if (typeof(vector2) == "number") {
            thisVector.x *= vector2
            thisVector.y *= vector2
        } else {
            thisVector.x *= vector2.x
            thisVector.y *= vector2.y
        }
        return thisVector
    }

    subtract(vector2: Vector2, createNewObject: boolean = false): Vector2 {
        let thisVector: Vector2 = this
        if (createNewObject) {
            thisVector = new Vector2(thisVector.x, thisVector.y)
        }
        thisVector.x -= vector2.x
        thisVector.y -= vector2.y
        return thisVector
    }

    divide(vector2: Vector2 | number, createNewObject: boolean = false): Vector2 {
        let thisVector: Vector2 = this
        if (createNewObject) {
            thisVector = new Vector2(thisVector.x, thisVector.y)
        }
        if (typeof (vector2) == "number") {
            thisVector.x /= vector2
            thisVector.y /= vector2
        } else {
            thisVector.x /= vector2.x
            thisVector.y /= vector2.y
        }
        return thisVector
    }

    round(mode: number = null): Vector2 {
        switch(mode) {
            case 1:
                this.x = Math.floor(this.x)
                this.y = Math.floor(this.y)
            case 2:
                this.x = Math.ceil(this.x)
                this.y = Math.ceil(this.y)
            default:
                this.x = Math.round(this.x)
                this.y = Math.round(this.y)
        }
        return this
    }

    magnitude(): number {
        return Math.sqrt(this.x^2+this.y^2)
    }

    toString(): string {
        return `X: ${this.x}, Y: ${this.y}`
    }

    clone(): Vector2 {
        return new Vector2(this.x, this.y)
    }
}

namespace gameAssets {
    /*
    export type SingleTile = {
        tileID: number,
        appearanceID?: number,
        rotation?: number,
        flipped?: number,
        collisionShape?: number,
    }
    */

    export type LevelData = {
        name: string,
        width: number,
        height: number,

        colorMapPaletteImage: Image

        tileMap: number[][][] //tile = tileMap[layer][tileIndex]
    }

    type TileImageData = (renderer.Animation | Image)[]

    export type ConstantTileData = {
        colormapPalette?: string,
        collidableWith: number,
        name: string,
        tileSheet?: TileImageData, //What tileset to use for this tile
    }

    /*
    const colormapPalettes: Image = 
    export const labeledColormapPalettes: {[key: string]: Buffer} = {
        red: utilities.getBufferFromImageY(1, colormapPalettes),
        green: utilities.getBufferFromImageY(3, colormapPalettes),
        blue: utilities.getBufferFromImageY(5, colormapPalettes),

        light: utilities.getBufferFromImageY(12, colormapPalettes),
        lighter: utilities.getBufferFromImageY(13, colormapPalettes),

        dark: utilities.getBufferFromImageY(14, colormapPalettes),
        darker: utilities.getBufferFromImageY(15, colormapPalettes),
    } 
    */

    export const tileImages: {[key: string]: TileImageData} = {
        caveGroundBlock: [
            img`
                . c c c c c c c
                c f c f c f c f
                c c f f f f f f
                c f f c d f d f
                c c f d d f f f
                c f f f f f f f
                c c f f d f f f
                c f f f f f f f
            `, //┍
            img`
                c c f f f f d f
                c f f c d f f f
                c c f d d f f f
                c f f f f f f f
                c c f d f f f f
                c f f f f c d f
                c c f f f d d f
                c f f f f f f f
            `, //|
            img`
                . c c c c c c c
                c f c f c f c f
                c c c d f f f f
                c f d d f f c d
                c c f f f f d d
                c f f d f f f f
                c c f c f c f c
                . c c c c c c c
            `, //[
            img`
                c c f f f f c c
                c f f f f d f c
                c c f c d f c c
                c f f d d f f c
                c c f f f f c c
                c f d f f f f c
                c c f f c d c c
                c f f f d d f c
            `, //||
            img`
                . c c c c c c .
                c f c f c f c c
                c c c d f f f c
                c f d d f d c c
                c c f f f f f c
                c f f d f f c c
                c c f c f c f c
                . c c c c c c .
            `, //[]
            img`
                f f f f f f f f
                f d f f f d f f
                f f f f d d f f
                f f d f f f f f
                f f f f f f d f
                f f d f f d d f
                f d d f f f f f
                f f f f f f d f
            `, //Dirt 1
            img`
                f f f f f f f f
                f d f f f c d f
                f f f f f d d f
                f f c d f f f f
                f f d d f f d f
                f f f f f f f f
                f c d f f c d f
                f d d f f d d f
            `, //Dirt 2
        ],
        specialBlocks: [
            img`
                . . 2 2 2 2 . .
                . 2 d . . d 2 .
                2 d . . . 2 d 2
                2 . . . 2 d . 2
                2 . . 2 d . . 2
                2 . 2 d . . . 2
                d 2 d . . . 2 d
                . d 2 2 2 2 d .
            `,//Barrier block
        ],
        coloredSquares: [
            //Color of the squares are in the same order as the current pallete
            img`
                . . . . . . . .
                . . . . . . . .
                . . . . . . . .
                . . . . . . . .
                . . . . . . . .
                . . . . . . . .
                . . . . . . . .
                . . . . . . . .
            `,
            img`
                1 1 1 1 1 1 1 1
                1 1 1 1 1 1 1 1
                1 1 1 1 1 1 1 1
                1 1 1 1 1 1 1 1
                1 1 1 1 1 1 1 1
                1 1 1 1 1 1 1 1
                1 1 1 1 1 1 1 1
                1 1 1 1 1 1 1 1
            `,
            img`
                2 2 2 2 2 2 2 2
                2 2 2 2 2 2 2 2
                2 2 2 2 2 2 2 2
                2 2 2 2 2 2 2 2
                2 2 2 2 2 2 2 2
                2 2 2 2 2 2 2 2
                2 2 2 2 2 2 2 2
                2 2 2 2 2 2 2 2
            `,
            img`
                3 3 3 3 3 3 3 3
                3 3 3 3 3 3 3 3
                3 3 3 3 3 3 3 3
                3 3 3 3 3 3 3 3
                3 3 3 3 3 3 3 3
                3 3 3 3 3 3 3 3
                3 3 3 3 3 3 3 3
                3 3 3 3 3 3 3 3
            `,
            img`
                4 4 4 4 4 4 4 4
                4 4 4 4 4 4 4 4
                4 4 4 4 4 4 4 4
                4 4 4 4 4 4 4 4
                4 4 4 4 4 4 4 4
                4 4 4 4 4 4 4 4
                4 4 4 4 4 4 4 4
                4 4 4 4 4 4 4 4
            `,
            img`
                5 5 5 5 5 5 5 5
                5 5 5 5 5 5 5 5
                5 5 5 5 5 5 5 5
                5 5 5 5 5 5 5 5
                5 5 5 5 5 5 5 5
                5 5 5 5 5 5 5 5
                5 5 5 5 5 5 5 5
                5 5 5 5 5 5 5 5
            `,
            img`
                6 6 6 6 6 6 6 6
                6 6 6 6 6 6 6 6
                6 6 6 6 6 6 6 6
                6 6 6 6 6 6 6 6
                6 6 6 6 6 6 6 6
                6 6 6 6 6 6 6 6
                6 6 6 6 6 6 6 6
                6 6 6 6 6 6 6 6
            `,
            img`
                7 7 7 7 7 7 7 7
                7 7 7 7 7 7 7 7
                7 7 7 7 7 7 7 7
                7 7 7 7 7 7 7 7
                7 7 7 7 7 7 7 7
                7 7 7 7 7 7 7 7
                7 7 7 7 7 7 7 7
                7 7 7 7 7 7 7 7
            `,
            img`
                8 8 8 8 8 8 8 8
                8 8 8 8 8 8 8 8
                8 8 8 8 8 8 8 8
                8 8 8 8 8 8 8 8
                8 8 8 8 8 8 8 8
                8 8 8 8 8 8 8 8
                8 8 8 8 8 8 8 8
                8 8 8 8 8 8 8 8
            `,
            img`
                9 9 9 9 9 9 9 9
                9 9 9 9 9 9 9 9
                9 9 9 9 9 9 9 9
                9 9 9 9 9 9 9 9
                9 9 9 9 9 9 9 9
                9 9 9 9 9 9 9 9
                9 9 9 9 9 9 9 9
                9 9 9 9 9 9 9 9
            `,
            img`
                a a a a a a a a
                a a a a a a a a
                a a a a a a a a
                a a a a a a a a
                a a a a a a a a
                a a a a a a a a
                a a a a a a a a
                a a a a a a a a
            `,
            img`
                b b b b b b b b
                b b b b b b b b
                b b b b b b b b
                b b b b b b b b
                b b b b b b b b
                b b b b b b b b
                b b b b b b b b
                b b b b b b b b
            `,
            img`
                c c c c c c c c
                c c c c c c c c
                c c c c c c c c
                c c c c c c c c
                c c c c c c c c
                c c c c c c c c
                c c c c c c c c
                c c c c c c c c
            `,
            img`
                d d d d d d d d
                d d d d d d d d
                d d d d d d d d
                d d d d d d d d
                d d d d d d d d
                d d d d d d d d
                d d d d d d d d
                d d d d d d d d
            `,
            img`
                e e e e e e e e
                e e e e e e e e
                e e e e e e e e
                e e e e e e e e
                e e e e e e e e
                e e e e e e e e
                e e e e e e e e
                e e e e e e e e
            `,
            img`
                f f f f f f f f
                f f f f f f f f
                f f f f f f f f
                f f f f f f f f
                f f f f f f f f
                f f f f f f f f
                f f f f f f f f
                f f f f f f f f
            `,
        ],
    } 

    //To save on memory costs ect. also just cleaner imo
    export const constTileData: ConstantTileData[]  = [
        {
            colormapPalette: "",
            collidableWith: 1,
            name: "caveGroundBlock",
            tileSheet: tileImages["caveGroundBlock"],
        },
        {
            colormapPalette: "",
            collidableWith: 1,
            name: "specialBlocks",
            tileSheet: tileImages["specialBlocks"],
        },
        {
            colormapPalette: "",
            collidableWith: 1,
            name: "coloredSquares",
            tileSheet: tileImages["coloredSquares"]
        },
    ]

    /*
    Tile ID: number (compressed with base64)
    Tile appearence: number (compressed with base64)
    Tile colormapPalette: number
    Tile rotation: number (0-3) (0 degrees, 90 degrees, 180 degrees, 270 degrees)
    Tile flipped: number (0-3) (none, horizontally, vertically, both)
    Tile shape: number (normal, sloped /, sloped \, half-block)
    Tile collidable with: number (0-7) (all, enemies only, player only, projectiles only, not enemies, not player, not projectiles, none)
    */

    export let currentColorMapPalettes: Buffer[] = [

    ]

    export const levels: LevelData[] = [
        {
            name: "The Great Plains",
            width: 20,
            height: 15,

            //For readabilities sake
            colorMapPaletteImage: img`
                . 1 2 3 4 5 6 7 8 9 a b c d e f .
                . 4 2 2 3 3 4 3 d d 4 4 4 d 3 f 2
                . c e e e e c c f f 3 3 3 f e f 3
                . 5 8 7 5 5 5 7 8 8 6 6 7 8 8 f 5
                . 7 d 8 7 7 7 8 d d 5 5 8 d d f 7
                . 6 8 7 6 7 6 7 8 9 a a 9 9 8 f 8
                . 7 d 8 7 8 7 8 d d c c d d d f d
                . . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . . .
                . 1 3 4 b b b 6 7 a b 1 b c c f b
                . 1 4 1 1 1 1 b 6 b 1 1 1 1 1 f 1
                . b e e 3 7 7 8 d d 9 c d d d f c
                . 3 d d 2 8 8 d d f d d d f f f d
            `,

            tileMap: [
                [
                    [0, 0, 0, 0, 0], [0, 1, 1, 0, 0], [0, 1, 1, 0, 0], [0, 1, 1, 0, 0], [0, 1, 1, 0, 0], [0, 1, 1, 0, 0], [0, 1, 1, 0, 0], [0, 1, 1, 0, 0], [0, 1, 1, 0, 0], [0, 1, 1, 0, 0], [0, 1, 1, 0, 0], [0, 1, 1, 0, 0], [0, 1, 1, 0, 0], [0, 1, 1, 0, 0], [0, 1, 1, 0, 0], [0, 1, 1, 0, 0], [0, 1, 1, 0, 0], [0, 1, 1, 0, 0], [0, 1, 1, 0, 0], [0, 0, 1, 0, 0],
                    [0, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [0, 1, 2, 0, 0],
                    [0, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [0, 1, 2, 0, 0],
                    [0, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [0, 1, 2, 0, 0],
                    [0, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [0, 1, 2, 0, 0],
                    [0, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [0, 1, 2, 0, 0],
                    [0, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [0, 1, 2, 0, 0],
                    [0, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [0, 1, 2, 0, 0],
                    [0, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [0, 1, 2, 0, 0],
                    [0, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [0, 1, 2, 0, 0],
                    [0, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [0, 1, 2, 0, 0],
                    [0, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [0, 1, 2, 0, 0],
                    [0, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [0, 1, 2, 0, 0],
                    [0, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [2, 1, 0, 0, 0], [0, 1, 2, 0, 0],
                    [0, 0, 3, 0, 0], [0, 1, 3, 0, 0], [0, 1, 3, 0, 0], [0, 1, 3, 0, 0], [0, 1, 3, 0, 0], [0, 1, 3, 0, 0], [0, 1, 3, 0, 0], [0, 1, 3, 0, 0], [0, 1, 3, 0, 0], [0, 1, 3, 0, 0], [0, 1, 3, 0, 0], [0, 1, 3, 0, 0], [0, 1, 3, 0, 0], [0, 1, 3, 0, 0], [0, 1, 3, 0, 0], [0, 1, 3, 0, 0], [0, 1, 3, 0, 0], [0, 1, 3, 0, 0], [0, 1, 3, 0, 0], [0, 0, 2, 0, 0],
                ]
            ]
        }
    ] 
}
