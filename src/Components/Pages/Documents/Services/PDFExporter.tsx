import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

interface CardData {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    position: { x: number; y: number }[]; // Assuming multiple positions can be specified
    page: number;
    isApproved: string; // Approval status
    signature?: string; // Signature path if approved
    update_at: Date; // Change to string to parse later
}

type Props = {
    docsPath: string;
    docId: string;
}

const monthNamesTh = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    };

    const dateString = new Intl.DateTimeFormat('th-TH', options).format(date);
    const [day, month, year] = dateString.split('/');

    // Convert month to Thai name
    const monthInThai = monthNamesTh[parseInt(month, 10) - 1];

    return `${day}/${monthInThai}/${year}`;
};

export default function PDFExporter({ docsPath, docId }: Props) {
    const [cards, setCards] = useState<CardData[]>([]);

    useEffect(() => {
        const fetchCards = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_URL}/approval/${docId}`);
                const data = await response.json();
                console.log(data); // Check the fetched data

                // Parse update_at to Date object
                const parsedData = data.map((card: CardData) => ({
                    ...card,
                    update_at: new Date(card.update_at) // Parse the date here
                }));

                setCards(parsedData);
            } catch (error) {
                console.error('Error fetching card data:', error);
            }
        };

        fetchCards();
    }, [docId]);

    const handleDownload = async () => {
        try {
            const pdfResponse = await fetch(`${import.meta.env.VITE_URL}/pdf/${docsPath}`);
            const pdfBytes = await pdfResponse.arrayBuffer();
            const pdfDoc = await PDFDocument.load(pdfBytes);
            pdfDoc.registerFontkit(fontkit);
            const fontUrl = '/fonts/Sarabun-Light.ttf';
            const fontBytes = await fetch(fontUrl).then((res) => res.arrayBuffer());
            const sarabunFont = await pdfDoc.embedFont(fontBytes);

            for (const card of cards) {
                console.log(`Processing card: ${card._id}`);
                const page = pdfDoc.getPage(card.page - 1);
                const pageHeight = page.getHeight();

                const pngUrl = `${import.meta.env.VITE_URL}/signature/${card.signature}`;
                const signatureImage = card.isApproved === "Approved" && card.signature ?
                    await fetch(pngUrl).then(res => res.arrayBuffer()) : null;

                if (signatureImage) {
                    const signatureImg = await pdfDoc.embedPng(signatureImage);
                    const originalSignatureWidth = 100; // Original size before scaling
                    const originalSignatureHeight = 50; // Original size before scaling

                    // Scale down to 0.5
                    const signatureWidth = originalSignatureWidth * 0.4;
                    const signatureHeight = originalSignatureHeight * 0.4;

                    // Adjust x and y coordinates (scale down position by 0.5)
                    const position = card.position[0]; // Use the first position for simplicity
                    const scaledX = position.x * 0.5; // Scale the x position
                    const scaledY = position.y * 0.5418; // Scale the y position

                    const adjustedX = scaledX - signatureWidth / 2; // Center the image horizontally
                    const adjustedY = pageHeight - scaledY - signatureHeight; // Invert y-coordinate
                    const textHeight = 14; // Approximate height for the text
                    const textWidth = sarabunFont.widthOfTextAtSize(formatDate(card.update_at), 10);

                    console.log(adjustedX, adjustedY);

                    page.drawImage(signatureImg, {
                        x: adjustedX + 60,
                        y: adjustedY - 40,
                        width: originalSignatureWidth,
                        height: originalSignatureHeight,
                    });

                    // Use the formatDate function to display the date in Thai format
                    page.drawRectangle({
                        x: adjustedX + 73, // Adjust the position a bit for padding
                        y: adjustedY - 100 - textHeight + signatureHeight, // Adjust the y position for padding
                        width: textWidth + 10, // Width of the rectangle
                        height: textHeight + 3, // Height of the rectangle
                        color: rgb(1, 1, 1), // White color
                    });

                    // Draw the text on top of the rectangle
                    page.drawText(formatDate(card.update_at), {
                        x: adjustedX + 73,
                        y: adjustedY - 110 + signatureHeight,
                        size: 10,
                        font: sarabunFont,
                        color: rgb(0, 0, 0), // Text color
                    });
                } else if (card.isApproved === "Reject") {
                    const originalSignatureWidth = 100; // Original size before scaling
                    const originalSignatureHeight = 50; // Original size before scaling

                    // Scale down to 0.5
                    const signatureWidth = originalSignatureWidth * 0.5;
                    const signatureHeight = originalSignatureHeight * 0.5;

                    // Adjust x and y coordinates (scale down position by 0.5)
                    const position = card.position[0]; // Use the first position for simplicity
                    const scaledX = position.x * 0.5; // Scale the x position
                    const scaledY = position.y * 0.535; // Scale the y position

                    const adjustedX = scaledX - signatureWidth / 2; // Center the image horizontally
                    const adjustedY = pageHeight - scaledY - signatureHeight; // Invert y-coordinate

                    // Draw "Reject" text in the center of the card
                    page.drawText('ปฏิเสธการลงนาม', {
                        x: adjustedX + 60,
                        y: adjustedY - 40,
                        size: 12,
                        font: sarabunFont,
                        color: rgb(1, 0, 0),
                    });
                }
            }

            const modifiedPdfBytes = await pdfDoc.save();
            const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${docsPath}_with_cards.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error exporting PDF:', error);
        }
    };

    return (
        <div>
            <Button type="primary" onClick={handleDownload}>
                Download
            </Button>
        </div>
    );
}
