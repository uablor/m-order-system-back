import { ExchangeRateOrmEntity } from "src/modules/exchange-rates/entities/exchange-rate.orm-entity";
export declare const convertToTargetCurrency: (amount: number, exchangeRate: ExchangeRateOrmEntity | null) => number;
export declare const convertToBaseCurrency: (amount: number, exchangeRate: ExchangeRateOrmEntity | null) => number;
