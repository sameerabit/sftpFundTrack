import {Readable} from "node:stream";
import csvParser from "csv-parser";


export async function syncCsvToDb(stream: Readable) {
    await new Promise((resolve, reject) => {
        stream
            .pipe(csvParser())
            .on('data', (data) => console.log(
                data
            ))
    })
}