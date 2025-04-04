
import SFTPClient from 'ssh2-sftp-client';
import path from 'path';
import {syncCsvToDb} from "./syncCsvToDb";
import {Readable} from "node:stream";


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

        const fileList = await sftp.list(REMOTE_DIR);
        const filesToProcess = fileList.filter((file) => file.name.endsWith('.csv'))
            .slice(0,10);
        for(const file of filesToProcess){
            const stream = await sftp.get(path.join(REMOTE_DIR, file.name));
            // @ts-ignore
            await syncCsvToDb(Readable.from(stream))
        }



    } catch (error) {
        console.error('Error connecting to SFTP server:', error);
        return;
    }
}


export async function mainLoop() {
    runSync();
}