#!/bin/bash
db=$1
if [[ -n $db ]]
then
    echo using db $db
    mongoexport --db $db --collection products --fields code,name,active,isconsumable,stock --csv --out stock_$(date +%y%m%d%H%M).csv
else
    echo please provide a database name
    exit 1
fi
