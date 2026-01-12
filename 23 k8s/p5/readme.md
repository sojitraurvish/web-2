
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





ingress(ingress controller) that is somthing extra that you have to install in your k8s cluster

master node runs kube controller manager which runs bunch of small contrallers inside it, and check have created right replica sets,are there 3 pods are present or not
incase of ingress controllar you have to bring in here it is not by defalut

and there are many popular companys who have created 

1)nginx ingress controller
2) haproxy ingress controller
these two are very famouse for a while

3) trafik -> for profite company who have created


Ingress and Ingress Controller
Ref - https://kubernetes.io/docs/concepts/services-networking/ingress/
An API object that manages external access to the services in a cluster, typically HTTP.
Ingress may provide load balancing, SSL termination and name-based virtual hosting.

see image 5 - when ever client sends the req to your ingress managed load balancer( you do not have to create load balancer sevice any more), ingress manages it and create sinlge load balancer for you, any req tha comes (inside the cluter) and first reaches to the ingress pod that is runinng(nginx, or haproxy or trafic or what ever you are using) that is able to looks at url and tell okay you want to goes to api.100xdevs.com then goes to the backend service, if you want to goes to api.100x.com/frontend then goes to the frontend service

if i have simple application which just has frontend and the backend (see pic 6)


NOTE - An Ingress does not expose arbitrary ports or protocols. Exposing services other than HTTP and HTTPS to the internet typically uses a service of type Service.Type=NodePort or Service.Type=LoadBalancer.



Ingress controller
If you remember from last week, our control plane had a controller manager running.
Ref - https://projects.100xdevs.com/tracks/kubernetes-1/Kubernetes-Part-1-3

The kube-controller-manager runs a bunch of controllers like
Replicaset controller
Deployment controller
etc

If you want to add an ingress to your kubernetes cluster, you need to install an ingress controller manually. It doesn’t come by default in k8s
Famous k8s ingress controllers
The NGINX Ingress Controller for Kubernetes works with the NGINX webserver (as a proxy).
HAProxy Ingress is an ingress controller for HAProxy.
The Traefik Kubernetes Ingress provider is an ingress controller for the Traefik proxy.
Full list - https://kubernetes.io/docs/concepts/services-networking/ingress-controllers/


before implemeting ingress we have to understand namespaces

name space let you structure your files pods services better

// by defalut it shows you pods in defalut namespaces
urvishsojitra@Urvishs-Mac-mini p3 % kubectl get pods 
NAME                                READY   STATUS    RESTARTS   AGE
nginx-deployment-59f86b59ff-58sr6   0/1     Unknown   0          10h
nginx-deployment-59f86b59ff-9qgsb   0/1     Unknown   0          10h
nginx-deployment-59f86b59ff-ld7sh   0/1     Unknown   0          10h

// show all pods in all the namespaceas 
urvishsojitra@Urvishs-Mac-mini p3 % kubectl get pods --all-namespaces
NAMESPACE            NAME                                               READY   STATUS    RESTARTS      AGE
default *              nginx-deployment-59f86b59ff-58sr6                  1/1     Running   1 (15s ago)   10h
default *            nginx-deployment-59f86b59ff-9qgsb                  1/1     Running   1 (15s ago)   10h
default *            nginx-deployment-59f86b59ff-ld7sh                  1/1     Running   1 (15s ago)   10h
kube-system          coredns-7d764666f9-bp4xw                           0/1     Running   1 (15s ago)   10h
kube-system          coredns-7d764666f9-m9wg8                           0/1     Running   1 (15s ago)   10h
kube-system          etcd-local-mine-control-plane                      0/1     Running   0             11s
kube-system          kindnet-4lhx8                                      1/1     Running   1 (15s ago)   10h
kube-system          kindnet-67h7b                                      1/1     Running   1 (15s ago)   10h
kube-system          kindnet-zrrng                                      1/1     Running   1 (15s ago)   10h
kube-system          kube-apiserver-local-mine-control-plane            0/1     Running   0             11s
kube-system          kube-controller-manager-local-mine-control-plane   0/1     Running   7 (15s ago)   10h
kube-system          kube-proxy-cwzp5                                   1/1     Running   1 (15s ago)   10h
kube-system          kube-proxy-hbpbz                                   1/1     Running   1 (15s ago)   10h
kube-system          kube-proxy-tfz2s                                   1/1     Running   1 (15s ago)   10h
kube-system          kube-scheduler-local-mine-control-plane            0/1     Running   7 (9h ago)    10h
local-path-storage   local-path-provisioner-67b8995b4b-982qn            1/1     Running   1 (15s ago)   10h

// get all the name spacees - default is yours and others are kubernaties namanged
urvishsojitra@Urvishs-Mac-mini p3 % kubectl get namespaces
NAME                 STATUS   AGE
default              Active   10h
kube-node-lease      Active   10h
kube-public          Active   10h
kube-system          Active   10h

people in the world have very big cluster and all there forntend and backend teams are deplying to the same cluster and now when i run 
kubctl get pods i just want to see backed team ke pods not frontend team ke because i am port of backend team so namespace let you structure it better
so create two namespaces
kubectl create namespace backend 
kubectl create namespace frontend

NOTE: if i update replicas 3 to 4 then it update my old deplyment in same namespace does not start new deployment, but if i change the name or namespace in metadata then it will not update my old deplyment if start new deployment, so inside metadata if you do not update any thing then it update in old or exsiting running deployment and if you updated somthing inside metadata then it start new depluyment with new name(if updated) or in new namespace(if updated)


now any time you are starting pod or deplyment let says the over there you can say that you are part of backend namespace

apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  # namespace: backend   <-------------------------
  replicas: 3  # how many replicas i need to specific pod
  selector:  
    matchLabels: # this is how deployment knows that is my replica set or my pod and this line try to check what all pods have app: set to nginx while doing any opration
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        # image: postgres:latest
        image: nginx:latest
        ports:
        - containerPort: 80
        # env:
        # - name: POSTGRES_PASSWORD
        #   value: "yourpassword"

-------------------
Namespaces

In Kubernetes, a namespace is a way to divide cluster resources between multiple users/teams. Namespaces are intended for use in environments with many users spread across multiple teams, or projects, or environments like development, staging, and production.
When you do 
// kubectl get pods

it gets you the pods in the default namespace
Creating a new namespace
Create a new namespace
// kubectl create namespace backend-team

Get all the namespaces
// kubectl get namespaces

Get all pods in the namespace
// kubectl get pods -n my-namespace

Create the manifest for a deployment in the namespace
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  namespace: backend-team
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

Apply the manifest
// kubectl apply -f deployment-ns.yml

Get the deployments in the namespace
// kubectl get deployment -n backend-team

Get the pods in the namespace
// kubectl get pods -n backend-team

Set the default context to be the namespace
// kubectl config set-context --current --namespace=backend-team

Try seeing the pods now
kubectl get pods

Revert back the kubectl config
kubectl config set-context --current --namespace=default

---------------------

urvishsojitra@Urvishs-Mac-mini p3 % kubectl get pods -owide
NAME                                READY   STATUS    RESTARTS       AGE   IP           NODE                 NOMINATED NODE   READINESS GATES
nginx-deployment-59f86b59ff-58sr6   1/1     Running   1 (120m ago)   12h   10.244.1.2   local-mine-worker    <none>           <none>
nginx-deployment-59f86b59ff-9qgsb   1/1     Running   1 (120m ago)   12h   10.244.1.3   local-mine-worker    <none>           <none>
nginx-deployment-59f86b59ff-ld7sh   1/1     Running   1 (120m ago)   12h   10.244.2.2   local-mine-worker2   <none>           <none>

so while creating pods you can attach namespaces so backend team only get backend pods and frontend team only frontend ones, it is just logical sepratetion otherwise 
they may runs together only

------------------------------------ from slides

install helm in you pc it make easy to install nginx ingress


Install the nginx ingress controller

Ref - https://docs.nginx.com/nginx-ingress-controller/installation/installing-nic/installation-with-manifests/

Using helm
- Install helm - package manager for k8s

Ref - https://helm.sh/
Installation - https://helm.sh/docs/intro/install/

// brew install helm
// helm version

- Add the ingress-nginx chart
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
helm install nginx-ingress ingress-nginx/ingress-nginx --namespace ingress-nginx --create-namespace

Check if you have pods running in the 
 kubectl get pods -n ingress-nginx

Default loadbalancer service
You will notice that if you use helm  to install the nginx-ingress-controller, it creates a Loadbalancer service for you
kubectl get services --all-namespaces


This routes all the traffic to an nginx pod
kubectl get pods -n ingress-nginx

This means the first part of our ingress deployment is already created
// see image 7

------------------------------------

so now get back to create atchtecture as per image 6 we have to create 5 things as yo can see in the pic

now we are adding ingress controller in to our k8s cluter and which will starts its own set of pods, so it should run on the seperate namespace, so in future when you bring external k8s configs like ingress so you want to put in seperate namespace that is why you need name space here

ingress and ingress controller are two diff things, you need at least one ingress controller that is ruuning and only that you can start ingresss- as like pods and deplymnet, ingress is k8s object but by default we do not have ingress contralller by defalut we have to bring one  


