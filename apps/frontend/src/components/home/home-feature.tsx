import { VStack, Text, Image, Box, Button } from '@chakra-ui/react'
import { WalletButton } from '../solana/solana-provider'
import VeCycleBack from '../../assets/VeCycleBack.svg'
import { useWallet } from '@solana/wallet-adapter-react'
import { useNavigate } from 'react-router-dom'
import { MdArrowOutward } from "react-icons/md";

export default function HomeFeature() {
  const navigate = useNavigate()
  const { connected } = useWallet()

  return (
    <VStack align="center" justify="center" w="100%">
      <Box alignSelf="start" w="100%">
        <Text fontSize="3xl" fontWeight="bold">
          Connect your wallet to start.
        </Text>
        <Text fontSize="lg">Connect your phantom wallet to start, and start your journey with CycleBack</Text>
      </Box>
      <Image alignSelf="center" src={VeCycleBack} alt="veCycleBack" maxW="500px" />
      <WalletButton maxW="500px" />
      {connected && (
        <Button
          color="white"
          maxW="500px"
          p={4}
          className="wallet-adapter-button-trigger"
          onClick={() => {
            navigate('/verify')
          }}
        >
          Verify your identity
          <MdArrowOutward />
        </Button>
      )}
    </VStack>
  )
}
