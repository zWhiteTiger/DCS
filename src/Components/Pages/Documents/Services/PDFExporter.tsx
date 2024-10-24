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
    updated_at: Date;
}

type Props = {
    docsPath: string;
    docId: string;
}

export default function PDFExporter({ docsPath, docId }: Props) {
    const [cards, setCards] = useState<CardData[]>([]);

    useEffect(() => {
        const fetchCards = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_URL}/approval/${docId}`);
                const data = await response.json();
                console.log(data); // Check the fetched data
                setCards(data);
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
            const fontUrl = '/fonts/Prompt-Regular.ttf';
            const fontBytes = await fetch(fontUrl).then((res) => res.arrayBuffer());
            const promptFont = await pdfDoc.embedFont(fontBytes);

            for (const card of cards) {
                console.log(`Processing card: ${card._id}`);
                const page = pdfDoc.getPage(card.page - 1);
                const pageWidth = page.getWidth();
                const pageHeight = page.getHeight();

                const pngUrl = `${import.meta.env.VITE_URL}/signature/${card.signature}`;
                const signatureImage = card.isApproved === "Approved" && card.signature ?
                    await fetch(pngUrl).then(res => res.arrayBuffer()) : null;

                if (signatureImage) {
                    const signatureImg = await pdfDoc.embedPng(signatureImage);
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

                    console.log(adjustedX, adjustedY);

                    page.drawImage(signatureImg, {
                        x: adjustedX + 60,
                        y: adjustedY - 40,
                        width: originalSignatureWidth,
                        height: originalSignatureHeight,
                    });
                } else if (card.isApproved === "Reject") {
                    const centerX = (pageWidth - 100) / 2; // Centering "Reject"
                    const centerY = (pageHeight - 50) / 2;

                    // Draw "Reject" text in the center of the card
                    page.drawText('Reject', {
                        x: centerX + 10,
                        y: centerY + 50,
                        size: 12,
                        font: promptFont,
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
