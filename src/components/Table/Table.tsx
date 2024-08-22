import { useEffect, useState } from 'react'

import { useFetch } from 'hooks/useFetch'
import Cell from 'components/Cell/Cell'
import { IMarket, ITableRow } from 'app/types/types'
import { BASE_URL } from 'app/config/globals'

import cls from './Table.module.scss'

const columnArr = ['Pair name/market', 'First', 'Second', 'Third']

const Table = () => {
    const { isLoading: isFirstLoading, response: firstMarket, error: isFirstError } = useFetch<IMarket>('/first');
    const { isLoading: isSecondLoading, response: secondMarket, error: isSecondError } = useFetch<IMarket>('/second');
    const { isLoading: isThirdLoading, response: thirdMarket, error: isThirdError } = useFetch<IMarket>('/third');

    const [firstPollMarket, setFirstPollMarket] = useState<IMarket>();
    const [secondPollMarket, setSecondPollMarket] = useState<IMarket>();
    const [thirdPollMarket, setThirdPollMarket] = useState<IMarket>();

    const [tableData, setTableData] = useState<ITableRow[]>([]);
    const [rateNames, setRateNames] = useState<string[]>([]);
    const [minValue, setMinValue] = useState<number | null>(null);

    const getMinRate = (combinedData: ITableRow[]) => {
        const allRates = combinedData.flatMap(row => [
            row.firstMarketRate,
            row.secondMarketRate,
            row.thirdMarketRate
        ]).filter(Boolean); 

        const globalMin = Math.min(...allRates);
        setMinValue(globalMin);
    }

    const buildTableData = () => {
        if (rateNames.length > 0) {
            const combinedData = rateNames.map((name) => {
                const baseName = name.split('/')[0];
                return {
                    name,
                    firstMarketRate: firstPollMarket?.rates?.[baseName] || firstMarket?.rates?.[baseName],
                    secondMarketRate: secondPollMarket?.rates?.[baseName] || secondMarket?.rates?.[baseName],
                    thirdMarketRate: thirdPollMarket?.rates?.[baseName] || thirdMarket?.rates?.[baseName],
                };
            });
            setTableData(combinedData);

            getMinRate(combinedData)
        }
    };

    const marketSubscribe = async (url: string, marketNum: number) => {
        const fullUrl = `${BASE_URL}${url}`;

        try {
            const response = await fetch(fullUrl);
            const data = await response.json();
            setPollMarketData(data, marketNum);
            await marketSubscribe(url, marketNum); 
        } catch {
            setTimeout(() => {
                marketSubscribe(url, marketNum);
            }, 500);
        }
    };

    const setPollMarketData = (data: IMarket, marketNum: number) => {
        switch (marketNum) {
            case 1:
                setFirstPollMarket(data);
                break;
            case 2:
                setSecondPollMarket(data);
                break;
            case 3:
                setThirdPollMarket(data);
                break;
        }
    };

    useEffect(() => {
        if (firstMarket && secondMarket && thirdMarket) {
            const rateNamesArr = Object.keys(firstMarket.rates).map((rate) => rate + `/${firstMarket.base}`);
            setRateNames(rateNamesArr);
        }
    }, [firstMarket, secondMarket, thirdMarket]);

    useEffect(() => {
        buildTableData();
    }, [rateNames, firstMarket, secondMarket, thirdMarket, firstPollMarket, secondPollMarket, thirdPollMarket]);

    useEffect(() => {
        marketSubscribe('/first/poll', 1);
        marketSubscribe('/second/poll', 2);
        marketSubscribe('/third/poll', 3);
    }, []);

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