import { green } from "react-native-reanimated/lib/typescript/Colors";

export const Colors = {
  //Background Colors
  bgPrimary: '#fff8ec',
  bgAccent: '#faf1e2',
  bgHighlight: '#ffe37a',
  bgCard: '#fffdf8',
  bgCard2:'#FFFAF1',

  //Text Colors
  textPrimary: '#6e3a0f',
  textSecondary: '#ab653a',
  textMuted: '#bea690',
  textDisabled: '#dcc6b4',
  textAddBtn: '#36A1C7',
  textRemoveBtn: '#F24822',

  // Tab Bar Colors
  tabActive: '#eca205',
  tabInactive: '#dcc6b4',
  tabGlow: '#ffe37a',

  //Fillter Tabs colors
  filterActiveBg: '#ffe37a',
  filterActiveText: '#ab653a',
  filterInactiveBg: '#faf1e2',
  filterInactiveText: '#bea690',

  // Button Colors
  btnPrimary: '#FF7D5C',
  btnSecondary: '#FFFAF1',
  btnAdd: '#BBE7FF',
  btnRemove: '#FFD4CD',

  // Status Color
  bgUpcoming: '#3B54E045',
  textUpcoming: '#3B54E0',
  bgActive: '#F9731645',
  textActive: '#F97316',
  bgCompleted: '#64FF7645',
  textCompleted: '#33BA42',


  //Step bar colors
  stepActive: '#FF613A',
  stepInactive: '#D9D9D9',

  //other colors
  green:'#33BA42',
  red: '#E70017',
  black: '#403E3E',

  //Icon Colors
  iconOrange: '#FF613A',
  iconBrown: '#CC9160',

  //Gradient - satellite icon
  gradientSatellite: ['#ff7d5c', '#f7630d', '#ff613a'] as const,

  //Gradient - Map icon
  gradientMap: ['#55b8dc', '#3dba9f', '#1e6f58'] as const,
}as const;

export type ColorKey = keyof typeof Colors;