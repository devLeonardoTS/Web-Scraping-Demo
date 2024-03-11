import puppeteer, { Page } from "puppeteer";

export class KabumScrapper {

    constructor(private readonly STORE_URL = "https://www.kabum.com.br"){
    }

    private async searchFirstCategoryProduct(page: Page, category: string) {

        await page.type("input#input-busca", category);
    
        const fieldEl = await page.$("input#input-busca");
        await fieldEl?.press("Enter");
    
        await page.waitForNavigation();
    
        const product = await page.evaluate(() => ({
            title: document.querySelector<any>("h2 > span.nameCard").textContent,
            price: document.querySelector<any>("div > span.priceCard").textContent,
            pic_url: document.querySelector<HTMLImageElement>("a > img.imageCard")?.src,
            product_url: document.querySelector<HTMLAnchorElement>("div > a.productLink")?.href,
            category: undefined,
        }));

        return product;
    }

    private async searchAllCategoryProducts(page: Page, category: string){

        await page.type("input#input-busca", category);
    
        const fieldEl = await page.$("input#input-busca");
        await fieldEl?.press("Enter");
    
        await page.waitForNavigation();
    
        const products = await page.evaluate(() => 
            Array.from(document?.querySelectorAll("main > div.productCard"), 
                (el) => ({
                    title: el?.querySelector("h2 > span.nameCard")?.textContent,
                    price: el?.querySelector("div > span.priceCard")?.textContent,
                    pic_url: el?.querySelector<HTMLImageElement>("a > img.imageCard")?.src,
                    product_url: el?.querySelector<HTMLAnchorElement>("div > a.productLink")?.href,
                    category: undefined,
               })
        ));

        return products;
    }

    public async scrapFirst(categories: string[]){
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.goto(this.STORE_URL);
        
        const products = [];
    
        for (let category of categories) {
            const product = await this.searchFirstCategoryProduct(page, category);
            product.category = category as any;
            products.push(product);
        }
    
        await browser.close();
    
        

        return products;
    }

    public async scrapPage(categories: string[]){
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.goto(this.STORE_URL);
        
        const products: any = [];
    
        for (let category of categories) {
            const productList = await this.searchAllCategoryProducts(page, category);
            for (let product of productList || []){
                product.category = category as any;
                products.push(product);
            }
        }

        await browser.close();
    
        return products;
    }
}