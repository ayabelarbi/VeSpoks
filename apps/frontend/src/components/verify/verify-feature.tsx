import { VStack, Text, Box, Input } from '@chakra-ui/react'

export default function VerifyFeature() {
  const handleVerifyIdentity = () => {
    console.log('Connextion to the backend')
  }

  return (
    <VStack align="center" justify="center" w="100%">
      <Box alignSelf="center" w="100%">
        <Text fontSize="3xl" fontWeight="bold">
          Verify your identity
        </Text>
        <Text fontSize="lg">Enter your phone number to verify your identity</Text>
      </Box>
      <Input
        placeholder="Phone number"
        maxW="500px"
        color="white"
        p={4}
        className="wallet-adapter-button-trigger"
        onClick={handleVerifyIdentity}
      />
    </VStack>
  )
}
