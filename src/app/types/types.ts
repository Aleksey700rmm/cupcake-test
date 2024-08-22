export interface IMarket {
    rates: IRates;
    base: string;
    timestamp: number,
    date: string
}

export interface IRates {
    [key: string]: number;
}

export interface ITableRow {
    name: string;
    firstMarketRate: number;
    secondMarketRate: number;
    thirdMarketRate: number;

}