import { http, createConfig } from "wagmi";
import { arbitrumSepolia, localhost } from "wagmi/chains";
import { injected } from "wagmi/connectors";

export const config = createConfig({
  chains: [arbitrumSepolia, localhost],
  connectors: [injected()],
  transports: {
    [arbitrumSepolia.id]: http(),
    [localhost.id]: http(),
  },
});
export type AppConfig = typeof config;
