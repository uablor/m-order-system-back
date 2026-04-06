"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToBaseCurrency = exports.convertToTargetCurrency = void 0;
const convertToTargetCurrency = (amount, exchangeRate) => {
    if (!exchangeRate) {
        console.log('No exchange rate provided, returning original amount:', amount);
        return amount;
    }
    if (exchangeRate.baseCurrency === exchangeRate.targetCurrency) {
        console.log('Base and target currency are the same:', exchangeRate.baseCurrency);
        return amount;
    }
    if (exchangeRate.rateType === 'BUY') {
        const converted = amount * exchangeRate.rate;
        console.log(`BUY conversion: ${amount} / ${exchangeRate.rate} = ${converted}`);
        return converted;
    }
    else {
        const converted = amount * exchangeRate.rate;
        console.log(`SELL conversion: ${amount} * ${exchangeRate.rate} = ${converted}`);
        return converted;
    }
};
exports.convertToTargetCurrency = convertToTargetCurrency;
const convertToBaseCurrency = (amount, exchangeRate) => {
    if (!exchangeRate) {
        console.log('No exchange rate provided, returning original amount:', amount);
        return amount;
    }
    if (exchangeRate.baseCurrency === exchangeRate.targetCurrency) {
        console.log('Base and target currency are the same:', exchangeRate.baseCurrency);
        return amount;
    }
    if (exchangeRate.rateType === 'BUY') {
        const converted = amount / exchangeRate.rate;
        console.log(`BUY conversion: ${amount} / ${exchangeRate.rate} = ${converted}`);
        return converted;
    }
    else {
        const converted = amount / exchangeRate.rate;
        console.log(`SELL conversion: ${amount} / ${exchangeRate.rate} = ${converted}`);
        return converted;
    }
};
exports.convertToBaseCurrency = convertToBaseCurrency;
//# sourceMappingURL=convert-to-target-currency.utils.js.map