you can bring ingress 2 ways
1 by running 9-nginx-ingress-controller

2 as per the above slides using helm package manager
so you can use these charts in helm it bring 9-nginx-ingress-controller file to start ingreess, and appply it
- Add the ingress-nginx chart
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx<repo where my helm chart exists>
helm repo update ---> update that repo
helm install nginx-ingress ingress-nginx/ingress-nginx --namespace ingress-nginx --create-namespace -> and install it 


urvishsojitra@Urvishs-Mac-mini p3 % kubectl get namespaces
NAME                 STATUS   AGE
backend              Active   83m
default              Active   13h
ingress-nginx        Active   4m52s
kube-node-lease      Active   13h
kube-public          Active   13h
kube-system          Active   13h
local-path-storage   Active   13h

No resources found in ingress-ingix namespace.
urvishsojitra@Urvishs-Mac-mini p3 % kubectl get pods --namespace ingress-nginx -> this pods is image 5's blue color pod and image 6 pod ruuing here
NAME                                                    READY   STATUS    RESTARTS   AGE
nginx-ingress-ingress-nginx-controller-67c86b68-8klg9   1/1     Running   0          5m

urvishsojitra@Urvishs-Mac-mini p3 % kubectl get svc --namespace ingress-nginx -> this load balancer service is image 5 and image 6 load balancer ruuing here in cloud also it get created if you running it in could (image 8 new stated load balancer)
NAME                                               TYPE           CLUSTER-IP     EXTERNAL-IP   PORT(S)                      AGE
nginx-ingress-ingress-nginx-controller             LoadBalancer   10.96.92.162   <pending>     80:30282/TCP,443:31167/TCP   6m26s
nginx-ingress-ingress-nginx-controller-admission   ClusterIP      10.96.61.248   <none>        443/TCP                      6m26s


we stll need to tell rules to ingress that this is how you forward the req but we just create red line infrastructure as per (image 7)


---------------------------------------------------------------- Adding the routing to the ingress controller slides
now Adding the routing to the ingress controller
Next up, we want to do the following - 

image 9 // now same url but diff route and single loadbalancer

Get rid of all existing deployments in the default namespace
kubectl get deployments
kubectl delete deployment_name

Get rid of all the services in the default namespace (dont delete the default kubernetes service, delete the old nginx and apache loadbalancer services)
 kubectl get services
 kubect

Create a deployment and service definition for the nginx image/app (this is different from the nginx controller)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  namespace: default
spec:
  replicas: 2
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
        image: nginx:alpine
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
  namespace: default
spec:
  selector:
    app: nginx
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
  type: ClusterIP

Create a deployment and service for the apache app
apiVersion: apps/v1
kind: Deployment
metadata:
  name: apache-deployment
  namespace: default
spec:
  replicas: 2
  selector:
    matchLabels:
      app: apache
  template:
    metadata:
      labels:
        app: apache
    spec:
      containers:
      - name: my-apache-site
        image: httpd:2.4
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: apache-service
  namespace: default
spec:
  selector:
    app: apache
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
  type: ClusterIP

Create the ingress resource
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: web-apps-ingress
  namespace: default #stated in default namespace
  annotations: # when you are string ingress or similar services in future the you can change some data in them you can tolk to them using these annotations
    nginx.ingress.kubernetes.io/rewrite-target: /  # the acnotation that we are using is this, where can find it goes to the ingress docs, why we are adding this beacuse any request coming from k8s.100xdevs.com/apache should goes to second service and reach to coorect pod where appache is ruunig and same thing for k8s.100xdevs.com/nginx(see image 9), 
    # so this mean any req comming from from k8s.100xdevs.com/apache (mean /) goes to at / path to service not apache, and that is why we added rewrite-target to / so that it goes to correct service and pod , else if i do not add this then req goes to /appche in service
    # nginx.ingress.kubernetes.io/rps: 10 # only 10 req per second per ip address, so this was the down site of service you have to manage sepere rate limite for all servies
spec:
  ingressClassName: nginx # there aare many infress controllers so we need to tell which one to use 3) types we discussed above
  rules:
  - host: your-domain.com # if req comes to this domain, evern we do not own this your-domain.com still we will make it work
    http:
      paths:
      - path: /nginx # if req comes to k8s.100xdevs.com/nginx then
        pathType: Prefix
        backend:
          service:
            name: nginx-service # it goes to nginx-service
            port:
              number: 80
      - path: /apache # if req comes to k8s.100xdevs.com/apache then
        pathType: Prefix
        backend:
          service:
            name: apache-service # it goes to apache-service
            port:
              number: 80



Combined manifest
Create a combined manifest with all the api objects
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  namespace: default
spec:
  replicas: 2
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
        image: nginx:alpine
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
  namespace: default
spec:
  selector:
    app: nginx
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
  type: ClusterIP
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: apache-deployment
  namespace: default
spec:
  replicas: 2
  selector:
    matchLabels:
      app: apache
  template:
    metadata:
      labels:
        app: apache
    spec:
      containers:
      - name: my-apache-site
        image: httpd:2.4
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: apache-service
  namespace: default
spec:
  selector:
    app: apache
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
  type: ClusterIP
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: web-apps-ingress
  namespace: default
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  rules:
  - host: your-domain.com
    http:
      paths:
      - path: /nginx
        pathType: Prefix
        backend:
          service:
            name: nginx-service
            port:
              number: 80
      - path: /apache
        pathType: Prefix
        backend:
          service:
            name: apache-service
            port:
              number: 80

Apply the manifest
kubectl apply -f complete.yml

notion image
Update your local hosts entry (/etc/hosts  ) such that your-domain.com points to the IP of your load balancer
65.20.84.86	your-domain.com

Try going to your-domain.com/apache and your-domain.com/nginx

---------------------------------------------------------------- Adding the routing to the ingress controller slides


now apply all thing one by one to create stucter like image 9

1) 10-de...yml
1) 11-de...yml
1) 12-ingress.yml

or run just one file insted of three which is 13-ingress-full.yml

urvishsojitra@Urvishs-Mac-mini p3 % kubectl apply -f 13-ingress-full.yml 
deployment.apps/nginx-deployment created
service/nginx-service created
deployment.apps/apache-deployment created
service/apache-service created
ingress.networking.k8s.io/web-apps-ingress created

so our image 9 entire architecture is created\

now every thing is find you can directly hit load balaner ip via your domain and you are good to go but because you add your-domain.com(which you do not own) so you have to spoof your domain for your mahine 

so go in // sudo vi /etc/hosts

and take your loadbalncer ip and add entry with your-domain.com so your domain start working locally, instead in read word you add your domain 



if you want to use traffic ingresss controllar -----------------------------------------------------------

Note - it does not have anotiation as in nginx ingress so how to point req to the services

Trying traefik’s ingress controller
Traefik is another popular ingress controller. Let’s try to our apps using it next
Install traefik ingress controller using helm
helm repo add traefik https://helm.traefik.io/traefik
helm repo update
helm install traefik traefi/traefik --namespace traefik --create-namespace

Make sure an ingressClass is created for traefik
 kubectl get IngressClass

Notice it created a LoadBalancer svc for you
 kubectl get svc -n traefik

Create a Ingress that uses the traefik ingressClass and traefik annotations (traefik.yml)
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: traefik-web-apps-ingress
  namespace: default
spec:
  ingressClassName: traefik
  rules:
  - host: traefik-domain.com
    http:
      paths:
      - path: /nginx
        pathType: Prefix
        backend:
          service:
            name: nginx-service
            port:
              number: 80
      - path: /apache
        pathType: Prefix
        backend:
          service:
            name: apache-service
            port:
              number: 80

Add an entry to your /etc/hosts  (IP should be your loadbalancer IP)
65.20.90.183    traefik-domain.com

Visit the website
traefik-domain.com/nginx
traefik-domain.com/apache

 
💡Can you guess what is going wrong? Why are you not seeing anything on this final page?

Assignment
Try to figure out how can you rewrite the path to / if you’re using traefik as the ingress class

if you want to use traffic ingresss controllar -----------------------------------------------------------





-------------------------------------------------slides for configmaps and secrets

SO YOU  SHOULD NOT APPLY THESE DEYLOUMENTS AND ALL DIRECTLY RATHAER IT SHOULD FIRST REACHES TO YOUR GITHUB AND OVER THERE CI-CD SHOULD RUNS IT SHOULD REACH TO YOUR CLUSER WE WILL SEE TAHT 
Secrets and configmaps
image 12
 
Kubernetes suggests some standard configuration practises. These include things like
You should always create a deployment rather than creating naked pods
Write your configuration files using YAML rather than JSON
Configuration files should be stored in version control before being pushed to the cluster 
 
Kubernetes v1 API also gives you a way to store configuration of your application outside the image/pod
This is done using 
ConfigMaps 
Secrets
Rule of thumb
Don’t bake your application secrets in your docker image
Pass them in as environment variables whenever you’re starting the container
image 13





ConfigMaps vs Secrets
Creating a ConfigMap
apiVersion: v1
kind: ConfigMap
metadata:
  name: example-config
