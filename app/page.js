"use client"

import styles from './page.module.css'
import { Table } from 'antd';
import Loading from './components/Loading';
import { columns } from './const';
import useFetching from './hooks/useFetching';

export default function Home() {
    const { loading, listProduct } = useFetching()

    return (
        <main className={styles.main}>
            {
                loading ?
                    <Loading /> :
                    <Table dataSource={listProduct} columns={columns} style={{ width: '100%' }} rowKey='itemid' />
            }
        </main>
    )
}
