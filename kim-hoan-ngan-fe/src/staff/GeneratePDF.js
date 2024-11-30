import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import OrderPDF from './OrderPDF';

const GeneratePDF = ({ order }) => (
    <PDFDownloadLink
        document={<OrderPDF order={order} />}
        fileName={`${order?.orderCode || "a"}.pdf`}
    >
        {({ blob, url, loading, error }) =>
            loading ? 'Loading document...' : 'Download PDF'
        }
    </PDFDownloadLink>
);

export default GeneratePDF;