data:
  key1: value1
  key2: value2

Creating a Secret
apiVersion: v1
kind: Secret
metadata:
  name: example-secret
data:
  password: cGFzc3dvcmQ=
  apiKey: YXBpa2V5

Key differences

Purpose and Usage:
Secrets: Designed specifically to store sensitive data such as passwords, OAuth tokens, and SSH keys.
ConfigMaps: Used to store non-sensitive configuration data, such as configuration files, environment variables, or command-line arguments.

Base64 Encoding:
Secrets: The data stored in Secrets is base64 encoded. This is not encryption but simply encoding, making it slightly obfuscated. This encoding allows the data to be safely transmitted as part of JSON or YAML files. // see image 14
ConfigMaps: Data in ConfigMaps is stored as plain text without any encoding.

Volatility and Updates:
Secrets: Often, the data in Secrets needs to be rotated or updated more frequently due to its sensitive nature.
ConfigMaps: Configuration data typically changes less frequently compared to sensitive data.

Kubernetes Features:
Secrets: Kubernetes provides integration with external secret management systems and supports encryption at rest for Secrets when configured properly. Ref https://secrets-store-csi-driver.sigs.k8s.io/concepts.html#provider-for-the-secrets-store-csi-driver
ConfigMaps: While ConfigMaps are used to inject configuration data into pods, they do not have the same level of support for external management and encryption. they just exists in you etcd data base of k8s in master node




/// config maps -----------

ConfigMaps
Ref - https://kubernetes.io/docs/concepts/configuration/configmap/
A ConfigMap is an API object used to store non-confidential data in key-value pairs. Pods can consume ConfigMaps as environment variables, command-line arguments, or as configuration files in a volume.
A ConfigMap allows you to decouple environment-specific configuration from your container images, so that your applications are easily portable.

Creating a ConfigMap
Create the manifest

# if you do like this then multiple applicaotin can use these env variables
apiVersion: v1 
kind: ConfigMap
metadata:
  name: ecom-backend-config
data:
  # 1st tyeps of secrates
  database_url: "mysql://ecom-db:3306/shop"
  cache_size: "1000"
  payment_gateway_url: "https://payment-gateway.example.com"
  max_cart_items: "50"
  session_timeout: "3600"

  # 2nd tyeps of secrates
  # file-like keys if i want to create .env file eventually then so in your final pod where your app is there it will create .env file there
  application.properties: | # i want this to reach as file in my final pod
    app.name=ecom-backend
    app.environment-production logging.level=INFO
    max.connections=100
  database.properties: |
    db.driverClassName=com.mysql.cj.jdbc.Driver
    db.username=ecom_user
    db.password-securepassword
    db.maxPoolSize=20
  cache.properties: |
    cache.type=redis
    cache.host=redis-cache
    cache.port=6379
    cache.ttl=600
  payment.properties: |
    gateway.url=https://payment-gateway.example.com
    gateway.apiKey-your_api_key_here
    gateway.timeout=30





Apply the manifest
	kubectl apply -f cm.yml

Get the configmap
 kubectl describe configmap ecom-backend-config

