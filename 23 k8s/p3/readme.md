
-----------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------- just show how entire flow looks like 
-----------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------


Series of events
When you run the following command, a bunch of things happen
kubectl create deployment nginx-deployment --image=nginx --port=80 --replicas=3

Step-by-Step Breakdown:
Command Execution:
You execute the command on a machine with kubectl installed and configured to interact with your Kubernetes cluster.
API Request:
kubectl sends a request to the Kubernetes API server to create a Deployment resource with the specified parameters.
API Server Processing:
The API server receives the request, validates it, and then processes it. If the request is valid, the API server updates the desired state of the cluster stored in etcd. The desired state now includes the new Deployment resource.
Storage in etcd:
The Deployment definition is stored in etcd, the distributed key-value store used by Kubernetes to store all its configuration data and cluster state. etcd is the source of truth for the cluster's desired state.
Deployment Controller Monitoring:
The Deployment controller, which is part of the kube-controller-manager, continuously watches the API server for changes to Deployments. It detects the new Deployment you created.
ReplicaSet Creation:
The Deployment controller creates a ReplicaSet based on the Deployment's specification. The ReplicaSet is responsible for maintaining a stable set of replica Pods running at any given time.
Pod Creation:
The ReplicaSet controller (another part of the kube-controller-manager) ensures that the desired number of Pods (in this case, 3) are created and running. It sends requests to the API server to create these Pods.
Scheduler Assignment:
The Kubernetes scheduler watches for new Pods that are in the "Pending" state. It assigns these Pods to suitable nodes in the cluster based on available resources and scheduling policies.
Node and Kubelet:
The kubelet on the selected nodes receives the Pod specifications from the API server. It then pulls the necessary container images (nginx in this case) and starts the containers.
 
Hierarchical Relationship
Deployment:
High-Level Manager: A Deployment is a higher-level controller that manages the entire lifecycle of an application, including updates, scaling, and rollbacks.
Creates and Manages ReplicaSets: When you create or update a Deployment, it creates or updates ReplicaSets to reflect the desired state of your application.
Handles Rolling Updates and Rollbacks: Deployments handle the complexity of updating applications by managing the creation of new ReplicaSets and scaling down old ones.
ReplicaSet:
Mid-Level Manager: A ReplicaSet ensures that a specified number of identical Pods are running at any given time.
Maintains Desired State of Pods: It creates and deletes Pods as needed to maintain the desired number of replicas.
Label Selector: Uses label selectors to identify and manage Pods.
Pods:
Lowest-Level Unit: A Pod is the smallest and simplest Kubernetes object. It represents a single instance of a running process in your cluster and typically contains one or more containers.
 
💡
A good question to ask at this point is why do you need a deployment when a replicaset is good enough to bring up and heal pods?

-----------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------




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

// to get all clusters
kind get clusters

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

// this is one way to start the nginx container
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


you can start pods in master nods but you should not because it has 10 diff things to runs so you should not overwhelme it, so it should be seperate in worker node


// today we learn about these things
deployments
replicaset
services -> so here we learn that how can we send the http reqs
ingress
configmaps
 

 // how to start new contianers and if it is running correctly then and only stop old version of my application
 // what if somthing else to manage your pods,so if they ever goes down or deleted bring them backup, or if i tell you 
 that here a new verstion of that iamge that you need to deploy - then fist deploy that new iamge, make sure it is working
 and then and only get rid of old image and this is where deployment comes in to the picture

