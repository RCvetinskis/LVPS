require 'faker'
# companies
# 100.times do |i|
#   company = Company.create!(
#     name: Faker::Company.name,
#     location: "#{Faker::Address.city}, #{Faker::Address.country}",
#     description: Faker::Company.catch_phrase
#   )

#   UserCompany.create!(
#     user_id: 2,
#     company_id: company.id
#   )

#   puts "Created company #{i + 1}: #{company.name}"
# end
#
# #comapny locations
company = Company.last

company.locations.create!(
  name: 'Vilnius Office',
  address: 'Gedimino pr. 1, Vilnius',
  city: 'Vilnius',
  country: 'Lithuania',
  postal_code: 'LT-01100',
  phone: '+370 5 123 4567',
  email: 'vilnius@company.com',
  primary_location: true,
  active: true
)

company.locations.create!(
  name: 'Kaunas Office',
  address: 'Laisvės al. 10, Kaunas',
  city: 'Kaunas',
  country: 'Lithuania',
  postal_code: 'LT-44215',
  phone: '+370 37 123 456',
  email: 'kaunas@company.com',
  primary_location: false,
  active: true
)

company.locations.create!(
  name: 'Klaipėda Warehouse',
  address: 'Jūros g. 50, Klaipėda',
  city: 'Klaipėda',
  country: 'Lithuania',
  postal_code: 'LT-92115',
  phone: '+370 46 123 456',
  email: 'warehouse@company.com',
  primary_location: false,
  active: true
)

puts "Created #{company.locations.count} locations"