Creating an express app that exposes env variables // see image 17 for two diff types of config maps
Express app code
import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
const port = 3000;
app.get('/', (req, res) => {
  const envVars = {
    DATABASE_URL: process.env.DATABASE_URL,
    CACHE_SIZE: process.env.CACHE_SIZE,
    PAYMENT_GATEWAY_URL: process.env.PAYMENT_GATEWAY_URL,
    MAX_CART_ITEMS: process.env.MAX_CART_ITEMS,
    SESSION_TIMEOUT: process.env.SESSION_TIMEOUT,
  };

  res.send(`
    <h1>Environment Variables</h1>
    <pre>${JSON.stringify(envVars, null, 2)}</pre>
  `);
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

Dockerfile to containerise it
FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx tsc -b

EXPOSE 3000
CMD [ "node", "index.js" ]

Deploy to dockerhub - https://hub.docker.com/repository/docker/100xdevs/env-backend/general


Trying the express app using docker locally
 docker run -p 3003:3000 -e DATABASE_URL=asd  100xdevs/env-backend

see image 15


Try running using k8s locally
Create the manifest (express-app.yml)


apiVersion: apps/v1
kind: Deployment
metadata:
  name: ecom-backend-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: ecom-backend
  template:
    metadata:
      labels:
        app: ecom-backend
    spec:
      containers:
      - name: ecom-backend
        image: 100xdevs/env-backend
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL  # this values you get form 1st tyeps of secrates
          valueFrom:
            configMapKeyRef:
              name: ecom-backend-config 
              key: database_url
        - name: CACHE_SIZE
          valueFrom:
            configMapKeyRef:
              name: ecom-backend-config
              key: cache_size
        - name: PAYMENT_GATEWAY_URL
          valueFrom:
            configMapKeyRef:
              name: ecom-backend-config
              key: payment_gateway_url
        - name: MAX_CART_ITEMS
          valueFrom:
            configMapKeyRef:
              name: ecom-backend-config
              key: max_cart_items
        - name: SESSION_TIMEOUT
          valueFrom:
            configMapKeyRef:
              name: ecom-backend-config
              key: session_timeout
        volumeMounts: #  # this values you get form 2nd tyeps of secrates // see image 18
        - name: config-volume
          mountPath: /etc/config
          readOnly: true
      volumes:   # create a voume which pick all the configration from this config map which we created above ecom-backend-config 
      - name: config-volume
        configMap:
          name: ecom-backend-config

Apply the manifest
 kubectl apply -f express-app.yml

Create the service (express-service.yml)
apiVersion: v1
kind: Service
metadata:
  name: ecom-backend-service
spec:
  type: NodePort
  selector:
    app: ecom-backend
  ports:
    - port: 3000
      targetPort: 3000
      nodePort: 30007

Apply the service
kubectl apply -f express-service.yml

Try visiting the website

see iamge 16
 
-----------------lets first does cofig maps parctical

you need to use 3 yml files 14,15,16

you can also create config map using cli like // kubectl create configmap - but it is not ideal so go with the file option and create with that

 urvishsojitra@Urvishs-Mac-mini p3 % kubectl apply -f 14-configmap.yml 
configmap/ecom-backend-config created

 urvishsojitra@Urvishs-Mac-mini p3 % kubectl get configmap
NAME                  DATA   AGE
ecom-backend-config   9      11s
kube-root-ca.crt      1      16h

// to get all actual vars in config maps
urvishsojitra@Urvishs-Mac-mini p3 % kubectl describe cm 
      Name:         ecom-backend-config
      Namespace:    default
      Labels:       <none>
      Annotations:  <none>

      Data
      ====
      application.properties:
      ----
      app.name=ecom-backend
      app.environment-production logging.level=INFO
      max.connections=100


      cache.properties:
      ----
      cache.type=redis
      cache.host=redis-cache
      cache.port=6379
      cache.ttl=600


      cache_size:
      ----
      1000

      database.properties:
      ----
      db.driverClassName=com.mysql.cj.jdbc.Driver
      db.username=ecom_user
      db.password-securepassword
      db.maxPoolSize=20

kubectl apply -f 15-deployment.yml  
deployment.apps/ecom-backend-deployment created

urvishsojitra@Urvishs-Mac-mini p3 % kubectl get pods
NAME                                     READY   STATUS              RESTARTS   AGE
ecom-backend-deployment-b9f75cb4-s8cd5   0/1     ContainerCreating   0          88s

if pod is not ruuning then get logs or describe it 
kubectl get pods
kubectl logs -f <name form above command>
or
kubectl describe pods <name from above command>

urvishsojitra@Urvishs-Mac-mini p3 % kubectl apply -f 16-service.yml 
service/ecom-backend-service created

-----------------lets first does cofig maps parctical


-------------------------------------secrates slides

Secrets
Secrets are also part of the kubernetes v1 api. They let you store passwords / sensitive data which can then be mounted on to pods as environment variables. Using a Secret means that you don't need to include confidential data in your application code.
Ref - https://kubernetes.io/docs/concepts/configuration/secret/
Using a secret
Create the manifest with a secret and pod (secret value is base64 encoded) (https://www.base64encode.org/)
apiVersion: v1
kind: Secret
metadata:
  name: dotfile-secret
data:
  .env: REFUQUJBU0VfVVJMPSJwb3N0Z3JlczovL3VzZXJuYW1lOnNlY3JldEBsb2NhbGhvc3QvcG9zdGdyZXMi # this we have to pass base64 encoded because, because when you deploy ssh certification and that might have some special charater so you pass as base64 and it will encode it to normal text in your container
---
apiVersion: v1
kind: Pod
metadata:
  name: secret-dotfiles-pod
spec:
  containers:
    - name: dotfile-test-container
      image: nginx
      volumeMounts:
        - name: env-file
          readOnly: true
          mountPath: "/etc/secret-volume"
  volumes:
    - name: env-file
      secret:
        secretName: dotfile-secret

notion image

Try going to the container and exploring the .env
kubectl exec -it secret-dotfiles-pod /bin/bash
cd /etc/secret-volume/
ls

Base64 encoding
Whenever you’re storing values in a secret, you need to base64 encode them. They can still be decoded , and hence this is not for security purposes. This is more to provide a standard way to store secrets, incase they are binary in nature. 
For example, TLS (https) certificates that we’ll be storing as secrets eventually can have non ascii characters. Converting them to base64 converts them to ascii characters.
 
Secrets as env variables
You can also pass in secrets as environment variables to your process (similar to how we did it for configmaps in the last slide)
Create the secret
apiVersion: v1
kind: Secret
metadata:
  name: my-secret
data:
  username: YWRtaW4=  # base64 encoded 'admin'
  password: cGFzc3dvcmQ=  # base64 encoded 'password'

Create the pod
apiVersion: v1
kind: Pod
metadata:
  name: secret-env-pod
spec:
  containers:
  - name: my-container
    image: busybox
    command: ["/bin/sh", "-c", "echo Username: $USERNAME; echo Password: $PASSWORD; sleep 3600"]
    env:
    - name: USERNAME
      valueFrom:
        secretKeyRef:
          name: my-secret
          key: username
    - name: PASSWORD
      valueFrom:
        secretKeyRef:
          name: my-secret
          key: password
-------------------------------------secrates slides

Note - we can crate configmaps and secrates via two ways 1) diractly create variables that will get values directly in your container
2) create env file so you have to write it here in yml file in certainer formate and that file will be there inside your cluser or pod or container that you have to check 

secearates practical

17 - how to create secrests  
18 - want to use in deplyment while creating pod

frist apply 17 file and and then 18


at above we learn about first way in both configmap and secrates 
now leats learn about 2 way entire .env file

so you do not push your .env in your github repo and that is why it does not present in your docker image or container as well 
so in .gitignore and .dockerignore add .

convert all .env file vars in based64 (see image 20) and see file 17

// in docker if you want your local machine ka file reach to your docker container the we use - volume mount => bind mounts
and in case of data base -> we use general volumes in docker container 

so and voluems have very similar concept in k8s as well, so volume let you put your file in you container file, so you can tell your container that take this volume form here, so see image 19 when you start your container and before that you create secrate then your secrect exists in some /etc/secret-volume/.env so from there you want ot put in your container to your app to access so how you will do that, using volume mounts


 # so your .env file in you secrats from there you create a local part as or volume and then mount it in your container from there
  # see iamge 18 also see file 17.yml and 18.yml for better understanding   
      volumeMounts: #2 now it is depends on your container that do i want to mount this spcifc env-file or secific folder on this container
        - name: env-file
          readOnly: true
          mountPath: "/etc/secret-volume" # in our case it is not this directory in our app root directory is app check your docker image work or root directory which is app, do not write only /app you have to write /app/.env other wise it will replace the entire app folder // and to check it by going inside the pod new COMMAND - kubectl exec -i <pod-name> /bin/bash and if here you look inside app folder then you have /env folder and in side that you have .env file you sill there is probelm so in your project you can set dotenv config to pic envaroment vars form here .env/.env from here, if you only write /app then you are telling you have to load .env file in app folder and thus it romoves everyting else so instead that wite /<root docker image dir>/config  and in your actual app dotenv config pic it from "./config/.env"
    volumes: #1 the deplyment i am starting it has buch of volumes we just one for e.g, so event before pod is created we tell the deplyment that you have access to all these bellow volumes, so it is name is env-file, and it is comes from secrate who's name is dotfile-secrate, so this volume comes from secrate as file, can i put something else here if you hard nfs - network file storeage, elastic block storages buch of places where you can persist data and put it here, so here i am telling secrate over here i want mounted as file over here, and app of the above pods or containers have access to this volome, what ever they want they can pic it is not nessasory to put above step if i want this volume to use in my any of above container then i ahve to do above step and mount this volume in that container to use
      - name: env-file
        secret:
          secretName: dotfile-secret


so this was about secrate and same thing you can do in configmap as well see 14.yml file at there we did and while creatething container you can mount same way as above 

-------------------------------------------------slides for configmaps and 


NOTE - HOW ci-cd flow works in k8s - check both approach together
you have to runs k8s fils via ci-cd after new image is pushed
or can use argo cd wich makes your life even easy - you can craete a seperate repo like cms-k8s where you can put all of your manifests and deployemt files and all you have to do, after you push to docker hub, you have to update this other repo inside that deplyment.yml / image:100xdevs/env-backend:update-new-hash so yo have to update image here and kubectl apply happens automatically via argo cd(it let you do that) 
here you maintain two rempo one is argo-cd one and one is where trafrom script in ops folder and your source code, when you update your source code then you have to upate image in argo-db wali repo (see image 22)

second way to do above same thing
also see the the (iamge 21) remember to create and cluster and s3 bucket you put that scripts in traform folder and you run it once or you when you change your cloud provider, and k8s file you apply and reapply multiple times




****************************************** Volumes in docker ***************************************************


Pretext
The following docker image runs a Node.js app that writes peridically to the filesystem - 
https://hub.docker.com/r/100xdevs/write-random

const fs = require('fs');
const path = require('path');

// Function to generate random data
function generateRandomData(length) {
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

// Write random data to a file
function writeRandomDataToFile(filePath, dataLength) {
    const data = generateRandomData(dataLength);
    fs.writeFile(filePath, data, (err) => {
        if (err) {
            console.error('Error writing to file', err);
        } else {
            console.log('Data written to file', filePath);
        }
    });
}

// Define the file path and data length
const filePath = path.join(__dirname, '/generated/randomData.txt');
const dataLength = 100; // Change this to desired length of random data

// Write random data to file every 10 seconds
setInterval(() => {
    writeRandomDataToFile(filePath, dataLength);
}, 10000); // 10000 ms = 10 seconds

// Keep the script running
console.log('Node.js app is running and writing random data to randomData.txt every 10 seconds.');

// see image 1, when you run above code it create rendomeFile.txt in container but when container get distroyed then file also get deleted but what if you want to persist the file, and same thing with mogodb container it get rid of data, so you have to mount this folder /etc/generated eithter in volume or either in your local machine /urvish/projects/generated(see image 2 ), so now if even container dies still our file will be safe at volue or in my mac machine

lets do it proactical or above code with docker
urvishsojitra@Urvishs-Mac-mini p3 % docker run 100xdevs/write-random - above code image only

then go instead the container to see that rendom file is generated or not
docker exec -it <container id> /bin/sh

go inside /app/generated and do ls, is randomData.txt exists
but if i delete contianer then this file rendomData.txt also get deleted if i did not mounted it a diff volume

how can i mount two way using docker voulme or do docker bind mount you can also mount two diff contianer data in same 
voume (see image 3)

Where is this file being stored?
The data is stored in the docker runtime filesystem . When the container dies, the data dies with it. This is called ephemeral storage

Volumes in docker (see image 3)

If you want to persist data across container stops and starts, you can use Volumes in Docker
Bind mounts
Replace the mount on the left with a folder on your own machine
docker run -v /Users/harkiratsingh/Projects/100x/mount:/usr/src/app/generated 100xdevs/write-random

Volume Mounts
Create a volume
docker volume create hello

Mount data to volume
docker run -v hello:/usr/src/app/generated 100xdevs/write-random

 
If you stop the container in either case, the randomFile.txt file persists

**** so this was about how to persist data in docker now we will see that how you can persists data in kubernaties

k8s let you persists data event if your pods die


Volumes in kubernetes
Ref - https://kubernetes.io/docs/concepts/storage/volumes/
Volumes
In Kubernetes, a Volume is a directory, possibly with some data in it, which is accessible to a Container as part of its filesystem. Kubernetes supports a variety of volume types, such as EmptyDir, PersistentVolumeClaim, Secret, ConfigMap, and others.// we alredy did configmaps and secret volue early and and how to mount it today we see other two types
Why do you need volumes?
If two containers in the same pod want to share data/fs, two conainter in same pod share the filesystem
see iamge 4

If you want to create a database that persists data even when a container restarts (creating a DB), 
see iamge 5,here we have another concept that we create persistant volue in diff clound provider  so if container, pod,or even if node goes down we have persisted our data and whereever we create new cluster and node or pod or conatiner at where we can import these data, and what if where you have store data taht storage goes down so you have ot take backup of your volume time to time, so you need to make sure that your data is replicated at various places


Your pod just needs extra space during execution (for caching lets say) but doesnt care if it persists or not.
see image 6

Types of volumes
Ephemeral Volume(see image 4)
Temporary volume that can be shared amongst various containers of a pod.  When the pods dies, the volume dies with it.
For example - 
  ConfigMap
  Secret
  emptyDir

Persistent Volume(incase of node volue if pod dies voulme stll persist or volume in diff service so if node dies still your data is persited, see image 5)
A Persistent Volume (PV) is a piece of storage in the cluster that has been provisioned by an administrator or dynamically provisioned using Storage Classes. It is a resource in the cluster just like a node is a cluster resource. PVs are volume plugins like Volumes but have a lifecycle independent of any individual Pod that uses the PV. This API object captures the details of the implementation of the storage, be that NFS, iSCSI, or a cloud-provider-specific storage system.

Persistent volume claim(see image 7)
A Persistent Volume Claim (PVC) is a request for storage by a user. It is similar to a Pod. Pods consume node resources and PVCs consume PV resources. Pods can request specific levels of resources (CPU and Memory). Claims can request specific size and access modes (e.g., can be mounted once read/write or many times read-only).

(as per image 7)
1) first create persistent voluem 
2) pvc claim
3) then while creating pod you attach it to pvc claim

