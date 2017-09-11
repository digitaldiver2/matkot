user="stijn"
ip="95.85.16.242"
folder=$(ssh $user@$ip "ls -t /home/stijn/backups | head -n 1")
full_path=/home/$user/backups/$folder/matkot
tmp_path=/tmp/matkot-dev-backup

echo "pulling backup $full_path from remote"
mkdir -p $tmp_path
scp -r $user@$ip:$full_path $tmp_path
mongorestore --db matkot-dev --drop $tmp_path/matkot


