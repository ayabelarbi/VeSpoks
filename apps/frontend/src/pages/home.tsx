import { VStack, Text, Image, Box, Button } from '@chakra-ui/react'
import { WalletButton } from '../components/solana/solana-provider'
import VeCycleBack from '../assets/VeCycleBack.svg'
import { useWallet } from '@solana/wallet-adapter-react'
import { useNavigate } from 'react-router-dom'
import { MdArrowOutward } from "react-icons/md";
import { useEffect, useState } from 'react'
import { api } from '../services/api'


export default function Home() {
  const navigate = useNavigate()
  const { connected, publicKey } = useWallet()
  const [signIn, setSignIn] = useState(false) 

  useEffect(() => {
    const checkSignIn = async () => {
      const response = await api.checkSignin({ wallet: publicKey?.toBase58() ?? "" })
      const data = response.data as { signedIn: boolean }
      console.log(data)
      if (!data) {
        setSignIn(false)
      } else {
        setSignIn(data.signedIn)
      }
    }
    checkSignIn()
  }, [connected, publicKey])

  // if i am sign in, redirect to select-app 
  // useEffect(() => {
  //   if (signIn) {
  //     navigate('/select-app')
  //   }
  // }, [signIn, navigate])

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
      {connected && !signIn && (
        <Button
          color="white"
          maxW="500px"
          p={4}
          className="wallet-adapter-button-trigger"
          background="blue.500"
          onClick={() => {
            navigate('/verify')
          }}
        >
          Verify your identity
          <MdArrowOutward />
        </Button>
      )}

      {signIn && (
        <Button
          color="white"
          maxW="500px"
          p={4}
          className="wallet-adapter-button-trigger"
          onClick={() => {
            navigate('/select-app')
          }}
        >
          Select your app
        </Button>
      )}
    </VStack>
  )
}
