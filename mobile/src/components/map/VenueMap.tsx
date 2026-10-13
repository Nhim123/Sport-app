import { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { color, radius, shadow } from '../../theme/tokens';

export interface MapPoint { id: string; name: string; lat: number; lng: number; priceLabel: string }

interface Props {
  center: { lat: number; lng: number };
  points: MapPoint[];
  onSelect?: (id: string) => void;
  height?: number;
}

// Bản đồ OpenStreetMap (Leaflet) render trong WebView — không cần API key, chạy được trong Expo Go.
// Tâm = vị trí người dùng; marker = các sân gần đây. Chạm marker → postMessage(id) về RN.
export function VenueMap({ center, points, onSelect, height = 320 }: Props) {
  const html = useMemo(() => {
    const c = JSON.stringify(center);
    const p = JSON.stringify(points);
    return `<!DOCTYPE html><html><head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<style>html,body,#map{height:100%;margin:0;padding:0;background:#F4F5F0}</style>
</head><body><div id="map"></div>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
  var C=${c}, P=${p};
  var map=L.map('map',{zoomControl:false}).setView([C.lat,C.lng],14);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap'}).addTo(map);
  L.circleMarker([C.lat,C.lng],{radius:9,color:'#111',weight:3,fillColor:'#C6F833',fillOpacity:1}).addTo(map).bindPopup('Vị trí của bạn');
  var group=[[C.lat,C.lng]];
  P.forEach(function(pt){
    var m=L.marker([pt.lat,pt.lng]).addTo(map);
    m.bindPopup('<b>'+pt.name+'</b><br>'+pt.priceLabel);
    m.on('click',function(){ if(window.ReactNativeWebView){window.ReactNativeWebView.postMessage(pt.id);} });
    group.push([pt.lat,pt.lng]);
  });
  if(group.length>1){ try{ map.fitBounds(group,{padding:[40,40],maxZoom:15}); }catch(e){} }
</script></body></html>`;
  }, [center, points]);

  return (
    <View style={[styles.wrap, { height }]}>
      <WebView
        originWhitelist={['*']}
        source={{ html }}
        style={styles.web}
        onMessage={e => onSelect?.(e.nativeEvent.data)}
        javaScriptEnabled
        domStorageEnabled
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { borderRadius: radius.card, overflow: 'hidden', backgroundColor: color.surface, marginTop: 12, ...shadow.card },
  web: { flex: 1, backgroundColor: 'transparent' },
});
