import React, { useState, useMemo } from 'react';
import { 
	View, Text, FlatList, StyleSheet, TouchableOpacity, 
	TextInput, StatusBar, ScrollView, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { format } from 'date-fns';
import { Button, Menu, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Employee {
	id: string;
	name: string;
	workHours: string;
	hoursLogged: string;
	tasksCompleted: number;
	status: 'Pending' | 'Approved' | 'Rejected';
	date: Date;
}

const TimesheetApproveScreen = () => {
	const navigation = useNavigation<NavigationProp>();
	const [searchQuery, setSearchQuery] = useState('');
	const [filter, setFilter] = useState('Date');
	const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
	const [menuVisible, setMenuVisible] = useState(false);
	
	// Show and hide menu
	const openMenu = () => setMenuVisible(true);
	const closeMenu = () => setMenuVisible(false);
	
	// Select filter option
	const selectFilter = (selected: 'All' | 'Pending' | 'Approved' | 'Rejected') => {
		setStatusFilter(selected);
		closeMenu();
	};
	
	// Get filter display text
	const getFilterDisplayText = () => {
		if (statusFilter === 'All') {
			return 'Filter: All';
		}
		return `Filter: ${statusFilter}`;
	};
	
	// Handle sorting based on filter
	const sortTimesheets = (timesheets: Employee[]) => {
		// Make a copy to avoid mutating the original
		const sortedTimesheets = [...timesheets];
		
		switch (filter) {
			case 'Date':
				// Sort by date (newest first)
				return sortedTimesheets.sort((a, b) => {
					return b.date.getTime() - a.date.getTime();
				});
			case 'Name':
				// Sort alphabetically by name
				return sortedTimesheets.sort((a, b) => {
					return a.name.localeCompare(b.name);
				});
			case 'Hours':
				// Sort by hours (highest first)
				return sortedTimesheets.sort((a, b) => {
					const aHours = parseFloat(a.hoursLogged.split(' ')[0]);
					const bHours = parseFloat(b.hoursLogged.split(' ')[0]);
					return bHours - aHours;
				});
			default:
				return sortedTimesheets;
		}
	};
	
	// Sample data matching the image
	const timesheets: Employee[] = [
		{
			id: '1',
			name: 'Alice Wong',
			workHours: '09:00 - 17:00',
			hoursLogged: '8 hrs',
			tasksCompleted: 2,
			status: 'Pending',
			date: new Date(2025, 4, 1), // May 1, 2025
		},
		{
			id: '2',
			name: 'Bob Johnson',
			workHours: '08:30 - 16:30',
			hoursLogged: '8 hrs',
			tasksCompleted: 2,
			status: 'Pending',
			date: new Date(2025, 4, 1), // May 1, 2025
		},
		{
			id: '3',
			name: 'Mike Davis',
			workHours: '09:15 - 18:15',
			hoursLogged: '9 hrs',
			tasksCompleted: 2,
			status: 'Approved',
			date: new Date(2025, 3, 30), // April 30, 2025
		},
		{
			id: '4',
			name: 'Sarah Chen',
			workHours: '08:45 - 17:45',
			hoursLogged: '9 hrs',
			tasksCompleted: 3,
			status: 'Rejected',
			date: new Date(2025, 3, 30), // April 30, 2025
		},
		// Additional Approved/Rejected timesheets
		{
			id: '5',
			name: 'David Wilson',
			workHours: '08:00 - 17:00',
			hoursLogged: '9 hrs',
			tasksCompleted: 5,
			status: 'Approved',
			date: new Date(2025, 3, 29), // April 29, 2025
		},
		{
			id: '6',
			name: 'Emily Parker',
			workHours: '09:30 - 18:30',
			hoursLogged: '9 hrs',
			tasksCompleted: 4,
			status: 'Approved',
			date: new Date(2025, 3, 29), // April 29, 2025
		},
		{
			id: '7',
			name: 'Frank Thomas',
			workHours: '08:15 - 16:15',
			hoursLogged: '8 hrs',
			tasksCompleted: 3,
			status: 'Rejected',
			date: new Date(2025, 3, 29), // April 29, 2025
		},
		{
			id: '8',
			name: 'Grace Lee',
			workHours: '10:00 - 19:00',
			hoursLogged: '9 hrs',
			tasksCompleted: 6,
			status: 'Approved',
			date: new Date(2025, 3, 28), // April 28, 2025
		},
		{
			id: '9',
			name: 'Henry Zhang',
			workHours: '08:30 - 17:30',
			hoursLogged: '9 hrs',
			tasksCompleted: 4,
			status: 'Approved',
			date: new Date(2025, 3, 28), // April 28, 2025
		},
		{
			id: '10',
			name: 'Irene Kim',
			workHours: '09:00 - 18:00',
			hoursLogged: '9 hrs',
			tasksCompleted: 3,
			status: 'Rejected',
			date: new Date(2025, 3, 28), // April 28, 2025
		},
		{
			id: '11',
			name: 'Jason Brown',
			workHours: '08:45 - 17:45',
			hoursLogged: '9 hrs',
			tasksCompleted: 5,
			status: 'Approved',
			date: new Date(2025, 3, 27), // April 27, 2025
		},
		{
			id: '12',
			name: 'Karen Miller',
			workHours: '09:15 - 18:15',
			hoursLogged: '9 hrs',
			tasksCompleted: 4,
			status: 'Rejected',
			date: new Date(2025, 3, 27), // April 27, 2025
		},
	];

	// Approve timesheet function
	const handleApprove = (id: string) => {
		console.log('Approved timesheet: ', id);
		// Update status in the backend
	};

	// Reject timesheet function
	const handleReject = (id: string) => {
		console.log('Rejected timesheet: ', id);
		// Show rejection dialog or navigate to rejection screen
	};

	// Filter timesheets based on status and search query
	const filteredTimesheets = useMemo(() => {
		return sortTimesheets(timesheets.filter(timesheet => {
			// Filter by status if not "All"
			const matchesStatus = statusFilter === 'All' || timesheet.status === statusFilter;
			
			// Filter by search query
			const matchesSearch = 
				searchQuery === '' || 
				timesheet.name.toLowerCase().includes(searchQuery.toLowerCase());
			
			return matchesStatus && matchesSearch;
		}));
	}, [timesheets, statusFilter, searchQuery, filter]);

	// Group timesheets by date
	const groupedTimesheets = filteredTimesheets.reduce((groups: Record<string, Employee[]>, timesheet) => {
		const date = format(timesheet.date, 'EEE, MMM d, yyyy');
		if (!groups[date]) {
			groups[date] = [];
		}
		groups[date].push(timesheet);
		return groups;
	}, {});

	// Sort date keys in reverse chronological order when Date filter is selected
	const sortedDateKeys = Object.keys(groupedTimesheets).sort((a, b) => {
		if (filter === 'Date') {
			// For Date filter, sort dates in reverse chronological order
			return new Date(b).getTime() - new Date(a).getTime();
		}
		return 0; // Keep original order for other filters
	});

	// Convert grouped timesheets to a flat array with date headers
	const flatData = sortedDateKeys.reduce((acc: Array<Employee | { isHeader: true, date: string }>, date) => {
		// Add date header
		acc.push({ isHeader: true, date });
		// Add employees for this date
		acc.push(...groupedTimesheets[date]);
		return acc;
	}, []);

	// Function to check if item is a header
	const isHeader = (item: any): item is { isHeader: true, date: string } => {
		return item.isHeader === true;
	};

	// Get status badge styling based on status
	const getStatusStyle = (status: 'Pending' | 'Approved' | 'Rejected') => {
		switch (status) {
			case 'Pending': return { color: '#fff', backgroundColor: '#0078ff' };
			case 'Approved': return { color: '#fff', backgroundColor: '#4caf50' };
			case 'Rejected': return { color: '#fff', backgroundColor: '#f44336' };
			default: return { color: '#fff', backgroundColor: '#0078ff' };
		}
	};

	// Function to navigate to timesheet detail screen
	const navigateToTimesheetDetail = (employee: Employee) => {
		try {
			// Create a timesheet object from the employee data
			const timesheet = {
				id: employee.id,
				date: format(employee.date, 'yyyy-MM-dd'),
				memberId: employee.id,
				memberName: employee.name,
				clockIn: employee.workHours.split(' - ')[0],
				clockOut: employee.workHours.split(' - ')[1],
				totalHours: parseInt(employee.hoursLogged.split(' ')[0]),
				completedTasks: Array(employee.tasksCompleted).fill({
					title: 'Task',
					category: 'Development',
					notes: 'Completed task'
				}),
				status: employee.status,
				description: `Timesheet for ${employee.name} on ${format(employee.date, 'EEEE, MMMM d, yyyy')}`,
			};
			
			// For debugging
			console.log('Navigating to TimesheetDetail with:', JSON.stringify({
				id: timesheet.id,
				date: timesheet.date,
				memberId: timesheet.memberId
			}));
			
			// We need to create a callback function that won't cause issues with serialization
			const handleStatusUpdateCallback = (id: string, newStatus: 'Approved' | 'Rejected', reason?: string) => {
				handleStatusUpdate(id, newStatus, reason);
			};
			
			// Navigate to timesheet detail screen with the correct parameters
			setTimeout(() => {
				navigation.navigate('TimesheetDetail', {
					timesheet,
					onStatusUpdate: handleStatusUpdateCallback
				});
			}, 0);
		} catch (error) {
			console.error('Navigation error:', error);
			// Show an alert with the error message
			Alert.alert(
				'Navigation Error',
				`Error navigating to timesheet details: ${error instanceof Error ? error.message : String(error)}`
			);
		}
	};
	
	// Handle status update from detail screen
	const handleStatusUpdate = (id: string, newStatus: 'Approved' | 'Rejected', reason?: string) => {
		console.log(`Timesheet ${id} status updated to ${newStatus}${reason ? `, reason: ${reason}` : ''}`);
		// Here you would update the actual data
	};

	// Render an item (either header or employee row)
	const renderListItem = ({ item }: { item: any }) => {
		if (isHeader(item)) {
			return (
				<View style={styles.sectionHeader}>
					<View style={styles.dateContainer}>
						<Ionicons name="calendar" size={18} color="#4a7aff" />
						<Text style={styles.sectionDate}>{item.date}</Text>
					</View>
				</View>
			);
		} else {
			const employee = item as Employee;
			const statusStyle = getStatusStyle(employee.status);
			const isPending = employee.status === 'Pending';
			
			return (
				<TouchableOpacity 
					onPress={() => {
						console.log('Timesheet item pressed:', employee.id);
						navigateToTimesheetDetail(employee);
					}}
					activeOpacity={0.7}
					style={styles.timesheetItemContainer}
				>
					<View style={styles.timesheetItem}>
						<View style={styles.row}>
							<View style={styles.mainContent}>
								<View style={[styles.nameRow]}>
									<Text style={styles.employeeName}>{employee.name}</Text>
									<View style={[styles.statusBadge, { backgroundColor: statusStyle.backgroundColor }]}>
										<Text style={[styles.statusText, { color: statusStyle.color }]}>{employee.status}</Text>
									</View>
								</View>
								
								<View style={styles.detailRow}>
									<Ionicons name="time-outline" size={16} color="#777" />
									<Text style={styles.detailText}>{employee.workHours}</Text>
								</View>
								
								<View style={styles.detailRow}>
									<Ionicons name="hourglass-outline" size={16} color="#777" />
									<Text style={styles.detailText}>{employee.hoursLogged}</Text>
								</View>
								
								<Text style={styles.tasksText}>
									{employee.tasksCompleted} completed tasks
								</Text>
							
							</View>

							{isPending && (
								<View style={styles.actionButtons}>
									<TouchableOpacity
										style={styles.approveButton}
										onPress={(e) => {
											e.stopPropagation();
											handleApprove(employee.id);
										}}
									>
										<Ionicons name="checkmark" size={22} color="#fff" />
									</TouchableOpacity>
									<TouchableOpacity
										style={styles.rejectButton}
										onPress={(e) => {
											e.stopPropagation();
											handleReject(employee.id);
										}}
									>
										<Ionicons name="close" size={22} color="#fff" />
									</TouchableOpacity>
								</View>
							)}
						</View>
					</View>
				</TouchableOpacity>
			);
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
			
			{/* Search Bar */}
			<View style={styles.searchContainer}>
				<View style={styles.searchBar}>
					<Ionicons name="search" size={20} color="#777" />
					<TextInput
						style={styles.searchInput}
						placeholder="Search member or task"
						value={searchQuery}
						onChangeText={setSearchQuery}
					/>
				</View>
			</View>
			
			{/* Filter Buttons */}
			<View style={styles.filterContainer}>
				<View style={styles.filterDropdownContainer}>
					<Menu
						visible={menuVisible}
						onDismiss={closeMenu}
						contentStyle={styles.menuContent}
						anchor={
							<TouchableOpacity
								onPress={openMenu}
								style={[
									styles.filterCustomButton,
									statusFilter !== 'All' && styles.filterMenuButtonActive
								]}
							>
								<Text style={[
									styles.filterCustomButtonText,
									statusFilter !== 'All' && styles.filterMenuButtonLabelActive
								]}>
									{getFilterDisplayText()}
								</Text>
								<Ionicons name="chevron-down" size={16} color="#5e76a7" />
							</TouchableOpacity>
						}
					>
						<Menu.Item
							onPress={() => selectFilter('All')}
							title="All Members"
							titleStyle={styles.menuItemText}
						/>
						<Menu.Item
							onPress={() => selectFilter('Pending')}
							title="Pending"
							titleStyle={styles.menuItemText}
						/>
						<Menu.Item
							onPress={() => selectFilter('Approved')}
							title="Approved"
							titleStyle={styles.menuItemText}
						/>
						<Menu.Item
							onPress={() => selectFilter('Rejected')}
							title="Rejected"
							titleStyle={styles.menuItemText}
						/>
					</Menu>
				</View>
				
				<ScrollView 
					horizontal 
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={styles.filtersScrollContainer}
				>
					<TouchableOpacity 
						style={[styles.filterButton, filter === 'Date' && styles.filterButtonActive]} 
						onPress={() => setFilter('Date')}
					>
						<Text style={[styles.filterText, filter === 'Date' && styles.filterTextActive]}>
							Date
						</Text>
					</TouchableOpacity>
					
					<TouchableOpacity 
						style={[styles.filterButton, filter === 'Name' && styles.filterButtonActive]} 
						onPress={() => setFilter('Name')}
					>
						<Text style={[styles.filterText, filter === 'Name' && styles.filterTextActive]}>
							Name
						</Text>
					</TouchableOpacity>
					
					<TouchableOpacity 
						style={[styles.filterButton, filter === 'Hours' && styles.filterButtonActive]} 
						onPress={() => setFilter('Hours')}
					>
						<Text style={[styles.filterText, filter === 'Hours' && styles.filterTextActive]}>
							Hours
						</Text>
					</TouchableOpacity>
				</ScrollView>
			</View>
			
			{/* Timesheet List */}
			{flatData.length > 0 ? (
				<FlatList
					data={flatData}
					keyExtractor={(item, index) => isHeader(item) ? `header-${item.date}` : `employee-${(item as Employee).id}`}
					renderItem={renderListItem}
					contentContainerStyle={styles.listContainer}
				/>
			) : (
				<View style={styles.emptyContainer}>
					<Ionicons name="calendar-outline" size={56} color="#ccc" />
					<Text style={styles.emptyText}>No timesheets match your filter</Text>
					<TouchableOpacity 
						style={styles.resetButton}
						onPress={() => {
							setStatusFilter('All');
							setSearchQuery('');
						}}
					>
						<Text style={styles.resetButtonText}>Reset Filters</Text>
					</TouchableOpacity>
				</View>
			)}
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f8f9fa',
	},
	searchContainer: {
		paddingHorizontal: 16,
		paddingVertical: 12,
		backgroundColor: '#f8f9fa',
		height: 64,
		justifyContent: 'center',
	},
	searchBar: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#fff',
		paddingHorizontal: 12,
		borderRadius: 20,
		height: 40,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 1,
		elevation: 1,
	},
	searchInput: {
		flex: 1,
		marginLeft: 8,
		fontSize: 16,
		color: '#333',
		height: 40,
	},
	filterContainer: {
		paddingHorizontal: 10,
		paddingBottom: 8,
		paddingTop: 8,
		flexDirection: 'row',
		alignItems: 'center',
		height: 52,
		backgroundColor: '#f8f9fa',
		zIndex: 100, // Ensure dropdown shows above other components
	},
	filterDropdownContainer: {
		marginRight: 8,
		zIndex: 200,
	},
	filterCustomButton: {
		height: 36,
		borderRadius: 20,
		borderColor: '#ddd',
		borderWidth: 1,
		backgroundColor: '#fff',
		minWidth: 130,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
	},
	filterCustomButtonText: {
		fontSize: 14,
		color: '#5e76a7',
		marginRight: 8,
	},
	filtersScrollContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	filterButton: {
		paddingHorizontal: 16,
		paddingVertical: 0,
		borderRadius: 20,
		marginRight: 8,
		borderWidth: 1,
		borderColor: '#ddd',
		backgroundColor: '#fff',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		height: 36,
		minWidth: 80,
	},
	filterButtonActive: {
		backgroundColor: '#e8f0fe',
		borderColor: '#e8f0fe',
	},
	filterText: {
		color: '#777',
		fontSize: 14,
		lineHeight: 36,
		textAlignVertical: 'center',
	},
	filterTextActive: {
		color: '#5e76a7',
		fontWeight: '500',
	},
	listContainer: {
		paddingBottom: 20,
	},
	sectionHeader: {
		paddingHorizontal: 16,
		paddingVertical: 10,
		backgroundColor: '#f8f9fa',
		borderTopWidth: 1,
		borderTopColor: '#eee',
	},
	dateContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	sectionDate: {
		fontSize: 16,
		fontWeight: '500',
		color: '#444',
		marginLeft: 8,
	},
	timesheetItem: {
		flexDirection: 'row',
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderBottomWidth: 1,
		borderBottomColor: '#eee',
		backgroundColor: '#fff',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	row: {
		flex: 1,
	},
	mainContent: {
		flex: 1,
	},
	nameRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 8,
		flex: 1,
	},
	employeeName: {
		fontSize: 17,
		fontWeight: '500',
		color: '#333',
	},
	statusBadge: {
		paddingHorizontal: 12,
		paddingVertical: 5,
		borderRadius: 16,
	},
	statusText: {
		fontSize: 12,
		fontWeight: '600',
	},
	detailRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 6,
	},
	detailText: {
		marginLeft: 6,
		fontSize: 14,
		color: '#555',
	},
	tasksText: {
		fontSize: 14,
		color: '#555',
	},
	actionButtons: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'flex-end',
		alignSelf: 'flex-end',
		gap: 8,  
	},
	approveButton: {
		backgroundColor: '#4caf50',
		width: 40,
		height: 40,
		borderRadius: 20,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 8,
	},
	rejectButton: {
		backgroundColor: '#f44336',
		width: 40,
		height: 40,
		borderRadius: 20,
		justifyContent: 'center',
		alignItems: 'center',
	},
	emptyContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 20,
	},
	emptyText: {
		fontSize: 16,
		color: '#777',
		marginTop: 12,
		marginBottom: 20,
	},
	resetButton: {
		paddingHorizontal: 20,
		paddingVertical: 10,
		backgroundColor: '#007bff',
		borderRadius: 20,
	},
	resetButtonText: {
		color: '#fff',
		fontSize: 14,
		fontWeight: '500',
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 1000,
	},
	modalContent: {
		width: '80%',
		backgroundColor: '#fff',
		borderRadius: 12,
		padding: 16,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		maxHeight: '80%',
	},
	modalHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 16,
		paddingBottom: 12,
		borderBottomWidth: 1,
		borderBottomColor: '#eee',
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: '#333',
	},
	optionItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 12,
		paddingHorizontal: 8,
		borderRadius: 8,
		marginVertical: 2,
	},
	selectedOption: {
		backgroundColor: '#e8f0fe',
	},
	selectedOptionText: {
		color: '#007bff',
		fontWeight: '500',
	},
	dropdownBackdrop: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.3)',
	},
	menuContent: {
		backgroundColor: '#fff',
		borderRadius: 8,
		marginTop: 40, // Position it properly below the button
	},
	menuItemText: {
		fontSize: 15,
		color: '#333',
	},
	filterMenuButtonActive: {
		backgroundColor: '#e8f0fe',
		borderColor: '#e8f0fe',
	},
	filterMenuButtonLabelActive: {
		color: '#5e76a7',
		fontWeight: '500',
	},
	timesheetItemContainer: {
		backgroundColor: '#fff',
	},
});

export default TimesheetApproveScreen;
