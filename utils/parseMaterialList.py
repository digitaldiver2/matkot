#! /bin/python

import csv
import pymongo

CODE='Code'
NAME='Omschrijving'
FAMILY_NAME='Familienaam'
FAMILY_INDEX='Familie'
STOCK='Voorraad Begin'
DESCRIPTION = 'Commentaar'

client = pymongo.MongoClient('localhost', 27017)
#db = client['matkot-dev']
db = client.testmongo

product_coll = db.products
family_coll = db.productfamilies


rowcount = 0

with open('materiaallijst.csv') as materiallist:
    reader = csv.DictReader(materiallist)
    for row in reader:
        code = row[CODE]
        name = row[NAME]
        description = row[DESCRIPTION]
        family_name = row[FAMILY_NAME]
        stock = row[STOCK]
        
        if code == None or code == '':
            print 'reached empty codes, parsed %d rows' % rowcount
            break
        else:
            if family_name == None or family_name == '':
                print 'empty family for product %s [%s]' % (name, code)
                break;

            #check if family already exists
            family_id = None
            family = family_coll.find_one({'name':family_name})
            if family == None:
                family_id = family_coll.insert_one({'name': family_name}).inserted_id
            else:
                family_id = family['_id']

            print 'family "%s" with id %s' % (family_name, family_id)

            #assemble product
            product = {
                'active': True,
                'name': name,
                'info': description,
                'code': code,
                'productfamily': [family_id],
                'stock': stock
            }

            print product

            product_coll.insert_one(product)
            rowcount += 1


print '--the end-- %d' % rowcount
