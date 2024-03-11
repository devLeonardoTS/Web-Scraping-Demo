import { AppAxios } from "@/components/utilities/AppAxios";
import Head from "next/head";
import { FormEventHandler, MouseEventHandler, useState } from "react";
import { useMutation, useQuery } from "react-query";
import * as lodash from "lodash";
import { CircularProgress } from "@mui/material";

type Product = {
  title: string;
  price: string;
  pic_url: string;
  product_url: string;
  category: string;
};

export default function Home() {
  const [categories, setCategories] = useState<string[]>([]);
  const [lastSearch, setLastSearch] = useState<string[]>([]);
  const [category, setCategory] = useState("");

  const productScrapperMutation = useMutation({
    mutationFn: (categories: string[]) => {
      return AppAxios.client.post<Product[]>("/api/products/kabum", categories);
    },
  });

  const handleAddCategorySubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (!category.length) return;

    setCategory("");
    setCategories((state) => [...state, category]);
  };

  const handleDelCategory = (target: number) => {
    setCategories((state) => state.filter((value, i) => i !== target));
  };

  const handleProductSearch: MouseEventHandler<HTMLButtonElement> = async (
    e
  ) => {
    if (lodash.isEqual(lastSearch, categories)) {
      console.log("Search already done.");
      return;
    }

    console.log("Searching Products...");
    await productScrapperMutation.mutateAsync(categories);
    setLastSearch(categories);
  };

  const handleProductClear: MouseEventHandler<HTMLButtonElement> = async (
    e
  ) => {
    setCategories([]);
    setLastSearch([]);
    productScrapperMutation.reset();
  };

  const handleSaveToCSV: MouseEventHandler<HTMLButtonElement> = async (e) => {
    console.log("Exporting to CSV");
  };

  return (
    <>
      <Head>
        <title>Demonstração - Raspagem de Dados</title>
        <meta name="description" content="Demonstração de raspagem de dados" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-[1200px] m-auto p-4 flex flex-col gap-4">
        <h1 className="text-center">Demonstração - Web Scraping</h1>

        <div className="flex gap-4 items-center">
          <form
            id="category-add-form"
            className="flex flex-col gap-1 w-80 border-2 border-black h-full"
            onSubmit={handleAddCategorySubmit}
          >
            <input
              type="text"
              id="input-category"
              name="input-category"
              placeholder="Digite uma categoria..."
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border-solid rounded-md p-1"
            />
            <button type="submit" className="p-1">
              Adicionar Categoria
            </button>
          </form>
          <div className="flex flex-col">
            <h2 className="text-base font-medium">Sobre o sistema</h2>
            <p className="text-sm">
              Adicione categorias, e clique em "Buscar Produtos".
              <br />O sistema vasculhará o website da{" "}
              <a href="https://www.kabum.com.br">Kabum!</a> para encontrar o
              primeiro produto de cada uma das categorias desejadas.
            </p>
          </div>
        </div>

        <div className="flex flex-col grow">
          <h2 className="font-normal">Lista de Categorias</h2>
          <ul
            id="category-list"
            className="flex flex-col gap-3 overflow-auto border-solid rounded-md flex-grow p-4 text-sm"
          >
            {categories.length ? (
              categories.map((item, index) => {
                return (
                  <li
                    key={`category-${index}`}
                    className="flex gap-4 items-center"
                  >
                    <div className="flex gap-4 grow overflow-auto">
                      <span>•</span>
                      <span className="flex-grow">{item}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelCategory(index)}
                      className="p-1"
                    >
                      Remover
                    </button>
                  </li>
                );
              })
            ) : (
              <span className="text-gray-400 font-light">
                Adicione ao menos uma categoria para começar as buscas...
              </span>
            )}
          </ul>
        </div>

        <div className="m-auto">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleProductSearch}
              disabled={categories.length < 1}
              className="p-1"
            >
              Buscar Produtos
            </button>

            <button
              type="button"
              onClick={handleProductClear}
              disabled={
                categories.length < 1 &&
                productScrapperMutation.data?.data === undefined
              }
              className="p-1"
            >
              Limpar Produtos
            </button>

            <button
              type="button"
              onClick={handleSaveToCSV}
              disabled={productScrapperMutation.data?.data === undefined}
              className="p-1"
            >
              Exportar CSV
            </button>
          </div>
        </div>

        <hr className="border-solid border-gray-300" />

        <div>
          <h2 className="font-normal">Lista de Produtos</h2>
          <ul
            id="product-list"
            className="flex flex-col gap-3 overflow-auto border-solid rounded-md flex-grow p-4 text-sm"
          >
            {productScrapperMutation.isIdle ? (
              <span className="text-gray-500 font-light">
                Aguardando pedido de busca...
              </span>
            ) : null}
            {productScrapperMutation.isLoading ? (
              <div className="flex flex-col items-center gap-4">
                <CircularProgress />
                <span className="text-gray-500 font-light">
                  Carregando produtos...
                </span>
              </div>
            ) : null}
            {productScrapperMutation.isError ? (
              <span className="text-gray-500 font-light">
                Ops! Algo deu errado.
              </span>
            ) : null}
            {productScrapperMutation.isSuccess
              ? productScrapperMutation.data.data.map((value, index) => {
                  return (
                    <li key={`product-${index}`} className="flex gap-1">
                      <img
                        src={value.pic_url}
                        height={100}
                        width={100}
                        alt={`Picture for: ${value.title}`}
                        className="border-2 border-solid border-black rounded-md"
                      />
                      <div className="flex flex-col flex-grow gap-2">
                        <div className="flex flex-col gap-2 flex-grow">
                          <span className="text-xs">
                            <span className="font-bold">Origem:&ensp;</span>
                            Kabum!
                          </span>
                          <span className="text-sm flex-grow">
                            {value.title}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-base font-bold">
                            Preço: {value.price}
                          </span>
                          <a
                            href={value.product_url}
                            className="text-sm no-underline"
                          >
                            Visitar produto na loja
                          </a>
                        </div>
                      </div>
                    </li>
                  );
                })
              : null}
          </ul>
        </div>
      </main>
    </>
  );
}
