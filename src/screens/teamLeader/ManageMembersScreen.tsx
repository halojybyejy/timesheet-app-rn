import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  TextInput,
  Alert,
  ActivityIndicator,
  StatusBar 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/Ionicons';

type Props = NativeStackScreenProps<RootStackParamList, 'ManageMembers'>;

interface Member {
  id: number;
  name: string;
  role: 'leader' | 'member';
  taskCount: number;
  totalHours: number;
}

const ManageMembersScreen = ({ navigation }: Props) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUserId] = useState(101); // Mock current user ID, in a real app this would come from auth context

  // Mock fetch members - would be replaced with actual API call
  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = () => {
    setLoading(true);
    
    // Simulating API call with setTimeout
    setTimeout(() => {
      const mockMembers: Member[] = [
        { id: 101, name: "You", role: "leader", taskCount: 10, totalHours: 35 },
        { id: 102, name: "Bob Johnson", role: "member", taskCount: 5, totalHours: 22 },
        { id: 103, name: "Alice Smith", role: "member", taskCount: 8, totalHours: 30 },
        { id: 104, name: "Mike Watson", role: "member", taskCount: 3, totalHours: 12 },
        { id: 105, name: "Sarah Parker", role: "leader", taskCount: 7, totalHours: 28 }
      ];
      
      setMembers(mockMembers);
      setFilteredMembers(mockMembers);
      setLoading(false);
      setRefreshing(false);
    }, 1000);
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setFilteredMembers(members);
    } else {
      const filtered = members.filter(
        member => member.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredMembers(filtered);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMembers();
  };

  const handleRemoveMember = (member: Member) => {
    // Cannot remove yourself or other leaders
    if (member.id === currentUserId) {
      Alert.alert('Error', 'You cannot remove yourself from the project.');
      return;
    }
    
    if (member.role === 'leader' && member.id !== currentUserId) {
      Alert.alert('Error', 'You cannot remove another leader from the project.');
      return;
    }
    
    Alert.alert(
      'Remove Member',
      `Are you sure you want to remove ${member.name} from this project? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => confirmRemoveMember(member)
        }
      ]
    );
  };

  const confirmRemoveMember = (member: Member) => {
    // In a real app, this would make an API call
    // DELETE /projects/:projectId/members/:userId
    
    // If the member has tasks, ask what to do with them
    if (member.taskCount > 0) {
      Alert.alert(
        'Member Has Tasks',
        `${member.name} has ${member.taskCount} active tasks. What would you like to do with them?`,
        [
          {
            text: 'Archive Tasks',
            onPress: () => removeMemberAndHandleTasks(member, 'archive')
          },
          {
            text: 'Reassign to Me',
            onPress: () => removeMemberAndHandleTasks(member, 'reassign')
          }
        ]
      );
    } else {
      removeMemberAndHandleTasks(member, 'none');
    }
  };

  const removeMemberAndHandleTasks = (member: Member, taskAction: 'archive' | 'reassign' | 'none') => {
    // Mock successful removal
    setLoading(true);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      // Filter out the removed member
      const updatedMembers = members.filter(m => m.id !== member.id);
      setMembers(updatedMembers);
      setFilteredMembers(updatedMembers.filter(
        m => m.name.toLowerCase().includes(searchQuery.toLowerCase())
      ));
      
      setLoading(false);
      
      // Show success message
      let message = `${member.name} has been removed from the project.`;
      if (taskAction === 'archive') {
        message += ` Their ${member.taskCount} tasks have been archived.`;
      } else if (taskAction === 'reassign') {
        message += ` Their ${member.taskCount} tasks have been reassigned to you.`;
      }
      
      Alert.alert('Success', message);
    }, 1000);
  };

  const SectionHeader = ({ title }: { title: string }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  const renderMemberItem = ({ item }: { item: Member }) => (
    <View style={styles.memberItem}>
      <View style={styles.memberLeft}>
        <View style={styles.memberIconContainer}>
          <View style={[
            styles.memberIcon,
            { backgroundColor: item.role === 'leader' ? '#4CD964' : '#007AFF' }
          ]}>
            <Ionicons 
              name={item.role === 'leader' ? 'person-circle' : 'person'} 
              size={18} 
              color="#FFFFFF" 
            />
          </View>
        </View>
        
        <View style={styles.memberInfo}>
          <Text style={styles.memberName}>{item.name}</Text>
          <View style={styles.memberDetails}>
            <Text style={styles.roleText}>
              {item.role === 'leader' ? 'Leader' : 'Member'}
            </Text>
            <Text style={styles.detailsSeparator}>•</Text>
            <Text style={styles.statsText}>
              {item.taskCount} tasks, {item.totalHours} hrs
            </Text>
          </View>
        </View>
      </View>
      
      {/* Only show remove button for members (not leaders) and not for current user */}
      {item.id !== currentUserId && item.role !== 'leader' && (
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveMember(item)}
        >
          <Ionicons name="trash-outline" size={18} color="#FF3B30" />
        </TouchableOpacity>
      )}
    </View>
  );

  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="people" size={50} color="#CCC" />
      <Text style={styles.emptyText}>
        {searchQuery.trim() !== '' 
          ? 'No members matching your search'
          : 'No members in this project yet'}
      </Text>
    </View>
  );

  const ListHeaderComponent = () => (
    <View style={styles.searchContainer}>
      <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
      <TextInput
        style={styles.searchInput}
        placeholder="Search members..."
        value={searchQuery}
        onChangeText={handleSearch}
        clearButtonMode="while-editing"
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backIcon} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Members</Text>
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={handleRefresh}
          disabled={loading || refreshing}
        >
          <Ionicons 
            name="refresh" 
            size={22} 
            color={loading || refreshing ? '#CCC' : '#007AFF'} 
          />
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading members...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredMembers}
          renderItem={renderMemberItem}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={ListHeaderComponent}
          ListEmptyComponent={ListEmptyComponent}
          stickyHeaderIndices={[0]}
          showsVerticalScrollIndicator={false}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListHeaderComponentStyle={styles.listHeaderStyle}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  backIcon: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  refreshButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E0E0E0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#555',
  },
  list: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
  },
  listHeaderStyle: {
    zIndex: 1,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  memberLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  memberIconContainer: {
    marginRight: 12,
  },
  memberIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  memberDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleText: {
    fontSize: 13,
    color: '#666',
  },
  detailsSeparator: {
    fontSize: 10,
    color: '#999',
    marginHorizontal: 6,
  },
  statsText: {
    fontSize: 13,
    color: '#666',
  },
  removeButton: {
    padding: 10,
  },
  separator: {
    height: 0.5,
    backgroundColor: '#E0E0E0',
    marginLeft: 64, // To align with the end of the icon
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#FFFFFF',
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default ManageMembersScreen; 