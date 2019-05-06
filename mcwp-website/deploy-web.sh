#!/usr/bin/expect
##
# op-web发布
#
set timeout 30
#不输参数，默认发布地址
set remoteIp "172.16.1.72"
set rip [lindex $argv 0]
if {$argc==1} {
set remoteIp "172.16.1.$rip"
}
send_user "发布机器IP：$remoteIp\n"
spawn ssh  zhudb@172.16.1.72 -i /var/lib/jenkins/7g/7g2
expect {
        -re "Are you sure" {
          send "yes"
        }
        -re "Permission denied" {
            send_user "Error:Permission denied.\n"
            exit
        }
        -re "zhudb@izbp1eu3rcorbj3uy0mw05z" {
            send "rm -rf /home/zhudb/nas/app/zdb_website_mp_pub\r"
            send "scp -rp -i /opt/7nG/1/7g1  devops@172.16.1.71:/var/lib/jenkins/appNodes/product/0.9.1/zdb_website_mp_pub  /home/zhudb/nas/app/\r"
            if {"$remoteIp"=="172.16.1.72"} {
              send "rm -rf /opt/app/zdb-front/zdb_website_mp_pub\r"
              send "cp -r /home/zhudb/nas/app/zdb_website_mp_pub /opt/app/zdb-front/zdb_website_mp_pub\r"
              send "cd   /opt/app/zdb-front/zdb_website_mp_pub\r"
	      send "yarn install\r"
	      send "pm2 stop node/server.js --name zdb-website\r"
	      send "pm2 start node/server.js --name zdb-website\r"
            }

        }
}
send  "exit\r"
expect eof
