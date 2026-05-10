import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const lessons = [
  {
    title: 'Colours',
    subtitle: 'Flashcards • Video • Quiz',
    emoji: '🌈',
    color: '#F3E8FF',
  },
  {
    title: 'Vegetables',
    subtitle: 'Learn healthy foods',
    emoji: '🥕',
    color: '#DCFCE7',
  },
  {
    title: 'Animals',
    subtitle: 'Identify and match',
    emoji: '🦒',
    color: '#DBEAFE',
  },
  {
    title: 'Feelings',
    subtitle: 'Explore emotions gently',
    emoji: '😊',
    color: '#FCE7F3',
  },
];

export default function LearnScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={['#8B5CF6', '#7C3AED', '#5B21B6']}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ padding: 24 }}>
            <Text style={{ color: 'white', fontSize: 34, fontWeight: '900' }}>
              Learn 🌱
            </Text>

            <Text
              style={{
                color: 'rgba(255,255,255,0.85)',
                fontSize: 17,
                marginTop: 10,
                lineHeight: 26,
              }}
            >
              Explore calm learning activities made just for you.
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
            {lessons.map((item) => (
              <TouchableOpacity
                key={item.title}
                style={{
                  backgroundColor: item.color,
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
                    <Text style={{ fontSize: 54 }}>{item.emoji}</Text>

                    <View style={{ marginLeft: 18 }}>
                      <Text
                        style={{
                          fontSize: 28,
                          fontWeight: '800',
                          color: '#4C1D95',
                        }}
                      >
                        {item.title}
                      </Text>

                      <Text
                        style={{
                          color: '#6B7280',
                          marginTop: 6,
                          fontSize: 15,
                        }}
                      >
                        {item.subtitle}
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
                      name='arrow-forward'
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
