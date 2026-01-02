how and why ci and cd

continous integration (why you check test here because husky is precommint hook which runing before you make commit but peopel can fool it via some command like git commit -m "messs" --no-verify)
ci - build project
   - ruining automated test
   - are test runing 
   - are they folloing best practices
   - is code linted well


continouse deployment - here you deploy the code and above you just check the code 
cd - dev stage prod

//deployment should not happen when someone creates a pool req, depolyment should happend when commit happes for master branch the deploment should happen

so in comanies first you make changes to dev and dev automatically deploy to dev.100x.com

and once every two week you merge dev branch to master branch and it deploys to prod and this is called releas cycly

// cd things

// you have to first push iamge to docker hub so you need to login first so create access token direct from docker hub and you can directly put these secrate
in pipeline file but it got expose to the word so go to (in repo) setting > secrate and variables > actions > Repository secrets > here create two vars
DOCKER_USERNAME=sojitraurvish
DOCKER_PASSWORK=your docker hub access token 
and use it in your pipeline files

and make the commit and check this things

fist manually ssh in your ec2 and install docker over there -> and write the code we wrote in cd.yml







<!-- how to deply websockt server -->
https://www.youtube.com/watch?v=iG1gjOjcjTQ







------------------------------------------------------------------------------


// Recovering SSH Keys from a Lost Local Copy
Unfortunately, you cannot retrieve the private key from the Droplet itself if you've lost the local copy. However, you have several options depending on your situation:

Option 1: Generate a New SSH Key Pair (Recommended)
Since the Droplet is still alive, generate a new key pair and add it:

1. Create a New SSH Key on Your Mac:

bash
ssh-keygen -t ed25519 -C "urvishsojitra@Urvishs-Mac-mini" -f ~/.ssh/id_ed25519_new
Press Enter when asked for a passphrase (or set one).

2. Get Your New Public Key:

bash
cat ~/.ssh/id_ed25519_new.pub
Copy the output.

3. SSH into Your Droplet (Using Password)

Since you lost the key, you'll need to use DigitalOcean's Console or Recovery Mode to add the new key. Log in to DigitalOcean Dashboard:

Select your Droplet

Click Console (top right)

Log in with your root password

4. Add the New Public Key:

bash
echo "YOUR_NEW_PUBLIC_KEY_HERE" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
5. Test the New Key:

bash
ssh -i ~/.ssh/id_ed25519_new root@64.227.131.234
Option 2: If You Have Access via DigitalOcean Console
If password login still works or you can access via Console:

bash
# Backup old keys (if they exist)
mv ~/.ssh/authorized_keys ~/.ssh/authorized_keys.bak

# Create new authorized_keys with your new public key
echo "YOUR_NEW_PUBLIC_KEY" > ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
Option 3: Use DigitalOcean API to Reset (If Needed)
If Console access fails, you can reset the Droplet's SSH keys via DigitalOcean Dashboard or API, but this is more complex.

Important Notes
The old private key is gone forever — there's no way to extract it from the Droplet

Public keys can't be reversed to recreate the private key

Generate a new key and properly backup it immediately:

bash
# Backup your new key securely
cp ~/.ssh/id_ed25519_new ~/Dropbox/backups/  # or cloud storage
# OR
cat ~/.ssh/id_ed25519_new | pbcopy  # Copy to clipboard and save in password manager
For GitHub Actions
Once you have the new key working locally:

bash
cat ~/.ssh/id_ed25519_new
Add this private key to GitHub Secrets as SSH_PRIVATE_KEY (as discussed in the previous answer).

Quick Summary
Generate a new key locally

Add the public key to your Droplet's ~/.ssh/authorized_keys

Test the connection

Backup the private key securely

Use it in GitHub Actions

Would you like help with any of these steps?