so developer only worid about creating pvc claim and then attach it with pod so setp 2 and 3 step one is done my devops enginer - you can do also 



------------------------------


Ephemeral volumes
A lot of times you want two containers in a pod to share data. 
But when the pods dies, then the data can die with it. 
// see image 4

Setup
Create a manifest that starts two pods which share the same volume
apiVersion: apps/v1
kind: Deployment
metadata:
  name: shared-volume-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: shared-volume-app
  template:
    metadata:
      labels:
        app: shared-volume-app
    spec:
      containers: # we have two conainers, becasuse we are trying to crate image 4
      - name: writer
        image: busybox # this image infinitely runs think of it as infintie while loop
        command: ["/bin/sh", "-c", "echo 'Hello from Writer Pod' > /data/hello.txt; sleep 3600"] # i want to run this command inside the container once, write echo measasge in site this data/hello.txt file and then sleep for an hour, so this data folder we will mount to this blue volume, so writer is about write in the volume and reader is about to read fromt this blue volume // see image 4
        volumeMounts:
        - name: shared-data
          mountPath: /data
      - name: reader
        image: busybox
        command: ["/bin/sh", "-c", "cat /data/hello.txt; sleep 3600"] # thsi read data and print
        volumeMounts: # contimue..... , then your container con decide that i want to use this shared-data volume and same thing for above
        - name: shared-data
          mountPath: /data
      volumes: # describe all the vlume that you want to create contimue.....
      - name: shared-data
        emptyDir: {} # 1 this mean i will start with the pod but when pod dies i will also dies


1) create modes via 1.yml
 kind create cluster --config 1-clusters.yml --name local-mine
Creating cluster "local-mine" ...
 ✓ Ensuring node image (kindest/node:v1.35.0) 🖼

2) create deplyment with vlument via 2.yml
 kubectl apply -f 2-deployment-with-ephemeral-volumes.yml 
deployment.apps/shared-volume-deployment created
urvishsojitra@Urvishs-Mac-mini p4 % kubectl get pods
NAME                                       READY   STATUS    RESTARTS   AGE
shared-volume-deployment-c6b54bd55-zrrdj   2/2     Running   0          13s

// to see the log of specific container inside the pod
urvishsojitra@Urvishs-Mac-mini p4 % kubectl logs -f shared-volume-deployment-c6b54bd55-zrrdj -c=reader
Hello from Writer Pod

// also lets check the data folder
urvishsojitra@Urvishs-Mac-mini p4 % kubectl exec -it -c=reader shared-volume-deployment-c6b54bd55-zrrdj -- sh
/ # ls
bin           dev           home          lib64         product_uuid  sys           usr
data          etc           lib           proc          root          tmp           var
/ # cd data/
/data # ls
hello.txt
/data # cat hello.txt
Hello from Writer Pod

// if i start 2 pods the pod1 has it's own and pod2 has it's own efemearal volue

// so writer is able to put data and read is able to read





//-------------------- now lets see persistant volume and persistant volume climes

Persistent volumes
Just like our kubernetes cluster has nodes where we provision our pods.
We can create peristent volumes where our pods can claim (ask for) storage
// see image 7 and 8 
 
Persistent volumes can be provisioned staticall(you have to create persistant volume menuall) or dynamically(here developer only create PVC- persistant volume claim and which create persistant volume automatically  ).


Static persistent volumes - see image 10, 11 two ways
Creating a NFS 
NFS is one famous implementation you can use to deploy your own persistent volume 
I’m running one on my aws server - 

// you have to start seprate strorage right so you have to put this file in your ec2 and start docker conatainr with docker compose, see image 11, and 13 and make sure 2049 port is open on this machine, so you k8s cluster can connect to it, so you have to open this port in your security section on ec2 //see image 14 also you can directly epose these port you should have some more security mesure so that only certain ips can access this machine, also see iamge 155 we create week-26 filder where we mounting our final pod
version: '3.7'

services:
  nfs-server:
    image: itsthenetwork/nfs-server-alpine:latest
    container_name: nfs-server
    privileged: true
    environment:
      SHARED_DIRECTORY: /exports
    volumes:
      - ./data:/exports:rw # it mounts ./data folder to a folder /exports inside this conainrter
    ports:
      - "2049:2049" // it also take a 2049 port of my machine and point to 2049 port on nfs container that starts 
    restart: unless-stopped

💡
Make sure the 2049 port on your machine is open

// now i have to make sure that my velter system has persitant volume which has cres for above nfs ec2 server so that eventually develop can create PVC- persistant volume claim

Creating a pv and pvc
Create a persistent volume claim and persistent volume
apiVersion: v1 
kind: PersistentVolume
metadata:
  name: nfs-pv
spec:
  capacity:
    storage: 10Gi # whenever user creates a persistant volume claim, so this is how i can check that can i assign this persitant volume to the user, does our final persitant volume has 10gb or not, and this 10Gi is file storage, but you need to make sure that is there 10db available or not when you are provisioning it
  accessModes:
    - ReadWriteMany # various types of access mode, ReadWriteMany mean many pods can read and wirte to the same persitant volume
  storageClassName: nfs # this is important and change based on are you storing to the elastic block store, are you storing it to valtor block store, or are you storing it to your own block store in our case last option nfs our block store
  nfs:
    path: /week-26 # remember this path in ec2 store we created this folder,so this path and bellow server, so form this folder you can read and write data 
    server: 52.66.197.168 # we did not specify port because it kowns that by defalut it runs on port 2349 
---  


//  so fist apply this pv fist so our pv is create and then eventually devlopes can clame it

// kubectl appy -f 3-pv.yml
// kubectl get pv// so it is available but devlopers does not clamed it see image 16,

// now two thing is create as per iamge 17 and two green thing is remain that we have to create PVC and pod

apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: nfs-pvc
spec:
  accessModes:
    - ReadWriteMany
  resources:
    requests:
      storage: 10Gi
  storageClassName: nfs # if there is persitant volue of tis class with this much storage then it will take it what it space is not availabel then your container will not start, if there is no persitant volume that is available that can handle this pvc constrains then your contianre will not start, and only when pvc get mounted to pv then pod starts else pod will not start

Create a pod
apiVersion: v1
kind: Pod
metadata:
  name: mongo-pod
spec:
  containers:
  - name: mongo
    image: mongo:4.4
    command: ["mongod", "--bind_ip_all"]
    ports:
    - containerPort: 27017
    volumeMounts:
    - mountPath: "/data/db" # this is the folder where mogodb data is stored,so this same folder we are moutning to bellow name nfs-volume, where this volme exists at bellow 
      name: nfs-volume
  volumes:
  - name: nfs-volume
    persistentVolumeClaim:
      claimName: nfs-pvc # what cleam i want to get it from above nfs-pvc we created above


NOTE - so you have to creeate two things as developer pvc and pod attact to it 
and cluster admin will have created pv

kubectl apply -f 4-pvc.yml
kubectl get pvc // see image 18, it says name - nfs-pvc volume is bound to nfs-pv volume
and // see iamge 19 if i do kubectl get pc then it say now Bounded not availle that mean it is assigned, now no one else can claim that volume


now leets create the pod kubectl apply -f 5-deplyme......yml


// so ect mchine continer is folder is mounted to pc and whcih is bonded to this pvc and which is the volume of this pod

// once above thing is done you can run bellow experiment

Try it out
Put some data in mongodb
kubectl exec -it mongo-pod -- mongo
use mydb
db.mycollection.insert({ name: "Test", value: "This is a test" })
exit

Delete and restart the pod
kubectl delete pod mongo-pod
kubectl apply -f mongo.yml

Check if the data persists
kubectl exec -it mongo-pod -- mongo
use mydb
db.mycollection.find()

see iamge 9




///////////////////////////        Automatic pv creation        /////////////////////  - it is created outside of your k8s cluster and automatically you do not have to do manuall steps as we did above






Automatic pv creation
Ref - https://docs.vultr.com/how-to-provision-persistent-volume-claims-on-vultr-kubernetes-engine
Create a persistent volume claim with storageClassName set to vultr-block-storage-hdd
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: csi-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 40Gi
  storageClassName: vultr-block-storage-hdd # this storoage class does not exists on aws and if you want to see the storage class of valter then run kubectl get StorageClass, so it should the classes of which provider you are connected to, and tis -hdd one is cheap one, so the thins is if you crate PersistentVolumeClaim this thing this code if you run then it create presitant valume automatically // see image 20

Apply the pod manifest
apiVersion: v1
kind: Pod
metadata:
  name: mongo-pod
spec:
  containers:
  - name: mongo
    image: mongo:4.4
    command: ["mongod", "--bind_ip_all"]
    ports:
    - containerPort: 27017
    volumeMounts:
    - name: mongo-storage
      mountPath: /data/db
  volumes:
  - name: mongo-storage
    persistentVolumeClaim:
      claimName: csi-pvc

 