Deployment
A Deployment in Kubernetes is a higher-level abstraction that manages a set of Pods and provides declarative updates to them. It offers features like 
1) scaling, - you just need to tell increase no of pods to 10 and it increse no of pods - earlyer i had to run that command 10 times kubectl run nginx-2 --image=nginx --port=80 - also i can not repeat name so it was tedious process earlier, also if i have created pods with depolyment and if i try to delete it with kubectl delete pod nginx-2 then it will recreate it, so it is very powerfull and you should always use it, by saying that replicas i want 10 then it start 10 containers if i say agagin replicas 6 then it stop 4 containers for me
2) rolling updates,- if i say that that new image is nginx-2 then it start this new image first if it is working corretly then it stop 
3) rollback capabilities - if new image i given but it did not worked or faild then our pods begin to fail,then deploment let us rollback to our existing deployment in (single command - i think it does happens automatically) ,  making it easier to manage the lifecycle of applications.

so deploment give you 4 services 
    - staring pods
    - rolling them back
    - updating pods
    - bring them back up if ever goes down


-------------------------------------------------------- some theory about depolment
Pod: A Pod is the smallest and simplest Kubernetes object. It represents a single instance of a running process in your cluster, typically containing one or more containers.
Deployment: A Deployment is a higher-level controller that manages a set of identical Pods. It ensures the desired number of Pods are running and provides declarative updates to the Pods it manages.
 
Key Differences Between Deployment and Pod:
Abstraction Level:
Pod: A Pod is the smallest and simplest Kubernetes object. It represents a single instance of a running process in your cluster, typically containing one or more containers.
Deployment: A Deployment is a higher-level controller that manages a set of identical Pods. It ensures the desired number of Pods are running and provides declarative updates to the Pods it manages.
Management:
Pod: They are ephemeral, meaning they can be created and destroyed frequently.
Deployment: Deployments manage Pods by ensuring the specified number of replicas are running at any given time. If a Pod fails, the Deployment controller replaces it automatically.
Updates:
Pod: Directly updating a Pod requires manual intervention and can lead to downtime.
Deployment: Supports rolling updates, allowing you to update the Pod template (e.g., new container image) and roll out changes gradually. If something goes wrong, you can roll back to a previous version.
Scaling:
Pod: Scaling Pods manually involves creating or deleting individual Pods.
Deployment: Allows easy scaling by specifying the desired number of replicas. The Deployment controller adjusts the number of Pods automatically.
Self-Healing:
Pod: If a Pod crashes, it needs to be restarted manually unless managed by a higher-level controller like a Deployment.
Deployment: Automatically replaces failed Pods, ensuring the desired state is maintained.
-------------------------------------------------------- some theory about depolment

// now let crate deploment - tecnically deployment creates a replicasets and a replicasets who manages to your pods, but right now just ingnore
// via single command you can also craete an deployment but it is good idea to have manifact file

Create a deployment
Lets create a deployment that starts 3 pods
 
Create deployment.yml
apiVersion: apps/v1
kind: Deployment # deployment comes in apps/v1 apis
metadata:
  name: nginx-deployment # deployemt name
spec:
  replicas: 3  // how many repolicals i need to specific pod
  selector: # this part is directly realted to templete metadata lables app:nginx (when you are creating deployemnt, you are saying that start 3 pods, you you need to tell it that the prods you are creating make sure that some lable attached to them for example app=<nginx - this coould be anything>), so whenever you find contianrs or want to know that our 3 continers is up or not then you can find via this app:nginx lable attached to it, and if i manually create 4th pod with this lable then it will delete one of them 4 so it make sure only 3 pods exists, so here app:ngix is to find and bellow templte app:nginx which actually attach the name to pods
    matchLabels: // this is how the deployment knows that, what pods are mine, what when via this templete it starts new pods so it can know what are mine pods, so if one of them creshs then it need to restart the pods
      app: nginx
  template:                        from here 
    metadata:
      labels:
        app: nginx                 
    spec:
      containers:
      - name: nginx
        image: nginx:latest
        ports:
        - containerPort: 80         to here is the templte for each and every replica, every replica, pod that is starting need to have one nginx container , and every pod is staring has app: nginx as lable

 
Apply the deployment
 kubectl apply -f deployment.yml

Get the deployment
kubectl get deployment
NAME               READY   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment   3/3     3            3           18s

