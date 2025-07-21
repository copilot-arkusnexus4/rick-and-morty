import React from 'react';
import {
  Input,
  Button,
  Dropdown,
  Avatar,
  type MenuProps
} from 'antd';
import type { InputRef } from 'antd';
import {
  SearchOutlined,
  DownOutlined,
  UserOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { toggleFavoritesBulk } from '../../store/slices/favoritesSlice';
import styles from './SearchToolbar.module.scss';

export interface SearchToolbarProps {
  onSearch: (searchTerm: string) => void;
  onClearSearch: () => void;
  loading: boolean;
  selectedRowKeys: React.Key[];
  onClearSelection: () => void;
  onViewDetails?: (characterId: number) => void;
}

export const SearchToolbar: React.FC<SearchToolbarProps> = ({
  onSearch,
  onClearSearch,
  loading,
  selectedRowKeys,
  onClearSelection,
  onViewDetails
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  
  // Ref para el input
  const inputRef = React.useRef<InputRef>(null);

  // Handlers
  const handleSearch = () => {
    const value = inputRef.current?.input?.value || '';
    onSearch(value.trim());
  };

  const handleClearSearch = () => {
    if (inputRef.current?.input) {
      inputRef.current.input.value = '';
    }
    onClearSearch();
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleBulkFavorites = () => {
    if (user?.email && selectedRowKeys.length > 0) {
      dispatch(toggleFavoritesBulk(user.email, selectedRowKeys as number[]));
      onClearSelection();
    }
  };

  const actionsMenuItems: MenuProps['items'] = [
    {
      key: 'bulk-favorite',
      label: `Toggle Favorites (${selectedRowKeys.length})`,
      disabled: selectedRowKeys.length === 0,
      onClick: handleBulkFavorites,
    },
    {
      key: 'details',
      label: 'View Details',
      disabled: selectedRowKeys.length !== 1,
      onClick: () => {
        if (selectedRowKeys.length === 1 && onViewDetails) {
          onViewDetails(Number(selectedRowKeys[0]));
        }
      },
    },
  ];

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  return (
    <div className={styles.toolbar}>
      <div className={styles.toolbarLeft}>
        <div className={styles.leftControls}>
          <div className={styles.searchGroup}>
            <Input
              placeholder="Search by character name..."
              ref={inputRef}
              onPressEnter={handleSearch}
              allowClear
              onClear={handleClearSearch}
              className={styles.searchInput}
            />
            <Button
              icon={<SearchOutlined />}
              onClick={handleSearch}
              className={styles.searchButton}
              loading={loading}
              type="primary"
            />
          </div>
          <Dropdown menu={{ items: actionsMenuItems }} className={styles.actionsDropdown}>
            <Button>
              Actions <DownOutlined />
            </Button>
          </Dropdown>
        </div>
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <div className={styles.userSection}>
            <Avatar icon={<UserOutlined />} size="small" />
            <span className={styles.userName}>{user?.email}</span>
          </div>
        </Dropdown>
      </div>
    </div>
  );
};

export default SearchToolbar; 