"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
exports.checkFileAlreadySynced = checkFileAlreadySynced;
exports.syncPrices = syncPrices;
const client_1 = require("@prisma/client");
exports.prisma = new client_1.PrismaClient();
function checkFileAlreadySynced(fileName) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield exports.prisma.synced_file.findUnique({
            where: {
                filename: fileName,
            }
        });
        return result !== null;
    });
}
//@ts-ignore
function syncPrices(fileName, prices) {
    return __awaiter(this, void 0, void 0, function* () {
        const syncedFile = yield exports.prisma.synced_file.create({
            data: {
                filename: fileName,
                last_synced: 0,
                status: false,
            }
        });
        const BATCH_SIZE = 1000;
        for (let i = 0; i < prices.length; i + BATCH_SIZE) {
            const batch = prices.slice(i, i + BATCH_SIZE);
            yield exports.prisma.fund_prices.createMany({
                data: batch.map((price) => ({
                    date: new Date(price.Date),
                    open: parseFloat(price.Open),
                    high: parseFloat(price.High),
                    low: parseFloat(price.Low),
                    close: parseFloat(price.Close),
                    volume: parseFloat(price.Volume),
                    created_at: new Date(),
                    updated_at: new Date(),
                    synced_file_id: syncedFile.id,
                })),
                skipDuplicates: true,
            });
        }
        return true;
    });
}
