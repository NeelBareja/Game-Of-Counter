"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { WagmiConfig, createConfig } from "wagmi"
import { mainnet, sepolia, goerli } from "wagmi/chains"
import { http } from "viem"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { RainbowKitProvider, darkTheme, lightTheme, getDefaultConfig } from "@rainbow-me/rainbowkit"
import { ThemeProvider } from "next-themes"
import { useTheme } from "next-themes"

// Configure chains & providers
const chains = [mainnet, sepolia, goerli] as const

// Set up wagmi config
const config = getDefaultConfig({
    appName: "GameOfCounter",
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "YOUR_PROJECT_ID",
    chains,
    transports: {
        [mainnet.id]: http(),
        [sepolia.id]: http(),
        [goerli.id]: http(),
    },
    ssr: true,
    batch: {
        multicall: true,
    },
})

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 5 * 1000,
        },
    },
})

export function Providers({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false)
    const { resolvedTheme } = useTheme()

    // Ensure we're only rendering the UI on the client to prevent hydration errors
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    return (
        <WagmiConfig config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider 
                    theme={resolvedTheme === "dark" ? darkTheme() : lightTheme()}
                >
                    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                        {children}
                    </ThemeProvider>
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiConfig>
    )
}
