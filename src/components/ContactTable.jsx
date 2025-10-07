import { memo } from 'react';
import { MoreHorizontal, Edit, Trash2, Users } from 'lucide-react';
import Avatar from './ui/Avatar';
import Badge from './ui/Badge';
import Dropdown from './ui/Dropdown';
import SkeletonLoader from './ui/SkeletonLoader';
import EmptyState from './ui/EmptyState';
import Button from './ui/Button';

const ContactTable = ({ 
  contacts = [], 
  loading = false, 
  onContactClick,
  onEditContact,
  onDeleteContact,
  className = '',
  ...props 
}) => {
  const getStatusVariant = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'neutral';
      case 'lead':
        return 'info';
      default:
        return 'neutral';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'inactive':
        return 'Inactive';
      case 'lead':
        return 'Lead';
      default:
        return 'Unknown';
    }
  };

  const createActionItems = (contact) => [
    {
      label: 'Edit',
      icon: <Edit size={16} />,
      onClick: () => onEditContact?.(contact),
    },
    {
      label: 'Delete',
      icon: <Trash2 size={16} />,
      onClick: () => onDeleteContact?.(contact),
      danger: true,
    },
  ];

  // Loading skeleton rows
  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${className}`} {...props}>
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <table className="min-w-full lg:min-w-[800px] xl:min-w-[1000px] divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <SkeletonLoader width={40} height={40} className="rounded-full mr-4" />
                      <div>
                        <SkeletonLoader width={120} height={16} className="mb-1" />
                        <SkeletonLoader width={80} height={12} />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <SkeletonLoader width={150} height={16} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <SkeletonLoader width={120} height={16} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <SkeletonLoader width={100} height={16} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <SkeletonLoader width={60} height={20} className="rounded-full" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <SkeletonLoader width={24} height={24} className="rounded ml-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Empty state
  if (!contacts || contacts.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`} {...props}>
        <EmptyState
          icon={<Users size={48} />}
          title="No contacts found"
          description="Get started by adding your first contact to the CRM."
          action={
            <Button variant="primary" onClick={() => onEditContact?.()}>
              Add Contact
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${className}`} {...props}>
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <table className="min-w-full lg:min-w-[800px] xl:min-w-[1000px] divide-y divide-gray-200" role="table" aria-label="Contacts list">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                scope="col"
              >
                Contact
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                scope="col"
              >
                Email
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                scope="col"
              >
                Phone
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                scope="col"
              >
                Company
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                scope="col"
              >
                Status
              </th>
              <th 
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                scope="col"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {contacts.map((contact) => (
              <tr 
                key={contact.id}
                onClick={() => onContactClick?.(contact)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onContactClick?.(contact);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`View details for ${contact.name}`}
                className="hover:bg-gray-50 cursor-pointer transition-all duration-150 hover:shadow-sm transform hover:scale-[1.01] focus:outline-none focus:bg-gray-50 focus:ring-2 focus:ring-primary-500 focus:ring-inset"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Avatar 
                      src={contact.avatar} 
                      name={contact.name} 
                      size="md" 
                      className="mr-4"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {contact.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {contact.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{contact.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {contact.phone || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {contact.company || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={getStatusVariant(contact.status)}>
                    {getStatusLabel(contact.status)}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Dropdown
                    trigger={
                      <button 
                        className="text-gray-400 hover:text-gray-600 transition-all duration-150 p-1 rounded hover:bg-gray-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`Actions for ${contact.name}`}
                      >
                        <MoreHorizontal size={20} aria-hidden="true" />
                      </button>
                    }
                    items={createActionItems(contact)}
                    align="right"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default memo(ContactTable);