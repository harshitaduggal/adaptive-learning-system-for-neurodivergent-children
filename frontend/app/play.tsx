import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const games = [
  {
    title: 'Match Game',
    subtitle: 'Find matching colours and objects',
    emoji: '🎨',
    color: '#F3E8FF',
  },
  {
    title: 'Sorting Game',
    subtitle: 'Place items in the correct basket',
    emoji: '🧺',
    color: '#FEF3C7',
  },
  {
    title: 'Memory Cards',
    subtitle: 'Flip and find the same pictures',
    emoji: '🃏',
    color: '#DBEAFE',
  },
  {
    title: 'Find Object',
    subtitle: 'Tap the correct object gently',
    emoji: '🔍',
    color: '#DCFCE7',
  },
];

export default function PlayScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={['#8B5CF6', '#7C3AED', '#5B21B6']}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ padding: 24 }}>
            <Text style={{ color: 'white', fontSize: 34, fontWeight: '900' }}>
              Play 🎮
            </Text>

            <Text
              style={{
                color: 'rgba(255,255,255,0.85)',
                fontSize: 17,
                marginTop: 10,
                lineHeight: 26,
              }}
            >
              Calm games that help you learn while having fun.
            </Text>
          </View>

          <View
            style={{
              backgroundColor: 'white',
              borderTopLeftRadius: 40,
              borderTopRightRadius: 40,
              padding: 20,
              minHeight: 800,
            }}
          >
            {games.map((game) => (
              <TouchableOpacity
                key={game.title}
                style={{
                  backgroundColor: game.color,
                  borderRadius: 28,
                  padding: 22,
                  marginBottom: 18,
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 54 }}>{game.emoji}</Text>

                    <View style={{ marginLeft: 18, maxWidth: 180 }}>
                      <Text
                        style={{
                          fontSize: 26,
                          fontWeight: '800',
                          color: '#4C1D95',
                        }}
                      >
                        {game.title}
                      </Text>

                      <Text
                        style={{
                          color: '#6B7280',
                          marginTop: 6,
                          fontSize: 15,
                          lineHeight: 22,
                        }}
                      >
                        {game.subtitle}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      backgroundColor: '#7C3AED',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Ionicons
                      name='play'
                      size={20}
                      color='white'
                    />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}
