export default function formatDateTime(date) {
    return new Date(date).toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' });
}