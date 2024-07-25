// src/components/LayoutStyles.ts
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: /*'#fff'*/ "yellow",
  },
  header: {
    height: 60,
    backgroundColor: /*'#f8f9fa'*/"red",
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  logo: {
    fontSize: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    backgroundColor:"blue",
    flex: 1,
  },
});
