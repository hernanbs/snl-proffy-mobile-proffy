import React, { useState } from 'react'
import styles from './styles';
import { View, AsyncStorage } from 'react-native';
import PageHeader from '../../components/PageHeader';
import { ScrollView } from 'react-native-gesture-handler';
import TeacherItem, { Teacher } from '../../components/TeacherItem';

import { useFocusEffect } from '@react-navigation/native'

function Favorites () {
    const [favorites, SetFavorites] = useState([])

    function loadFavorites() {
        AsyncStorage.getItem('favorites').then(response => {
            if (response) {
                const favoritedTeachs = JSON.parse(response)
                SetFavorites(favoritedTeachs)
            }
        })
    }
    useFocusEffect(()=>{
        loadFavorites()
    })
    return (
        <View style={styles.container} >
            <PageHeader title='Meus Proffys favoritos'></PageHeader>
        
            <ScrollView
                style={styles.teacherList}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingBottom: 16,
                }}
            >
                {favorites.map((teacher: Teacher) => {
                        return (
                            <TeacherItem 
                                key={teacher.id}
                                teacher={teacher}
                                favorited
                            />
                        )
                })}
            </ScrollView>
        </View>
    )

}

export default Favorites