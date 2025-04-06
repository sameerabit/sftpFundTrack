// @ts-ignore
// @ts-ignore

import {checkFileAlreadySynced, syncPrices} from "./dbConnection";
import {Readable} from "node:stream";
import csvParser from "csv-parser";


export async function checkFileExist(fileName: string): Promise<boolean> {
    return await checkFileAlreadySynced(fileName);
}


export async function syncCsvToDb(fileName: string, stream: Readable) {
    await new Promise((resolve, reject) => {
        const prices: any[] = [];
        stream
            .pipe(csvParser())
            .on('data', async (data) => {
                    prices.push(data);
                }
            ).on('end', async () => {
            // console.log(prices);

            // prices.forEach(async (price) => {
            await syncPrices(fileName, prices);
            // });
            resolve(true);
        })
        });
}