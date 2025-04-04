import {PrismaClient} from '@prisma/client';

export const prisma = new PrismaClient();


export async function checkFileAlreadySynced(): Promise<void> {
    await prisma.synced_file.findUnique({
        where: {
            file_name: 'test.csv',
    });
}