// it show the which lable it attached to 
dubectl describe pod
Labels:           app=nginx

Get the rs
kubectl get rs
NAME                         DESIRED   CURRENT   READY   AGE
nginx-deployment-576c6b7b6   3         3         3       34s

Get the pod
kubectl get pod
NAME                               READY   STATUS    RESTARTS   AGE
nginx-deployment-576c6b7b6-b6kgk   1/1     Running   0          46s
nginx-deployment-576c6b7b6-m8ttl   1/1     Running   0          46s
nginx-deployment-576c6b7b6-n9cx4   1/1     Running   0          46s

Try deleting a pod
kubectl delete pod nginx-deployment-576c6b7b6-b6kgk

Ensure the pods are still up
kubectl get pods

// what happens if i delete deplyment - > so it delete the replica set it created and replicaset will delete all the pods it created
// kubectl delte deployment <nginx-deplyment-rendomid - name of the deplyment>
then check replicaset and pods
kubectl get rs
kubectl get pods

// so let correct one tecnical detial is first deployment creates replicaset and replicaset creates 3 pods
// deployment > replicaset > 3 pods

then why can not i directly create replicaset and create 3 pods why i need deplyment? will ans this q letter on

// so now lets create first only replicaset and see that wheather it crates 3 pods or not

// so now let fist understand the replicaset and then the diff
 
-------------------------------------------------------- some theory about replicaset

Replicaset
A ReplicaSet in Kubernetes is a controller that ensures a specified number of pod replicas are running at any given time. It is used to maintain a stable set of replica Pods running in the cluster, even if some Pods fail or are deleted.
 
When you create a deployment, you mention the amount of replicas you want for this specific pod to run. The deployment then creates a new ReplicaSet that is responsible for creating X number of pods.
notion image
 
Series of events
User creates a deployment which creates a replicaset which creates pods
If pods go down, replicaset controller  ensures to bring them back up

-------------------------------------------------------- some theory about replicaset


apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: nginx-replicaset
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:latest
        ports:
        - containerPort: 80

        
kubectl apply -f replicaset.yml

here also if i delte pod it restarted because replicaset make sure that no of pods ruunig is 3

fisrt delete all the pods and replicaset by delteing replicasets
kubectl delete rs 


Why do you need deployment?
If all that a deployment does is create a replicaset, why cant we just create rs ?
 

Experiment
Update the image to be nginx2  (an image that doesnt exist)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx2:latest
        ports:
        - containerPort: 80


// fist create deployment with this command 
kubectl apply -f 3-deplyment-replicaset.yml

// check everythig is created or not deployment > replicaset > pods
// all done

// now i want to upgrade my image so now i want to change my image to let say nginx:letest to nginx-2:letest 
so after changeing this i reapply my deployment via
//  kubectl apply -f 3-deployment-replicaset.yml 

// now waht should happend

                                                        -> pod
// so at first you careted old deployment -> replicaset -> pod
                                                        -> pod


                                                            -> new pod
option 2 new iamge appliyed to deployment -> new replicaset -> new pod
                                                            -> new pod

// when you update the image then - deplyment should create brand new replicaset and create 3 new pods or should updated in older one and which updated older pods 

// so here it creste brand new replicaset - remember the deployment principals it give you rolling updates means i will first create new pods via new replicaset and if they are helthy then i will slowly move your traffic towards new pods via new replicaset


urvishsojitra@Urvishs-Mac-mini p2 % kubectl get pods
NAME                                READY   STATUS             RESTARTS   AGE
nginx-deployment-59f86b59ff-7gf4s   1/1     Running            0          16m
nginx-deployment-59f86b59ff-9pdmq   1/1     Running            0          16m       <here>
nginx-deployment-59f86b59ff-qschb   1/1     Running            0          16m
nginx-deployment-75db7f44db-tl2t7   0/1     ImagePullBackOff   0          8m13s       ImagePullBackOff -why because i took not a valid image which is nginx-2
urvishsojitra@Urvishs-Mac-mini p2 % 

