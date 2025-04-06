import React, { useState } from 'react';
import { 
  VStack, 
  Text, 
  useColorModeValue, 
  Image, 
  HStack,
  Box,
  Flex,
  IconButton,
  Badge,
  Center,
  Button,
  useToast
} from '@chakra-ui/react';
import { FaChevronLeft, FaChevronRight, FaGift } from 'react-icons/fa';
import { MdDateRange, MdAccessTime } from 'react-icons/md';
import Lime from '../../public/lime.svg';
import Velib from '../../public/velib.png';
import { useNavigate } from 'react-router-dom';

interface Trip {
  id: string;
  provider: string;
  date: string;
  time: string;
  duration: string;
  distance: string;
  startLocation: string;
  endLocation: string;
  cost: string;
  rewardsAvailable?: boolean;
}

export const ViewTripsPage: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [claimingReward, setClaimingReward] = useState(false);
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const highlightColor = useColorModeValue('teal.500', 'teal.300');
  const API_URL = 'http://localhost:3002/api/v1';
  const toast = useToast();
  const navigate = useNavigate();

  const claimReward = async (tripId: string) => {
    try {
      setClaimingReward(true);
      const wallet = "69Xp2gGaCDwBV33ixTpGUEQpYqz3c8HVanjmSaeCes6f";
      
      console.log(`Claiming token for trip ${tripId} with wallet ${wallet}`);
      
      // Simulate API call to claim reward
      // In a real application, you would call your API here
      try {
        await fetch(`${API_URL}/claim`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            wallet,
            tripId
          }),
        });
        // API response handling would go here
      } catch (_) {
        console.log('API call failed but continuing with demo flow');
      }
      
      // Show success message regardless of response in this demo
      setTimeout(() => {
        toast({
          title: "Reward claimed",
          description: "Your trip rewards have been credited to your wallet",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top"
        });
        
        // Redirect to home page after 3 seconds
        setTimeout(() => {
          navigate('/');
        }, 3000);
        
        setClaimingReward(false);
      }, 3000);
    } catch (error) {
      console.error('Error claiming reward:', error);
      setClaimingReward(false);
      toast({
        title: "Error claiming reward",
        description: "Please try again later",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Sample trip data
  const trips: Trip[] = [
    {
      id: '1',
      provider: 'Lime',
      date: '2023-05-15',
      time: '14:30',
      duration: '15 min',
      distance: '2.3 km',
      startLocation: 'Bastille',
      endLocation: 'République',
      cost: '3.50€',
      rewardsAvailable: true
    },
    // {
    //   id: '2',
    //   provider: 'Velib',
    //   date: '2023-05-14',
    //   time: '09:15',
    //   duration: '22 min',
    //   distance: '3.1 km',
    //   startLocation: 'Nation',
    //   endLocation: 'Père Lachaise',
    //   cost: '2.00€'
    // },
    {
      id: '3',
      provider: 'Lime',
      date: '2023-05-12',
      time: '18:45',
      duration: '10 min',
      distance: '1.7 km',
      startLocation: 'Opéra',
      endLocation: 'Grands Boulevards',
      cost: '2.75€',
      rewardsAvailable: true
    },
    // {
    //   id: '4',
    //   provider: 'Velib',
    //   date: '2023-05-10',
    //   time: '12:30',
    //   duration: '30 min',
    //   distance: '4.2 km',
    //   startLocation: 'Trocadéro',
    //   endLocation: 'Champ de Mars',
    //   cost: '2.00€'
    // },
    {
      id: '5',
      provider: 'Lime',
      date: '2023-05-08',
      time: '20:15',
      duration: '18 min',
      distance: '2.9 km',
      startLocation: 'Châtelet',
      endLocation: 'Hôtel de Ville',
      cost: '3.25€'
    },
    // {
    //   id: '6',
    //   provider: 'Velib',
    //   date: '2023-05-05',
    //   time: '16:45',
    //   duration: '25 min',
    //   distance: '3.5 km',
    //   startLocation: 'Montparnasse',
    //   endLocation: 'Luxembourg',
    //   cost: '2.00€'
    // },
    {
      id: '7',
      provider: 'Lime',
      date: '2023-05-03',
      time: '11:20',
      duration: '12 min',
      distance: '1.8 km',
      startLocation: 'Concorde',
      endLocation: 'Madeleine',
      cost: '2.50€',
      rewardsAvailable: true
    },
    // {
    //   id: '8',
    //   provider: 'Velib',
    //   date: '2023-05-01',
    //   time: '15:30',
    //   duration: '28 min',
    //   distance: '3.8 km',
    //   startLocation: 'Bastille',
    //   endLocation: 'Gare de Lyon',
    //   cost: '2.00€'
    // }
  ];

  const displayedTrips = trips.slice(currentIndex, currentIndex + 3);

  const handleNext = () => {
    if (currentIndex + 3 < trips.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <VStack spacing={6} w="full" p={4}>
      <Text fontSize="2xl" fontWeight="bold" alignSelf="flex-start">
        My Recent Trips
      </Text>
      
      <Box position="relative" w="full" py={4}>
        <Flex justify="space-between" align="center">
          <IconButton
            aria-label="Previous trips"
            icon={<FaChevronLeft />}
            onClick={handlePrev}
            isDisabled={currentIndex === 0}
            variant="ghost"
            size="lg"
          />
          
          <HStack spacing={4} overflow="hidden" w="full" justifyContent="center">
            {displayedTrips.map((trip) => (
              <Box
                key={trip.id}
                bg={bgColor}
                borderWidth="1px"
                borderColor={borderColor}
                borderRadius="lg"
                overflow="hidden"
                w="300px"
                boxShadow="md"
                transition="transform 0.3s"
                _hover={{ transform: 'translateY(-5px)' }}
              >
                <Box 
                  p={1} 
                  bg={trip.provider === 'Lime' ? 'green.500' : 'blue.500'} 
                  w="full"
                >
                  <HStack px={2}>
                    <Image 
                      src={trip.provider === 'Lime' ? Lime : Velib} 
                      alt={trip.provider}
                      boxSize="24px"
                    />
                    <Text color="white" fontWeight="bold">{trip.provider}</Text>
                  </HStack>
                </Box>
                
                <VStack p={4} align="stretch" spacing={3}>
                  <HStack>
                    <MdDateRange />
                    <Text fontSize="sm">{trip.date}</Text>
                    <MdAccessTime />
                    <Text fontSize="sm">{trip.time}</Text>
                  </HStack>
                  
                  <HStack justify="space-between">
                    <VStack align="flex-start" spacing={0}>
                      <Text fontSize="xs" color="gray.500">From</Text>
                      <Text fontWeight="medium">{trip.startLocation}</Text>
                    </VStack>
                    <VStack align="flex-end" spacing={0}>
                      <Text fontSize="xs" color="gray.500">To</Text>
                      <Text fontWeight="medium">{trip.endLocation}</Text>
                    </VStack>
                  </HStack>
                  
                  <HStack justify="space-between">
                    <Badge colorScheme="purple">{trip.duration}</Badge>
                    <Badge colorScheme="teal">{trip.distance}</Badge>
                  </HStack>
                  
                  <Flex justify="space-between" align="center">
                    {/* <Text fontWeight="bold" color={highlightColor}>
                      {trip.cost}
                    </Text> */}
                    
                    {trip.provider === 'Lime' && trip.rewardsAvailable && (
                      <Button 
                        size="sm" 
                        colorScheme="green" 
                        leftIcon={<FaGift />}
                        onClick={() => claimReward(trip.id)}
                        isLoading={claimingReward}
                        loadingText="Claiming..."
                      >
                        Claim Rewards
                      </Button>
                    )}
                  </Flex>
                </VStack>
              </Box>
            ))}
          </HStack>
          
          <IconButton
            aria-label="Next trips"
            icon={<FaChevronRight />}
            onClick={handleNext}
            isDisabled={currentIndex + 3 >= trips.length}
            variant="ghost"
            size="lg"
          />
        </Flex>
        
        <Center mt={4}>
          <HStack spacing={1}>
            {trips.map((_, index) => (
              <Box
                key={index}
                w="8px"
                h="8px"
                borderRadius="full"
                bg={index >= currentIndex && index < currentIndex + 3 ? highlightColor : 'gray.300'}
              />
            ))}
          </HStack>
        </Center>
      </Box>
    </VStack>
  );
};

export default ViewTripsPage; 