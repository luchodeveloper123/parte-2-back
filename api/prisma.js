const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
module.exports = prisma;


async function main() {
await prisma.personaje.createMany({
    data: [
    { nombre: 'Homero' },
    { nombre: 'Lisa' },
    { nombre: 'Flanders' },
    { nombre: 'Marge' },
    ],
});
}

main()
.then(async () => {
    await prisma.$disconnect();
})
.catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});