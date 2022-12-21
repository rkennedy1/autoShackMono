from emailUtil import EmailUtil
import smtplib
import ssl
import os
import subprocess
from dotenv import load_dotenv
load_dotenv()


def ping(hostname):
    return os.system("ping -c 1 " + hostname) == 0


def main():
    host = os.getenv('HOSTNAME')
    emailUtil = EmailUtil("autoshackpi@gmail.com", "xsrqemvcgovranjs")
    if not ping(host):
        message = "The server for {} is currently down".format(host)
        emailAddresses = ["rskennedy99@gmail.com",
                          "christy_kennedy@hotmail.com", "mskennedy67@gmail.com"]
        emailUtil.sendEmail(emailAddresses, message)


if __name__ == "__main__":
    main()
