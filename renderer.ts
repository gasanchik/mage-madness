namespace renderer {
    export enum AnimationState {
        Playing,
        Paused,
        Stopped
    } 
    
    export type LightSource = {
        pixelPosition: Vector2,
        radiusPixels: number, 
        colorMapPalette: Buffer[],
    }

    export let screenPosition: Vector2 = new Vector2(0, 0)
    let internalOldScreenPosition: Vector2 = new Vector2(0, 0)
    let internalScreenPosition: Vector2 = new Vector2(0, 0)
    export let screenPositionDifference: Vector2 = new Vector2(0, 0)
    export const screenSize: Vector2 = new Vector2(160, 120)
    export const tilesPerScreen: Vector2 = screenSize.divide(customTiles.tileSizePixels, true).round(1)

    let cachedTiles: {[key: string]: Image} = {}
    let lightSources: LightSource[] = [{
        pixelPosition: new Vector2(80, 60),
        radiusPixels: 30,
        colorMapPalette: [utilities.getBufferFromImageY(1, gameAssets.levels[0].colorMapPaletteImage), utilities.getBufferFromImageY(2, gameAssets.levels[0].colorMapPaletteImage)]
    }]
    //40, 30
    let lightBufferSize: Vector2 = new Vector2(52, 50) //40, 30 //20, 15, //26, 25 
    let lightBuffer: Buffer = Buffer.create(lightBufferSize.x * lightBufferSize.y)
    let lightBufferPosition: Vector2 = new Vector2(-24, -40) //In pixel position
    //lightBuffer.setUint8(321, 3)
    //lightBuffer.setUint8(372, 3)
    //lightBuffer.setUint8(373, 3)
    //lightBuffer.fill(1, 0, 500)

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
                this.currentTick += 1
            }
            
            let ticksUntilNextFrame: number
            if (typeof this.delayPerFrame == "number") {
                ticksUntilNextFrame = this.delayPerFrame
            } else {
                ticksUntilNextFrame = this.delayPerFrame[this.currentFrame] || this.delayPerFrame[1]
            }
            if (this.currentTick > ticksUntilNextFrame) {
                this.currentTick = 1
                this.currentFrame += 1
                if (this.currentFrame > this.frames.length) {
                    this.loops += 1
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
    //I fucking hate this piece of shit "hardware" 
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
        if (rotated > 0 && !hardwareMode) {
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

    function lightShadeTileImage(image: Image, tilePosition: Vector2): Image {
        let shadedImage: Image = image.clone()
        let lightShaderTilePosition: Vector2 = tilePosition.multiply(2, true)
        lightShaderTilePosition.add(lightBufferPosition)
        let shaderBufferIndex: number = lightShaderTilePosition.x + lightBufferSize.x * lightShaderTilePosition.y//Index that correlates with the top-left quarter of the tile
        let colorMapPaletteIndex: number = lightBuffer.getUint8(shaderBufferIndex)

        /*
        console.log(colorMapPaletteIndex)
        console.log(shaderBufferIndex)
        console.log(tilePosition.x)
        console.log(tilePosition.y) 
        */

        if (colorMapPaletteIndex > 0) {
            //shadedImage.fillRect(0, 0, 4, 4, 2)
            shadedImage.mapRect(0, 0, 4, 4, gameAssets.currentColorMapPalettes[colorMapPaletteIndex])
        }

        shaderBufferIndex += 1
        colorMapPaletteIndex = lightBuffer.getUint8(shaderBufferIndex)
        if (colorMapPaletteIndex > 0) {
            //shadedImage.fillRect(4, 0, 4, 4, 3)
            shadedImage.mapRect(4, 0, 4, 4, gameAssets.currentColorMapPalettes[colorMapPaletteIndex])
        }

        shaderBufferIndex += lightBufferSize.x
        colorMapPaletteIndex = lightBuffer.getUint8(shaderBufferIndex)
        if (colorMapPaletteIndex > 0) {
            //shadedImage.fillRect(0, 4, 4, 4, 4)
            shadedImage.mapRect(0, 4, 4, 4, gameAssets.currentColorMapPalettes[colorMapPaletteIndex])
        }

        shaderBufferIndex += 1
        colorMapPaletteIndex = lightBuffer.getUint8(shaderBufferIndex)
        if (colorMapPaletteIndex > 0) {
            //shadedImage.fillRect(4, 4, 4, 4, 5)
            shadedImage.mapRect(4, 4, 4, 4, gameAssets.currentColorMapPalettes[colorMapPaletteIndex])
        }

        return shadedImage
    }

    function drawTile(layer: number = 0, tilePosition: Vector2): void {
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
        tileVisual = lightShadeTileImage(tileVisual, tilePosition)
        stampImageToImage(tileVisual, screen, pixelPosition)
    }

    
    function drawTiles(layer: number = 0) {
        if (customTiles.loadingNewLevel) {
            return 
        }

        let screenPositionTile: Vector2 = customTiles.pixelPositionToTilePosition(internalScreenPosition)
        for (let x = screenPositionTile.x; x < tilesPerScreen.x + screenPositionTile.x + 1; x++) {
            for (let y = screenPositionTile.y; y < tilesPerScreen.y + screenPositionTile.y + 1; y++) {
                drawTile(layer, new Vector2(x, y))
            }
        }
        //let asdasd = image.ofBuffer(screenBuffer)
    }

    function updateLightBuffer(): void {
        for (let x = 0; x < lightBufferSize.x; x++) {
            for (let y = 0; y < lightBufferSize.y; y++) {
                let lightShaderTilePosition = new Vector2(x, y)
                let lightShaderPixelPosition = lightShaderTilePosition.multiply(customTiles.tileSizePixels/2, true)
                lightShaderPixelPosition.add(lightBufferPosition)
                console.log(lightShaderPixelPosition.magnitude())
                let distance: number //**TODO**
            }
        }
    }

    //Background renderer
    scene.createRenderable(0, (currentScreen: Image, camera: scene.Camera) => {
        screenPosition.add(new Vector2(controller.dx(), controller.dy()))
        internalScreenPosition = screenPosition.round()
        screenPositionDifference = internalScreenPosition.subtract(internalOldScreenPosition, true)
        internalOldScreenPosition = internalScreenPosition.clone()
    })

    //lightShadeTileImage(null, new Vector2(2, 2))

    //Tile background renderer 
    scene.createRenderable(1, (currentScreen: Image, camera: scene.Camera) => {
        drawTiles(0)
    })

    //Entity renderer
    scene.createRenderable(2, (currentScreen: Image, camera: scene.Camera) => {

    })

    //Tile foreground renderer
    scene.createRenderable(3, (currentScreen: Image, camera: scene.Camera) => {
        //drawTiles(0)
    })

    //Foreground renderer
    scene.createRenderable(4, (currentScreen: Image, camera: scene.Camera) => {

    })

    updateLightBuffer()
}