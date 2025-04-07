
import {checkFileAlreadySynced} from "../src/dbService";

describe('Check File Already Synced To DB', () => {
    it('Check whether the file is already synced with DB', async () => {
        expect(await checkFileAlreadySynced('test')).toBe(false);
    });
});