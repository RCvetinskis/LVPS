# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 20_260_611_145_258) do
  create_table 'companies', force: :cascade do |t|
    t.string 'name', null: false
    t.string 'location', null: false
    t.text 'description'
    t.datetime 'created_at', null: false
    t.datetime 'updated_at', null: false
  end

  create_table 'permissions', force: :cascade do |t|
    t.string 'name', null: false
    t.string 'resource_type'
    t.string 'action', null: false
    t.text 'description'
    t.datetime 'created_at', null: false
    t.datetime 'updated_at', null: false
    t.index ['name'], name: 'index_permissions_on_name', unique: true
    t.index %w[resource_type action], name: 'index_permissions_on_resource_type_and_action'
  end

  create_table 'role_permissions', force: :cascade do |t|
    t.integer 'role_id', null: false
    t.integer 'permission_id', null: false
    t.datetime 'created_at', null: false
    t.datetime 'updated_at', null: false
    t.index ['permission_id'], name: 'index_role_permissions_on_permission_id'
    t.index %w[role_id permission_id], name: 'index_role_permissions_on_role_id_and_permission_id', unique: true
    t.index ['role_id'], name: 'index_role_permissions_on_role_id'
  end

  create_table 'roles', force: :cascade do |t|
    t.string 'name'
    t.datetime 'created_at', null: false
    t.datetime 'updated_at', null: false
  end

  create_table 'user_companies', force: :cascade do |t|
    t.integer 'user_id', null: false
    t.integer 'company_id', null: false
    t.datetime 'created_at', null: false
    t.datetime 'updated_at', null: false
    t.index ['company_id'], name: 'index_user_companies_on_company_id'
    t.index %w[user_id company_id], name: 'index_user_companies_on_user_id_and_company_id', unique: true
    t.index ['user_id'], name: 'index_user_companies_on_user_id'
  end

  create_table 'users', force: :cascade do |t|
    t.string 'email', default: '', null: false
    t.string 'encrypted_password', default: '', null: false
    t.string 'reset_password_token'
    t.datetime 'reset_password_sent_at'
    t.datetime 'remember_created_at'
    t.datetime 'created_at', null: false
    t.datetime 'updated_at', null: false
    t.string 'name', null: false
    t.string 'surname', null: false
    t.string 'address'
    t.date 'birth_date'
    t.integer 'role_id'
    t.string 'jti', null: false
    t.string 'status', default: 'pending'
    t.string 'invitation_token'
    t.datetime 'invitation_sent_at'
    t.index ['email'], name: 'index_users_on_email', unique: true
    t.index ['invitation_token'], name: 'index_users_on_invitation_token', unique: true
    t.index ['jti'], name: 'index_users_on_jti', unique: true
    t.index ['reset_password_token'], name: 'index_users_on_reset_password_token', unique: true
    t.index ['role_id'], name: 'index_users_on_role_id'
  end

  add_foreign_key 'role_permissions', 'permissions'
  add_foreign_key 'role_permissions', 'roles'
  add_foreign_key 'user_companies', 'companies'
  add_foreign_key 'user_companies', 'users'
  add_foreign_key 'users', 'roles'
end
