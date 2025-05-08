import type { Metadata } from "next"
import ContractInteraction from "@/components/contract-interaction"

export const metadata: Metadata = {
  title: "Smart Contract Counter",
  description: "A modern interface for interacting with a counter smart contract",
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">Smart Contract Counter</h1>
        <ContractInteraction />
      </div>
    </main>
  )
}
