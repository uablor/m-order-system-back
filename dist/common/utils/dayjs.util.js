"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTime = exports.formatDate = void 0;
exports.calculateDays = calculateDays;
const dayjs_1 = __importDefault(require("dayjs"));
require("dayjs/locale/lo");
dayjs_1.default.locale('lo');
const formatDate = (date) => {
    return (0, dayjs_1.default)(date).format('dddd DD-MM-YYYY');
};
exports.formatDate = formatDate;
function calculateDays(startDate, endDate) {
    if (!startDate || !endDate)
        return 0;
    const start = (0, dayjs_1.default)(startDate);
    const end = (0, dayjs_1.default)(endDate);
    const diff = end.diff(start, 'day');
    return diff > 0 ? diff : 0;
}
const formatTime = (date) => {
    if (!date)
        return '';
    return (0, dayjs_1.default)(date).format('HH:mm:ss');
};
exports.formatTime = formatTime;
//# sourceMappingURL=dayjs.util.js.map