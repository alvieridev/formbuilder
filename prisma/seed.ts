import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient()


async function main() {
    const user = await prisma.user.upsert({
        where: {  email: "alvierime@gmail.com"},
        update: {},
        create: {
            name: "Alvieri",
            email: "alvierime@gmail.com",
            password: "ww"
        },
    })
    console.log({user})
}

main()
    .then(() => prisma.$disconnect())
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect();
        process.exit(1);
    })