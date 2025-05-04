import { View, StyleSheet, SectionList, Switch, Alert, TouchableOpacity, Platform } from 'react-native';
import { spacing, layout } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';
import { Text } from '@/components/ui/atoms/Text';
import { Moon, Bell, Volume2, Gamepad2, Users, CircleHelp as HelpCircle, Info, LogOut, UserX, ChevronRight } from 'lucide-react-native';
import Constants from 'expo-constants';

interface SettingItemProps {
  icon: typeof Moon;
  label: string;
  value?: string;
  onPress?: () => void;
  disabled?: boolean;
  showChevron?: boolean;
  toggle?: boolean;
  isToggled?: boolean;
  onToggle?: (value: boolean) => void;
}

function SettingItem({ 
  icon: Icon, 
  label, 
  value, 
  onPress,
  disabled,
  showChevron = true,
  toggle = false,
  isToggled = false,
  onToggle
}: SettingItemProps) {
  const colors = useThemeColors();
  const iconColor = disabled ? colors.text.secondary : colors.brand.primary;

  const handlePress = () => {
    if (disabled) return;
    onPress?.();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled && !toggle}
      style={[
        styles.settingItem,
        disabled && styles.settingItemDisabled
      ]}
      activeOpacity={0.7}
    >
      <View style={styles.settingContent}>
        <View style={[styles.iconContainer, { backgroundColor: `${iconColor}20` }]}>
          <Icon size={20} color={iconColor} />
        </View>
        <View style={styles.labelContainer}>
          <Text weight="semibold">{label}</Text>
          {value && (
            <Text variant="secondary" size="sm">{value}</Text>
          )}
          {disabled && (
            <Text variant="secondary" size="xs">Coming soon</Text>
          )}
        </View>
      </View>
      {toggle ? (
        <Switch
          value={isToggled}
          onValueChange={onToggle}
          disabled={disabled}
          trackColor={{ 
            false: colors.background.tertiary, 
            true: colors.brand.primary 
          }}
          thumbColor={colors.white}
          ios_backgroundColor={colors.background.tertiary}
        />
      ) : showChevron ? (
        <ChevronRight size={20} color={colors.text.secondary} />
      ) : null}
    </TouchableOpacity>
  );
}

interface Section {
  title: string;
  data: SettingItemProps[];
}

export default function Settings() {
  const colors = useThemeColors();
  const router = useRouter();
  const { signOut } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const version = Constants.expoConfig?.version || '1.0.0';

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Implement account deletion logic
          }
        }
      ]
    );
  };

  const sections: Section[] = [
    {
      title: 'Appearance',
      data: [
        {
          icon: Moon,
          label: 'Dark Mode',
          toggle: true,
          isToggled: isDark,
          onToggle: toggleTheme,
          showChevron: false
        }
      ]
    },
    {
      title: 'Notifications',
      data: [
        {
          icon: Bell,
          label: 'Enable Notifications',
          toggle: true,
          disabled: true,
          showChevron: false
        }
      ]
    },
    {
      title: 'Game Settings',
      data: [
        {
          icon: Volume2,
          label: 'Sound Effects',
          toggle: true,
          disabled: true,
          showChevron: false
        },
        {
          icon: Gamepad2,
          label: 'Default Game Settings',
          disabled: true
        },
        {
          icon: Users,
          label: 'Manage Players',
          onPress: () => router.push('/(tabs)/setup')
        }
      ]
    },
    {
      title: 'Support',
      data: [
        {
          icon: HelpCircle,
          label: 'Help & FAQ',
          onPress: () => {}
        },
        {
          icon: Info,
          label: 'About',
          onPress: () => {}
        }
      ]
    },
    {
      title: 'Account',
      data: [
        {
          icon: LogOut,
          label: 'Sign Out',
          onPress: signOut,
          showChevron: false
        },
        {
          icon: UserX,
          label: 'Delete Account',
          onPress: handleDeleteAccount,
          showChevron: false
        }
      ]
    }
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item.label + index}
        contentContainerStyle={styles.content}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section: { title } }) => (
          <Text 
            variant="secondary" 
            size="sm" 
            style={[
              styles.sectionTitle,
              { backgroundColor: colors.background.primary }
            ]}
          >
            {title}
          </Text>
        )}
        renderItem={({ item }) => (
          <View style={[styles.itemContainer, { backgroundColor: colors.background.card.primary }]}>
            <SettingItem {...item} />
          </View>
        )}
        ListHeaderComponent={
          <Text size="xl" weight="semibold" style={styles.title}>Settings</Text>
        }
        ListFooterComponent={
          <Text 
            variant="secondary" 
            size="xs" 
            align="center"
            style={styles.version}
          >
            Version {version}
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.container,
  },
  title: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
    textTransform: 'uppercase',
  },
  itemContainer: {
    borderRadius: layout.radius.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  settingItemDisabled: {
    opacity: 0.6,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelContainer: {
    flex: 1,
  },
  version: {
    marginTop: spacing.xl,
  },
});