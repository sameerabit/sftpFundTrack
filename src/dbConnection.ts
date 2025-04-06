import {PrismaClient} from '@prisma/client';

export const prisma = new PrismaClient();


export async function checkFileAlreadySynced(fileName: string): Promise<boolean> {
    const result = await prisma.synced_file.findUnique({
        where: {
            filename: fileName,
        }
    });
    return result !== null;
}

export async function syncPrices(fileName: string, prices): Promise<boolean> {
    const result = await prisma.synced_file.create({
        data: {
            filename: fileName,
            last_synced: 0,
            status: false,
            fund_prices:{
                create: prices.map((price: { date: string | number | Date; open: string; high: string; low: string; close: string; volume: string; }) => ({
                    date: new Date(price.Date),
                    open: parseFloat(price.Open),
                    high: parseFloat(price.High),
                    low: parseFloat(price.Low),
                    close: parseFloat(price.Close),
                    volume: parseFloat(price.Volume),
                    created_at: new Date(),
                    updated_at: new Date(),
                })),
            },
        }
    });
    // console.log(result.id);
    // await prisma.fund_prices.createMany({
    //     data: prices
    // });
    return result !== null;
}