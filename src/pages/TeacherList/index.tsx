import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TextInput, BorderlessButton, RectButton } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons'
import AsyncStorage from '@react-native-community/async-storage'

import PageHeader from '../../components/PageHeader';
import TeacherItem, { Teacher } from '../../components/TeacherItem';

import styles from './styles'
import api from '../../services/api';
import { useFocusEffect } from '@react-navigation/native';

function TeacherList() {
  const [teachers, setTeachers] = useState([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isFiltersVisible, setFiltersVisible] = useState(false);

  const [subject, setSubject] = useState('');
  const [week_day, setWeekday] = useState('');
  const [time, setTime] = useState('');

  function handleToggleFiltersVisible() {
    setFiltersVisible(!isFiltersVisible);
  }

  function loadFavorites() {
    AsyncStorage.getItem('favorites').then(response => {
      if (response) {
        const favoritedTeachers = JSON.parse(response);
        const favoritedTeachersId = favoritedTeachers.map((teacher: Teacher) => {
          return teacher.id;
        });

        setFavorites(favoritedTeachersId);
      }
    });
  }


  async function handleFiltersSubmit() {
    loadFavorites();
    
    const response = await api.get('classes', {
      params: {
        subject,
        week_day,
        time,
      }
    });
    
    setFiltersVisible(false);
    setTeachers(response.data)
  }

  return (
    <View style={styles.container}>
      <PageHeader 
        title="Proffys disponíveis" 
        headerRight={(
            <BorderlessButton onPress={handleToggleFiltersVisible}>
              <Feather name="filter" size={20} color="#fff" />
            </BorderlessButton>
          )}
      >
      
      { isFiltersVisible && (
          <View style={styles.searchForm}>
            <Text style={styles.label}>Matérias</Text>
            <TextInput
              style={styles.input}
              value={subject}
              onChangeText={text => setSubject(text)}
              placeholder="Qual a matéria?"
              placeholderTextColor='#c1bcc'
            />


            <View style={styles.inputGroup}>
              <View style={styles.inputBlock}>
                <Text style={styles.label}>Dia da semana</Text>
                <TextInput
                  style={styles.input}
                  value={week_day}
                  onChangeText={text => setWeekday(text)}
                  placeholder="Qual o dia?"
                  placeholderTextColor='#c1bcc'
                />
              </View>

              <View style={styles.inputBlock}>
                <Text style={styles.label}>Horários</Text>
                <TextInput
                  style={styles.input}
                  value={time}
                  onChangeText={text => setTime(text)}
                  placeholder="Qual horário?"
                  placeholderTextColor='#c1bcc'
                />
              </View>
          </View>

          <RectButton 
            onPress={handleFiltersSubmit} 
            style={styles.submitButton}
          >
            <Text style={styles.submitButtonText}>Filtrar</Text>
          </RectButton>
        </View>
        )}
      </PageHeader>

      <ScrollView
        style={styles.teacherList}
        contentContainerStyle={{ 
          paddingHorizontal: 16,
          paddingBottom: 24,
        }}
      >

        {teachers.map((teacher: Teacher) => {
          return <TeacherItem 
          key={teacher.id} 
          teacher={teacher}
            favorited={favorites.includes(teacher.id)}
          />
        })}
        
      </ScrollView>
    </View>  
  )
}

export default TeacherList;