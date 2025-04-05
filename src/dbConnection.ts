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