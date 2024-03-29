# fullstack_webdev_course
## Notes about Middleware
Middleware functions have to be taken into use before routes if we want them to be executed before the route event handlers are called. 
There are also situations where we want to define middleware functions after routes. 
In practice, this means that we are defining middleware functions that are only called if no route handles the HTTP request.
## Notes about deployment
1. install cors on the backend to make it possible to connect from a different origin.
It can be installed with npm:
    ```
    pnpm install cors
    ```
   and it's necessary to import it and add as a middleware:
    ```javascript
    import express from 'express'
    import cors from 'cors'
    
    const app = express()
    app.use(cors())
    ```
2. In the backend change the port to take as default the env variable:
    ```javascript
    const PORT = process.env.PORT || 3001
    app.listen(PORT)
    console.log(`Server listening on the port ${PORT}`)
    ```
3. Once subscribed to free plan of Fly.io, authenticate from the backend root:
    ```
    fly auth login
    ```
4. Launch the app:
    ```
    fly launch
    ```
   This operation will create a `fly.toml` file with this configuration:
    ```
    [env]
      PORT = "8080" # add this
    
    [experimental]
      auto_rollback = true
    
    [[services]]
      http_checks = []
      internal_port = 8080 
      processes = ["app"]
    ```
    or this:
    ```
    [http_service]
      internal_port = 3000
    ```
   If you have the last one, change it to:
    ``` 
   [env]
       PORT = "8080" # add this
   
   [experimental]
       auto_rollback = true # add this

   [http_service]
       internal_port = 8080
    ```
5. Deploy and open the app:
    ```
    fly deploy
    fly open
    ```
6. To have a production build f the frontend you can run:
    ```
    pnpm run build
    ```
    It willl rpoduce a minified version of the app contained in the directory `static`
7. To serve static files from the backend copy paste the `build` directory in the backend root and add the followinglines to the code:
    ```javascript
    app.use(express.static('build'))
    ```
8. Since now the frontend and backend are on the same address, we can declare relative URLs.
Change the frontend URL into:
    ```javascript
    import axios from 'axios'
    const baseUrl = '/api/notes'
    
    const getAll = () => {
        const request = axios.get(baseUrl)
        return request.then(response => response.data)
    }
    
    //...
    ```
    Whenever express gets an HTTP GET request it will first check if the build directory contains a file corresponding to the request's address. 
If a correct file is found, express will return it.
9. To create a new production build of the frontend without extra manual work, let's add some npm-scripts to the package.json of the backend repository.
    ```json
    {
      "scripts": {
        // ...
        "build:ui": "rm -rf build && cd ../part2-notes/ && npm run build && cp -r build ../notes-backend",
        "deploy": "fly deploy",
        "deploy:full": "npm run build:ui && npm run deploy",    
        "logs:prod": "fly logs"
      }
    }
    ```
    The `build:ui` script depends on the operating system. With Windows it changes to:
    ```json
    "build:ui": "@powershell Remove-Item -Recurse -Force build && cd ../frontend && npm run build && @powershell Copy-Item build -Recurse ../backend", 
    ```
10. Changes on the frontend have caused it to no longer work in development mode (when started with command npm start), as the connection to the backend does not work.
This is because we have used relative URLs in the backend, supposing that frontend and backend are on the same address.
To solve this problem it is enough to add the following declaration to the `package.json` file of the frontend repository.
    ```json
    {
      "dependencies": {
        // ...
      },
      "scripts": {
        // ...
      },
      "proxy": "http://localhost:3001"
    }
    ```
    After a restart, the React development environment will work as a proxy. If the React code does an HTTP request to a server address at http://localhost:3000 not managed by the React application itself (i.e. when requests are not about fetching the CSS or JavaScript of the application), the request will be redirected to the server at http://localhost:3001.

To set env variables on fly:
```
fly secrets set DATABASE_URL=postgres://example.com/mydb 
```
for more info: https://fly.io/docs/reference/secrets/

## Notes about ESM and jest
How to enable ESM on jest: https://jestjs.io/docs/ecmascript-modules
1. install cross-env
   ```
   pnpm install cross-env
   ```
2. Create file `jets.config.js` and insert:
   ```javascript
   export default { transform: {} }
   ```
3. Edit test script in `package.json` as follows:
   ```json
   "test": "cross-env NODE_OPTIONS=--experimental-vm-modules pnpx jest"
   ```
   
## Notes about git clone in another repo
after git cloning the repo in the pre-existing repo, delete the folder `.git` and get the submodules:
```
git submodule status
```
you will get the following error for the just added repo:
```
fatal: no submodule mapping found in .gitmodules for path 'part_6/unicafe-redux'
```
remove it as submodule with the following command>
```
git rm --cached 'part_6/unicafe-redux'
```
all the files will get uploaded to be committed. Commit them and it will work.

if it doesn't ork try with `git add`

## Notes about redux testing
The rerender of the app or component take place only because we are subscribing the rerendering to the store.
```javascript
store.subscribe(renderApp)
```
if it's not done the app or component doesn't rerender on store change.
So during the tests we can either rerender it manually or subscribe to the store.

## Error on ApolloDrain:
instead of the autofilled import:
```javascript
import {ApolloServerPluginDrainHttpServer} from "@apollo/server/src/plugin/drainHttpServer/index.js";
```
insert:
```javascript
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
```