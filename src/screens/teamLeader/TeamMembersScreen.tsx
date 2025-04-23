import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  TextInput,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Team Member interface
interface TeamMember {
  id: string;
  name: string;
  role: string;
  status: 'Online' | 'Offline' | 'Clocked In' | 'Clocked Out' | 'On Leave';
  todayClockIn?: string;
  todayClockOut?: string;
  totalHoursThisWeek: number;
  lastTask?: string;
}

// Mock data
const teamMembersData: TeamMember[] = [
  {
    id: '1',
    name: 'Alice Wong',
    role: 'Frontend Developer',
    status: 'Clocked In',
    todayClockIn: '09:00 AM',
    totalHoursThisWeek: 32,
    lastTask: 'Implement dashboard UI'
  },
  {
    id: '2',
    name: 'Bob Johnson',
    role: 'Backend Engineer',
    status: 'Online',
    todayClockIn: '08:30 AM',
    totalHoursThisWeek: 40,
    lastTask: 'API optimization'
  },
  {
    id: '3',
    name: 'Carol Martinez',
    role: 'UI/UX Designer',
    status: 'Clocked Out',
    todayClockIn: '09:15 AM',
    todayClockOut: '05:30 PM',
    totalHoursThisWeek: 38,
    lastTask: 'Design system updates'
  },
  {
    id: '4',
    name: 'Dave Wilson',
    role: 'QA Engineer',
    status: 'On Leave',
    totalHoursThisWeek: 16,
    lastTask: 'Test automation'
  },
  {
    id: '5',
    name: 'Eva Chen',
    role: 'Product Manager',
    status: 'Offline',
    totalHoursThisWeek: 36,
    lastTask: 'Stakeholder meeting'
  },
  {
    id: '6',
    name: 'Frank Lee',
    role: 'DevOps Engineer',
    status: 'Clocked In',
    todayClockIn: '08:00 AM',
    totalHoursThisWeek: 42,
    lastTask: 'CI/CD pipeline update'
  },
  {
    id: '7',
    name: 'Grace Kim',
    role: 'Data Analyst',
    status: 'Clocked In',
    todayClockIn: '09:30 AM',
    totalHoursThisWeek: 37,
    lastTask: 'Monthly report'
  }
];

const TeamMembersScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(teamMembersData);

  // Filter members based on search query and status filter
  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      member.role.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === null || member.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Get status badge color based on status
  const getStatusColor = (status: TeamMember['status']) => {
    switch (status) {
      case 'Online': return '#4caf50'; // Green
      case 'Clocked In': return '#2196f3'; // Blue
      case 'Offline': return '#9e9e9e'; // Gray
      case 'On Leave': return '#ff9800'; // Orange
      case 'Clocked Out': return '#f44336'; // Red
      default: return '#9e9e9e';
    }
  };

  // Handle member tap/selection
  const handleMemberPress = (member: TeamMember) => {
    // Future implementation: navigate to member details
    // For now, we could show an alert or modal
    console.log('Member selected:', member.name);
    // Optional: navigation.navigate('TeamMemberDetail', { memberId: member.id });
  };

  // Filter by status handler
  const handleStatusFilter = (status: string | null) => {
    setStatusFilter(status === statusFilter ? null : status);
  };

  // Render status filter buttons
  const renderStatusFilters = () => {
    const statuses = ['All', 'Clocked In', 'Clocked Out', 'Online', 'Offline', 'On Leave'];
    
    return (
      <View style={styles.filtersContainer}>
        {statuses.map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.filterButton,
              statusFilter === (item === 'All' ? null : item) && styles.activeFilterButton
            ]}
            onPress={() => handleStatusFilter(item === 'All' ? null : item)}
          >
            <Text 
              style={[
                styles.filterButtonText,
                statusFilter === (item === 'All' ? null : item) && styles.activeFilterButtonText
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // Render individual team member item
  const renderMemberItem = ({ item }: { item: TeamMember }) => (
    <TouchableOpacity
      style={styles.memberItem}
      onPress={() => handleMemberPress(item)}
    >
      <View style={styles.memberLeftSection}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {item.name.split(' ').map(n => n[0]).join('')}
          </Text>
        </View>
        
        <View style={styles.memberInfo}>
          <Text style={styles.memberName}>{item.name}</Text>
          <Text style={styles.memberRole}>{item.role}</Text>
          
          <View style={styles.statusContainer}>
            <View 
              style={[
                styles.statusBadge, 
                { backgroundColor: getStatusColor(item.status) }
              ]}
            />
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
          
          {item.todayClockIn && (
            <Text style={styles.timeText}>
              In: {item.todayClockIn}
              {item.todayClockOut ? ` · Out: ${item.todayClockOut}` : ''}
            </Text>
          )}
        </View>
      </View>
      
      <View style={styles.memberRightSection}>
        <View>
          <Text style={styles.hoursLabel}>Weekly Hours</Text>
          <Text style={styles.hoursValue}>{item.totalHoursThisWeek}h</Text>
          
          {item.lastTask && (
            <Text style={styles.lastTaskText} numberOfLines={1}>
              Last: {item.lastTask}
            </Text>
          )}
        </View>
        <Ionicons name="chevron-forward" size={20} color="#bbb" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Team Members</Text>
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or role..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>
      
      {/* Status Filters */}
      {renderStatusFilters()}
      
      {/* Team Members List */}
      <FlatList
        data={filteredMembers}
        keyExtractor={(item) => item.id}
        renderItem={renderMemberItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No team members found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#333',
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 8,
    marginTop: 4,
  },
  filterButton: {
    paddingHorizontal: 12,
    height: 40,
    minWidth: 90,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeFilterButton: {
    backgroundColor: '#2089dc',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
  },
  activeFilterButtonText: {
    color: '#fff',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  memberLeftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e1f5fe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0288d1',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  memberRole: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  statusBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 13,
    color: '#666',
  },
  timeText: {
    fontSize: 12,
    color: '#888',
  },
  memberRightSection: {
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
  hoursLabel: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
  },
  hoursValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'right',
  },
  lastTaskText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
    maxWidth: 120,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 64,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: '#999',
  },
});

export default TeamMembersScreen;