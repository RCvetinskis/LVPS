namespace :permissions do
  task load: :environment do
    permissions = [
      # Company management
      { name: 'manage_company', resource_type: 'Company', action: 'manage' },
      { name: 'view_company', resource_type: 'Company', action: 'view' },
      { name: 'create_company', resource_type: 'Company', action: 'create' },
      { name: 'update_company', resource_type: 'Company', action: 'update' },
      { name: 'delete_company', resource_type: 'Company', action: 'delete' },

      # User management
      { name: 'invite_users', resource_type: 'User', action: 'invite' },
      { name: 'view_users', resource_type: 'User', action: 'view' },
      { name: 'manage_users', resource_type: 'User', action: 'manage' },
      { name: 'assign_roles', resource_type: 'User', action: 'assign_role' },

      # Company-specific actions
      { name: 'manage_company_users', resource_type: 'UserCompany', action: 'manage' },
      { name: 'view_company_employees', resource_type: 'UserCompany', action: 'view' },
      { name: 'remove_company_users', resource_type: 'UserCompany', action: 'remove' }
    ]

    permissions.each do |perm|
      Permission.find_or_create_by!(name: perm[:name]) do |p|
        p.resource_type = perm[:resource_type]
        p.action = perm[:action]
        p.description = "Can #{perm[:action]} #{perm[:resource_type]}"
      end
    end

    # Assign permissions to roles
    company_owner_role = Role.find_by(name: Role::COMPANY_OWNER_ROLE)
    employee_role = Role.find_by(name: Role::EMPLOYEE_ROLE)

    # Company owner permissions
    company_owner_permissions = %w[
      invite_users manage_company_users view_company_employees
      view_users manage_company update_company view_company create_company delete_company
    ]

    company_owner_permissions.each do |perm_name|
      permission = Permission.find_by(name: perm_name)
      RolePermission.find_or_create_by!(role: company_owner_role, permission: permission)
    end

    # Employee permissions
    employee_permissions = ['view_company']
    employee_permissions.each do |perm_name|
      permission = Permission.find_by(name: perm_name)
      RolePermission.find_or_create_by!(role: employee_role, permission: permission)
    end
  end
end
