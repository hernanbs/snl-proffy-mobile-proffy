import React, { useState } from 'react'
import styles from './styles';
import { View, Text } from 'react-native';
import PageHeader from '../../components/PageHeader';
import TeacherItem, { Teacher } from '../../components/TeacherItem';
import { ScrollView, TextInput, BorderlessButton, RectButton } from 'react-native-gesture-handler';

import { Feather } from '@expo/vector-icons'
import api from '../../services/api';

import AsyncStorage from '@react-native-community/async-storage'

function TeacherList () {
    const [favorites, SetFavorites] = useState<number[]>([])


    const [ isFiltersVisible, setIsFiltersVisible ] = useState(false) 

    const [subject, setSubject] = useState('')
    const [week_day, setWeekDay] = useState('')
    const [time, setTime] = useState('')
    const [teachers, setTeachers] = useState([]);

    function loadFavorites() {
        AsyncStorage.getItem('favorites').then(response => {
            if (response) {
                const favoritedTeachs = JSON.parse(response)
                const favoritedTeachersIds = favoritedTeachs.map((teacher: Teacher) => {return teacher.id})
                SetFavorites(favoritedTeachersIds)
            }
        })
    }

    async function handleFiltersSubmit() {
        loadFavorites()
        const response = await api.get('classes',{
            params: {
                subject,
                week_day,
                time
            }
        })
        setTeachers(response.data)

        setIsFiltersVisible(false)
    }

    function handleToggleFiltersVisible() {
        setIsFiltersVisible(!isFiltersVisible)
    }

    return (
        <View style={styles.container} >
           <PageHeader 
                title='Proffys disponiveis'
                headerRight={(
                    <BorderlessButton onPress={handleToggleFiltersVisible}>
                        <Feather name='filter' size={20} color='#FFF'/>
                    </BorderlessButton>
                )}
            >
                { isFiltersVisible && ( 
                    <View style={styles.searchForm}>
                        <Text style={styles.label}>Materia</Text>
                        <TextInput 
                            style={styles.input}
                            value={subject}
                            onChangeText={text => setSubject(text)} 
                            placeholder="Qual a materia ?"
                            placeholderTextColor="#C1BCCC"
                        />
                        <View style={styles.inputGroup}>
                            <View style={styles.inputBlock}>
                                <Text style={styles.label}>Dia da semana</Text>
                                <TextInput 
                                    value={week_day}
                                    onChangeText={text => setWeekDay(text)} 
                                    style={styles.input}
                                    placeholder="Qual o dia ?"
                                    placeholderTextColor="#C1BCCC"
                                />                            
                            </View>
                            <View style={styles.inputBlock}>
                                <Text style={styles.label}>Horario</Text>
                                <TextInput 
                                    value={time}
                                    onChangeText={text => setTime(text)} 
                                    style={styles.input}
                                    placeholder="Qual horário ?"
                                    placeholderTextColor="#C1BCCC"
                                />                            
                            </View>
                        </View>
                        <RectButton onPress={handleFiltersSubmit} style={styles.submitButton}>
                            <Text style={styles.submitButtonText}>Filtrar</Text>
                        </RectButton>
                    </View>
                )}
           </PageHeader>
            <ScrollView
                style={styles.teacherList}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingBottom: 16,
                }}
            >
                {teachers.map((teacher: Teacher) => {
                    return (
                        <TeacherItem 
                            key={teacher.id} 
                            teacher={teacher} 
                            favorited={favorites.includes(teacher.id)}
                        />
                    )
                })}
            </ScrollView>
            
        </View>
    )

}

export default TeacherList