"use client"

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import moment from 'moment';

const useFetching = () => {
    const [listTimeFlashSale, setListTimeFlashSale] = useState([])
    const [listProductId, setListProductId] = useState([])
    const [listProduct, setListProduct] = useState([])
    const [loading, setLoading] = useState(true)

    const getListProductId = useCallback(() => {
        if (!listTimeFlashSale || listTimeFlashSale.length === 0) return

        const timeFlashSale = listTimeFlashSale.find((tfs) => {
            const start = moment.unix(tfs.startTime)
            const end = moment.unix(tfs.endTime)
            const cur = moment()

            return cur.isBetween(start, end, 'millisecond', [])
        })

        axios.get('/api/api/v4/flash_sale/get_all_itemids', {
            params: {
                need_personalize: true,
                order_mode: 2,
                promotionid: timeFlashSale.promotionid,
                sort_soldout: true
            },
        })
            .then(response => {
                setListProductId(response?.data?.data?.item_brief_list.map((el) => el.itemid))
            });

    }, [listTimeFlashSale])

    const getListProduct = useCallback(() => {
        if (listProductId.length === 0) return

        const timeFlashSale = listTimeFlashSale.find((tfs) => {
            const start = moment.unix(tfs.startTime)
            const end = moment.unix(tfs.endTime)
            const cur = moment()

            return cur.isBetween(start, end, 'millisecond', [])
        })

        // Divide the array into small arrays
        const chunkArray = (array, size) => {
            const result = [];
            for (let i = 0; i < array.length; i += size) {
                result.push(array.slice(i, i + size));
            }

            return result;
        }

        // Get data from a small array
        const getProducts = async (products) => {
            return new Promise((resolve, reject) => {
                const params = {
                    promotionid: timeFlashSale.promotionid,
                    categoryid: 0,
                    itemids: products,
                    limit: products.length,
                }

                axios.post('/api/api/v4/flash_sale/flash_sale_batch_get_items', params).then((response) => {
                    resolve(response.data.data.items)
                })
            })
        }

        const chunks = chunkArray(listProductId, 50);
        const promises = chunks.map(chunk => getProducts(chunk));

        Promise.all(promises)
            .then(results => {
                const products = results.flat().sort((a, b) => Number(b.discount.replace(/%/g, '')) - Number(a.discount.replace(/%/g, '')))
                setListProduct(products)
                setLoading(false)
            });

    }, [listProductId])

    const getAllSessions = () => {
        setLoading(true)

        axios.get('/api/api/v4/flash_sale/get_all_sessions', {
            params: {
                category_personalization_type: 1
            },
        })
            .then(response => {
                const { data } = response;
                const flashSales = data?.data?.sessions?.map((fs) => {
                    return {
                        endTime: fs.end_time,
                        startTime: fs.start_time,
                        promotionid: fs.promotionid
                    }
                }) || []

                setListTimeFlashSale(flashSales)
            });
    }

    useEffect(() => {
        getAllSessions()
    }, [])

    useEffect(() => {
        getListProductId()
    }, [listTimeFlashSale])

    useEffect(() => {
        getListProduct()
    }, [listProductId])

    useEffect(() => {
        if (listProduct.length === 0) return

        const interval = setInterval(() => {
            if ((moment().format('m') == '30' || moment().format('m') == '0') && moment().format('s') == '0') {
                getAllSessions()
            }
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [listProduct]);

    return {
        loading,
        listProduct
    }
}

export default useFetching;