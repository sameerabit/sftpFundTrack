
import SFTPClient, {FileInfo} from 'ssh2-sftp-client';
import path from 'path';
import {checkFileExist, syncCsvToDb} from "./syncCsvToDb";
import {Readable} from "node:stream";
import { EventEmitter } from 'events';


EventEmitter.defaultMaxListeners = 20;

const sftp = new SFTPClient();
const REMOTE_DIR = '/Users/virajamarasinghe/Alwy';
export async function runSync() {
    try{
        await sftp.connect({
            host: 'localhost',
            port: 22,
            username: 'virajamarasinghe',
            password: '19941026'
        });

        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        const fileList = await sftp.list(REMOTE_DIR);

        const chunkSize = 10;
        const batchesToProcess = [];

        for(let i=0; i<fileList.length; i+=chunkSize){
            batchesToProcess.push(fileList.filter((file) => {
                return file.name.endsWith('.csv') && file.name.startsWith('ALWY_'+todayStr)
            }).slice(i,i+chunkSize));
        }

        for(const filesToProcess of batchesToProcess){

            await Promise.all(filesToProcess.map(async (file: FileInfo) => {
                const fileAlreadySynced = await checkFileExist(file.name);
                if(!fileAlreadySynced){
                    const stream = await sftp.get(path.join(REMOTE_DIR, file.name));
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