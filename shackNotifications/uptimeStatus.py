import smtplib
import ssl
import os
from dotenv import load_dotenv
load_dotenv()


def ping(hostname):
    return os.system("ping -c 1 " + hostname) == 0


def sendEmail(hostname):
    ctx = ssl.create_default_context()
    password = "xsrqemvcgovranjs"    # Your app password goes here
    sender = "autoshackpi@gmail.com"    # Your e-mail address
    receiver = "rskennedy99@gmail.com"  # Recipient's address
    message = "The server for {} is currently down".format(hostname)

    with smtplib.SMTP_SSL("smtp.gmail.com", port=465, context=ctx) as server:
        server.login(sender, password)
        server.sendmail(sender, receiver, message)


def main():
    host = os.getenv('HOSTNAME')
    if not ping(host):
        sendEmail(host)


if __name__ == "__main__":
    main()
