from emailUtil import EmailUtil
from datetime import datetime
from datetime import timedelta
import pymysql as MySQLdb
import os
from dotenv import load_dotenv
load_dotenv()
ROOT_DIR = os.path.realpath(os.path.join(os.path.dirname(__file__), '..'))


def getWaterEvents():
    try:
        db = MySQLdb.connect(
            host=os.getenv('MYSQL_HOST'),
            user=os.getenv('MYSQL_USER'),
            password=os.getenv('MYSQL_PASSWORD'),
            database=os.getenv('MYSQL_DATABASE')
        )
        cursor = db.cursor()
    except (MySQLdb.Error, MySQLdb.Warning) as e:
        print(e)
        return 0
    compareTime = datetime.now() - timedelta(hours=12)
    query = "SELECT COUNT(datetime) FROM shacklog WHERE flow_rate>0 AND datetime>'{}';".format(
        str(compareTime))
    print(query)
    cursor.execute(query)
    results = cursor.fetchall()
    print(results[0][0])
    return results[0][0]


def main():
    emailUtil = EmailUtil("autoshackpi@gmail.com", "xsrqemvcgovranjs")
    if getWaterEvents() == 0:
        message = "RED ALERT!\n RED ALERT!\nNo watering events in the autoshack for the last 12 hours!\nRED ALERT!\n RED ALERT!"
        emailAddresses = ["rskennedy99@gmail.com", "mskennedy67@gmail.com"]
        emailUtil.sendEmail(emailAddresses, message)


if __name__ == "__main__":
    main()
