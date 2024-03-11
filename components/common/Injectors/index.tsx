import { StyledEngineProvider } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from "react-query";

export type InjectorProps = {
  children?: React.ReactNode;
};

const queryClient = new QueryClient();

function Injectors({ children }: InjectorProps) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <StyledEngineProvider injectFirst>{children}</StyledEngineProvider>
      </QueryClientProvider>
    </>
  );
}

export default Injectors;
