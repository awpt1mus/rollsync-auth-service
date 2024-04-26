# RollSync Auth service
Service is responsible to handle user authentication and registration.

## Built using

- [Node.js](https://nodejs.org/en/)
- [TypeScript](https://www.typescriptlang.org/)
- [Nest.js](https://docs.nestjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Kysely](https://kysely.dev/)
- [Zod](https://zod.dev/)
- [Docker](https://www.docker.com/)
- [PgAdmin](https://www.pgadmin.org/)


## Prerequisits

- Docker is required for database setup. ([installation](https://docs.docker.com/engine/install/)).
- Node.js 18.x.x or above. ([installation](https://nodejs.org/en/download)).
- Pnpm is needed as package manager ([installation](https://pnpm.io/installation)).


## How to run using Docker

- Clone this repository
- In project's root directory create two files

    1. `integrations.env` - used by docker-compose to pass some config to postgresql and pgadmin containers.

    ```text
    # these credentials can be used to login to pgadmin web app running locally.
    PGADMIN_DEFAULT_EMAIL=admin@admin.com
    PGADMIN_DEFAULT_PASSWORD=12345

    # Postgresql config , these will be default user/pass credentials
    POSTGRES_USER=postgres
    POSTGRES_PASSWORD=postgres
    ```
    
    2. `.env` - used by application to load config

    ```text
    PORT=5000
    SECRET=<hext secret>
    DB_USER=postgres
    DB_PASS=postgres
    DB_NAME=rollsync-auth-db
    DB_PORT=5432
    DB_HOST=db
    ```
- Run following in terminal in project root

    ```shell
    > docker compose up
    ```
- To stop , press `CTRL+C` in terminal.

## Containers 

3 containers run when you run `docker compose up`. 

1. `db` - postgresql database container. 
2. `pgadmin` - GUI for postgresql database.
3. `api` - this service's container.

### First time setup for PgAdmin

when you run `docker compose up` for first time, it will start fresh containers. You will need to add configuration to
PgAdmin tool to see the database. 

1. After containers are started go to [http://localhost:8888](http://localhost:8888).

2. Login using `PGADMIN_DEFAULT_EMAIL` and `PGADMIN_DEFAULT_PASSWORD` from `integrations.env`. 

    ![Pgadmin Login](/docs/pgadmin_login_screen.PNG)

3. On the right hand side menu, right click `Servers -> Register -> Server`.

    ![Add server](/docs/pgadmin_add_server.png)

4. In modal popup under `General` tab,  give any name of your choice. 

    ![Connection name](/docs/pgadmin_register_name.PNG)

5. Under `Connection` tab, provide values for `host`, `port`, `username`, `password` from `.env` file and hit save.

    ![connection config](/docs/pgadmin_register_connection.PNG)

6. Now the database should be visible in the left pane under `Servers`, for more info visite tool docs or look around. 

    ![pgadmin db pane](/docs/pgadmin_db_pane.PNG)

7. Once this first time setup is done, next time you start `docker compose up` will not require this setup again.


## How to debug

For debugging during development you can use `VSCode debugger`. 

1. First build the application locally (Although locally building is not needed with Docker, this allows setting up proper breakpoints), to build you run, 

    ```shell
    > pnpm run build
    ```
2. Start the containers

    ```shell
    > docker compose up
    ```
3. Setup your breakpoints as needed 

    ![breakpoints](/docs/debugging_add_breakpoints.PNG)

4. Start the Debugger by pressing `Ctrl+Shift+D` or navigate to `Run & Debug`, from the dropdown select `Docker: Attach to container` option and hit green play button. 

    ![attach debugger](/docs/debugging_attack_container.PNG)

5. If everything goes well, you shoud see debugger controlls and you can debug. 


## Open API 

Once container is running you can visit [http://localhost:5000/docs](http://localhost:5000/docs) to see swagger docs.

## Contribution guidelines

1. `main` is the production branch, all issue/feature branches will be created from `main` branch.

2. Take an issue you want to implement.

3. Create a branch from `main` for this issue

    ![creating branch for issue](/docs/creating_issue_branch.PNG)

4. Checkout the branch locally and do your work. 

5. Once done push your changes and open a PR to merge into `main`. 

6. Once PR is approved by atleast 1 person, it can be merged. 

## Code quality 

This Project is using Biome as Linter,formatter & Code analysis tool. 
Before you push your changes make sure you run , 

```shell
> pnpm run check
```

This runs a linter, formatter & code analysis tool. Please fix all linter errors , once you see message 
like below, you can push. 

![biome check](/docs/biome_check.PNG)

if you want to do linting and formatting separately then you can run below and fix separately.

```shell
> pnpm run format
```

```shell
> pnpm run lint
```