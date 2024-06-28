import { ChangeEvent, useState } from 'react';
import { server } from '../../../../App';
import { getToken } from '../../../api/Utils';
import { UserPropInterface } from '../../../etc/UserPropInterface';

interface Role {
  id: number;
  name: string;
  description: string;
  color: string;
  permissions: string[];
}

const allPermissions = [
  'Manage Users', 
  'Edit Roles', 
  'Full Access', 
  'View Items', 
  'Edit Items', 
  'Delete Items', 
  'Add To Cart',
  // add more permissions here
];

export const Roles = ({user}: UserPropInterface) => {
  document.title = "Roles - Admin"
  
  const [newRole, setNewRole] = useState<Role | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [permissionSearch, setPermissionSearch] = useState<string>("");
  const [roles, setRoles] = useState<Role[]>([
    {
      id: 1,
      name: 'Admin',
      description: 'Can manage everything',
      color: 'red',
      permissions: ['Manage Users', 'Edit Roles', 'Full Access'],
    },
    {
      id: 2,
      name: 'User',
      description: 'Can view certain items',
      color: 'green',
      permissions: ['View Items', 'Add To Cart']
    }
  ]);

  const addRole = () => {
    const newRole: Role = {
      id: Date.now(),
      name: '',
      description: '',
      color: '',
      permissions: []
    };
    setRoles([newRole, ...roles]);
    setNewRole(newRole);
    const token = getToken();
    fetch(`${server}/admin/${token}/role/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newRole),
    })
  }

  const updateRole = (id: number, event: ChangeEvent<HTMLInputElement>) => {
    const updatedRoles = roles.map((role) => 
      role.id === id ? { ...role, [event.target.name]: event.target.value } : role
    );
    setRoles(updatedRoles);
  };

  const updateRoleColor = (id: number, color: string) => {
    const updatedRoles = roles.map((role) => 
      role.id === id ? { ...role, color } : role
    );
    setRoles(updatedRoles);
  };

  const togglePermission = (id: number, permission: string) => {
    const updatedRoles = roles.map((role) => 
      role.id === id ? { 
        ...role, 
        permissions: role.permissions.includes(permission)
        ? role.permissions.filter(p => p !== permission)
        : [...role.permissions, permission]
      } 
      : role
    );
    setRoles(updatedRoles);
  };

  return (
    <div className="container mx-auto px-4 pt-10">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold text-blue-500">Manage Roles</h1>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
          onClick={addRole}
        >
          Add Role
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {roles.map((role) => (
          <div key={role.id} className="bg-white shadow-lg rounded-lg p-5">
            {(newRole?.id === role.id) ? (
              <div className="space-y-3">
                <input
                  type="text"
                  name="name"
                  value={role.name}
                  onChange={(e) => updateRole(role.id, e)}
                  placeholder="Role Name"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-400"
                />
                <input
                  type="text"
                  name="description"
                  value={role.description}
                  onChange={(e) => updateRole(role.id, e)}
                  placeholder="Role Description"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-400"
                />
                <input 
                  type="color" 
                  value={role.color} 
                  onChange={(e) => updateRoleColor(role.id, e.target.value)} 
                />
                <button onClick={() => setSelectedRole(role)} 
                        className="w-full py-2 px-3 text-white bg-blue-500 rounded focus:outline-none hover:bg-blue-700">
                  Permissions
                </button>
                <button onClick={() => setNewRole(null)} 
                        className="w-full py-2 px-3 text-white bg-blue-500 rounded focus:outline-none hover:bg-blue-700">
                  Save
                </button>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-semibold mb-3" style={{color: role.color}}>{role.name}</h2>
                <p className="text-gray-500 mb-3">{role.description}</p>
                <ul className="mb-3">
                  {role.permissions.map((permission) => (
                    <li key={permission}>- {permission}</li>
                  ))}
                </ul>
                <button
                  className="text-sm text-blue-500 border border-blue-500 hover:bg-blue-500 hover:text-white rounded-lg px-3 py-1"
                  onClick={() => setNewRole(role)}
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      {selectedRole && (
        <div className="fixed left-0 top-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-5">
            <h2 className="text-2xl font-bold mb-3">Edit Permissions</h2>
            <input 
              type="text" 
              value={permissionSearch} 
              onChange={(e) => setPermissionSearch(e.target.value)} 
              placeholder="Search permissions..."
              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-400 mb-3"
            />
            {allPermissions
              .filter(permission => permission.toLowerCase().includes(permissionSearch.toLowerCase()))
              .map((permission) => (
                <div key={permission} className="flex items-start mb-1">
                  <input 
                    type="checkbox" 
                    id={`${selectedRole.id}-${permission}`}
                    name="permissions"
                    checked={selectedRole.permissions.includes(permission)}
                    onChange={() => togglePermission(selectedRole.id, permission)}
                    className="form-checkbox h-4 w-4 text-blue-600"
                  />
                  <label htmlFor={`${selectedRole.id}-${permission}`} className="ml-2">{permission}</label>
                </div>
            ))}
            <div className="flex justify-end mt-4">
              <button 
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => setSelectedRole(null)}
              >
                Save
              </button>
              <button 
                className="px-3 py-1 ml-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => setSelectedRole(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
