import { ExchangeRateOrmEntity } from "src/modules/exchange-rates/entities/exchange-rate.orm-entity";

export const convertToTargetCurrency = (amount: number, exchangeRate: ExchangeRateOrmEntity | null): string => {
    if (!exchangeRate) {
      console.log('No exchange rate provided, returning original amount:', amount);
      return amount.toString();
    }
    
    // If base currency is already the target currency, no conversion needed
    if (exchangeRate.baseCurrency === exchangeRate.targetCurrency) {
      console.log('Base and target currency are the same:', exchangeRate.baseCurrency);
      return amount.toString();
    }
    
    // Convert based on rate type
    if (exchangeRate.rateType === 'BUY') {
      // BUY rate: foreign currency -> base currency (LAK)
      // To convert from base to foreign: amount / rate
      const converted = amount * exchangeRate.rate;
      console.log(`BUY conversion: ${amount} / ${exchangeRate.rate} = ${converted}`);
      return converted.toString();
    } else {
      // SELL rate: base currency (LAK) -> foreign currency  
      // To convert from base to foreign: amount * rate
      const converted = amount * exchangeRate.rate;
      console.log(`SELL conversion: ${amount} * ${exchangeRate.rate} = ${converted}`);
      return converted.toString();
    }
  }


  
export const convertToBaseCurrency = (amount: number, exchangeRate: ExchangeRateOrmEntity | null): string => {
    if (!exchangeRate) {
      console.log('No exchange rate provided, returning original amount:', amount);
      return amount.toString();
    }
    
    // If base currency is already the target currency, no conversion needed
    if (exchangeRate.baseCurrency === exchangeRate.targetCurrency) {
      console.log('Base and target currency are the same:', exchangeRate.baseCurrency);
      return amount.toString();
    }
    
    // Convert based on rate type
    if (exchangeRate.rateType === 'BUY') {
      // BUY rate: foreign currency -> base currency (LAK)
      // To convert from base to foreign: amount / rate
      const converted = amount / exchangeRate.rate;
      console.log(`BUY conversion: ${amount} / ${exchangeRate.rate} = ${converted}`);
      return converted.toString();
    } else {
      // SELL rate: base currency (LAK) -> foreign currency  
      // To convert from base to foreign: amount * rate
      const converted = amount / exchangeRate.rate;
      console.log(`SELL conversion: ${amount} / ${exchangeRate.rate} = ${converted}`);
      return converted.toString();
    }
  }
