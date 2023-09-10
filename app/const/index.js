import { formatPrice } from "../utils";

export const API_GET_TOKEN_FLASH_SALE = '/api/api/v4/flash_sale/get_all_sessions'

export const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (data, row) => {
            return <a href={`https://shopee.vn/${data}-i.${row.shopid}.${row.itemid}`} target="_blank">{data}</a>
        }
    },
    {
        title: 'Discount',
        dataIndex: 'discount',
        key: 'discount',
    },
    {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
        render: (data) => {
            return <span>{formatPrice(data)}</span>
        }
    },
    {
        title: 'Price Before Discount',
        key: 'price_before_discount',
        dataIndex: 'price_before_discount',
        render: (data) => {
            return <span>{formatPrice(data)}</span>
        }
    },
];