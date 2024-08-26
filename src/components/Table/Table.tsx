import { useEffect, useMemo, useRef, useState } from 'react'

import { useFetchWithPolling } from 'hooks/useFetch'
import Cell from 'components/Cell/Cell'
import { IMarket, ITableRow } from 'app/types/types'
import { BASE_URL } from 'app/config/globals'

import cls from './Table.module.scss'

const columnArr = ['Pair name/market', 'First', 'Second', 'Third']

const Table = () => {
    const { isLoading: isFirstLoading, response: firstMarket, error: isFirstError } = useFetchWithPolling<IMarket>('/first', 5000);
    const { isLoading: isSecondLoading, response: secondMarket, error: isSecondError } = useFetchWithPolling<IMarket>('/second', 5000);
    const { isLoading: isThirdLoading, response: thirdMarket, error: isThirdError } = useFetchWithPolling<IMarket>('/third', 5000);

    const [rateNames, setRateNames] = useState<string[]>([]);

    const tableData: ITableRow[] = useMemo(() => {
        if (!rateNames.length) return [];

        return rateNames.map((name) => {
            const baseName = name.split('/')[0];
            return {
                name,
                firstMarketRate: firstMarket?.rates?.[baseName],
                secondMarketRate: secondMarket?.rates?.[baseName],
                thirdMarketRate: thirdMarket?.rates?.[baseName],
            };
        });
    }, [rateNames, firstMarket, secondMarket, thirdMarket]);

    const minValue = useMemo(() => {
        const allRates = tableData.flatMap(row => [
            row.firstMarketRate,
            row.secondMarketRate,
            row.thirdMarketRate
        ]).filter(Boolean); 

        const globalMin = Math.min(...allRates);
        return globalMin
    }, [tableData])

    useEffect(() => {
        if (firstMarket && secondMarket && thirdMarket) {
            const rateNamesArr = Object.keys(firstMarket.rates).map((rate) => rate + `/${firstMarket.base}`);
            setRateNames(rateNamesArr);
        }
    }, [firstMarket, secondMarket, thirdMarket]);

    if (isFirstLoading || isSecondLoading || isThirdLoading) {
        return <div>Loading...</div>;
    }

    if (isFirstError || isSecondError || isThirdError) {
        return <div>Error loading market data</div>;
    }

    return (
        <div className={cls.Table}>
            <div className={cls.content}>
                <div className={cls.columnNames}>
                    {columnArr.map((item, index) => (
                        <Cell key={index} value={item} />
                    ))}
                </div>
                <div>
                    {tableData.map((rate, index) => (
                        <div key={index} className={cls.row}>
                            <Cell value={rate.name} />
                            <Cell value={rate.firstMarketRate} isMinValue={rate.firstMarketRate === minValue}/>
                            <Cell value={rate.secondMarketRate} isMinValue={rate.secondMarketRate === minValue}/>
                            <Cell value={rate.thirdMarketRate} isMinValue={rate.thirdMarketRate === minValue}/>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Table