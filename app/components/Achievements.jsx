import {useState, useEffect} from "react";
import {View,Text,StyleSheet} from "react-native"

export default function Achievements(){
    const dummyAchievements = [
  {
    id: 1,
    milestone: 25,
    awarded_at: "2026-03-01"
  },
  {
    id: 2,
    milestone: 50,
    awarded_at: "2026-04-01"
  }
];
 const [achievements, setAchievements]=useState([])
 useEffect(()=>{
    setAchievements(dummyAchievements)
 },[])
 const badgeConfig = {
  25: { label: "Bronze Badge", icon: "🥉" },
  50: { label: "Silver Badge", icon: "🥈" },
  75: { label: "Gold Badge", icon: "🥇" }
};
 

  const badge = badgeConfig[achievement.milestone];

   return (
    <View style={styles.container}>
      <Text style={styles.title}>Achievements</Text>

      <View style={styles.badgesRow}>
        {achievements.map((achievement) => {

          const badge = badgeConfig[achievement.milestone];

          return (
            <View key={achievement.id} style={styles.badge}>
              <Text style={styles.badgeIcon}>{badge.icon}</Text>

              <Text>{badge.label}</Text>

              <Text>
                {new Date(achievement.awarded_at).toDateString()}
              </Text>
            </View>
          );

        })}
      </View>

    </View>
  );
}
const styles = StyleSheet.create({

  container:{
    marginTop:20
  },

  title:{
    fontSize:20,
    fontWeight:"bold",
    marginBottom:10
  },

  badgesRow:{
    flexDirection:"row",
    justifyContent:"space-around"
  },

  badge:{
    alignItems:"center"
  },

  badgeIcon:{
    fontSize:40
  }

})
