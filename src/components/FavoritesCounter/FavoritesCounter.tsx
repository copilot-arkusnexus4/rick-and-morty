import React from 'react';
import { StarFilled } from '@ant-design/icons';
import styles from './FavoritesCounter.module.scss';

export interface FavoritesCounterProps {
  count: number;
  className?: string;
}

export const FavoritesCounter: React.FC<FavoritesCounterProps> = ({
  count,
  className
}) => {
  return (
    <div className={className}>
      <div className={styles.favoritesCounter}>
        <StarFilled className={styles.starIcon} />
        <span>Total Favorites: {count}</span>
      </div>
    </div>
  );
};

export default FavoritesCounter; 