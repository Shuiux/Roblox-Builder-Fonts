import { createWriteStream } from 'fs';
import { Readable } from 'stream';

const downloadFonts = [
    "16658221428", // Builder Sans
    "16658237174", // Builder Extended
    "16658246179" // Builder Mono
]

downloadFonts.forEach(async (fontId) => {
    const { locations: [{ location: fontUrl }] } = await (await fetch(`https://assetdelivery.roblox.com/v2/assetId/${fontId}`)).json();
    if (!fontUrl) return;

    let { name: fontName, faces: fontFaces } = await (await fetch(fontUrl)).json();
    fontName = fontName.replaceAll(" ", "");

    if (!fontFaces || fontFaces.length < 1) return;

    fontFaces.forEach(async (fontFace) => {
        let { name: faceName, weight, assetId } = fontFace;
        faceName = faceName.replaceAll(" ", "");
        const faceId = assetId.replace("rbxassetid://", "");

        console.log(fontName, faceName, weight, faceId);

        if (!assetId.startsWith("rbxassetid://")) return;

        const { locations: [{ location: faceUrl }] } = await (await fetch(`https://assetdelivery.roblox.com/v2/assetId/${faceId}`)).json();
        if (!faceUrl) return;

        const fileName = [fontName, faceName, weight].join("-");
        Readable.fromWeb((await fetch(faceUrl)).body).pipe(createWriteStream(`./fonts/${fontName}/${fileName}.otf`));
    });
});