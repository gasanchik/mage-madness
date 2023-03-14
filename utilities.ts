namespace Math {
    export function modulo(x: number, y: number): number {
        return (x % y) % y;
    }
}

namespace utilities {
    function numberToHex(n: number) {
        let hex: string[] = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "F", "G"]
        return hex[Math.clamp(1, 16, n)]
    }

    export function getBufferFromImageY(y: number, image: Image): Buffer {
        let bufferString: string = "";
        for (let i = 0; i < 16; i++) {
            bufferString = bufferString + "0" + numberToHex(image.getPixel(i, y))
        }
        return Buffer.fromHex(bufferString)
    }

    export function isObjectOnScreen(position: Vector2, size: Vector2,
        marginPixels: number = 0 //Margin of error where it still outputs true
    ): boolean {
        if (renderer.screenPosition.x - marginPixels - size.x > position.x) {
            return false
        }
        if (renderer.screenPosition.x + renderer.screenSize.x + marginPixels + size.x < position.x) {
            return false
        }
        if (renderer.screenPosition.y - marginPixels - size.y > position.y) {
            return false
        }
        if (renderer.screenPosition.y + renderer.screenSize.y + marginPixels + size.y < position.y) {
            return false
        }
        return true
    }
    
    export function getColumns(img: Image, y: number, dst: Buffer): void {
        let sp = 0
        let w = img.width
        let h = img.height
        if (y >= h || y < 0) {
            return
        }

        dst.setUint8(1, img.getPixel(0, y))
        let n = Math.min(dst.length, (w - y) * h)
        //uint8_t * dp = dst.data;
        //let n = min(dst.length, (w - x) * h) >> 1;

        while (n--) {
            dst.setUint8(sp, img.getPixel(sp, y))
            sp++;
        }
        return
    }

    export function setColumns(img: Image, y: number, src: Buffer, offset: number): void {
        let sp = 0
        offset = offset || 0
        let w = img.width
        let h = img.height
        if (y >= h || y < 0) {
            return
        }

        let n = Math.min(src.length, (w - y) * h)
        //uint8_t * dp = dst.data;
        //let n = min(dst.length, (w - x) * h) >> 1;

        while (n--) {
            img.setPixel(Math.modulo((sp + offset), screen.width), y, src[sp])
            sp++;
        }
        return
    }
}