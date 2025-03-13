## Security

This project relies on a number of third party libraries such as NextJS, Prisma, Auth.js, React, zod all of which are very popular and well maintained, however you should accept there is always a risk these libraries have yet undiscovered vulnerabilities. I suggest you keep these up to date in your package.json file.

### Link Generation

Link generation is secured behind auth.js. You will 1) require a Google account and 2) Need to your email address(es) listed under the ```ADMIN_EMAILS``` environment variable. 

Upon first visiting http://yourdomain.com/register, you will ne redirected to Google's authentication page where you will need to sign in and then be redirected back to your domain.
This app will then only allow the sign-in process to continue if the Google email address matches one of those in the ```ADMIN_EMAILS``` environment variable. 

Note : Only the link generation process is protected behind Auth. Any generated links are not protected and anyone with the link will be able to operate your smart lock.

### Smart lock operation

During the link generation process a URL is produced along with a random UIID... It will look similar to this:
```https://www.yourdomain.com/?id=51b567eb-d5ca-17cc-a2e2-719324133ce1```

This link is not guessable, but should ONLY be shared with those you want to operate your smartlock as it is publicly accessible and anyone who gets hold of it will be able to operate your smartlocks.
The link is only valid during the time windows specified during the link generation process. I don't recommend you generated keys that are long lasting.

Currently keys can only be revoked by deleting the row from the TemporaryLink table in the database. Expired links do not need to be revoked as they would no longer function regardless. 

### DDOS 

As with any other web app, you will need to implement your own DDoS protection or IP filtering if required. Services like Cloudflare can help here or Vercel has some basic capability. 
The app can be easily modified to incorporate features like IP address filtering etc. if you want to limit where people can access links from.
