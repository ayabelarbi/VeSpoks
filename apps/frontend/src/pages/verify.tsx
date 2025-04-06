/* eslint-disable */
import { useState } from 'react';
import { VStack, Text, Button, Input, useToast, Box } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useWallet } from '@solana/wallet-adapter-react';

export default function Verify() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const { publicKey } = useWallet();

  // Check if user is connected with a wallet
  const walletAddress = publicKey ? publicKey.toBase58() : null;

  console.log(setStep)
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
    navigate('/confirm-otp')
  }
  const handleVerifyOtp = async () => {
    if (!otp || !walletAddress) return;
    
    setLoading(true);
    try {
      const response = await api.verifyLogin({
        wallet: walletAddress,
        otp,
      });
      
      if (response.status === 200) {
        toast({
          title: 'Verification successful',
          description: 'You are now logged in',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        // Redirect to select-app page instead of claim
        navigate('/select-app');
      } else {
        toast({
          title: 'Incorrect code',
          description: 'The verification code is incorrect. Please try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error during OTP verification:', error);
      toast({
        title: 'Error',
        description: 'An error occurred. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack spacing={8} align="center" justify="center" w="100%" p={8} bg="white" borderRadius="md">
      {step === 'phone' && (
        <Box w="100%" maxW="500px">
          <Text fontSize="lg" mb={4}>Enter your phone number (international format)</Text>
          <Input 
            placeholder="+33612345678" 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            mb={4}
          />
          <Button 
            colorScheme="purple"
            onClick={verifyAndGoToApps}
            isLoading={loading}
            width="100%"
            backgroundColor="rgb(100, 26, 230)"
          >
            Verify
          </Button>
        </Box>
      )}
      
      {step === 'otp' && (
        <Box w="100%" maxW="500px">
          <Text mb={4}>Enter the code received by SMS</Text>
          <Input 
            placeholder="123456" 
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
            Verify
          </Button>
        </Box>
      )}
    </VStack>
  );
}
