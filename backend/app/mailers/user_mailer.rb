class UserMailer < ApplicationMailer
  def invitation_mail(company, user)
    @company = company
    @user = user
    @invitation_url = "http://localhost:3000/auth/accept-invite?token=#{user.invitation_token}"
    mail(
      to: user.email,
      subject: 'Test'
    )
  end
end
