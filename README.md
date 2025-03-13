# Linkey

Linkey is an open source project that enables owners of the Nuki range of smart locks (https://nuki.io/) to generate temporary links that can be shared with other people to operate the links remotely.
Features include:
* Generate links that are valid within date and time window
* Link generation limited to authorised users
* Logging of lock and unlock events

The aim of this has been to keep it simple and allow you to modify for your specific use-case. In my case, this was to enable me to provide a means to provide access to my dog walker and cleaner on specific days within a limited time window.

The project is based on the NextJS framework, utilising shadcn for the UI library and auth.js for authentication/authorisation.

## Installation

Dependencies:
* PostgreSQL database (such as Supabase)
* Nuki web account with a generated API key
* Google authentication provider setup for use with Auth.js

To install Linkey and run locally, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/apateluk/linkey.git
    ```
2. Navigate to the project directory:
    ```bash
    cd linkey
    ```
3. Install the dependencies:
    ```bash
    npm install
    ```

## Deployment

To deploy Linkey, follow these steps:

1. Define the environment variables in .env or a .env.local file (see Environment Variables section below)

2. Build the project:
    ```bash
    npm run build
    ```
3. Start the application:
    ```bash
    npm start
    ```

Deploying in a serverless environment such as Heroku or Vercel is the simplest approach to getting this up and running.
1. Fork the project into your own GitHub repo

2. Configure Heruku, Vercel or other to deploy from your newly created repo

3. Define the environment variables required (below)

4. Configure your URL if using a custom domain or use the one provided

## Usage

After starting the application visit ```https://www.yourdomain.com/register```

Sign-in - You will need a Google account that is also listed in the ```ADMIN_EMAILS environment variable```
Now you can create a link that is valid between the date/times specified. The generated link can  be shared with anyone you want to operate your lock (e.g. cleaner, guest, dog walker etc...)

Visiting the provided link will present you with a Lock and Unlock button.

Note: The standard Nuki API does not provide a means to know if the smart lock was unlocked or locked successfully, only that the command was sent to the Nuki API successfully. This means that if your smart lock is offline, the web app will not report an error when trying to operate the lock.
Also note, some locks take some time to respond. Operating the lock with the buttons may have a delay of a few seconds, whilst the lock wakes up.


## Environment Variables
| Variable Name       | Description                                                                 |
|---------------------|-----------------------------------------------------------------------------|
| `DATABASE_URL`      | The connection string for your PostgreSQL database.                         |
| `DIRECT_URL`      | The connection string for your PostgreSQL database.                         |
| `NUKI_API_URL`      | The API address for accessing the Nuki API (currently https://api.nuki.io)                            |
| `NUKI_API_KEY`      | The API key for accessing the Nuki web API.                            |
| `NUKI_SMARTLOCK_ID`      | ID of smart lock device obtained from the Nuki Web account.          |
| `SERVER_ADDRESS`      | Full web address including https://. Used to prefix to the generated link. Can be ```http://localhost:3000``` for the local development environment                        |
| `AUTH_SECRET`      | A random secret of a minimum of 32 characters as required by Auth.js. Can be generated using  ```openssl rand -base64 33  ```                       |
| `AUTH_URL`      | Full web address including https:// Can be ```http://localhost:3000``` for the local development environment                        |
| `AUTH_GOOGLE_ID`      | The client ID for Google authentication. See: https://authjs.dev/getting-started/providers/google?framework=next-js                           |
| `AUTH_GOOGLE_SECRET`  | The secret for Google authentication. See: https://authjs.dev/getting-started/providers/google?framework=next-js                                 |
| `ADMIN_EMAILS`  | Space separated list of email addressed for people who are able to generate links.                                   |

## Security

For information on security practices and guidelines, please refer to our [Security Page](SECURITY.md).

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for more details.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

