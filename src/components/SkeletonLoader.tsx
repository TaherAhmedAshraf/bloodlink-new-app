import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, ViewStyle } from 'react-native';
import colors from '../theme/colors';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: ViewStyle;
}

const SkeletonItem: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
}) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: colors.border,
          opacity,
        },
        style,
      ]}
    />
  );
};

interface SkeletonLoaderProps {
  type?: 'request' | 'ongoing' | 'list';
  count?: number;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  type = 'request',
  count = 3,
}) => {
  if (type === 'ongoing') {
    return (
      <View style={styles.ongoingContainer}>
        {Array(2)
          .fill(0)
          .map((_, index) => (
            <View key={index} style={styles.ongoingItem}>
              <SkeletonItem width={60} height={60} borderRadius={30} style={styles.circle} />
              <View style={styles.contentContainer}>
                <SkeletonItem width="80%" height={16} style={styles.line} />
                <SkeletonItem width="60%" height={14} style={styles.line} />
                <View style={styles.statusContainer}>
                  <SkeletonItem width={80} height={20} borderRadius={10} style={styles.statusBadge} />
                  <SkeletonItem width={100} height={12} style={styles.roleBadge} />
                </View>
              </View>
              <SkeletonItem width={40} height={20} borderRadius={4} />
            </View>
          ))}
      </View>
    );
  }

  if (type === 'list') {
    return (
      <View style={styles.footerContainer}>
        <SkeletonItem width={120} height={10} style={styles.footerItem} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <View key={index} style={styles.requestItem}>
            <SkeletonItem width={60} height={60} borderRadius={30} style={styles.circle} />
            <View style={styles.contentContainer}>
              <SkeletonItem width="80%" height={16} style={styles.line} />
              <SkeletonItem width="60%" height={14} style={styles.line} />
              <SkeletonItem width="40%" height={12} style={styles.line} />
            </View>
            <SkeletonItem width={60} height={24} borderRadius={12} />
          </View>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  requestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.background,
  },
  circle: {
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
    gap: 8,
  },
  line: {
    marginBottom: 4,
  },
  ongoingContainer: {
    padding: 16,
    gap: 10,
  },
  ongoingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.background,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    marginTop: 4,
  },
  roleBadge: {
    marginTop: 4,
  },
  footerContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerItem: {
    alignSelf: 'center',
  },
});

export default SkeletonLoader; 