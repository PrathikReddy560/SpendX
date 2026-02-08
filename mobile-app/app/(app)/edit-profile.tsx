// Edit Profile Screen
// Update user profile information

import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    Pressable,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { Text, TextInput, useTheme, Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import Animated, { FadeInDown } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import ResponsiveContainer from '../../src/components/layout/ResponsiveContainer';
import GlassCard from '../../src/components/ui/GlassCard';
import AnimatedButton from '../../src/components/ui/AnimatedButton';
import { Colors } from '../../src/config/colors';
import { Spacing, BorderRadius } from '../../src/config/theme';
import { API_BASE_URL, Endpoints } from '../../src/config/api';

interface UserProfile {
    name: string;
    email: string;
    phone: string;
    dob: string;
    gender: string;
    avatar_url: string | null;
}

const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say'];

export default function EditProfileScreen() {
    const router = useRouter();
    const theme = useTheme();
    const isDark = theme.dark;
    const colors = isDark ? Colors.dark : Colors.light;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<UserProfile>({
        name: '',
        email: '',
        phone: '',
        dob: '',
        gender: '',
        avatar_url: null,
    });
    const [showGenderPicker, setShowGenderPicker] = useState(false);

    const fetchProfile = useCallback(async () => {
        try {
            const token = await AsyncStorage.getItem('spendx_access_token');
            if (!token) {
                router.replace('/auth/login');
                return;
            }

            const response = await axios.get(
                `${API_BASE_URL}${Endpoints.user.profile}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setProfile({
                name: response.data.name || '',
                email: response.data.email || '',
                phone: response.data.phone || '',
                dob: response.data.dob || '',
                gender: response.data.gender || '',
                avatar_url: response.data.avatar_url,
            });
        } catch (error: any) {
            console.error('Fetch profile error:', error);
            if (error.response?.status === 401) {
                router.replace('/auth/login');
            }
        } finally {
            setLoading(false);
        }
    }, [router]);

    useFocusEffect(
        useCallback(() => {
            fetchProfile();
        }, [fetchProfile])
    );

    const handleSave = async () => {
        if (!profile.name.trim()) {
            Alert.alert('Error', 'Name is required');
            return;
        }

        setSaving(true);
        try {
            const token = await AsyncStorage.getItem('spendx_access_token');
            if (!token) {
                router.replace('/auth/login');
                return;
            }

            await axios.patch(
                `${API_BASE_URL}${Endpoints.user.updateProfile}`,
                {
                    name: profile.name.trim(),
                    phone: profile.phone.trim() || null,
                    dob: profile.dob.trim() || null,
                    gender: profile.gender || null,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            Alert.alert('Success', 'Profile updated successfully');
            router.push('/(app)/profile');
        } catch (error: any) {
            console.error('Update profile error:', error);
            Alert.alert('Error', error.response?.data?.detail || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handlePickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setProfile(prev => ({ ...prev, avatar_url: result.assets[0].uri }));
        }
    };

    if (loading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={{ color: colors.text, marginTop: Spacing.md }}>Loading...</Text>
            </View>
        );
    }

    return (
        <ResponsiveContainer>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <LinearGradient
                    colors={colors.gradients.primaryDark as [string, string]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.header}
                >
                    <Pressable onPress={() => router.push('/(app)/profile')} style={styles.backButton}>
                        <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
                    </Pressable>
                    <Text variant="titleLarge" style={styles.headerTitle}>
                        Edit Profile
                    </Text>
                    <View style={{ width: 40 }} />
                </LinearGradient>

                {/* Avatar */}
                <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.avatarSection}>
                    <Pressable onPress={handlePickImage} style={styles.avatarContainer}>
                        <Avatar.Image
                            size={100}
                            source={{ uri: profile.avatar_url || 'https://i.pravatar.cc/300?u=default' }}
                        />
                        <View style={[styles.editBadge, { backgroundColor: colors.primary }]}>
                            <MaterialCommunityIcons name="camera" size={16} color="#FFFFFF" />
                        </View>
                    </Pressable>
                    <Text variant="bodySmall" style={{ color: colors.textSecondary, marginTop: Spacing.sm }}>
                        Tap to change photo
                    </Text>
                </Animated.View>

                {/* Form */}
                <View style={styles.content}>
                    <Animated.View entering={FadeInDown.delay(200).duration(400)}>
                        <GlassCard padding="lg">
                            {/* Name */}
                            <Text variant="labelMedium" style={[styles.label, { color: colors.textSecondary }]}>
                                Full Name *
                            </Text>
                            <TextInput
                                value={profile.name}
                                onChangeText={(text) => setProfile(prev => ({ ...prev, name: text }))}
                                placeholder="Enter your name"
                                style={[styles.input, { backgroundColor: colors.surfaceVariant, color: colors.text }]}
                                placeholderTextColor={colors.placeholder}
                            />

                            {/* Email (read-only) */}
                            <Text variant="labelMedium" style={[styles.label, { color: colors.textSecondary }]}>
                                Email
                            </Text>
                            <TextInput
                                value={profile.email}
                                editable={false}
                                style={[styles.input, { backgroundColor: colors.surfaceVariant, color: colors.textSecondary }]}
                            />

                            {/* Phone */}
                            <Text variant="labelMedium" style={[styles.label, { color: colors.textSecondary }]}>
                                Phone Number
                            </Text>
                            <TextInput
                                value={profile.phone}
                                onChangeText={(text) => setProfile(prev => ({ ...prev, phone: text }))}
                                placeholder="Enter phone number"
                                keyboardType="phone-pad"
                                style={[styles.input, { backgroundColor: colors.surfaceVariant, color: colors.text }]}
                                placeholderTextColor={colors.placeholder}
                            />

                            {/* Date of Birth */}
                            <Text variant="labelMedium" style={[styles.label, { color: colors.textSecondary }]}>
                                Date of Birth
                            </Text>
                            <TextInput
                                value={profile.dob}
                                onChangeText={(text) => setProfile(prev => ({ ...prev, dob: text }))}
                                placeholder="YYYY-MM-DD"
                                style={[styles.input, { backgroundColor: colors.surfaceVariant, color: colors.text }]}
                                placeholderTextColor={colors.placeholder}
                            />

                            {/* Gender */}
                            <Text variant="labelMedium" style={[styles.label, { color: colors.textSecondary }]}>
                                Gender
                            </Text>
                            <Pressable
                                onPress={() => setShowGenderPicker(!showGenderPicker)}
                                style={[styles.input, styles.selectInput, { backgroundColor: colors.surfaceVariant }]}
                            >
                                <Text style={{ color: profile.gender ? colors.text : colors.placeholder }}>
                                    {profile.gender || 'Select gender'}
                                </Text>
                                <MaterialCommunityIcons
                                    name={showGenderPicker ? 'chevron-up' : 'chevron-down'}
                                    size={24}
                                    color={colors.textSecondary}
                                />
                            </Pressable>

                            {showGenderPicker && (
                                <View style={[styles.optionsList, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                    {genderOptions.map((option) => (
                                        <Pressable
                                            key={option}
                                            onPress={() => {
                                                setProfile(prev => ({ ...prev, gender: option }));
                                                setShowGenderPicker(false);
                                            }}
                                            style={[
                                                styles.optionItem,
                                                profile.gender === option && { backgroundColor: `${colors.primary}20` }
                                            ]}
                                        >
                                            <Text style={{ color: colors.text }}>{option}</Text>
                                            {profile.gender === option && (
                                                <MaterialCommunityIcons name="check" size={20} color={colors.primary} />
                                            )}
                                        </Pressable>
                                    ))}
                                </View>
                            )}
                        </GlassCard>
                    </Animated.View>

                    {/* Save Button */}
                    <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.buttonContainer}>
                        <AnimatedButton
                            onPress={handleSave}
                            loading={saving}
                            icon="check"
                            style={styles.saveButton}
                            title="Save Changes"
                        />
                    </Animated.View>
                </View>
            </ScrollView>
        </ResponsiveContainer>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingBottom: 100,
        flexGrow: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: Spacing.xl,
        paddingBottom: Spacing.lg,
        paddingHorizontal: Spacing.md,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    avatarSection: {
        alignItems: 'center',
        marginTop: -Spacing.xl,
        marginBottom: Spacing.lg,
    },
    avatarContainer: {
        position: 'relative',
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#FFFFFF',
    },
    content: {
        paddingHorizontal: Spacing.md,
    },
    label: {
        marginBottom: Spacing.xs,
        marginTop: Spacing.md,
        fontWeight: '600',
    },
    input: {
        borderRadius: BorderRadius.md,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        fontSize: 16,
    },
    selectInput: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    optionsList: {
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        marginTop: Spacing.xs,
        overflow: 'hidden',
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
    },
    buttonContainer: {
        marginTop: Spacing.xl,
    },
    saveButton: {
        borderRadius: BorderRadius.lg,
    },
});
