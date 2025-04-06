import { WalletError } from '@solana/wallet-adapter-base'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { ReactNode, useCallback, useMemo } from 'react'
import { useCluster } from '../cluster/cluster-data-access'
import { Box, BoxProps } from '@chakra-ui/react'
// import { useConnection } from '@solana/wallet-adapter-react'
// import { useNavigate } from 'react-router-dom'
import('@solana/wallet-adapter-react-ui/styles.css')


// Composant personnalisé avec style Chakra UI
export function WalletButton(props: BoxProps) {
  // const { connection } = useConnection()
  // const navigate = useNavigate()

  // handle connection. If connected go to /verify page
  // useEffect(() => {
  //   if (connection  ) {
  //     navigate('/verify')
  //   }
  // }, [connection])

  return (
    <Box width="100%" className="wallet-adapter-container" {...props}>
      <WalletMultiButton />
    </Box>
  )
}

export function SolanaProvider({ children }: { children: ReactNode }) {
  const { cluster } = useCluster()
  const endpoint = useMemo(() => cluster.endpoint, [cluster])
  const onError = useCallback((error: WalletError) => {
    console.error(error)
  }, [])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} onError={onError} autoConnect={true}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