Explore the resources created
kubectl get pv
kubectl get pvc
kubectl get pods

Put some data in mongodb
kubectl exec -it mongo-pod -- mongo
use mydb
db.mycollection.insert({ name: "Test", value: "This is a test" })
exit

Delete and restart the pod
kubectl delete pod mongo-pod
kubectl apply -f mongo.yml

Check if the data persists
kubectl exec -it mongo-pod -- mongo
use mydb
db.mycollection.find()











--------------------------------------------- now lets starts with these topics
devops - youtube.com/watch?v=IjY34e7NfaU&t=1483s&pp=ygUZa3ViZXJuZXRlcyBoYXJraXJhdCBzaW5naA%3D%3D
Repl.it - https://www.youtube.com/watch?v=s0kBqGpThp0
codeforces.com https://www.youtube.com/watch?v=vABb1y4fmwE

What we’re learning
HPA - Horizontal Pod Autoscaling
Node Autoscaling
Resource management
 

 untill now we hard code replicas 1 2 or let say 5, but now you want when load comes you want to auto scale these replicas and that is way you want that it should be handeled by someone else, if cpus usage become very high on these pods, if memory useage become very high, if you have some custom metric of yours that req on this endpoint per second is very high you need to auto scale up and if it goes 0 then you can autoscale down, and that is what horizontal pod autoscaler let you do



 Horizontal pod accelerator
Ref - https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/
A Horizontal Pod Autoscaler (HPA) is a Kubernetes feature that automatically adjusts the number of pod replicas in a deployment, replica set, or stateful set based on observed metrics like CPU utilisation or custom metrics.
This helps ensure that the application can handle varying loads by scaling out (adding more pod replicas) when demand increases and scaling in (reducing the number of pod replicas) when demand decreases.
Horizontal scaling
As the name suggests, if you add more pods to your cluster, it means scaling horizontally. Horizontally refers to the fact that you havent increased the resources on the machine.
// iamge 1


Architecture
Kubernetes implements horizontal pod autoscaling as a control loop that runs intermittently (it is not a continuous process) (once every 15s)
 
cadvisor -  https://github.com/google/cadvisor - resource useage of the pods(cpu,memory) is fetched by this called cadvisor - this is an inidipendent project you can run it locally as well, if you run it locally  and see all locally runing docker conatiners and how many resoruces they are using, see image 3, if you run this command locally then it starts cadvisor locally in your machine, and it start to look at what are the docker containers are you running and how many resources they are running, so for every contianr you get the internal or aggerigated resource useages , so we take these resoruce usages and put inside matrisc server, and this matics server is something that you have to add inside your k8s cluster,

your kubernaties cluster by defalut does expose this pod level matrics, but it does not store them anywhere, so this storage that every 10s you takes the status from cadvisor and you store them in this metric server can be only done if something is running in your machine which is storing every 10 second and exposing this 

cadvisor -gets  the status from the pod
Metrics server - which takes the status, take it from every worker node that they have, and host them on this api server
all the status of the specific pod, all the pods status form which you can get worker nodes status as well, if you have 3 pods which has xyz usage so you can also get the worker node usages as well, so all of this stored in the metric server

this metric server is usefull generally as well if you ever want to see the usage of your pods of node then this metric sever let you see it, so now let see how we can add this metrics server in k8s cluser and see node and pods level metrics

and it has notihing to do with hpa contrlloer so we see that letter on

