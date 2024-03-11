import { KabumScrapper } from "@/app/services/Scrappers/kabum";

export async function POST(req: Request){

    const categories: string[] = await req.json();

    const kabumScrapper = new KabumScrapper();

    const products = await kabumScrapper.scrapPage(categories)
        .catch((error) => {
            console.error("Something went wrong:", error.message);
            return new Response();
        });

    return new Response(JSON.stringify(products));

}