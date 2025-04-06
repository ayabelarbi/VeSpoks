import React from 'react';
import { 
  Box, 
  Heading, 
  SimpleGrid, 
  VStack, 
  Text, 
  useColorModeValue, 
  Center, 
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Icon, 
  Image, 
  HStack
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FaBicycle } from 'react-icons/fa';
import { MdElectricScooter } from 'react-icons/md';
import { getUserData } from '../services/wallet-service';
import Lime from '../../public/lime.svg';
import Velib from '../../public/velib.png';
interface AppCard {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  available: boolean;
}

export const SelectAppPage: React.FC = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedApp, setSelectedApp] = React.useState<AppCard | null>(null);
  const userData = getUserData();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const apps: AppCard[] = [
    {
      id: 'lime',
      name: 'Lime',
      description: 'Electric scooters for short urban trips',
      icon: MdElectricScooter,
      color: '#4caf50',
      available: true
    },
    // {
    //   id: 'velib',
    //   name: 'Velib',
    //   description: 'Shared bicycles across the city',
    //   icon: FaBicycle,
    //   color: '#2196f3',
    //   available: true
    //}
  ];

  // const handleSelectApp = (app: AppCard) => {
  //   setSelectedApp(app);
  //   if (app.available) {
  //     onOpen();
  //   }
  // };

  // const handleConfirmSelection = () => {
  //   onClose();
  //   if (selectedApp) {
  //     navigate(`/app/${selectedApp.id}`);
  //   }
  // };

  return (
    <VStack spacing={8} align="center" justify="center" w="100%" p={8} bg="white" borderRadius="md">
      <Text fontSize="2xl" fontWeight="bold">Select your app</Text>
      <HStack>
      <Image src={Lime} alt="Lime" boxSize="50px" />
        <Button onClick={() => navigate('/view-trips')}>Lime</Button>
      </HStack>
      <HStack>
        <Image src={Velib} alt="Velib" boxSize="50px" />
        <Button onClick={() => navigate('/view-trips')}>Velib</Button>
      </HStack>
    </VStack>
  );
};

export default SelectAppPage; 