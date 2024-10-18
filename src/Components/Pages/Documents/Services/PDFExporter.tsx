import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

interface CardData {
    _id: string
    email: string
    firstName: string
    lastName: string
    position: { x: number; y: number }[]
    page: number
    isApproved: string // Approval status
    signaturePath?: string // Signature path if approved
}

type Props = {
    filename: string;
    docId: string;
}

export default function PDFExporter({ filename, docId }: Props) {
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
            const pdfResponse = await fetch(`${import.meta.env.VITE_URL}/pdf/${filename}`);
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
                const centerX = pageWidth / 2 - 100;
                const centerY = pageHeight / 2 - 50;

                // Draw the card rectangle
                page.drawRectangle({
                    x: centerX,
                    y: centerY,
                    width: 200,
                    height: 100,
                    color: rgb(0.9, 0.9, 0.9),
                    borderColor: rgb(0, 0, 0),
                    borderWidth: 1,
                });

                // Draw user name in the card
                page.drawText(`${card.firstName} ${card.lastName}`, {
                    x: centerX + 10,
                    y: centerY + 70,
                    size: 12,
                    font: promptFont,
                    color: rgb(0, 0, 0),
                });

                if (card.isApproved === "Reject") {
                    // Draw "Reject" text in the center of the card
                    page.drawText('Reject', {
                        x: centerX + 10,
                        y: centerY + 50,
                        size: 12,
                        font: promptFont,
                        color: rgb(1, 0, 0),
                    });
                } else if (card.isApproved === "Approved" && card.signaturePath) {
                    // Load and embed the signature image if approved
                    const signatureResponse = await fetch(card.signaturePath);
                    const signatureBytes = await signatureResponse.arrayBuffer();
                    const signatureImage = await pdfDoc.embedPng(signatureBytes); // Use embedJpg if it's a JPEG

                    // Draw the signature image on the card
                    const signatureWidth = 100; // Adjust size as needed
                    const signatureHeight = 40; // Adjust size as needed
                    page.drawImage(signatureImage, {
                        x: centerX + 10,
                        y: centerY + 10, // Adjust y position as needed
                        width: signatureWidth,
                        height: signatureHeight,
                    });
                }
            }

            const modifiedPdfBytes = await pdfDoc.save();
            const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${filename}_with_cards.pdf`;
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
