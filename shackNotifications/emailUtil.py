import smtplib
import ssl


class EmailUtil():
    def __init__(self, senderEmail, password):
        self.senderEmail = senderEmail
        self.password = password

    def sendEmail(self, receivers, message):
        print(message)
        ctx = ssl.create_default_context()
        with smtplib.SMTP_SSL("smtp.gmail.com", port=465, context=ctx) as server:
            server.login(self.senderEmail, self.password)
            server.sendmail(self.senderEmail, receivers, message)
