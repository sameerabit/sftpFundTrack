import {checkFileAlreadySynced} from "./dbConnection";


export async function checkFile(fileName: string): Promise<boolean> {
    return await checkFileAlreadySynced(fileName);
}


// export async function syncCsvToDb(stream: Readable) {
//     await new Promise((resolve, reject) => {
//         stream
//             .pipe(csvParser())
//             .on('data', async (data) => {
//                     await checkFileAlreadySynced();
//                 }
//             )
//     })
// }