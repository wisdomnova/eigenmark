import { http, createConfig } from "wagmi";
import { arbitrumSepolia, localhost } from "wagmi/chains";
import { injected, coinbaseWallet } from "wagmi/connectors";

export const config = createConfig({
  chains: [arbitrumSepolia, localhost],
  connectors: [
    injected(),
    coinbaseWallet({ appName: "ProofChain" }),
  ],
  transports: {
    [arbitrumSepolia.id]: http(),
    [localhost.id]: http(),
  },
});
export type AppConfig = typeof config;
