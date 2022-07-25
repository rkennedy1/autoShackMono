from pymongo import MongoClient
import os
import json

ROOT_DIR = os.path.realpath(os.path.join(os.path.dirname(__file__), '..'))

class Database():
    def __init__(self):
        uri = "mongodb+srv://cluster0.27zu2.mongodb.net/myFirstDatabase?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority"
        client = MongoClient(uri,
                             tls=True,
                             tlsCertificateKeyFile=ROOT_DIR + '/scripts/certs/mongodb-cert.pem')
        db = client['AutoShack']
        self.collection = db['Testing']

    def addEntry(self, entry):
        self.collection.insert_one(entry)

    def addMany(self, list):
        self.collection.insert_many(list)

    def numDocuments(self):
        doc_count = self.collection.count_documents({})
        print(doc_count)

def main():
    lines = []
    entries = []
    with open(ROOT_DIR + '/logs/shackdata.log') as f:
        lines = f.readlines()

    lastAdd = []
    with open(ROOT_DIR + '/logs/lastAdd.txt', 'r') as f:
        lastAdd = f.readlines()
        if not lastAdd:
            lastAdd.append('000')

    for line in lines:
        jsonline = json.loads(line)
        if jsonline['datetime'] > lastAdd[0]:
            entries.append(jsonline)

    if entries:
        with open(ROOT_DIR + '/logs/lastAdd.txt', 'w') as f:
            f.write(entries[-1]['datetime'])

    if entries is not None:
        D1 = Database()
        D1.addMany(entries)
    print("Added ", len(entries), " documents to the database")


if __name__ == "__main__":
    main()
