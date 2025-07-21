// src/views/Home/Home.tsx
import React, { useState, useMemo } from 'react';
import {
  Table,
  Pagination,
  Card,
  Select,
  Modal,
  Descriptions,
  Tag,
  Button,
  Dropdown
} from 'antd';
import {
  StarFilled,
  StarOutlined,
  CalendarOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { fetchCharacters } from '../../thunks/charactersThunks';
import { toggleFavorite, toggleFavoritesBulk, selectIsFavorite, selectFavoritesCount } from '../../store/slices/favoritesSlice';
import { SearchToolbar } from '../../components/SearchToolbar';
import { FavoritesCounter } from '../../components/FavoritesCounter';
import styles from './Home.module.scss';
import type { Character } from '../../store/slices/charactersSlice';

interface Person {
  key: number;
  id: number;
  avatar: string;
  fullName: string;
  location: string;
  favorite: boolean;
  createdDate: string;
}

export const Home: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const { items: characters, loading, info } = useSelector((state: RootState) => state.characters);
  const favoritesState = useSelector((state: RootState) => state.favorites);

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [currentSearchTerm, setCurrentSearchTerm] = useState(''); // Active search term
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // State for context menu
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    record: Person | null;
  }>({
    visible: false,
    x: 0,
    y: 0,
    record: null,
  });

  // Context menu ref
  const contextMenuRef = React.useRef<HTMLDivElement>(null);

  // Effect to close context menu when clicking outside
  React.useEffect(() => {
    if (!contextMenu.visible) return;
    function handleClickOutside(event: MouseEvent) {
      // If the menu is open and the click is not inside the menu, close it
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(event.target as Node)
      ) {
        setContextMenu(prev => ({ ...prev, visible: false }));
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [contextMenu.visible]);

  // State for details modal
  const [detailsModal, setDetailsModal] = useState<{
    open: boolean;
    character: Character | null;
  }>({
    open: false,
    character: null,
  });

  // Load characters from API
  React.useEffect(() => {
    dispatch(fetchCharacters(currentPage, currentSearchTerm || undefined));
  }, [dispatch, currentPage, currentSearchTerm]);

  React.useEffect(() => {
    document.title = 'Home | Rick & Morty Explorer';
  }, []);

  // Search handler (now goes directly to API)
  const handleSearch = (searchTerm: string) => {
    setCurrentSearchTerm(searchTerm);
    setCurrentPage(1); // Reset to page 1 on search
  };

  // Clear search handler
  const handleClearSearch = () => {
    setCurrentSearchTerm('');
    setCurrentPage(1); // Reset to page 1 on clear
  };

  // Clear selection handler
  const handleClearSelection = () => {
    setSelectedRowKeys([]);
  };

  // Map API characters to Person for the table
  const data: Person[] = useMemo(() => {
    return characters.map(char => ({
      key: char.id,
      id: char.id,
      avatar: char.image,
      fullName: char.name,
      location: char.location.name,
      favorite: selectIsFavorite({ favorites: favoritesState }, user?.email || '', char.id),
      createdDate: new Date(char.created).toLocaleDateString()
    }));
  }, [characters, favoritesState, user?.email]);

  // Total user favorites counter
  const totalUserFavorites = useMemo(() => {
    return selectFavoritesCount({ favorites: favoritesState }, user?.email || '');
  }, [favoritesState, user?.email]);



  // Context menu handlers
  const showContextMenu = (event: React.MouseEvent, record: Person) => {
    event.preventDefault();

    // If a menu is open, close it first, then open the new one
    if (contextMenu.visible) {
      setContextMenu({ visible: false, x: 0, y: 0, record: null });
      // Use setTimeout to ensure state updates
      setTimeout(() => {
        setContextMenu({
          visible: true,
          x: event.clientX,
          y: event.clientY,
          record: record,
        });
      }, 0);
    } else {
      // If no menu is open, open directly
      setContextMenu({
        visible: true,
        x: event.clientX,
        y: event.clientY,
        record: record,
      });
    }
  };

  const handleContextMenuAction = (action: string) => {
    if (!contextMenu.record || !user?.email) return;

    const record = contextMenu.record; // Local variable for TypeScript

    switch (action) {
      case 'toggle-favorite':
        dispatch(toggleFavorite(user.email, record.id));
        break;
      case 'details':
        // Find the full character from the API using the ID
        const fullCharacter = characters.find(char => char.id === record.id);
        if (fullCharacter) {
          setDetailsModal({
            open: true,
            character: fullCharacter,
          });
        }
        break;
    }

    // Close context menu after action
    setContextMenu(prev => ({ ...prev, visible: false }));
  };

  const columns: ColumnsType<Person> = [
    {
      title: '',
      dataIndex: 'avatar',
      width: 60,
      align: 'center',
      render: src => <img src={src} alt="" className={styles.avatar} />
    },
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      align: 'center'
    },
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      // No width defined - will use available space
    },
    {
      title: 'Location Origin',
      dataIndex: 'location',
      // No width defined - will use available space
    },
    {
      title: 'Favorites',
      dataIndex: 'favorite',
      width: 100,
      align: 'center',
      render: (_, record) =>
        record.favorite
          ? <StarFilled
            className="star filled"
            style={{ color: '#faad14', cursor: 'pointer' }}
            onClick={(e) => {
              e.stopPropagation();
              dispatch(toggleFavorite(user?.email || '', record.id));
            }}
          />
          : <StarOutlined
            className="star empty"
            style={{ color: '#d9d9d9', cursor: 'pointer' }}
            onClick={(e) => {
              e.stopPropagation();
              dispatch(toggleFavorite(user?.email || '', record.id));
            }}
          />
    },
    {
      title: 'Created Date',
      dataIndex: 'createdDate',
      width: 150,
      align: 'center'
    }
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  // Close details modal handler
  const handleCloseDetailsModal = () => {
    setDetailsModal({
      open: false,
      character: null,
    });
  };

  // Get status color function
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Alive': return 'green';
      case 'Dead': return 'red';
      default: return 'default';
    }
  };

  // Get gender color function
  const getGenderColor = (gender: string) => {
    switch (gender) {
      case 'Male': return 'blue';
      case 'Female': return 'magenta';
      case 'Genderless': return 'orange';
      default: return 'default';
    }
  };

  // Context Menu with modern API items
  const contextMenuItems = [
    {
      key: 'toggle-favorite',
      icon: contextMenu.record?.favorite ? <StarFilled /> : <StarOutlined />,
      label: contextMenu.record?.favorite ? 'Remove favorite' : 'Add favorite',
      onClick: () => handleContextMenuAction('toggle-favorite'),
    },
    {
      key: 'details',
      label: 'Details',
      onClick: () => handleContextMenuAction('details'),
    },
  ];

  const contextMenuComponent = (
    <div ref={contextMenuRef} style={{ position: 'fixed', left: contextMenu.x, top: contextMenu.y, zIndex: 1000 }}>
      <Dropdown
        open={contextMenu.visible}
        menu={{
          items: contextMenuItems,
          onClick: (e) => {
            e.domEvent.stopPropagation(); // Prevent closing when clicking the menu
          }
        }}
        trigger={[]}
        dropdownRender={(menu) => (
          <div onMouseDown={(e) => e.stopPropagation()}>
            {menu}
          </div>
        )}
      >
        <div
          style={{
            width: 1,
            height: 1,
            pointerEvents: 'none',
          }}
        />
      </Dropdown>
    </div>
  );

  // Character details modal
  const detailsModalComponent = (
    <Modal
      title={`Character Details: ${detailsModal.character?.name || ''}`}
      open={detailsModal.open}
      onCancel={handleCloseDetailsModal}
      footer={[
        <Button key="close" onClick={handleCloseDetailsModal}>
          Close
        </Button>
      ]}
      width={600}
    >
      {detailsModal.character && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Character image */}
          <div style={{ textAlign: 'center' }}>
            <img
              src={detailsModal.character.image}
              alt={detailsModal.character.name}
              width={200}
              style={{ borderRadius: '8px' }}
            />
          </div>

          {/* Personal Information */}
          <Descriptions title="Personal Information" bordered column={1} size="small">
            <Descriptions.Item label="ID">
              {detailsModal.character.id}
            </Descriptions.Item>
            <Descriptions.Item label="Name">
              {detailsModal.character.name}
            </Descriptions.Item>
            <Descriptions.Item label="Favorite">
              {selectIsFavorite({ favorites: favoritesState }, user?.email || '', detailsModal.character.id) ? (
                <Tag color="gold" icon={<StarFilled />}>
                  Yes
                </Tag>
              ) : (
                <Tag color="default" icon={<StarOutlined />}>
                  No
                </Tag>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={getStatusColor(detailsModal.character.status)}>
                {detailsModal.character.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Species">
              {detailsModal.character.species}
            </Descriptions.Item>
            <Descriptions.Item label="Type">
              {detailsModal.character.type || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Gender">
              <Tag color={getGenderColor(detailsModal.character.gender)}>
                {detailsModal.character.gender}
              </Tag>
            </Descriptions.Item>
          </Descriptions>

          {/* Location Information */}
          <Descriptions title="Locations" bordered column={1} size="small">
            <Descriptions.Item label="Origin">
              {detailsModal.character.origin?.name || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Last known location">
              {detailsModal.character.location?.name || 'N/A'}
            </Descriptions.Item>
          </Descriptions>

          {/* Additional Information */}
          <Descriptions title="Additional Information" bordered column={1} size="small">
            <Descriptions.Item label="Episodes">
              {detailsModal.character.episode?.length || 0} episodes
            </Descriptions.Item>
            <Descriptions.Item label="Created date">
              {detailsModal.character.created ? new Date(detailsModal.character.created).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) : 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Resource URL">
              <a href={detailsModal.character.url} target="_blank" rel="noopener noreferrer">
                View in API
              </a>
            </Descriptions.Item>
          </Descriptions>
        </div>
      )}
    </Modal>
  );

  return (
    <div className={styles.container}>
      {/* Search Toolbar Component */}
      <SearchToolbar
        onSearch={handleSearch}
        onClearSearch={handleClearSearch}
        loading={loading}
        selectedRowKeys={selectedRowKeys}
        onClearSelection={handleClearSelection}
        onViewDetails={(characterId) => {
          const fullCharacter = characters.find(char => char.id === characterId);
          if (fullCharacter) {
            setDetailsModal({ open: true, character: fullCharacter });
          }
        }}
      />

      {/* Main content centered */}
      <div className={styles.content}>
        {loading ? (
          // Loading state
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Loading characters...</p>
          </div>
        ) : (
          // Desktop view: Table with integrated header
          <div className={styles.tableContainer}>
            <div className={styles.tableHeader}>
              <h2 className={styles.tableTitle}>Persons Groups – Everyone</h2>
            </div>
      <Table
        rowSelection={rowSelection}
        columns={columns}
              dataSource={data.slice(0, pageSize)} // Show only items according to pageSize
        pagination={false}
        className={styles.table}
              size="middle"
              scroll={{ y: 560 }} // Exact height to show 10 rows (56px per row)
              loading={loading} // Ant Design loading indicator
              onRow={(record) => ({
                onContextMenu: (event) => showContextMenu(event, record),
                onClick: () => {
                  // Find the full character from the API using the ID
                  const fullCharacter = characters.find(char => char.id === record.id);
                  if (fullCharacter) {
                    setDetailsModal({
                      open: true,
                      character: fullCharacter,
                    });
                  }
                },
                style: { cursor: 'pointer' }, // Indicate clickable
              })}
            />
            <div className={styles.tableFooter}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'space-between' }}>
                <Pagination
                  current={currentPage}
                  total={info?.count || 0}
                  pageSize={20} // API always returns 20
                  showSizeChanger={false} // Disabled, we use our own Select
                  onChange={(page) => {
                    setCurrentPage(page);
                  }}
                  showTotal={(total, range) =>
                    `${range[0]}-${range[1]} of ${total} items`
                  }
                />

                <Select
                  value={pageSize}
                  onChange={(value) => setPageSize(value)}
                  style={{
                    width: 100,
                    color: '#000000',
                  }}
                  size="small"
                  className="page-size-select"
                  getPopupContainer={(triggerNode) => triggerNode.parentElement}
                  transitionName=""
                  choiceTransitionName=""
                  dropdownStyle={{
                    color: '#000000'
                  }}
                >
                  <Select.Option value={10}>10 / page</Select.Option>
                  <Select.Option value={20}>20 / page</Select.Option>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Separate favorites counter (desktop only) */}
        <FavoritesCounter 
          count={totalUserFavorites}
          className={styles.favoritesContainer}
        />
      </div>

      {/* Context Menu */}
      {contextMenuComponent}

      {/* Details Modal */}
      {detailsModalComponent}
    </div>
  );
};

export default Home;