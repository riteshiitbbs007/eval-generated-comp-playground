import { LightningElement } from 'lwc';

/**
 * Responsive Card Grid Component
 * 
 * Displays a grid of cards that adapts to screen size:
 * - Mobile: 1 column
 * - Tablet: 2 columns
 * - Desktop: 4 columns
 * 
 * Uses SLDS grid utilities for responsive layout
 */
export default class CardGrid4ColumnsDesktop2 extends LightningElement {
    /**
     * Sample card data for demonstration
     * Each card contains:
     * - id: unique identifier
     * - title: card heading
     * - description: card content
     * - iconName: SLDS icon reference
     * - iconAlt: accessibility text for icon
     */
    cards = [
        {
            id: '1',
            title: 'Analytics Dashboard',
            description: 'View real-time analytics and metrics for your business performance and key indicators.',
            iconName: 'utility:chart',
            iconAlt: 'Analytics chart icon'
        },
        {
            id: '2',
            title: 'Customer Portal',
            description: 'Access customer information, support tickets, and communication history in one place.',
            iconName: 'utility:people',
            iconAlt: 'People icon'
        },
        {
            id: '3',
            title: 'Document Library',
            description: 'Store, organize, and share important documents with your team securely.',
            iconName: 'utility:page',
            iconAlt: 'Document page icon'
        },
        {
            id: '4',
            title: 'Reports Manager',
            description: 'Generate and manage custom reports with advanced filtering and export options.',
            iconName: 'utility:report',
            iconAlt: 'Report icon'
        },
        {
            id: '5',
            title: 'Task Tracker',
            description: 'Track project tasks, set priorities, and monitor completion status efficiently.',
            iconName: 'utility:task',
            iconAlt: 'Task icon'
        },
        {
            id: '6',
            title: 'Calendar Events',
            description: 'Schedule meetings, set reminders, and manage your calendar events seamlessly.',
            iconName: 'utility:event',
            iconAlt: 'Calendar event icon'
        },
        {
            id: '7',
            title: 'Email Center',
            description: 'Manage email communications, templates, and automated campaigns from one interface.',
            iconName: 'utility:email',
            iconAlt: 'Email icon'
        },
        {
            id: '8',
            title: 'Settings Hub',
            description: 'Configure system preferences, user permissions, and integration settings.',
            iconName: 'utility:settings',
            iconAlt: 'Settings icon'
        },
        {
            id: '9',
            title: 'Notification Center',
            description: 'Stay updated with real-time notifications and important system alerts.',
            iconName: 'utility:notification',
            iconAlt: 'Notification bell icon'
        },
        {
            id: '10',
            title: 'Search Tools',
            description: 'Powerful search capabilities across all your data with advanced filters.',
            iconName: 'utility:search',
            iconAlt: 'Search icon'
        },
        {
            id: '11',
            title: 'File Upload',
            description: 'Upload and manage files with drag-and-drop support and version control.',
            iconName: 'utility:upload',
            iconAlt: 'Upload icon'
        },
        {
            id: '12',
            title: 'User Profile',
            description: 'Manage your profile information, preferences, and account settings.',
            iconName: 'utility:user',
            iconAlt: 'User profile icon'
        }
    ];
}