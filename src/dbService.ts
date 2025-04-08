import {PrismaClient} from '@prisma/client';

export const prisma = new PrismaClient();

type Price = {
    Date: string | number | Date;
    Open: string;
    High: string;
    Low: string;
    Close: string;
    Volume: string;
}


export async function checkFileAlreadySynced(fileName: string): Promise<boolean> {
    const result = await prisma.synced_file.findUnique({
        where: {
            filename: fileName,
        }
    });
    return result !== null;
}

//@ts-ignore
export async function syncPrices(fileName: string, prices): Promise<boolean> {
    const syncedFile = await prisma.synced_file.create({
        data: {
            filename: fileName,
            last_synced: 0,
            status: false,
        }
    });

    const BATCH_SIZE = 1000;

    for (let i=0; i<prices.length; i+=BATCH_SIZE) {
        const batch: [Price]  = prices.slice(i, i+BATCH_SIZE);
        await prisma.fund_prices.createMany({
            data: batch.map((price) => ({
                date: new Date(price.Date),
                open: parseFloat(price.Open),
                high: parseFloat(price.High),
                low: parseFloat(price.Low),
                close: parseFloat(price.Close),
                volume: parseFloat(price.Volume),
                created_at: new Date(),
                updated_at: new Date(),
                synced_file_id: syncedFile.id,
            })),
            skipDuplicates: true,
        });
    }

    return true;
}