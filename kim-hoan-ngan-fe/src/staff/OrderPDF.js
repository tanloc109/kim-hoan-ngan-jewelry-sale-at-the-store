import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#E4E4E4',
        padding: 20,
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
    },
    header: {
        fontSize: 18,
        marginBottom: 10,
        textAlign: 'center',
    },
    table: {
        display: "table",
        width: "auto",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: '#000',
        marginBottom: 10,
        marginTop: 10,
    },
    tableRow: {
        flexDirection: "row",
    },
    tableCol: {
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: '#000',
        padding: 5,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tableCell: {
        fontSize: 10,
    },
    tableHeader: {
        backgroundColor: '#f2f2f2',
        fontWeight: 'bold',
    },
    tableCellHeader: {
        textAlign: 'center',
        padding: 10,
    },
});

const OrderPDF = () => {
    const order = {
        orderCode: 'ORD12345',
        seller: {
            name: 'Seller Company',
            address: '123 Seller Street, City, Country',
            email: 'seller@example.com',
            phone: '123-456-7890',
            taxCode: 'TAX123456',
        },
        buyer: {
            name: 'Buyer Name',
            address: '456 Buyer Avenue, City, Country',
            email: 'buyer@example.com',
            phone: '098-765-4321',
        },
        products: [
            { id: 'P001', name: 'Product 1', goldType: 'Type A', weight: '10g', laborCost: '$5.00', stoneCost: '$2.00', quantity: 2, totalPrice: '$24.00' },
            { id: 'P002', name: 'Product 2', goldType: 'Type B', weight: '20g', laborCost: '$7.00', stoneCost: '$3.00', quantity: 1, totalPrice: '$30.00' },
            { id: 'P003', name: 'Product 3', goldType: 'Type C', weight: '15g', laborCost: '$6.00', stoneCost: '$1.00', quantity: 3, totalPrice: '$48.00' },
        ],
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text style={styles.header}>HÓA ĐƠN BÁN HÀNG</Text>
                    <Text>(Bản thể hiện của hóa đơn điện tử)</Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.header}>THÔNG TIN CỬA HÀNG</Text>
                    <Text>Đơn vị bán hàng: {order.seller.name}</Text>
                    <Text>Mã số thuế: {order.seller.taxCode}</Text>
                    <Text>Địa chỉ: {order.seller.address}</Text>
                    <Text>Email: {order.seller.email}</Text>
                    <Text>Số điện thoại: {order.seller.phone}</Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.header}>THÔNG TIN KHÁCH HÀNG</Text>
                    <Text>Khách hàng: {order.buyer.name}</Text>
                    <Text>Địa chỉ: {order.buyer.address}</Text>
                    <Text>Email: {order.buyer.email}</Text>
                    <Text>Số điện thoại: {order.buyer.phone}</Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.header}>DANH SÁCH SẢN PHẨM</Text>
                    <View style={styles.table}>
                        <View style={[styles.tableRow, styles.tableHeader]}>
                            <View style={styles.tableCol}><Text style={[styles.tableCell, styles.tableCellHeader]}>STT</Text></View>
                            <View style={styles.tableCol}><Text style={[styles.tableCell, styles.tableCellHeader]}>Mã SP</Text></View>
                            <View style={styles.tableCol}><Text style={[styles.tableCell, styles.tableCellHeader]}>Tên SP</Text></View>
                            <View style={styles.tableCol}><Text style={[styles.tableCell, styles.tableCellHeader]}>Loại Vàng</Text></View>
                            <View style={styles.tableCol}><Text style={[styles.tableCell, styles.tableCellHeader]}>Trọng Lượng</Text></View>
                            <View style={styles.tableCol}><Text style={[styles.tableCell, styles.tableCellHeader]}>Tiền Công</Text></View>
                            <View style={styles.tableCol}><Text style={[styles.tableCell, styles.tableCellHeader]}>Tiền Đá</Text></View>
                            <View style={styles.tableCol}><Text style={[styles.tableCell, styles.tableCellHeader]}>Số Lượng</Text></View>
                            <View style={styles.tableCol}><Text style={[styles.tableCell, styles.tableCellHeader]}>Thành Tiền</Text></View>
                        </View>
                        {order.products.map((product, index) => (
                            <View style={styles.tableRow} key={index}>
                                <View style={styles.tableCol}><Text style={styles.tableCell}>{index + 1}</Text></View>
                                <View style={styles.tableCol}><Text style={styles.tableCell}>{product.id}</Text></View>
                                <View style={styles.tableCol}><Text style={styles.tableCell}>{product.name}</Text></View>
                                <View style={styles.tableCol}><Text style={styles.tableCell}>{product.goldType}</Text></View>
                                <View style={styles.tableCol}><Text style={styles.tableCell}>{product.weight}</Text></View>
                                <View style={styles.tableCol}><Text style={styles.tableCell}>{product.laborCost}</Text></View>
                                <View style={styles.tableCol}><Text style={styles.tableCell}>{product.stoneCost}</Text></View>
                                <View style={styles.tableCol}><Text style={styles.tableCell}>{product.quantity}</Text></View>
                                <View style={styles.tableCol}><Text style={styles.tableCell}>{product.totalPrice}</Text></View>
                            </View>
                        ))}
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default OrderPDF;
