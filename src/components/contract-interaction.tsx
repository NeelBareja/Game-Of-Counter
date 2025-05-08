"use client"

import { useState, useEffect } from "react"
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Plus, Minus, RotateCcw, Wallet } from "lucide-react"
import ConnectWallet from "@/components/connect-wallet"
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/lib/contract-config"
import { motion } from "framer-motion"

export default function ContractInteraction() {
  const { address, isConnected } = useAccount()
  const [error, setError] = useState<string | null>(null)

  // Read contract data
  const {
    data: counterData,
    isLoading: isLoadingCounter,
    refetch: refetchCounter,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getCounter",
  })

  const { data: ownerData, isLoading: isLoadingOwner } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "Owner",
  })

  // Write functions
  const { writeContract: increase, data: increaseTxHash } = useWriteContract()
  const { writeContract: decrease, data: decreaseTxHash } = useWriteContract()
  const { writeContract: reset, data: resetTxHash } = useWriteContract()

  // Wait for transactions
  const { isLoading: isIncreasing, isSuccess: isIncreaseSuccess } = useWaitForTransactionReceipt({
    hash: increaseTxHash,
  })

  const { isLoading: isDecreasing, isSuccess: isDecreaseSuccess } = useWaitForTransactionReceipt({
    hash: decreaseTxHash,
  })

  const { isLoading: isResetting, isSuccess: isResetSuccess } = useWaitForTransactionReceipt({
    hash: resetTxHash,
  })

  // Refetch counter when any transaction is confirmed
  useEffect(() => {
    if (isIncreaseSuccess) {
      refetchCounter()
      toast({
        title: "Success",
        description: "Counter increased successfully",
      })
    }
  }, [isIncreaseSuccess, refetchCounter])

  useEffect(() => {
    if (isDecreaseSuccess) {
      refetchCounter()
      toast({
        title: "Success",
        description: "Counter decreased successfully",
      })
    }
  }, [isDecreaseSuccess, refetchCounter])

  useEffect(() => {
    if (isResetSuccess) {
      refetchCounter()
      toast({
        title: "Success",
        description: "Counter reset successfully",
      })
    }
  }, [isResetSuccess, refetchCounter])

  // Check if current user is the owner
  const isOwner = ownerData && address ? (ownerData as string).toLowerCase() === address.toLowerCase() : false

  // Handle increase function
  const handleIncrease = () => {
    setError(null)
    try {
      increase({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "increase",
      })
    } catch (err) {
      console.error("Error increasing counter:", err)
      setError("Failed to increase counter")
      toast({
        title: "Error",
        description: "Failed to increase counter",
        variant: "destructive",
      })
    }
  }

  // Handle decrease function
  const handleDecrease = () => {
    setError(null)
    try {
      decrease({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "decrease",
      })
    } catch (err) {
      console.error("Error decreasing counter:", err)
      setError("Failed to decrease counter")
      toast({
        title: "Error",
        description: "Failed to decrease counter",
        variant: "destructive",
      })
    }
  }

  // Handle reset function
  const handleReset = () => {
    setError(null)
    try {
      reset({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "reset",
      })
    } catch (err) {
      console.error("Error resetting counter:", err)
      setError("Failed to reset counter")
      toast({
        title: "Error",
        description: "Failed to reset counter",
        variant: "destructive",
      })
    }
  }

  // Format counter value
  const count = counterData ? Number(counterData) : null

  // Check if any transaction is loading
  const isLoading = isLoadingCounter || isLoadingOwner || isIncreasing || isDecreasing || isResetting

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full shadow-xl border-2 bg-gradient-to-b from-background to-muted/50 backdrop-blur-sm">
          <CardHeader className="space-y-4">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Game Of Counter
              </CardTitle>
            </motion.div>
            <CardDescription className="text-center text-base">
              Connect your wallet to interact with the smart contract
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="flex justify-center">
              <ConnectWallet />
            </div>

            {isConnected && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-primary/20 shadow-lg">
                  <h3 className="text-lg font-medium mb-4 text-primary/80">Current Count</h3>
                  {isLoadingCounter ? (
                    <Skeleton className="h-20 w-24 rounded-xl" />
                  ) : (
                    <motion.span
                      key={count}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
                    >
                      {count !== null ? count : "0"}
                    </motion.span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={handleIncrease}
                      disabled={isLoading}
                      className="w-full h-14 flex items-center justify-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg"
                      size="lg"
                    >
                      <Plus className="mr-2 h-6 w-6" />
                      Increase
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={handleDecrease}
                      disabled={isLoading}
                      className="w-full h-14 flex items-center justify-center bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg"
                      size="lg"
                    >
                      <Minus className="mr-2 h-6 w-6" />
                      Decrease
                    </Button>
                  </motion.div>
                </div>

                {isOwner && (
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={handleReset}
                      disabled={isLoading}
                      variant="destructive"
                      className="w-full h-14 flex items-center justify-center bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg"
                      size="lg"
                    >
                      <RotateCcw className="mr-2 h-6 w-6" />
                      Reset Counter (Owner Only)
                    </Button>
                  </motion.div>
                )}

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm shadow-md"
                  >
                    {error}
                  </motion.div>
                )}
              </motion.div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col text-sm text-muted-foreground border-t border-border/50 bg-muted/30">
            {isConnected && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full space-y-2"
              >
                <div className="flex items-center justify-center space-x-2">
                  <Wallet className="h-4 w-4 text-primary" />
                  <p className="font-medium">
                    {address?.substring(0, 6)}...{address?.substring(address.length - 4)}
                  </p>
                </div>
                <p className="text-center text-primary/80">
                  {isOwner ? "You are the contract owner" : "You are not the contract owner"}
                </p>
              </motion.div>
            )}
          </CardFooter>
        </Card>
      </motion.div>
      <Toaster />
    </div>
  )
}