so at first it trying to start one new pod with new replicaset and if it start properly then i will scale down one pod from old replicaset and will keep doing for all the pods and if all new pods are stared and working correctly then and only to stop old replicaset


urvishsojitra@Urvishs-Mac-mini p2 % kubectl get deployment
NAME               READY   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment   3/3     1            3           21m
urvishsojitra@Urvishs-Mac-mini p2 % kubectl get rs        
NAME                          DESIRED   CURRENT   READY   AGE
nginx-deployment-59f86b59ff   3         3         3       22m  -> it still has old replica sets and all the req still goes <here> in old pods, not to the bed pods 
nginx-deployment-75db7f44db   1         1         0       13m 


----------------------------------------------------------

Role of deployment
Deployment ensures that there is a smooth deployment, and if the new image fails for some reason, the old replicaset is maintained.
Even though the rs is what does pod management , deployment is what does rs management
----------------------------------------------------------

Rollbacks
Check the history of deployment
 kubectl rollout history deployment/nginx-deployment

Undo the last deployment
kubectl rollout undo deployment/nginx-deployment


// now let say i update the new correct image to postgress with env vars

// how things get autoscale - keep this in mind - here you can play with your pods when to scale up and down
q - if i create five nodes then will it keep on runing eventhough i do not have anyting inside it? yes
and that is way i would do somethign like this will choose min 2 nods and max 10 nodes so it will automatically increase more node when there is more load (see image 1)

if you have microservice architecture where there is lot of small small process or still can be depend on the usecase but microsercies could be one of them why to share the compute
k8s -> container orchestrator
    -> poovides autoscaling



-----------

each node has diff ip and if you want your pod which is in that node can be access via that ip 55.22.1.3:80 then you can not access it ,
if you want that req to reach a pod then you have to create anouther service called service, a services which exposis your pods over the internet,
if you want to get public ip for your software in pod or pod and want to point it to urvish.100x.com domain then you need to create a sevice in k8s

// if i do this then it will tell me the ip where my container is running so this is the ip of your pod
kubectl get pods -owide
NAME                                READY   STATUS    RESTARTS   AGE   IP            NODE                 NOMINATED NODE   READINESS GATES
nginx-deployment-59f86b59ff-4wqbq   1/1     Running   0          32s   10.244.1.15   local-mine-worker    <none>           <none>
nginx-deployment-59f86b59ff-4zbwx   1/1     Running   0          32s   10.244.1.16   local-mine-worker    <none>           <none>
nginx-deployment-59f86b59ff-cnnhq   1/1     Running   0          32s   10.244.2.13   local-mine-worker2   <none>           <none>

but if i try to goes to this ip 10.244.1.15:80 where nginx should be running, but this is private ip because it start with 10.something that can be used for one pod to talk to another pod in same node or other node but outside world can not access these pods untill you introduce the service

// now how to you reach to continer you create a service

----------------------------------------------------------------- service theory
Service
In Kubernetes, a "Service" is an abstraction that defines a logical set of Pods and a policy by which to access them. - <when you create service you have to tell it, that you can access this pod and this pod, so these are the two pods where i want you to forward the traffic to , and how do you want to this service to descoverable, do you want to craete a load balancer, or do you just want to expose the ip of the node, so you need to tell it logical set of pods - so what all pods need to hit and policy by which to access them- how it can assess>
Kubernetes Services provide a way to expose applications running on a set of Pods as network services. Here are the key points about Services in Kubernetes:
Key concepts
Pod Selector: Services use labels to select the Pods they target. A label selector identifies a set of Pods based on their labels.
Service Types:
ClusterIP: Exposes the Service on an internal IP in the cluster. This is the default ServiceType. The Service is only accessible within the cluster.
NodePort: Exposes the Service on each Node’s IP at a static port (the NodePort). A ClusterIP Service, to which the NodePort Service routes, is automatically created. You can contact the NodePort Service, from outside the cluster, by requesting <NodeIP>:<NodePort>.
LoadBalancer: Exposes the Service externally using a cloud provider’s load balancer. NodePort and ClusterIP Services, to which the external load balancer routes, are automatically created.
Endpoints: These are automatically created and updated by Kubernetes when the Pods selected by a Service's selector change.
----------------------------------------------------------------- service theory