Metrics server - The Metrics Server is a lightweight, in-memory store for metrics. It collects resource usage metrics (such as CPU and memory) from the kubelets and exposes them via the Kubernetes API (Ref - https://github.com/kubernetes-sigs/metrics-server/issues/237)

how to add Metrics server you just need to apply this file to k8s cluster(you do not need to use helm - might be able to use)

kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
or in above script you have to add soming so at the end your hpa to work so bellow is the modified version you need to use bellow script
Apply from here - https://github.com/100xdevs-cohort-2/week-28-manifests - i have down loaded this file 1-metric-server.yml
but now we can see harkirat one is not running so we have to go with above first link
and apply that file with 
kubectl apply -f 1-metric-server.yml

// check 1-metric-server.yml in wich namespace this deployment is created wich is kube-system



Try getting the metrics
kubectl get pod -n kube-system
NAME                                               READY   STATUS             RESTARTS        AGE
metrics-server-5dcdd678c-rdwfl                     0/1     Running              0             47s

// check why it is failing so instead of hakirst script use above script
kubectl describe pod metrics-server-58b9b5bc4-w2tgn -n kube-system

kubectl get nodes -n kube-system

// to get node and pod metrics
urvishsojitra@Urvishs-Mac-mini p5 % kubectl top nodes
NAME                       CPU(cores)   CPU(%)   MEMORY(bytes)   MEMORY(%)   
local-mine-control-plane   173m         1%       1062Mi          13%         
local-mine-worker          44m          0%       281Mi           3%          
local-mine-worker2         86m          0%       336Mi           4%          
urvishsojitra@Urvishs-Mac-mini p5 % kubectl top pods 
NAME                                       CPU(cores)   MEMORY(bytes)   
shared-volume-deployment-c6b54bd55-zrrdj   0m           3Mi     

//image 2

Sample request that goes from hpa controller to the API server
GET https://338eb37e-2824-4089-8eee-5a05f84fb85e.vultr-k8s.com:6443/apis/metrics.k8s.io/v1beta1/namespaces/default/pods


now next we need to understand that now given we have this metric server, what is the hpa controller, and how does it autoscale the pods that we will see tomorrow
 

-----------------------------------last part of k8s 

HPA - Horizontal Pod Autoscaling - how can you increase the no of pods, how can you decrease the no of pods
Node Autoscaling - if you have 2 nodes on vluter cluseter, then how can you increase nodes if you load increases and how can you decrease the nodes if your load decreases, untill now we added fix no of nodes and via controal panel or dashboard we increse and decrese the no of nodes, but we want to autoscale this so we give min and max value from dashboarnd and some autoscaller pic the right now of node and based on maticx or laod it increase and decrease the no of nodes
Resource management - which mean whenever you are staring pod, so how can you ensure that single pod does not takes all the resources of your node, so how you can restrict pod that it only takes the 2vcpus and 500mb of ram, so that even process inside this pod,so there is container that try to run multiple process and try to get more then 2 vcpu then it can not, even this pod try to creeate very big arry inmemory let and try to take up more space then allcaoted then it can not, so clearly this pod has 2 vcpus and 500mb of ram

you can read more about it via this link 
 Horizontal pod accelerator
Ref - https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/

we are staring node js process, and it can not take more then one cpu, so if your node has 10 cpus so single pod can take only 1 cpu over here, so if you have 8 replicass then you have power of 8 vcpus is being used, then why not to start
10 replicas because you knows that your node js process is single threadded so single pod can take only single cpu, we can not do that because what if i have something else in my k8s cluster what if i have postgress table running and anotehr process, then these 10 node js proces are over provisioned(not being used) so i want that no of replicas which are running that no is apt, let say the no of req are comming 500 req/s then i only need 5 replicas, and that is what i want no of pods want to be, but how can we decide that no of req / s is good or better metric, usally the good metric is how much cup, and memory you are using, if i know that amongs the 5 node js pod that i am running, the average cup utilization is let say 50% or each pod is taking half a core form 10 cpus, beacause we know for a fact that single node js process can take a core(node js is a single threaded), so if i have 10 core in my machine and if i start one node js(which as while loop infinitely running)process by doing node index.js then because javascript is single threaded it only takes one core fully to 100% stll my all other 9 cores are free and doing other jobs

// and if you do prctical in your machine and see the actual graics how much is being used live then there are two command 
// htop
// top

if i run go lang process then it can use multiple cores so 

but node js can only use one core form 10 vcps and 9 of them will be ideal, and hence when you starts the node js process
you should have the matics values if the cpu utilization of my node js pod goes above 50% then i should start another pod , now my loaded is devided between two pods 25%, 25%, now again load increased for fist pod 80% and for second pod 70%, now you again know that your cpu threshold is 50% that mean if average cup usage goes above 50% [ (80 + 70)/2 = 75%] so 75% is above 50% so now i need to add 3rd pod, and again load get distributed amongs 3 and each one becomes 50%, 50% and 50%,(if again average load of 3 pods goes beyond 50% you need to add new pod and based on this metric you might want to auto scale, and if it goes bellow to 50% and we start stoping other nodes so here we want average cpu usage to be 50%) and here our metic si cpu usage

Note- for down calse if i have incread pods to 4 and evey one are getting current cup load is 49.9%,49.9%,49.9% and 49.9% and if you down scale then if now slight load increases you again have to scale up and so just keep doing it because if we down scale then cpu uage agin goes beyond the average for remaing pods, so at this time we do no down scale, so you need to make sure that when you down scale then after down scale average cpu uages should goes bellow to 50% then and only you down scale otherwise you do not so this is the general also which you use to autoscale up and down 

now the quetion is how do you do it in k8s and the ans is using horizontal pod autoscaller, why it is called horizontal because you are increasinn no of pods, not the size of the pod, and even if you increse the size of pod and say that this pod has accses to 10 vcpus then also it does not make any sence, because node js porcess can only use 1 core of cpu and stll 9 core remain ideal, so here it only make sence to scale it horizontally scale and add move, so let see how we can do that


how let see the architecture(we alredy discusll it above in previous video) of horizontal pod autoscaler is the controller in the kubernatic-controller manager

// see image 2
hpa controller runs once in 15s and you can chagne this configration to let say run every 20s , and it does these all of these checks that is there any node which is above 50% do i need to autoscale up or down that is what this hda controller does just like depolyment controller keep on checking all the deplyments, similaryly hpa contrller keeps on checking  all the horizontal poad autoscaller that you have created, get the metrics and and when anything in a metric change based on that  i will update the no of replica on that sepcific deployment

A Horizontal Pod Autoscaler (HPA) is a Kubernetes feature that automatically adjusts the number of pod replicas in a deployment, replica set, or stateful set based on observed metrics like CPU utilisation or custom metrics.

but how hpa get the metrics form and the ans is the metrics server, and this metric server you have to install in your k8s cluter it does not comes by defualt, hpa controller comes by default, so firt thing you have to do is to install this metrics server which aggregates the cpu usages, memory usage from various pods and exposes it to the api server

and if you want to get these metrics manually by running command then you can get it by running bellow commands but you need to have metrics server intall first then and only command works

// to get the pods usages
kubectl top pods 

// to get the node usages
kubectl top nodes



// so first start the cluser via 
kubectl apply -f 1-clusters.yml

// installl the metrics there are two ways as per above check one above we did same thing above

// once metic server is created you can check it via these two caommands
urvishsojitra@Urvishs-Mac-mini p5 % kubectl top nodes
NAME                       CPU(cores)   CPU(%)   MEMORY(bytes)   MEMORY(%)   
local-mine-control-plane   229m         2%       676Mi           8%          
local-mine-worker          27m          0%       177Mi           2%          
local-mine-worker2         60m          0%       201Mi           2%   

and to get pods 
// kubectl top pods

// now we need to create horizontal pod auto scaller and which will auto scale our pods

// now let crete first cpu intensive process

App for the day
We’ll be creating a simple express app that does a CPU intensive task to see horizontal scaling in action. 
import express from 'express';

const app = express();
const BIG_VALUE = 10000000000;

app.get('/', (req, res) => {
    let ctr = 0;
    for (let i = 0; i < BIG_VALUE; i++) {
        ctr += 1;
    }
    res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

 
The app is deployed at https://hub.docker.com/r/100xdevs/week-28

 docker run -p 3000:3000 100xdevs/week-28

 // at fist let's try to deploy this application without horizontal pod autoscaller for above image 


and need to start two things deplyemnt and service 3-deplyment.yml and 4-services.yml


 Creating the manifests
Hardcoded replicas
Lets try to create a deployment with hardcoded set of replicas
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cpu-deployment
spec:
  replicas: 2
  selector:
    matchLabels:
      app: cpu-app
  template:
    metadata:
      labels:
        app: cpu-app
    spec:
      containers:
      - name: cpu-app
        image: 100xdevs/week-28:latest
        ports:
        - containerPort: 3000

Create a serice
apiVersion: v1
kind: Service
metadata:
  name: cpu-service
spec:
  selector:
    app: cpu-app #any pod with started with this lables
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: LoadBalancer


so untill now we ware not autoscaling so nothing is happeing when one pod alone goes above 50%

// now lets apply this hpa and see that will it does what is says it does




With a horizontal pod accelerator
Add HPA manifest

apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: cpu-hpa # name of my hpa
spec:
  scaleTargetRef: # what am i trying to scale?
    apiVersion: apps/v1
    kind: Deployment # a deplymentment - ans of above qs
    name: cpu-deployment # with the name cpu-deployment - this is deployment whos replicas i want to change based on bellow metrics
  minReplicas: 2 # the minimum no of repolicas i want is two 
  maxReplicas: 5 # the minimum no of repolicas i want is five and these are pod replicas not the node repolicas
  metrics: # and the metics based on which we auto scale 
  #this is the array so you can add more values here
  - type: Resource # type is resource
    resource:
      name: cpu # and the resoruce is cpu
      target: # target is 50%
        type: Utilization # you can also play with this type based on the type of autoscaling you want to do, and this type === Utilization we will see in next slide, we also see the formula it usages to scale up and down
        averageUtilization: 50 # but the average utilization we want is 50%, so as soon as avg utilization goes above 50% you scale up and if it goes bellow 50%, if after down saling scaling it remain bellow 50% then we auto scale it down, if you know you will have quickly spke the coose this no 50% or else you can pic 80% or more or less based on the reqirement

Apply all three manifests
kubectl apply -f service.yml
kubectl apply -f deployment.yml
kubectl apply -f hpa.yml

💡
You can scale up/down based on multiple metrics. 
If either of the metrics goes above the threshold, we scale up
If all the metrics go below the threshold, we scale down


urvishsojitra@Urvishs-Mac-mini p5 % kubectl get hpa
NAME      REFERENCE                   TARGETS              MINPODS   MAXPODS   REPLICAS   AGE
cpu-hpa   Deployment/cpu-deployment   cpu: <unknown>/50%   2         5         2          30s

it says that cpu percentage is cpu: <unknown>/50%, it should be 50% but i do not know what it is, so due to some reason it can not get the pods level metics

i can get the pods leavel metrics if i do, but above guy cant, but why let see that
urvishsojitra@Urvishs-Mac-mini p5 % kubectl top pods
NAME                              CPU(cores)   MEMORY(bytes)   
cpu-deployment-57c47946d7-bvsdv   1m           87Mi            
cpu-deployment-57c47946d7-q2d97   1m           87Mi   

so how can you debug that kubectl get hpa why it is not able to get the cpu percentage  <unknown>/50%, and if it wont be able to get cpu percentage it wont be scale up, because based on this no <unknown> it knows that it need to scale up or down

urvishsojitra@Urvishs-Mac-mini p5 % kubectl describe hpa cpu-hpa 
Name:                                                  cpu-hpa
Namespace:                                             default
Labels:                                                <none>
Annotations:                                           <none>
CreationTimestamp:                                     Mon, 12 Jan 2026 16:46:35 +0530
Reference:                                             Deployment/cpu-deployment
Metrics:                                               ( current / target )
  resource cpu on pods  (as a percentage of request):  <unknown> / 50%
Min replicas:                                          2
Max replicas:                                          5
Deployment pods:                                       2 current / 0 desired
Conditions:
  Type           Status  Reason                   Message
  ----           ------  ------                   -------
  AbleToScale    True    SucceededGetScale        the HPA controller was able to get the target's current scale
  ScalingActive  False   FailedGetResourceMetric  the HPA was unable to compute the replica count: failed to get cpu utilization: missing request for cpu in container cpu-app of Pod cpu-deployment-57c47946d7-bvsdv
Events:
  Type     Reason                        Age                   From                       Message
  ----     ------                        ----                  ----                       -------
  Warning  FailedComputeMetricsReplicas  10m (x12 over 13m)    horizontal-pod-autoscaler  *E invalid metrics (1 invalid out of 1), first error is: failed to get cpu resource metric value: failed to get cpu utilization: missing request for cpu in container cpu-app of Pod cpu-deployment-57c47946d7-bvsdv
  Warning  FailedGetResourceMetric       3m36s (x37 over 13m)  horizontal-pod-autoscaler  failed to get cpu utilization: missing request for cpu in container cpu-app of Pod cpu-deployment-57c47946d7-bvsdva 

  so for this error we get this 2 solutions // see image 4 so first solution we alreay sow above harkirat modified script and given github link, second solution it gives which is add pod level resources, what are resources and what are resource limitations we are about to discuss that eventually, but lets discuss it little bit first, why because 
  wehn i do 

urvishsojitra@Urvishs-Mac-mini p5 % kubectl get hpa
NAME      REFERENCE                   TARGETS              MINPODS   MAXPODS   REPLICAS   AGE
cpu-hpa   Deployment/cpu-deployment   cpu: <unknown>/50%   2         5         2          30s

my hpa still has <unknown> for the cpu uages, it can not get the cpu usages, so how does it get fixed, if i can add resources in my pod or in deployment more specifically, if you look at the deployment you can also add resources limits
what are resource limits, is that, that this specific pod atlist need half a core and at max one core, whenever pods starts then make sure that half a core is available on that specific node and make sure, that pod only taks 1 core that is called resource management 

apiVersion: apps/v1
kind: Deployment
metadata:
  name: cpu-deployment
spec:
  replicas: 2
  selector:
    matchLabels:
      app: cpu-app
  template:
    metadata:
      labels:
        app: cpu-app
    spec:
      containers:
      - name: cpu-app
        image: 100xdevs/week-28:latest
        ports:
        - containerPort: 3000
        # you have to add this in your deployment file, if you add this resource limits then hpa becomes happy and it able to fetch the resource or metics for the pod
        resources:
          requests:
            cpu: "500m"
            memory: "256Mi"
          limits: 
            cpu: "1"
            memory:"512Mi"


see image 5 our k8s cluster has 4 vcpus and tow of them is for master node and only 2 of them for the worker node

e.g if i have k8s cluster and inside that let say i have 2 worker nodes and each has 2 vcpus, so in node one whatever pods you stars that would be compiting for these 2 vcpus, so every pod that is starting will atleast take 0.5 vcpu, so when you are scheduling it it find 0.5 chore on each node where it fund it play it in that machine let say it find the fist node and play there then we now have 1.5 vcpu left to be clamed on this machine, so it mean if 4 pod is stated on node 1 then vcps become 0, so does it mean all the 2 cpus are being used? > no it is just that this pod atleast need half a vcpu, so it say that do not matter i use that space or not but point me in the machine where atleast 0.5 vcpu available ho, so if 4 pod is already schedule on this node then if 5th comes then it goes to diff node, so let say assume that we have started 2 node and form that one of the node is master node so you can not sechdue pod there right and first node is filled with four pods so now when you try to start 5th pod it will gives the error untill i start new node or untill this node also auto scaled up, so if some how when 5th pods is staring and it reallize that i do not have enough resources then what if new node is created and that is what called node auto scalling, but right now we are learning resoruce management

and at above what is this limit section - that mean make sure that each pod can not takes the more then 1 vcpu, and should not takes the space for all other pods

so add above resource lines in you deployment and reapply the 3-deployment.yml

wait for hpa and you will get the metic value accesable via hpa
urvishsojitra@Urvishs-Mac-mini p5 % kubectl get hpa
NAME      REFERENCE                   TARGETS       MINPODS   MAXPODS   REPLICAS   AGE
cpu-hpa   Deployment/cpu-deployment   cpu: 0%/50%   2         5         2          130m

but way adding resorces fix this hpa issue, because it is cloud sepcific issue it might happens on aws and might not happend in gcp so ya..

see image 5 our k8s cluster has 4 vcpus and tow of them is for master node and only 2 of them for the worker node

and now if you send the req the it autoscale up  and down based on the load 
do all above things and start sending 5 req, which all get stuck and start porcessing and you have 2 vcpus left for worker node you it can only auto scale up 4 pods not more then tahat so you will see that i will try to start 5 pod but will get error 

kubectl get hpa
kubectl get pods

so the thing is due to we send 5 req it reaches to the capacity of 5 but why one pod is not running, because we have only 2 cpus avalable, each one of them req a half a cpu even though there is 0% usages because you said half a cpu so it will save half a cpu space for you even if you are not using it 

so if you does 
kubectl describe pod <id - name> 
then i will say that you have to scale up the no of nodes that you have, you can goes to the dasboard and can increse it see image 6, no of nodes to let say 3, and then the 5th pod will get sechedule which was getting the error, or i can also decrese min cpu 500m to 300m then it could have started more pods in same node

// image 7 formula for auto scalling, but ans - sealling(ans)  if ans is 3.1 then sealing(3.1) = 4 so it increse a replica

<!-- see hortstare video they do not auto scale a lot they manually scale a lot because in as situaltion of spike they preprepare for the let say 2cr people if when ther match you can watch his autoscalling video, if you have spikey workload the autoscalling is really bed -->

// see iamge 8 quiesion // the ans is i have 10 cores in my machine still i am able to run 100 process why because it use vairous algo like context switching, if single process can hoge a core then you can not run more then 10 process in your machine so, so half a core mean it context switch so 50% of time it does have cpu and 50% of time it does not have the cpu in a second like that

<!-- what is serverless k8s and how it charge you? this is not like that what we are doing when new node started you change charge for that like that  -->



// load test also you can do to check poads are auto scalling or not
Try sending a bunch of requests to the server (or just visit it in the browser)
npm i -g loadtest
loadtest -c 10 --rps 200 http://65.20.89.70

Check the CPU usage
kubectl top pods   

See the hpa average usage
 kubectl get hpa

Check the number of pods, see as they scale up
kubectl get pods




--------


Resource requests and limits
Ref - https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/
When you specify a Pod, you can optionally specify how much of each resource a container needs. The most common resources to specify are CPU and memory (RAM).
There are two types of resource types

Resource requests
The kubelet reserves at least the request amount of that system resource specifically for that container to use.

Resource limits
When you specify a resource limit for a container, the kubelet enforces those limits so that the running container is not allowed to use more of that resource than the limit you set. 

Difference b/w limits and requests
If the node where a Pod is running has enough of a resource available, it's possible (and allowed) for a container to use more resource than its request for that resource specifies. However, a container is not allowed to use more than its resource limit.
Experiments
30% CPU usage on a single threaded Node.js app
Update the spec from the last slide to decrease the CPU usage. Notice that the CPU doesnt go over 30% even though this is a Node.js app where it can go up to 100%
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cpu-deployment
spec:
  replicas: 2
  selector:
    matchLabels:
      app: cpu-app
  template:
    metadata:
      labels:
        app: cpu-app
    spec:
      containers:
      - name: cpu-app
        image: 100xdevs/week-28:latest
        ports:
        - containerPort: 3000
        resources:
          requests:
            cpu: "100m"
          limits:
            cpu: "300m"

Try hitting the server
SEE IMAGE 8
 
Request 2 vCPU in 10 replicas
Try requesting more resources than available in the cluster.
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cpu-deployment
spec:
  replicas: 10
  selector:
    matchLabels:
      app: cpu-app
  template:
    metadata:
      labels:
        app: cpu-app
    spec:
      containers:
      - name: cpu-app
        image: 100xdevs/week-28:latest
        ports:
        - containerPort: 3000
        resources:
          requests:
            cpu: "1000m"
          limits:
            cpu: "1000m"

 SEE IMAGE 9


in this second image it try to take full one cpu for single pod and i have 1 node with 2 cpus then 3rd pod you will not able to start, so either i have to start new pod manuall or cluster autoscalling


// SEE IAMGE 14 - first enable this option of auto scalling it min nodes staty through the month then i will pay 90 and it it becomes max then i will pay 270$ or if it stay in between then i will pay based on my usage, and follow bello process

Cluster autoscaling
Ref - https://github.com/kubernetes/autoscaler
Cluster Autoscaler - a component that automatically adjusts the size of a Kubernetes Cluster so that all pods have a place to run and there are no unneeded nodes. Supports several public cloud providers. Version 1.0 (GA) was released with kubernetes 1.8.
 
Underprovisioned resources
In the last slide, we saw that we didn’t have enough resources to schedule a pod on.
SEE IMAGE 10 


Let’s make our node pool dynamic and add a min  and max nodes.
SEE IAMGE 11
Restart the deployment
kubectl delete deployment cpu-deployment
kubectl apply -f deployment.yml

Notice a new node gets deployed
SEE IMAGE 12
Logs of the cluster autoscaler
 kubectl get pods -n kube-system | grep cluster-autoscaler
SEE IMAGE 13
Try downscaling
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cpu-deployment
spec:
  replicas: 10
  selector:
    matchLabels:
      app: cpu-app
  template:
    metadata:
      labels:
        app: cpu-app
    spec:
      containers:
      - name: cpu-app
        image: 100xdevs/week-28:latest
        ports:
        - containerPort: 3000
        resources:
          limits:
            cpu: "500m"
          requests:
            cpu: "1000m"

// NOTE : 1 node is able to handle 2 vcpus in that 4 pods can run wo we need 3 worker and 1 master totol 4 nodes up

Notice the number of server goes down to 2 again
Good things to learn after this - 
Gitops (ArgoCD)
Custom metrics based scaling, event based autoscaling - https://www.giffgaff.io/tech/event-driven-autoscaling
Deploying prometheus in a k8s cluster, scaling based on custom metrics from prometheus
 














 Kubernetes Lab
 
Base repository - https://github.com/code100x/algorithmic-arena/
Things to do - 
Create a PV, PVC for the postgres database.
Create a PV, PVC for redis.
Create deployments for redis, postgres.
Create ClusterIP services for redis, postgres
Create a deployment for the nextjs app, expose it via a loadbalancer service on ‣
Create a deployment for the judge api server. Expose it via a ClusterIP service
Create a deployment for the judge workers. Add resource limits and requests to it
Create a HPA that scales based on the pending submission queue length in the redis queue
You can either expose an endpoint that you use as a custom metric
You can put all metrics in prometheus and pick them up from there
You can use KEDA to scale based on redis queue length
 
 see image 15


 devops - youtube.com/watch?v=IjY34e7NfaU&t=1483s&pp=ygUZa3ViZXJuZXRlcyBoYXJraXJhdCBzaW5naA%3D%3D
Repl.it - https://www.youtube.com/watch?v=s0kBqGpThp0
codeforces.com https://www.youtube.com/watch?v=vABb1y4fmwE

see image 16 question > node afanities or create other node pool, or karpanter

see iamge 17 ws when ws doen or otherwise which server i join (state less servers)
in statefull server you should take backup somewhere

kadi let you do ingresses better
karpenter let you start node automatilly so you do not need to crete node pool at your own