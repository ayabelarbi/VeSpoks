import { useWallet } from "@solana/wallet-adapter-react"


export default function Claim() {
  // ADD HERE THE LOGIC TO CLAIM THE FUNDS TO THE WALLET 
  const { publicKey, connected } = useWallet()
  console.log(publicKey, connected)

  return <div>Claim your funds {publicKey?.toBase58()}</div>
}