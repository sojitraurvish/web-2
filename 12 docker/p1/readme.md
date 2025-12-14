docker run -d mongo - without port mapping 
// run mongo container from the image
docker run -d -p 27017:27017 mongo

---------------------------------------------------

// clean up the images form your machine 
// docker rmi mongo

but before you remove image you have remove (stop or kill) and then remove container also

// check all running containers
// docker ps

// to kill the running container
docker kill <container id>

// to check all the stoped containers
docker ps -a

// to remove stoped containers 
docker rm <container name or id>

// check all the images in your machine locally 
// docker images

// no you can clean up the images form your machine 
// docker rmi mongo

// shortcurt to delete stoped continaer as well as image form your machine
docker rmi --force

-----------------------------------------------------------


// to build your own image
// docker build