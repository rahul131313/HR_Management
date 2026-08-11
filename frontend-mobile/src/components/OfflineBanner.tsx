import { Text, View } from 'react-native';
export function OfflineBanner({ visible }: { visible: boolean }) { return visible ? <View style={{ backgroundColor:'#b91c1c', padding:8 }}><Text style={{ color:'#fff', textAlign:'center', fontSize:12, fontWeight:'600' }}>No internet connection · Showing cached data</Text></View> : null; }
