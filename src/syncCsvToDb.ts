import {checkFileAlreadySynced, syncPrices} from "./dbService";
import {Readable} from "node:stream";
import csvParser from "csv-parser";


export async function checkFileExist(fileName: string): Promise<boolean> {
    return await checkFileAlreadySynced(fileName);
}


export async function syncCsvToDb(fileName: string, stream: Readable) {
        const prices: [] = [];
        stream
            .pipe(csvParser())
            .on('data', async (data) => {
                    //@ts-ignore
                    prices.push(data);
                }
            ).on('end', async () => {
            await syncPrices(fileName, prices);
            console.log('Processing completed for file:', fileName);
        })
}