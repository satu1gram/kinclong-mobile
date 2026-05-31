import React from 'react';
import Svg, {
  Path, Line, Circle, Polyline, Polygon, Rect, G,
} from 'react-native-svg';

export type KIconName =
  | 'queue' | 'history' | 'home' | 'wrench' | 'settings' | 'more'
  | 'plus' | 'x' | 'check' | 'check-circle'
  | 'search' | 'download' | 'edit' | 'trash'
  | 'car' | 'bike' | 'kiosk' | 'user' | 'users' | 'building'
  | 'mail' | 'lock' | 'logout' | 'crown' | 'bell'
  | 'clock' | 'play' | 'cash' | 'calendar' | 'refresh'
  | 'chevron-right' | 'chevron-left' | 'chevron-down' | 'chevron-up'
  | 'alert' | 'info' | 'star' | 'phone' | 'shield' | 'chart' | 'filter' | 'tag'
  | 'eye' | 'eye-off';

type Props = { name: KIconName; size?: number; color?: string };

export default function KIcon({ name, size = 20, color = '#64748b' }: Props) {
  const s = { stroke: color, strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };
  const w = size;
  const h = size;
  const v = '0 0 24 24';

  switch (name) {
    case 'queue':
      return (
        <Svg width={w} height={h} viewBox={v} fill="none">
          <Line {...s} x1="8" y1="6" x2="21" y2="6"/>
          <Line {...s} x1="8" y1="12" x2="21" y2="12"/>
          <Line {...s} x1="8" y1="18" x2="21" y2="18"/>
          <Line {...s} x1="3" y1="6" x2="3.01" y2="6"/>
          <Line {...s} x1="3" y1="12" x2="3.01" y2="12"/>
          <Line {...s} x1="3" y1="18" x2="3.01" y2="18"/>
        </Svg>
      );
    case 'history':
      return (
        <Svg width={w} height={h} viewBox={v} fill="none">
          <Polyline {...s} points="1 4 1 10 7 10"/>
          <Path {...s} d="M3.51 15a9 9 0 1 0 .49-4.95"/>
          <Polyline {...s} points="12 7 12 12 15 14"/>
        </Svg>
      );
    case 'home':
      return (
        <Svg width={w} height={h} viewBox={v} fill="none">
          <Path {...s} d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <Polyline {...s} points="9 22 9 12 15 12 15 22"/>
        </Svg>
      );
    case 'wrench':
      return (
        <Svg width={w} height={h} viewBox={v} fill="none">
          <Path {...s} d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
        </Svg>
      );
    case 'settings':
      return (
        <Svg width={w} height={h} viewBox={v} fill="none">
          <Circle {...s} cx="12" cy="12" r="3"/>
          <Path {...s} d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </Svg>
      );
    case 'more':
      return (
        <Svg width={w} height={h} viewBox={v} fill="none">
          <Circle {...s} cx="12" cy="12" r="1" fill={color}/>
          <Circle {...s} cx="19" cy="12" r="1" fill={color}/>
          <Circle {...s} cx="5" cy="12" r="1" fill={color}/>
        </Svg>
      );
    case 'plus':
      return (
        <Svg width={w} height={h} viewBox={v} fill="none">
          <Line {...s} x1="12" y1="5" x2="12" y2="19"/>
          <Line {...s} x1="5" y1="12" x2="19" y2="12"/>
        </Svg>
      );
    case 'x':
      return (
        <Svg width={w} height={h} viewBox={v} fill="none">
          <Line {...s} x1="18" y1="6" x2="6" y2="18"/>
          <Line {...s} x1="6" y1="6" x2="18" y2="18"/>
        </Svg>
      );
    case 'check':
      return (
        <Svg width={w} height={h} viewBox={v} fill="none">
          <Polyline {...s} points="20 6 9 17 4 12"/>
        </Svg>
      );
    case 'check-circle':
      return (
        <Svg width={w} height={h} viewBox={v} fill="none">
          <Path {...s} d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <Polyline {...s} points="22 4 12 14.01 9 11.01"/>
        </Svg>
      );
    case 'search':
      return (
        <Svg width={w} height={h} viewBox={v} fill="none">
          <Circle {...s} cx="11" cy="11" r="8"/>
          <Line {...s} x1="21" y1="21" x2="16.65" y2="16.65"/>
        </Svg>
      );
    case 'download':
      return (
        <Svg width={w} height={h} viewBox={v} fill="none">
          <Path {...s} d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <Polyline {...s} points="7 10 12 15 17 10"/>
          <Line {...s} x1="12" y1="15" x2="12" y2="3"/>
        </Svg>
      );
    case 'edit':
      return (
        <Svg width={w} height={h} viewBox={v} fill="none">
          <Path {...s} d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <Path {...s} d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </Svg>
      );
    case 'trash':
      return (
        <Svg width={w} height={h} viewBox={v} fill="none">
          <Polyline {...s} points="3 6 5 6 21 6"/>
          <Path {...s} d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
        </Svg>
      );
    case 'car':
      return (
        <Svg width={w} height={h} viewBox={v} fill="none">
          <Path {...s} d="M5 17H3v-5l2.5-5h13l2.5 5v5h-2"/>
          <Circle {...s} cx="7.5" cy="17" r="1.5"/>
          <Circle {...s} cx="16.5" cy="17" r="1.5"/>
          <Line {...s} x1="5" y1="12" x2="19" y2="12"/>
        </Svg>
      );
    case 'bike':
      return (
        <Svg width={w} height={h} viewBox={v} fill="none">
          <Circle {...s} cx="18.5" cy="17.5" r="3.5"/>
          <Circle {...s} cx="5.5" cy="17.5" r="3.5"/>
          <Circle {...s} cx="15" cy="5" r="1"/>
          <Path {...s} d="M12 17.5V14l-3-3 4-3 2 3h2"/>
        </Svg>
      );
    case 'kiosk':
      return (
        <Svg width={w} height={h} viewBox={v} fill="none">
          <Rect {...s} x="5" y="2" width="14" height="20" rx="2"/>
          <Line {...s} x1="9" y1="7" x2="15" y2="7"/>
          <Line {...s} x1="9" y1="11" x2="15" y2="11"/>
          <Line {...s} x1="9" y1="15" x2="11" y2="15"/>
        </Svg>
      );
    case 'user':
      return (
        <Svg width={w} height={h} viewBox={v} fill="none">
          <Path {...s} d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <Circle {...s} cx="12" cy="7" r="4"/>
        </Svg>
      );
    case 'users':
      return (
        <Svg width={w} height={h} viewBox={v} fill="none">
          <Path {...s} d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <Circle {...s} cx="9" cy="7" r="4"/>
          <Path {...s} d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <Path {...s} d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </Svg>
      );
    case 'building':
      return (
        <Svg width={w} height={h} viewBox={v} fill="none">
          <Rect {...s} x="2" y="7" width="20" height="14" rx="2"/>
          <Path {...s} d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
        </Svg>
      );
    case 'mail':
      return (
        <Svg width={w} height={h} viewBox={v} fill="none">
          <Path {...s} d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <Polyline {...s} points="22 6 12 13 2 6"/>
        </Svg>
      );
    case 'lock':
      return (
        <Svg width={w} height={h} viewBox={v} fill="none">
          <Rect {...s} x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <Path {...s} d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </Svg>
      );
    case 'logout':
      return (
        <Svg width={w} height={h} viewBox={v} fill="none">
          <Path {...s} d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <Polyline {...s} points="16 17 21 12 16 7"/>
          <Line {...s} x1="21" y1="12" x2="9" y2="12"/>
        </Svg>
      );
    case 'crown':
      return (
        <Svg width={w} height={h} viewBox={v} fill="none">
          <Path stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z"/>
        </Svg>
      );
    case 'bell':
      return (
        <Svg width={w} height={h} viewBox={v} fill="none">
          <Path {...s} d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <Path {...s} d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </Svg>
      );
    case 'clock':
      return (
        <Svg width={w} height={h} viewBox={v} fill="none">
          <Circle {...s} cx="12" cy="12" r="10"/>
          <Polyline {...s} points="12 6 12 12 16 14"/>
        </Svg>
      );
    case 'play':
      return (
        <Svg width={w} height={h} viewBox={v} fill="none">
          <Polygon fill={color} stroke="none" points="5 3 19 12 5 21 5 3"/>
        </Svg>
      );
    case 'cash':
      return (
        <Svg width={w} height={h} viewBox={v} fill="none">
          <Rect {...s} x="1" y="4" width="22" height="16" rx="2"/>
          <Line {...s} x1="1" y1="10" x2="23" y2="10"/>
        </Svg>
      );
    case 'calendar':
      return (
        <Svg width={w} height={h} viewBox={v} fill="none">
          <Rect {...s} x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <Line {...s} x1="16" y1="2" x2="16" y2="6"/>
          <Line {...s} x1="8" y1="2" x2="8" y2="6"/>
          <Line {...s} x1="3" y1="10" x2="21" y2="10"/>
        </Svg>
      );
    case 'refresh':
      return (
        <Svg width={w} height={h} viewBox={v} fill="none">
          <Polyline {...s} points="1 4 1 10 7 10"/>
          <Path {...s} d="M3.51 15a9 9 0 1 0 .49-4.95"/>
        </Svg>
      );
    case 'chevron-right':
      return (
        <Svg width={w} height={h} viewBox={v} fill="none">
          <Polyline {...s} points="9 18 15 12 9 6"/>
        </Svg>
      );
    case 'chevron-left':
      return (
        <Svg width={w} height={h} viewBox={v} fill="none">
          <Polyline {...s} points="15 18 9 12 15 6"/>
        </Svg>
      );
    case 'chevron-down':
      return (
        <Svg width={w} height={h} viewBox={v} fill="none">
          <Polyline {...s} points="6 9 12 15 18 9"/>
        </Svg>
      );
    case 'chevron-up':
      return (
        <Svg width={w} height={h} viewBox={v} fill="none">
          <Polyline {...s} points="18 15 12 9 6 15"/>
        </Svg>
      );
    case 'alert':
      return (
        <Svg width={w} height={h} viewBox={v} fill="none">
          <Path {...s} d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <Line {...s} x1="12" y1="9" x2="12" y2="13"/>
          <Line {...s} x1="12" y1="17" x2="12.01" y2="17"/>
        </Svg>
      );
    case 'info':
      return (
        <Svg width={w} height={h} viewBox={v} fill="none">
          <Circle {...s} cx="12" cy="12" r="10"/>
          <Line {...s} x1="12" y1="8" x2="12" y2="12"/>
          <Line {...s} x1="12" y1="16" x2="12.01" y2="16"/>
        </Svg>
      );
    case 'star':
      return (
        <Svg width={w} height={h} viewBox={v} fill="none">
          <Polygon {...s} points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </Svg>
      );
    case 'phone':
      return (
        <Svg width={w} height={h} viewBox={v} fill="none">
          <Path {...s} d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.71 3.41a2 2 0 0 1 2-2.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
        </Svg>
      );
    case 'shield':
      return (
        <Svg width={w} height={h} viewBox={v} fill="none">
          <Path {...s} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </Svg>
      );
    case 'chart':
      return (
        <Svg width={w} height={h} viewBox={v} fill="none">
          <Line {...s} x1="18" y1="20" x2="18" y2="10"/>
          <Line {...s} x1="12" y1="20" x2="12" y2="4"/>
          <Line {...s} x1="6" y1="20" x2="6" y2="14"/>
        </Svg>
      );
    case 'filter':
      return (
        <Svg width={w} height={h} viewBox={v} fill="none">
          <Polygon {...s} points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
        </Svg>
      );
    case 'tag':
      return (
        <Svg width={w} height={h} viewBox={v} fill="none">
          <Path {...s} d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
          <Line {...s} x1="7" y1="7" x2="7.01" y2="7"/>
        </Svg>
      );
    case 'eye':
      return (
        <Svg width={w} height={h} viewBox={v} fill="none">
          <Path {...s} d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <Circle {...s} cx="12" cy="12" r="3"/>
        </Svg>
      );
    case 'eye-off':
      return (
        <Svg width={w} height={h} viewBox={v} fill="none">
          <Path {...s} d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
          <Line {...s} x1="1" y1="1" x2="23" y2="23"/>
        </Svg>
      );
    default:
      return (
        <Svg width={w} height={h} viewBox={v} fill="none">
          <Circle {...s} cx="12" cy="12" r="10"/>
        </Svg>
      );
  }
}
