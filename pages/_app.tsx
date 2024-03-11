import Injectors from "@/components/common/Injectors";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Injectors>
      <Component {...pageProps} />
    </Injectors>
  );
}