now lets create are very first service that will expose our app over our cluser

Create service.yml
apiVersion: v1
kind: Service
metadata:
  name: nginx-service # name of the service
spec:
  selector: # how does it know at what ports to forward traffic to? ans is the pods which has nginx in there lables, as like deployment identifies the pods, replicasets identifies the pods
    app: nginx
  ports:
     - protocol: TCP  # the protocol you on wehich you expose on Which is TCP because it is http server we are hitting up
      port: 80 # the port on which it should be expose on internally
      targetPort: 80 # the target on which you should hit the container
      nodePort: 30007  # at where it should be expose on the internet, , 30000 - 30200 this range taht is why you do not use node port in production
  type: NodePort # there are diff types of services you can create

  #if you has k8s cluster which has let say two machines and if fist machine is runing two pods and second mahcine is ruunig thired pod
  # fist two pods are the nginx pods in first machine
  # you can craete a verious types of services 
  
  # see pic 2 and 3 and 15
  # Cluster IP - one is  rather then  (second one which has one pod) directly hiting node 1's nginx-pod-1 and nginx-pod-2, it can hit the service(cluster ip) which has internal ip call 1.2.3.4 you hit this ip and which will load balance req between  nginx-pod-1 and nginx-pod-2, and that is one type of service called cluster IP

  #
  # Node port - if i hit the specifc node1 on sepecific port then it should take me to both the pod in loadbalce fation inside that node1 (see image 4)
  # the multiple node you have, you can expose the same port on all of these nodes and they will all talk to the same set of containers that you have selected (see iamge 5)
  # currectly i have 3 nods(including master) and node port, and node service service expose single port on all threes of these, i can hit any one of three nodes on that specific port and it forward req to these container (see iamge 6)

// apply the service 
 kubectl apply -f 5-node-service.yml 
service/nginx-service created

urvishsojitra@Urvishs-Mac-mini p2 % kubectl get svc
NAME            TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)        AGE
kubernetes      ClusterIP   10.96.0.1      <none>        443/TCP        7h57m
nginx-service   NodePort    10.96.217.40   <none>        80:30007/TCP   5s      <------- http://localhost:30007/ this is not runing but if you so same thing in valter or any cloud provider then it is running 

// in cloud proder make sure you have created firewalle rule for port 30007(see pic 14) instead youc can also crete firewell group

// i have created node port that mean if i goes to any of the nodes, if i goes to the ip of any of these three nodes then i should be able to find soming runing here at 30007, but i am doing it locally that is why it is not wrokiung

urvishsojitra@Urvishs-Mac-mini p2 % docker ps
CONTAINER ID   IMAGE                  COMMAND                  CREATED       STATUS       PORTS                       NAMES
3ac4f7060668   kindest/node:v1.35.0   "/usr/local/bin/entr…"   8 hours ago   Up 8 hours                               local-mine-worker
b504801e96fe   kindest/node:v1.35.0   "/usr/local/bin/entr…"   8 hours ago   Up 8 hours                               local-mine-worker2
781145a62d43   kindest/node:v1.35.0   "/usr/local/bin/entr…"   8 hours ago   Up 8 hours   127.0.0.1:50995->6443/tcp   local-mine-control-plane

