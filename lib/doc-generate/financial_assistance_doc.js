const PDFLib = require('pdf-lib');
const fontkit = require('@pdf-lib/fontkit');
const fs = require('fs')
const path = require('path')

const fontBytesUbuntuR = fs.readFileSync(path.join(__dirname, 'assets', 'PublicaSans-Light.otf'));
const fontBytesUbuntuR2 = fs.readFileSync(path.join(__dirname, 'assets', 'times new roman.ttf'));
const fontBytesUbuntuB = fs.readFileSync(path.join(__dirname, 'assets', 'Ubuntu-Bold.ttf'));
const fontBytesUbuntuB2 = fs.readFileSync(path.join(__dirname, 'assets', 'times new roman bold.ttf'));

module.exports = () => {
    return Object.freeze({
        genDocs: async (details = {}) => {
            try {
                // pdf edit
                const mouDoc = fs.readFileSync(path.join(__dirname, 'assets', 'template.pdf'));

                const pdfDoc = await PDFLib.PDFDocument.load(mouDoc);

                pdfDoc.registerFontkit(fontkit);

                // Embed our custom font in the document
                const customFontR = await pdfDoc.embedFont(fontBytesUbuntuR);
                const customFontR2 = await pdfDoc.embedFont(fontBytesUbuntuR2);
                const customFontB = await pdfDoc.embedFont(fontBytesUbuntuB);
                const customFontB2 = await pdfDoc.embedFont(fontBytesUbuntuB2);

                const pages = pdfDoc.getPages();
                let firstPage = pages[0];
                const { width, height } = firstPage.getSize();

                let cursor = 672;

                firstPage.drawText("Ref. No. KAHER-/2022-23/D-", {
                    x: 50,
                    y: cursor,
                    size: 11,
                    font: customFontR,
                    color: PDFLib.rgb(0.19, 0.19, 0.19)
                });

                firstPage.drawText(details.approved_date || "", {
                    x: 400,
                    y: cursor,
                    size: 11,
                    font: customFontR,
                    color: PDFLib.rgb(0.19, 0.19, 0.19)
                });

                cursor -= 65
                firstPage.drawText("O R D E R", {
                    x: 250,
                    y: cursor,
                    size: 16,
                    font: customFontB,
                    color: PDFLib.rgb(0.19, 0.19, 0.19)
                });

                cursor -= 30
                firstPage.drawText("Sub   : ", {
                    x: 100,
                    y: cursor,
                    size: 12,
                    font: customFontR2,
                    color: PDFLib.rgb(0.19, 0.19, 0.19)
                });

                firstPage.drawText("Permission to participate in the Conference.", {
                    x: 150,
                    y: cursor,
                    size: 12,
                    font: customFontB2,
                    color: PDFLib.rgb(0.19, 0.19, 0.19)
                });

                cursor -= 17
                firstPage.drawText("Ref   : ", {
                    x: 100,
                    y: cursor,
                    size: 12,
                    font: customFontR2,
                    color: PDFLib.rgb(0.19, 0.19, 0.19)
                });

                let ref_text = `Request letter of the applicant forwarded through the concerned principal and HoD ${details.college || ""}.`;
                let ref_text_array = fillParagraph({ text: ref_text, font: customFontR2, fontSize: 12, maxWidth: 380 });

                for (let i = 0; i < ref_text_array.length; i++) {
                    firstPage.drawText(ref_text_array[i], {
                        x: 150,
                        y: cursor,
                        size: 12,
                        font: customFontR2,
                        color: PDFLib.rgb(0.19, 0.19, 0.19)
                    });
                    cursor = cursor - (customFontR2.heightAtSize(10) + 5);
                }

                let paragraph_1 = `          With reference to the above, the request of ${details.fullName || "User"}, ${details.designation ? details.designation + "," : ""} ${details.department ? details.department + "," : ""} ${details.college || ""}. For attending ${details.event_title || "Event"} to be held ${details.event_place || ""} from ${details.duration ? details.duration + "," : ""} has been approved by the competent authority of the University.`;
                let paragraph_1_array = fillParagraph({ text: paragraph_1, font: customFontR2, fontSize: 12, maxWidth: 500 });

                cursor -= 20
                for (let i = 0; i < paragraph_1_array.length; i++) {
                    firstPage.drawText(paragraph_1_array[i], {
                        x: 65,
                        y: cursor,
                        size: 12,
                        font: customFontR2,
                        color: PDFLib.rgb(0.19, 0.19, 0.19)
                    });
                    cursor = cursor - (customFontR2.heightAtSize(12) + 10);
                }

                let paragraph_2 = "          The KAHER shall consider the release of financial grant only after submission of the attendance certificate, Photograph and original bills/ vouchers as per university rules.";
                let paragraph_2_array = fillParagraph({ text: paragraph_2, font: customFontR2, fontSize: 12, maxWidth: 500 });

                for (let i = 0; i < paragraph_2_array.length; i++) {
                    firstPage.drawText(paragraph_2_array[i], {
                        x: 65,
                        y: cursor,
                        size: 12,
                        font: customFontR2,
                        color: PDFLib.rgb(0.19, 0.19, 0.19)
                    });
                    cursor = cursor - (customFontR2.heightAtSize(12) + 10);
                }


                cursor -= 35;
                firstPage.drawText("Prof. Dr. V.A. Kothiwale", {
                    x: 370,
                    y: cursor,
                    size: 12,
                    font: customFontB,
                    color: PDFLib.rgb(0.19, 0.19, 0.19)
                });

                cursor = cursor - (customFontR.heightAtSize(12) + 10);
                firstPage.drawText("Registrar", {
                    x: 410,
                    y: cursor,
                    size: 12,
                    font: customFontB,
                    color: PDFLib.rgb(0.19, 0.19, 0.19)
                });

                cursor -= 35;
                firstPage.drawText("To,", {
                    x: 65,
                    y: cursor,
                    size: 12,
                    font: customFontR,
                    color: PDFLib.rgb(0.19, 0.19, 0.19)
                });
                cursor = cursor - (customFontR.heightAtSize(12) + 5);
                firstPage.drawText("The above staff member.", {
                    x: 65,
                    y: cursor,
                    size: 12,
                    font: customFontR,
                    color: PDFLib.rgb(0.19, 0.19, 0.19)
                });
                cursor -= 35;
                firstPage.drawText("CC to:", {
                    x: 65,
                    y: cursor,
                    size: 12,
                    font: customFontR,
                    color: PDFLib.rgb(0.19, 0.19, 0.19)
                });

                cursor = cursor - (customFontR.heightAtSize(12) + 5);
                firstPage.drawText("1. The PA to Hon. Chancellor, KAHER, Belagavi.", {
                    x: 85,
                    y: cursor,
                    size: 12,
                    font: customFontR,
                    color: PDFLib.rgb(0.19, 0.19, 0.19)
                });

                cursor = cursor - (customFontR.heightAtSize(12) + 5);
                firstPage.drawText("2. The Special Officer to Hon. Vice-Chancellor, KAHER, Belagavi.", {
                    x: 85,
                    y: cursor,
                    size: 12,
                    font: customFontR,
                    color: PDFLib.rgb(0.19, 0.19, 0.19)
                });

                cursor = cursor - (customFontR.heightAtSize(12) + 5);
                firstPage.drawText("3. The Principal, J N Medical College, Belagavi.", {
                    x: 85,
                    y: cursor,
                    size: 12,
                    font: customFontR,
                    color: PDFLib.rgb(0.19, 0.19, 0.19)
                });

                cursor = cursor - (customFontR.heightAtSize(12) + 5);
                firstPage.drawText("4. The Finance Officer, KAHER, Belagavi.", {
                    x: 85,
                    y: cursor,
                    size: 12,
                    font: customFontR,
                    color: PDFLib.rgb(0.19, 0.19, 0.19)
                });

                // save to file
                const pdfBytes = await pdfDoc.save();

                // fs.writeFile('./create.pdf', pdfBytes, (err) => {
                //     if (err) {
                //         return console.log("Failed to  save file")
                //     } else {
                //         console.log("File saved");
                //     }
                // });
                return { buffer: Buffer.from(pdfBytes) };
            } catch (error) {
                console.log("error........", error);
            }
        }
    })
}

function fillParagraph({ text, font, fontSize, maxWidth }) {
    let paragraph = [];
    if (font.widthOfTextAtSize(text, fontSize) > maxWidth) {
        let words = text.split(' ');
        let newParagraph = [];
        let i = 0;
        newParagraph[i] = [];
        for (let k = 0; k < words.length; k++) {
            let word = words[k];
            newParagraph[i].push(word);
            if (font.widthOfTextAtSize(newParagraph[i].join(' '), fontSize) > maxWidth) {
                newParagraph[i].splice(-1);
                i = i + 1;
                newParagraph[i] = [];
                newParagraph[i].push(word);
            }
        }
        paragraph = newParagraph.map(p => p.join(' '));
    }
    return paragraph;
}


