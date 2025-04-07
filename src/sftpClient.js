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
exports.runSync = runSync;
exports.mainLoop = mainLoop;
const ssh2_sftp_client_1 = __importDefault(require("ssh2-sftp-client"));
const path_1 = __importDefault(require("path"));
const syncCsvToDb_1 = require("./syncCsvToDb");
const node_stream_1 = require("node:stream");
const events_1 = require("events");
events_1.EventEmitter.defaultMaxListeners = 20;
const sftp = new ssh2_sftp_client_1.default();
const REMOTE_DIR = '/Users/virajamarasinghe/Alwy';
function runSync() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield sftp.connect({
                host: 'localhost',
                port: 22,
                username: 'virajamarasinghe',
                password: '19941026'
            });
            const today = new Date();
            const todayStr = today.toISOString().split('T')[0];
            const fileList = yield sftp.list(REMOTE_DIR);
            const chunkSize = 10;
            const batchesToProcess = [];
            for (let i = 0; i < fileList.length; i += chunkSize) {
                batchesToProcess.push(fileList.filter((file) => {
                    return file.name.endsWith('.csv') && file.name.startsWith('ALWY_' + todayStr);
                }).slice(i, i + chunkSize));
            }
            for (const filesToProcess of batchesToProcess) {
                yield Promise.all(filesToProcess.map((file) => __awaiter(this, void 0, void 0, function* () {
                    const fileAlreadySynced = yield (0, syncCsvToDb_1.checkFileExist)(file.name);
                    if (!fileAlreadySynced) {
                        const stream = yield sftp.get(path_1.default.join(REMOTE_DIR, file.name));
                        //@ts-ignore
                        yield (0, syncCsvToDb_1.syncCsvToDb)(file.name, node_stream_1.Readable.from(stream));
                    }
                })));
            }
        }
        catch (error) {
            console.error('Error connecting to SFTP server:', error);
            return;
        }
    });
}
function mainLoop() {
    return __awaiter(this, void 0, void 0, function* () {
        runSync();
    });
}
