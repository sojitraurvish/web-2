https://projects.100xdevs.com/tracks/g0AcDSPl74nk45ZZjRdU/aws-4

// for cli login to the actual machine
ssh -> 22

// if you do not put anything at the end i mean post then req by default goes to port 80 and it is http not s
http://3.5.10.11 -> this goes to port 80 http://3.5.10.11:80
http -> 80 // amd if node process is running in the machine then you have to open that port on that machine

https -> 443 (extra thing here you have to add security sertificate as well even though you open this port)


// ssh in the server // before this run this to give permition to this privatekey fiel chmode 700 kirat-test-2.pem
// shh -i kirat-test-2.pem ubuntu@13.234.111.39

code to deploy in p1 folder

// if your ec2 machine does not have the internet access then thing to do is
ping google.com
vi /etc/resolv.conf
    add this entry -> nameserver 8.8.8.8 
    to exit -> ESC : q

// clone this code on server 
git clone https://github.com/hkirat/sum-server.git

pnpm i 
node index.js // this process is runing on port 8080

but i have only opened 3 port 22, 80, 443 not port 8080 then what to do now

// in securiy(firewall rules) grop add 2 rules for port 8080 // via this you can access your server but is is not good and that is why we will use negix proxy

    custom TCp 8080 anware for p4v4
    custom TCp 8080 anware for p4v6


if you have 2 node process one on port 8080 and second on 8081 and so you have reverse proxey on port 80 on same server
and that decide based on your domain where to forward the req, and that is called reverce proxy

// this is reverse proxy
your req -> bad.website.com - reistricted
your req -> proxy server(vpn) -> which forwrads req to (bad.website.com)

// and what we are doing here where proxey is is same server and forward req to the appropreat service is proxy
// so here proxy is in same machine

// sudo apt update
// sudo apt install nginx

// nginx by default runs on port 80 // hit your ip you well see wellcome page

// to configure domin with ip 
and name backend1 - select A for record - then add the ip for that domain 13.234.111.39
and name backend2 - select A for record - then add the ip for that domain 13.234.111.39 add same ip for both so both point to same server and then we use nginx to send req to diff node process on same server

Create reverse proxy

sudo rm sudo vi /etc/nginx/nginx.conf // first delete old default file
sudo vi /etc/nginx/nginx.conf

events {
    # Event directives...
}

http {        # -> start an http server

    server {
        listen 80;                     # -> listening on port 80
        server_name be1.100xdevs.com;  # -> this domain goes to backend 1

        location / {
            proxy_pass http://localhost:8080;   # -> proxies traffic to port 8080
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }

    server {
        listen 80;                     # -> also listening on port 80
        server_name be2.100xdevs.com;  # -> this domain goes to backend 2

        location / {
            proxy_pass http://localhost:8081;   # -> proxies traffic to port 8081
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }

}

// when you change the config then restart neginx via this command
sudo nginx -s reload


ping <id>
// if you want that when you ping some domain from local in your system and you want that req goes to the locally runing sercer
you can do that by changin the configarations here
sudo vi /etc/hosts

// certificate management or https we will learn in letter videos


in callage you have one public ip via that your callage connected to the world - if some website block this main ip now boddy in call can access that site
and you all have the private ip in your class room router