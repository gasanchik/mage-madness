namespace renderer {
    export enum AnimationState {
        Playing,
        Paused,
        Stopped
    } 
    
    export type LightSource = {
        pixelPosition: Vector2,
        radiusPixels: number, 
        colorMapPalette: number[],
    }
    let graphicsMode: number = 2 //0, 1, 2, 3, 4

    export let screenPosition: Vector2 = {x: 0, y: 0}
    let internalOldScreenPosition: Vector2 = { x: 0, y: 0 }
    let internalScreenPosition: Vector2 = { x: 0, y: 0 }
    export let screenPositionDifference: Vector2 = { x: 0, y: 0 }
    export const screenSize: Vector2 = { x: 160, y: 120 }
    export const tilesPerScreen: Vector2 = Vector2Library.floor(Vector2Library.divide(screenSize, customTiles.tileSizePixels))//{ x: Math.floor(screenSize.x / customTiles.tileSizePixels), y: Math.floor(screenSize.y / customTiles.tileSizePixels) }

    let cachedTiles: {[key: string]: Image} = {}
    let lightSources: LightSource[] = [
        {
            pixelPosition: {x: 80, y: 60},
            radiusPixels: 60,
            colorMapPalette: [6, 5]
        }
    ]
    //40, 30
    let lightBufferSize: Vector2 = { x: 52, y: 50 } //40, 30 //20, 15, //26, 25
    let lightBuffer: Buffer = Buffer.create(lightBufferSize.x * lightBufferSize.y)
    let lightMappingSizeBuffer: Buffer = Buffer.create(lightBufferSize.x * lightBufferSize.y)
    let lightBufferPosition: Vector2 = { x: -24, y: -40 } //In pixel position

    const bayerThresholdMap = [
        [1, 49, 13, 61, 4, 52, 16, 64],
        [33, 17, 45, 29, 36, 20, 48, 32],
        [9, 57, 5, 53, 12, 60, 8, 56],
        [41, 25, 37, 21, 44, 28, 40, 24],
        [3, 51, 15, 63, 2, 50, 14, 62],
        [35, 19, 47, 31, 34, 18, 46, 30],
        [11, 59, 7, 55, 10, 58, 6, 54],
        [43, 27, 39, 23, 42, 26, 38, 22]
    ];

    export class Animation {
        public frames: Image[]
        public frame: Image //This is an image, the other is a frame counter, they are not one of the same
        public animationState: AnimationState = AnimationState.Playing
        public isAnimation: boolean = true
        protected delayPerFrame: (number[] | number) //How much ticks until the next frame in the animation
        protected currentTick: number = 1
        protected currentFrame: number
        protected loops: number = 0
        protected maxLoops: number
        protected synced: boolean //If all things that use this animation are synced with eachother 

        update(): void {
            if (this.animationState != AnimationState.Playing) {
                return
            }

            if (this.synced) {
                this.currentTick = game.runtime()*30 //Assumes game is running at 60 fps
            } else {
                this.currentTick++
            }
            
            let ticksUntilNextFrame: number
            if (typeof this.delayPerFrame == "number") {
                ticksUntilNextFrame = this.delayPerFrame
            } else {
                ticksUntilNextFrame = this.delayPerFrame[this.currentFrame] || this.delayPerFrame[1]
            }
            if (this.currentTick > ticksUntilNextFrame) {
                this.currentTick = 1
                this.currentFrame++
                if (this.currentFrame > this.frames.length) {
                    this.loops++
                    if (this.loops > this.maxLoops && this.maxLoops != -1) {
                        this.animationState = AnimationState.Stopped
                    }
                }
            }
            this.frame = this.frames[this.currentFrame]
        }

        constructor(frames: Image[] = [], delayPerFrame: (number[] | number) = 10, frame: number = 0, maxLoops: number = -1, synced: boolean = true) {
            this.frames = frames
            this.delayPerFrame = delayPerFrame
            this.currentFrame = frame
            this.maxLoops = -1
            this.synced = synced
         }
    }

    /*

    export function slowRotate(imageToAffect: Image, degrees: number): Image {
        let numberOfTimesToRotate: number = Math.modulo(Math.ceil(degrees / 90), 360)
        function rotateOneTime(imageToAffect: Image): Image {
            let newImage: Image = image.create(imageToAffect.height, imageToAffect.width)
            let referenceImage: Image = imageToAffect.clone()
            referenceImage.flipY()
            for (let x = 0; x < imageToAffect.width; x++) {
                let buffer: Buffer = Buffer.create(imageToAffect.height)
                referenceImage.getRows(x, buffer)
                utilities.setColumns(newImage, x, buffer, 0)
            }
            return newImage
        }
        let finishedImage: Image = imageToAffect.clone()
        for (let rotatedTimes = 0; rotatedTimes < numberOfTimesToRotate; rotatedTimes++) {
            finishedImage = rotateOneTime(finishedImage)
        }
        return finishedImage
    }
    */

    export function stampImageToImage(image: Image, image2: Image, pixelPosition: Vector2, screenPositionRelativeMultiplier: number = 1): void {
        if (!image) {
            return
        }
        if (screenPositionRelativeMultiplier > 0) {
            image2.drawTransparentImage(image, pixelPosition.x * screenPositionRelativeMultiplier - internalScreenPosition.x, pixelPosition.y * screenPositionRelativeMultiplier - internalScreenPosition.y)
        } else {
            image2.drawTransparentImage(image, pixelPosition.x, pixelPosition.y)
        }
    }

    export function processImage(image: Image, colormapPalette: Buffer = null, flipped: number = 0, rotated: number = 0): Image {
        image = image.clone()
        if (rotated > 0 && graphicsMode > 0) {
            image = image.rotated(rotated*90)
        }
    
        switch (flipped) {
            case 1:
                //horizontally
                image.flipX()
                break
            case 2:
                //vertically
                image.flipY()
                break
            case 3:
                //both
                image.flipX()
                image.flipY()
                break
            default:
                break
        }

        if (colormapPalette) {
            image.mapRect(0, 0, image.width, image.height, colormapPalette)
        }
        return image
    }

    function lightShadeTileQuarter(target: Image, pixelPosition: Vector2, shaderBufferIndex: number) {
        let lightShadeBuffer: Buffer = gameAssets.currentColorMapPalettes[lightBuffer.getUint8(shaderBufferIndex)]
        let mapSize: number = lightMappingSizeBuffer.getUint8(shaderBufferIndex)
        if (graphicsMode <= 1) {
            target.mapRect(pixelPosition.x, pixelPosition.y, 4, 4, lightShadeBuffer)
        } else if (graphicsMode <= 2) {
            target.mapRect(pixelPosition.x, pixelPosition.y, mapSize, mapSize, lightShadeBuffer)
        } else if (graphicsMode >= 3) {
            target.mapRect(pixelPosition.x, pixelPosition.y, 4, 4, lightShadeBuffer)
        }
    }

    function lightShadeTileImage(target: Image, tilePosition: Vector2): Image {
        let targetClone: Image = target.clone()
        let lightShaderTilePosition: Vector2 = Vector2Library.add(Vector2Library.multiply(tilePosition, 2), { x: 6, y: 10 })//{ x: tilePosition.x * 2 + 6, y: tilePosition.y * 2 + 10}
        let shaderBufferIndex: number = lightShaderTilePosition.x + lightBufferSize.x * lightShaderTilePosition.y//Index that correlates with the top-left quarter of the tile
        let colorMapPaletteIndex: number = lightBuffer.getUint8(shaderBufferIndex)        
        /*
        console.log(colorMapPaletteIndex)
        console.log(shaderBufferIndex)
        console.log(tilePosition.x)
        console.log(tilePosition.y) 
        */
        lightShadeTileQuarter(targetClone, { x: 0, y: 0 }, shaderBufferIndex)
        shaderBufferIndex++
        lightShadeTileQuarter(targetClone, { x: 4, y: 0 }, shaderBufferIndex)
        shaderBufferIndex += lightBufferSize.x -1 //- Math.floor(game.runtime()/500)
        lightShadeTileQuarter(targetClone, { x: 0, y: 4 }, shaderBufferIndex)
        shaderBufferIndex++
        lightShadeTileQuarter(targetClone, { x: 4, y: 4 }, shaderBufferIndex)

        return targetClone
    }

    function drawTile(layer: number = 0, tilePosition: Vector2, target: Image): void {
        let pixelPosition = customTiles.tilePositionToPixelPosition(tilePosition)

        let tileIdx = customTiles.tilePositionToTileIdx(tilePosition)
        let tile: number[] = customTiles.loadedLevel.tileMap[layer][tileIdx]

        if (!tile) {
            return
        }

        //Skip drawing air tiles 
        if (tile[0] == 1 && tile[1] == 0) {
            return
        }

        let tileVisual: (Animation | Image) = gameAssets.constTileData[tile[0]].tileSheet[tile[1]]
        if (tileVisual instanceof Animation) {
            //rotation flip and pallete are not supported on animations
            tileVisual = tileVisual as Animation
        } else {
            tileVisual = tileVisual as Image
            let colorMapPalette = gameAssets.constTileData[tile[0]].colormapPalette
            let tileString = tile.join(".") + colorMapPalette
            //0.0.0.0.
            if (tileString.slice(tileString.length - 4) != "0.0." && !cachedTiles[tileString]) {
                cachedTiles[tileString] = processImage(tileVisual, null, tile[3], tile[2])
            } else if (cachedTiles[tileString]) {
                tileVisual = cachedTiles[tileString]
            }
        }
        tileVisual = tileVisual as Image
        if (graphicsMode > 0) {
            tileVisual = lightShadeTileImage(tileVisual, tilePosition)
        }
        //target.drawTransparentImage(tileVisual, pixelPosition.x, pixelPosition.y)
        stampImageToImage(tileVisual, target, pixelPosition)
    }

    function drawTiles(layer: number = 0, target: Image) {
        if (customTiles.loadingNewLevel) {
            return 
        }

        let screenPositionTile: Vector2 = customTiles.pixelPositionToTilePosition(internalScreenPosition)
        
        for (let x = screenPositionTile.x; x < tilesPerScreen.x + screenPositionTile.x + 1; x++) {
            for (let y = screenPositionTile.y; y < tilesPerScreen.y + screenPositionTile.y + 1; y++) {
                drawTile(layer, {x: x, y: y}, target)
            }
        }
        //let asdasd = image.ofBuffer(screenBuffer)
    }

    function ditherPixel(pixelPosition: Vector2, threshold: number): boolean {
        return false
        let dithering = Math.floor(Math.modulo(threshold, 65))
        let map = bayerThresholdMap[pixelPosition.x % 8][pixelPosition.y % 8]
        if (map < dithering + 1) {
            return true
        }
        return false
    }

    function updateLightBuffer(): void {
        if (graphicsMode <= 0) {
            return
        }

        lightBuffer.fill(0, 0, lightBuffer.length)
        lightMappingSizeBuffer.fill(255, 0, lightMappingSizeBuffer.length)
        let lightBufferIndex: number = 0
        for (let y = 0; y < lightBufferSize.y; y++) {
            for (let x = 0; x < lightBufferSize.x; x++) {
                let lightShaderTilePosition = {x: x, y: y}
                let lightShaderPixelPosition = { x: lightShaderTilePosition.x * customTiles.tileSizePixelsHalf + lightBufferPosition.x, y: lightShaderTilePosition.y * customTiles.tileSizePixelsHalf + lightBufferPosition.y}
                for (let lightIndex = 0; lightIndex < lightSources.length; lightIndex++) {
                    let light: LightSource = lightSources[lightIndex]
                    let subtracted: Vector2
                    let distance: number = Vector2Library.distance(lightShaderPixelPosition, light.pixelPosition)
                    if (distance < light.radiusPixels) {
                        if (graphicsMode > 0) {
                            if (distance < light.radiusPixels * 0.65) {
                                lightBuffer.setUint8(lightBufferIndex, light.colorMapPalette[0])
                            } else {
                                lightBuffer.setUint8(lightBufferIndex, light.colorMapPalette[1])
                            }
                            if (graphicsMode >= 2) {
                                lightMappingSizeBuffer.setUint8(lightIndex, Math.floor((distance / light.radiusPixels) * 255))
                            }
                        }
                        /*
                        if (!ditherPixel(lightShaderTilePosition, Math.floor((Math.clamp(1, light.radiusPixels / 2, distance) * 2 / light.radiusPixels) * 64))) {
                            //lightBuffer.setUint8(lightBufferIndex, light.colorMapPalette[0])
                        } else if (distance < light.radiusPixels/2) {
                            lightBuffer.setUint8(lightBufferIndex, light.colorMapPalette[1])
                        } else
                        */

                        //console.log(distance)
                        //console.log(lightShaderPixelPosition.toString())
                    }
                }
                lightBufferIndex++
            }
        }
    }

    //Background renderer
    scene.createRenderable(0, (currentScreen: Image, camera: scene.Camera) => {
        screenPosition = Vector2Library.add(screenPosition, { x: controller.dx(), y: controller.dy()})
        internalScreenPosition = Vector2Library.round(screenPosition)
        screenPositionDifference = Vector2Library.subtract(internalScreenPosition, internalOldScreenPosition)
        internalOldScreenPosition = Vector2Library.clone(screenPosition)
    })

    //lightShadeTileImage(null, new Vector2(2, 2))

    //Tile background renderer 
    scene.createRenderable(1, (target: Image, camera: scene.Camera) => {
        drawTiles(0, target)
    })

    //Entity renderer
    scene.createRenderable(2, (target: Image, camera: scene.Camera) => {

    })

    //Tile foreground renderer
    scene.createRenderable(3, (target: Image, camera: scene.Camera) => {
        //drawTiles(0)
    })

    //Foreground renderer
    scene.createRenderable(4, (target: Image, camera: scene.Camera) => {

    })

    updateLightBuffer()
}