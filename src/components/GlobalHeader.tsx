import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface GlobalHeaderProps {
  title?: string;
  onBack?: () => void;
  onNavigateToSomeday?: () => void;
  onNavigateToGroups?: () => void;
}

export default function GlobalHeader({
  title,
  onBack,
  onNavigateToSomeday,
  onNavigateToGroups,
}: GlobalHeaderProps) {
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <>
      {/* 전역 헤더 */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingTop: Platform.OS === 'web' ? 10 : 50,
          paddingBottom: 12,
          backgroundColor: 'white',
          borderBottomWidth: 1,
          borderBottomColor: '#e0e0e0',
        }}
      >
        {/* 왼쪽: 뒤로가기 버튼 또는 제목/앱 이름 */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {onBack && (
            <TouchableOpacity
              onPress={onBack}
              style={{ marginRight: 8, marginLeft: -8, padding: 0 }}
            >
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
          )}
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#333' }}>
            {title || 'Yooti'}
          </Text>
        </View>

        {/* 오른쪽: 햄버거 메뉴 버튼 */}
        <TouchableOpacity
          onPress={() => setMenuVisible(true)}
          style={{ padding: 4, marginRight: -8 }}
        >
          <Ionicons name="menu" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* 햄버거 메뉴 모달 */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
          onPress={() => setMenuVisible(false)}
        >
          <View
            style={{
              position: 'absolute',
              top: Platform.OS === 'web' ? 60 : 100,
              right: 20,
              backgroundColor: 'white',
              borderRadius: 8,
              padding: 10,
              minWidth: 150,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <TouchableOpacity
              style={{ paddingVertical: 12, paddingHorizontal: 16 }}
              onPress={() => {
                setMenuVisible(false);
                if (onNavigateToGroups) {
                  onNavigateToGroups();
                } else {
                  Alert.alert('Groups', 'Groups 기능이 곧 추가됩니다.');
                }
              }}
            >
              <Text style={{ fontSize: 16, color: '#333' }}>Groups</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ paddingVertical: 12, paddingHorizontal: 16 }}
              onPress={() => {
                setMenuVisible(false);
                if (onNavigateToSomeday) {
                  onNavigateToSomeday();
                } else {
                  Alert.alert('Somedays', 'Somedays 기능이 곧 추가됩니다.');
                }
              }}
            >
              <Text style={{ fontSize: 16, color: '#333' }}>Somedays</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ paddingVertical: 12, paddingHorizontal: 16 }}
              onPress={() => {
                setMenuVisible(false);
                Alert.alert('Settings', 'Settings 기능이 곧 추가됩니다.');
              }}
            >
              <Text style={{ fontSize: 16, color: '#333' }}>Settings</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}
