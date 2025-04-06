import { useState } from 'react';
import { VStack, Text, Button, Input, Box } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
// import { api } from '../services/api';
import { useWallet } from '@solana/wallet-adapter-react';

export default function ConfirmOTP() {
  // const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  // const toast = useToast();
  const navigate = useNavigate();
  const { publicKey } = useWallet();

  // Check if user is connected with a wallet
  const walletAddress = publicKey ? publicKey.toBase58() : null;

  // const handleSubmitPhone = async () => {
  //   if (!phone || !walletAddress) return;

  //   console.log(walletAddress, phone);
  //   // just sign in
  //   const response = await api.signin({
  //     wallet: walletAddress,
  //     phone: phone.startsWith('+') ? phone : `+${phone}`,
  //   });

  //   console.log(response);

  //   if (response.status === 201) {
  //     setStep('otp');
  //   }

  // };

  const verifyAndGoToApps = async () => {
    navigate('/select-app')
  }
  const handleVerifyOtp = async () => {
    if (!otp || !walletAddress) return;
    navigate('/select-app')
  };

  return (
    <VStack spacing={8} align="center" justify="center" w="100%" p={8} bg="white" borderRadius="md">
      {step === 'phone' && (
        <Box w="100%" maxW="500px">
          <Text fontSize="lg" mb={4}>Enter the code received by SMS</Text>
          <Input 
            placeholder="OTP HERE" 
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            mb={4}
          />
          <Button 
            colorScheme="purple"
            onClick={verifyAndGoToApps}
            isLoading={loading}
            width="100%"
            backgroundColor="rgb(100, 26, 230)"
          >
            Confirm OTP
          </Button>
        </Box>
      )}
      
      {step === 'otp' && (
        <Box w="100%" maxW="500px">
          <Text mb={4}>Enter the code received by SMS</Text>
          <Input 
            placeholder="OTP HERE" 
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            mb={4}
          />
          <Button 
            colorScheme="purple"
            onClick={handleVerifyOtp}
            isLoading={loading}
            width="100%"
            backgroundColor="rgb(100, 26, 230)"
          >
            Confirm OTP 
          </Button>
        </Box>
      )}
    </VStack>
  );
}
