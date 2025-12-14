// to build the image 
 % docker build -t backend

// change and created the proper name and tag - generally you do not do this befcause you assign proper name while creating the image
docker tag backend sojitraurvish/backend:mine1

// to build the image in current folder
 % docker build -t backend .

 // to run that image as container 
 % docker run -p 3000:3000 backend 

// if you want to go inside the running container
// Note: For Alpine-based images, use /bin/sh instead of /bin/bash
docker exec -it <container id> /bin/sh

// if you do not what to go inside and run command from outside, inside the container
// docker exec <container id> 

--------------------------------------
// to push your image to docker hub for other people to use (it is like github)

- go to dockerhub and sign in
- create new repository - sojitraurvish/my-new-backend-testing

- login to docker cli
- you might have to create an access token

// push to repository you have created
docker push <your_username or namespace>/your_reponame:tagname
// this push only works if you have login from cli an dif you have cia google or other social acc in docker hub then go to 
> my profile > security > create new access token which you can use as password

// change and created the proper name - generally you do not do this befcause you assign proper name while creating the image
docker tag backend sojitraurvish/my-new-backend-testing:mine4 

// pushed the image
docker push sojitraurvish/my-new-backend-testing:mine4  


---------------------------------------

