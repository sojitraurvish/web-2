https://projects.100xdevs.com/tracks/kubernetes-1/Kubernetes-Part-1-4

why to use k8s

1) switch to diff clound provider
2) auto heal
3) autoscale
4) can observe your complete system in simple dashboard


Creating a k8s cluster
 
Locally (Make sure you have docker)
minukube   we do not use this becuase it only run master node and does start eveything in that only
kind - https://kind.sigs.k8s.io/docs/user/quick-start/ - we use this because it gives same architecture as k8s

On cloud
GKE
AWS K8s
vultr

Using kind
Install kind - https://kind.sigs.k8s.io/docs/user/quick-start/#installation


// how to installl kind
brew install kind
kind version

Single node setup
Create a 1 (master node) cluster
kind create cluster --name local

Check the docker containers you have running
urvishsojitra@Urvishs-Mac-mini ~ % docker ps   - this only started one mode and master node we want to start multi nodes with master and worker so follow bello thing 
CONTAINER ID   IMAGE                  COMMAND                  CREATED              STATUS              PORTS                       NAMES
0ff80b850c90   kindest/node:v1.35.0   "/usr/local/bin/entr…"   About a minute ago   Up About a minute   127.0.0.1:54909->6443/tcp   local-control-plane
You will notice a single container running (control-pane)

Delete the cluster
kind delete cluster -n local 



Multi node setup
Create a clusters.yml file
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
- role: control-plane
- role: worker
- role: worker

Create the node setup
 kind create cluster --config clusters.yml --name local

Check docker containers
urvishsojitra@Urvishs-Mac-mini p1 % docker ps
CONTAINER ID   IMAGE                  COMMAND                  CREATED              STATUS              PORTS                       NAMES
5387452c8a2c   kindest/node:v1.35.0   "/usr/local/bin/entr…"   About a minute ago   Up About a minute   127.0.0.1:56188->6443/tcp   local-control-plane
667de6d99c09   kindest/node:v1.35.0   "/usr/local/bin/entr…"   About a minute ago   Up About a minute                               local-worker2
69cc051e17f5   kindest/node:v1.35.0   "/usr/local/bin/entr…"   About a minute ago   Up About a minute                               local-worker

127.0.0.1:56188 -> you can go over here to hit the k8s apis - and hit the api server
// so when you crate cluster on aws or any other cloud provide and if you want to interacti with row api call the you have to send creds as well but form where you get the cruds
// if i am not interaction with row api then where i will store that pass(which i get when i have created cluster on aws) in my local machine so that i can connect directly
and the ans is in this file - cat ~/.kube/config 
// so what creads i get form cloud provider that i will put here in this file so in future when i try to interact with it(cloud cluster) via kubectl so this command will first goes
in this config file and find the creds and does the api call with this creds
// and even at above when i created cluster via kind it created cluster and put my created in this config file so you can check it there
// so to sum up every cloud provider which i use gives me config file that i have to add in my local cofig file for creds and when i am interacting with that cluster it send that 
creads with it while sending any api req and interact with api server

so no the question is my container is call local and its creds are alredy here in config file so how can i interact with this api server 127.0.0.1:56188 and send the config along
and the ans is using kubectl - command line interface

so install that - if you do not want to use kubectl then you can direactly hit this api via this 127.0.0.1:56188 but you have to find out end point and send the creds via postman
// how to install kubectl
brew install kubectl
kubectl version --client

// kubectl innner the hood send the api req pase the respose and give you clean output 

-------------------------------- extra not need
 
Now you have a node cluster running locally
Using minikube
 
Install minikube - https://minikube.sigs.k8s.io/docs/start/?arch=%2Fmacos%2Fx86-64%2Fstable%2Fbinary+download
Start a k8s cluster locally
minikube start

Run docker ps to see the single node setup
 
💡
A single node setup works but is not ideal. You don’t want your control pane to run containers/act as a worker.
-------------------------------- extra not need


urvishsojitra@Urvishs-Mac-mini p1 % kubectl get nodes <--v=8 verbose level - for which api req is going you can see the url>
NAME                  STATUS   ROLES           AGE   VERSION
local-control-plane   Ready    control-plane   21m   v1.35.0
local-worker          Ready    <none>          21m   v1.35.0
local-worker2         Ready    <none>          21m   v1.35.0

// so i have 1 master node and 2 worker node
// so how to create pod with this specific image like nginx before that fist check nginx iamge via only docker and hit the browser is it working or not

docker run -p 3005:80 nginx 
and hit localhost:3005 in browser 

// now create a pod
kubectl run nginx<pod name> --image=nginx<image name> --port=80<what port you want to expose on this container, this much is not enough to expose your port on internet, so we see this letter on>
// and inner the hood happend lot of things master has api server it add in etcd and then scheduler schedul the pod then worker node has kublet which pull the iamge and stated the container

// to get all the running pods
kubctl get pods
kubctl get pods -w - in wath mode so i do not have to run above command multipe time

// but how can i check that it is runing or not - you can not directly reach it, it is hold diff beast game
// when i run this docker run -p 3000:80 nginx then i get some logs so how can i get those logs here using kubectl
kubectl log <nginx - pod name>
// so it is runing somewhere eventhough i can not directly hit but it is runing somewhere

// this created pod is ruunign on which worker 
kubectl describe pod <nginx - pod name>

Node: local-worker/172.24.0.4 - it is running on this worker - node

-------------------------------- lets start two more pods

kubectl run nginx-2 --image=nginx --port=80
kubectl run postgres --image=postgres --port=80 --env POSTGRES_PASSWORD

urvishsojitra@Urvishs-Mac-mini p1 % kubectl get pods             
NAME       READY   STATUS              RESTARTS   AGE
nginx      1/1     Running             0          32m
nginx-2    1/1     Running             0          4m41s
nginx-3    1/1     Running             0          3m19s
postgres   0/1     ContainerCreating   0          2m40s  -> even this is creshing there is something called restarted so it keep restarting it will not distory that pod because it got cresh and that is the benifit k8s provides you

-------------------------------- lets start two more pods

// how to delte pod
kubectl delte pod <nginx - pod name>

// okay now we larn how to create pods but how to reach that pod so how can i do liek localhost:3000 and reach to that sepecific pod will soon reach ther when we reach to services
because untill now we just learn 
cluster 
nods
pods
container
image

---------- still left is 
deployments
replicaset
services -> so here we learn that how can we send the http reqs
ingress
configmaps

// this is once way to start the nginx container
kubectl run nigix --image=nginx --port=80

or using Manifest file

file - pod-contaiers.yml or manifest.yml
apiVersion: v1
kind: Pod
metadata:
  name: nginx // this is name for it and it goes in metadata
spec:
  containers: // it can runing multiple container but we are just giving only one container right now, if i add multiple then single pod start multiple containers
  - name: nginx
    image: nginx // if i change this image name after it is created then it change that new iamge in the final pod which is running
    ports:
    - containerPort: 80

// now i can simplaly do 
kubectl apply -f <pod-contaier.yml - name of the file>
pod/nginx created

// what is benifit of doing this 
/ if i change this image name after it is created then it change that new iamge in the final pod, and you do it again and again in ci-cd pipelines