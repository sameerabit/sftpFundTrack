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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkFileExist = checkFileExist;
exports.syncCsvToDb = syncCsvToDb;
const dbService_1 = require("./dbService");
const csv_parser_1 = __importDefault(require("csv-parser"));
function checkFileExist(fileName) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, dbService_1.checkFileAlreadySynced)(fileName);
    });
}
function syncCsvToDb(fileName, stream) {
    return __awaiter(this, void 0, void 0, function* () {
        yield new Promise((resolve) => {
            const prices = [];
            stream
                .pipe((0, csv_parser_1.default)())
                .on('data', (data) => __awaiter(this, void 0, void 0, function* () {
                //@ts-ignore
                prices.push(data);
            })).on('end', () => __awaiter(this, void 0, void 0, function* () {
                yield (0, dbService_1.syncPrices)(fileName, prices);
                resolve(true);
            }));
        }).finally(() => {
            console.log('Process Done...');
        });
    });
}
