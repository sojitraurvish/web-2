https://projects.100xdevs.com/tracks/w5E6PT2t0IyOFM3bZxcM/aws-fe-1

storage - object stores - s3

when you upload image on any object store then via object store url you should not give permition to access it you should use cdn for copple of reasons

1 ) cacheing(single source of truth) - if you have deploy your image on usa object store then if user from india want to access that image then first
you req reaches to CDN server in india and check the cache if not found then req goes to usa server fetch the image and add in 
the indian server cache and server to user and when again req comes for same image it usage that cache to serve it.

so you do not use your image object store url you use cdn url 

so cdn.urvish.aws.com/a.mp4 -> which points to -> (sourse) s3.urvish.cms.aws.com

so on cloudfront i have to create distribution that this is my source url and it will give me diff url which points to same assert, but it does something extra

so when you are creating a s3 bucket bock all the access by defalut and letter on only give permition to cdn to access it


aws has cloudfront as cdn

CDN - contect delivery network 

Object store      CDN

storage         distribution 

2GB uses        20 Gb of bandwith is consumened (if 100 people visites it)

$0.02 per month /   $0.01 daller for distribution
