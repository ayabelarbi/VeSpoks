import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Button, Text, Title, Card, Divider, ActivityIndicator } from 'react-native-paper';

const ClaimRewardsScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [journeys, setJourneys] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    // Simuler un chargement de données depuis une API
    const loadData = setTimeout(() => {
      // Données factices des trajets
      const mockJourneys = [
        { id: 1, date: '2 avril 2025', from: 'Montparnasse', to: 'Gare du Nord', points: 15, type: 'Métro' },
        { id: 2, date: '3 avril 2025', from: 'Gare du Nord', to: 'La Défense', points: 25, type: 'Train' },
        { id: 3, date: '4 avril 2025', from: 'La Défense', to: 'Châtelet', points: 10, type: 'Métro' },
      ];
      
      const total = mockJourneys.reduce((sum, journey) => sum + journey.points, 0);
      
      setJourneys(mockJourneys);
      setTotalPoints(total);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(loadData);
  }, []);

  const handleClaimRewards = () => {
    setIsClaiming(true);
    
    // Simuler une requête à l'API pour réclamer les points
    setTimeout(() => {
      // Réinitialiser les trajets après la réclamation
      setJourneys([]);
      setTotalPoints(0);
      setIsClaiming(false);
      
      // Dans une application réelle, vous afficheriez une confirmation et peut-être naviguerait vers un écran de succès
    }, 2000);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Chargement de vos trajets...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Title style={styles.title}>Vos récompenses</Title>
        <Card style={styles.pointsCard}>
          <Card.Content style={styles.pointsCardContent}>
            <Text style={styles.pointsLabel}>Points disponibles</Text>
            <Text style={styles.pointsValue}>{totalPoints}</Text>
          </Card.Content>
        </Card>
      </View>
      
      <ScrollView style={styles.journeysList}>
        <Title style={styles.journeysTitle}>Vos trajets verts récents</Title>
        
        {journeys.length > 0 ? (
          journeys.map((journey) => (
            <Card key={journey.id} style={styles.journeyCard}>
              <Card.Content>
                <Text style={styles.journeyDate}>{journey.date}</Text>
                <View style={styles.journeyRoute}>
                  <Text style={styles.journeyLocation}>{journey.from}</Text>
                  <Text style={styles.journeyArrow}>→</Text>
                  <Text style={styles.journeyLocation}>{journey.to}</Text>
                </View>
                <View style={styles.journeyDetails}>
                  <Text style={styles.journeyType}>{journey.type}</Text>
                  <Text style={styles.journeyPoints}>+{journey.points} pts</Text>
                </View>
              </Card.Content>
            </Card>
          ))
        ) : (
          <Text style={styles.noJourneysText}>
            Aucun trajet récent. Utilisez les transports en commun pour gagner des points!
          </Text>
        )}
      </ScrollView>
      
      <View style={styles.footerContainer}>
        <Button
          mode="contained"
          onPress={handleClaimRewards}
          style={styles.claimButton}
          disabled={totalPoints === 0 || isClaiming}
          loading={isClaiming}
        >
          {isClaiming ? 'Réclamation en cours...' : 'Réclamer mes récompenses'}
        </Button>
        
        <Button
          mode="text"
          onPress={() => navigation.navigate('PhoneVerification')}
          style={styles.textButton}
        >
          Mettre à jour mon téléphone
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 15,
    color: '#666',
  },
  headerContainer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 15,
  },
  pointsCard: {
    marginTop: 10,
    backgroundColor: '#4CAF50',
  },
  pointsCardContent: {
    alignItems: 'center',
    padding: 10,
  },
  pointsLabel: {
    color: '#fff',
    fontSize: 16,
  },
  pointsValue: {
    color: '#fff',
    fontSize: 42,
    fontWeight: 'bold',
  },
  journeysList: {
    flex: 1,
    padding: 20,
  },
  journeysTitle: {
    fontSize: 18,
    marginBottom: 15,
    color: '#333',
  },
  journeyCard: {
    marginBottom: 10,
  },
  journeyDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  journeyRoute: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  journeyLocation: {
    fontSize: 16,
    fontWeight: '500',
  },
  journeyArrow: {
    marginHorizontal: 8,
    color: '#4CAF50',
  },
  journeyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  journeyType: {
    fontSize: 14,
    color: '#666',
  },
  journeyPoints: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  noJourneysText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
  footerContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  claimButton: {
    paddingVertical: 8,
    backgroundColor: '#4CAF50',
  },
  textButton: {
    marginTop: 10,
  },
});

export default ClaimRewardsScreen; 