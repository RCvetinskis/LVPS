require 'faker'

100.times do |i|
  company = Company.create!(
    name: Faker::Company.name,
    location: "#{Faker::Address.city}, #{Faker::Address.country}",
    description: Faker::Company.catch_phrase
  )

  UserCompany.create!(
    user_id: 2,
    company_id: company.id
  )

  puts "Created company #{i + 1}: #{company.name}"
end