// the reason it did not work locallly because when i start these machine locally then there is somthing running on this container on 30007, but i have not expose it on my mac, so the probelm is when you run kind it create 3 docker container as node and that you have to expose with your mac machine on port 30007 then only can req can goes inside contaienr as node, there is only one port mapping  127.0.0.1:50995->6443/tcp(this mean if any is ruuing on 6443 then i can visite it on lcoalhost:50995) but i have to add more that says my machine 30007 can point here 
// see image 7 - this extra step i have to do because i am ruuing it via kind locally, and how we can do this when you

kind: Cluster # see image 8
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
- role: control-plane 
  extraPortMappings:
  - containerPort: 30007 
    hostPort: 30007
- role: worker
  extraPortMappings: 
  - containerPort: 30007 
    hostPort: 30008
- role: worker
  extraPortMappings: 
  - containerPort: 30007 
    hostPort: 30009


// start new cluster with portmaping with nodes
// kind create cluster --config 6-clusters-node-with-ports.yml  --name local-mine


let see how to do same thing on valter and second thing is via node service you can not run it on port 80 you have to choose some weard port like 30007 so that is why we
learn second type of service called load balancer service but this does not work locally

load balancer is outside of the cluster not a poat of the cluster it is diff service (see pic 9)
- and the benifit of this is you never expose your core ip to end users, user only hit load balancer and it hit your actual server 
but in node port services user directly hits ip of your server, and they will know the ip of your master or worker node

// see image 10 - this configaration you need to add in your config file to connect to your k8s cluter
so i remove old file with rm ~/.kube/config
and add new at samelocation vi ~/.kube/config

and how i will get details from cloud

kubectl get nodes
kubectl get pods
kubectl get deployment
kubectl get service


apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  selector:
    app: nginx
  ports:
    - protocol: TCP  # the protocol you on wehich you expose on Which is TCP because it is http server we are hitting up
      port: 80 # the port on which it should be expose on internally   # Service port
      targetPort: 80 # the target on which you should hit the container    # Routes to container 
  type: LoadBalancer # there are diff types of services you can create

when you apply above service 
kubectl apply -f 7-lb-service.yml

it creates fresh load balancer service on cloude provider and you can it it by provded ip (see pic 11, 12) use that ip:80 and it will forward req to your containers
you also have to expose loablancer port:80 then and only it works
// there are somethisgs are missing how to convert to https and how to attach domainname here, that we will see letter on



// there is also concept of persiteent volueme to store databasedata or redis data to persist it


https://projects.100xdevs.com/tracks/kubernetes-part-2/Kubernetes-Part-2-5
// there are some down side of services and that is way ingress comes into the picture

fist does the lite time set up
fist create cluster with 6
then create pods with 3
and create 7 load balancer service - it automatically creates loadbalancer you just need to hit the ip

if i use node port service then i need to take (node ip:30007) 

and once i start load balancer service then (loadbalancer Ip:30007)





Downsides of services

in company have very big clustore of 7000 machine and entire company projects works on same cluster then you have lot of load balancers for each app and you can do that and that is why you have to use service

Services are great, but they have some downsides - 

Scaling to multiple apps

If you have three apps (frontend, backend, websocket server), you will have to create 3 saparate services to route traffic to them. There is no way to do centralized traffic management (routing traffic from the same URL/Path-Based Routing) 

There are also limits to how many load balancers you can create
see image 1

2) second problem
Multiple certificates for every route
You can create certificates for your load balancers but you have to maintain them outside the cluster and create them manually
You also have to update them if they ever expire
see image 2

3) third probelm
No centralized logic to handle rate limitting to all services
Each load balancer can have its own set of rate limits, but you cant create a single rate limitter for all your services. 
see image 3


so i want single load balancer and want to route the req either based on
1) domainanme - 100xdevs.com and apis.100xdevs.com
2) route - 100xdevs.com/api and 100xdevs.com/ws (see iamge 4) websocket
3) or based on contaier id
4) in replat video for each user we start small pod

so that is way ingress comes in to the picture
