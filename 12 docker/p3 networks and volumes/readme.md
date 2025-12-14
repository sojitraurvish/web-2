// without volume data does not persist
// docker run -p 27017:27017 mongo

// to see the list of volumes that you have created
// docker volume ls

// create volume
docker volume create <volume name>

// docker exec -it ......
// mongo store data in this folder data/db 
// postgres /var/lib/postgres/data

// mount that folder in mongo which actually stores the data 
docker run -v <volume name>:/data/db -p 27017:27017 mongo

---------------------------------------------------------
// networks - how to make containers to talk to eachother 
// attach them to the same network

create iamge 
docker build -t <image name> .

create a network 
docker network create my_custom_network

Start mongo on the same network
docker run -d -v volume_database:/data/db --name <super-impotent-name> --network my_custom_network -p 27017:27017 mongo

// change mongo uri in you porject 
"mongodb://<super-impotent-name>:27017/mydatabase
// this <super-impotent-name> will eventually resolve to mongo ip of mongo conintainer where mongodb is connected

Start the backend process with the network attached to it
docker run -d -p 3000:3000 --name <tag name> --network my_custom_network image_tag

Check the logs to ensure the db connection is successful
docker logs <container_id>
