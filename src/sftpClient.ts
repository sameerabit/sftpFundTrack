import SFTPClient, {FileInfo} from 'ssh2-sftp-client';
import path from 'path';
import {checkFileExist, syncCsvToDb} from "./syncCsvToDb";
import {Readable} from "node:stream";
import {EventEmitter} from 'events';


EventEmitter.defaultMaxListeners = 20;

const sftp = new SFTPClient();
const REMOTE_DIR = '/Users/virajamarasinghe/Alwy';

export async function runSync() {
    try {

        //if already mounted drive used, not need to create a sftp connection. Scan the local directory and process the files
        await sftp.connect({
            host: 'localhost',
            port: 22,
            username: 'virajamarasinghe',
            password: '19941026'
        });

        const todayStr = new Date().toISOString().split('T')[0];

        const fileList = (await sftp.list(REMOTE_DIR)).filter((file) => {
            return file.name.endsWith('.csv') && file.name.startsWith('ALWY_' + todayStr)
        });

        const chunkSize = 10;
        const batchesToProcess = [];

        for (let i = 0; i < fileList.length; i += chunkSize) {
            batchesToProcess.push(fileList.slice(i, i + chunkSize));
        }

        for (const filesToProcess of batchesToProcess) {
            await Promise.all(filesToProcess.map(async (file: FileInfo) => {
                const fileAlreadySynced = await checkFileExist(file.name);
                if (!fileAlreadySynced) {
                    const stream = await sftp.get(path.join(REMOTE_DIR, file.name));
                    //@ts-ignore
                   await syncCsvToDb(file.name, Readable.from(stream))
                }
            }));
        }

    } catch (error) {
        console.error('Error connecting to SFTP server:', error);
        return;
    }
}


export async function mainLoop() {
    runSync();
}