# ownCloud: Server

Owncloud instance for the Padre1 geoportal

Inspired from the owncloud official [server container](https://registry.hub.docker.com/u/owncloud/server/), customized to fit our needs

Uses as base image the owncloud official [base container](https://registry.hub.docker.com/u/owncloud/base/)

Can be ued with sqlite DB as well as with mariaDB or PostgreSQL DB (this is set up using env vars)


## Usage

```bash
docker run -ti   --rm --name owncloud   -p 84:80 padre1-owncloudserver
```


### Launch with plain `docker`

Using MariaDB and Redis containers:

```bash
docker run -d --name redis webhippie/redis:latest

docker run -d \
  --name mariadb \
  -e MARIADB_ROOT_PASSWORD=owncloud \
  -e MARIADB_USERNAME=owncloud \
  -e MARIADB_PASSWORD=owncloud \
  -e MARIADB_DATABASE=owncloud \
  --volume ./mysql:/var/lib/mysql \
  webhippie/mariadb:latest
```

Then you can start the ownCloud web server, you can customize the used environment variables as needed:

```bash
export OWNCLOUD_VERSION=9.1.4 # The ownCloud version to launch
export OWNCLOUD_DOMAIN=localhost
export OWNCLOUD_ADMIN_USERNAME=admin
export OWNCLOUD_ADMIN_PASSWORD=admin
export OWNCLOUD_HTTP_PORT=80
export OWNCLOUD_HTTPS_PORT=443

docker run -d \
  --name owncloud \
  --link mariadb:db \
  --link redis:redis \
  -p 80:80 \
  -p 443:443 \
  -e OWNCLOUD_DOMAIN=${OWNCLOUD_DOMAIN} \
  -e OWNCLOUD_DB_TYPE=mysql \
  -e OWNCLOUD_DB_NAME=owncloud \
  -e OWNCLOUD_DB_USERNAME=owncloud \
  -e OWNCLOUD_DB_PASSWORD=owncloud \
  -e OWNCLOUD_DB_HOST=db \
  -e OWNCLOUD_ADMIN_USERNAME=${OWNCLOUD_ADMIN_USERNAME} \
  -e OWNCLOUD_ADMIN_PASSWORD=${OWNCLOUD_ADMIN_PASSWORD} \
  -e OWNCLOUD_REDIS_ENABLED=true \
  -e OWNCLOUD_REDIS_HOST=redis \
  --volume ./data:/mnt/data:z \
  owncloud/server:${OWNCLOUD_VERSION}
```


### Launch with `docker-compose`

The installation of `docker-compose` is not covered by this instructions, please follow the [official installation instructions](https://docs.docker.com/compose/install/). After the installation of `docker-compose` you can continue with the following commands to start the ownCloud stack. First we are defining some required environment variables, then we are downloading the required `docker-compose.yml` file. The `.env` and `docker-compose.yml` are expected in the current working directory, when running `docker-compose` commands:

```bash
cat << EOF > .env
VERSION=9.1.4 # The ownCloud version to launch
DOMAIN=localhost
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin
HTTP_PORT=80
HTTPS_PORT=443
EOF

wget -O docker-compose.yml https://raw.githubusercontent.com/owncloud-docker/server/master/docker-compose.yml

# Finally start the containers in the background
docker-compose up -d
```

More commands of interest (try adding `-h` for help):

```bash
docker-compose exec owncloud bash
docker-compose stop
docker-compose start
docker-compose down
docker-compose logs
```

By default `docker-compose up` will start Redis, MariaDB and ownCloud containers, the `./data` directory is used to store the contents persistently. The container ports `80` and `443` are bound as configured in the `.env` file.


## Build locally

The available versions should be already pushed to the Docker Hub, but in case you want to try a change locally you can always execute the following command (run from a cloned Git repository) to get an image built locally:

```
source .env
IMAGE_NAME=owncloud/server:${VERSION} 
./hooks/build
```


## Upgrade to newer version

In order to upgrade an existing container-based installation you just need to shutdown the setup and replace the used container version. While booting the containers the upgrade process gets automatically triggered, so you don't need to perform any other manual step.


## Custom apps

Installed apps or config.php changes inside the docker container are retained across stop/start.


## Custom certificates

By default we generate self-signed certificates on startup of the containers, you can replace the certificates with your own certificates. Place them into `./data/certs/ssl-cert.crt` and `./data/certs/ssl-cert.key`.


## Accessing the ownCloud

By default you can access the ownCloud instance at [https://localhost/](https://localhost/) as long as you have not changed the port binding. The initial user gets set by the environment variables `ADMIN_USERNAME` and `ADMIN_PASSWORD`, per default it's set to `admin` for username and password.


## Build image from tarball

1. Download ownCloud Community ```owncloud-9.1.4.tar.gz``` from the ownCloud downloads page.
2. Comment out the first `curl` command for downloading the tarball from the URL within the `Dockerfile`
3. Remove the comment from the `ADD` command within the `Dockerfile`
4. Build the ownCloud Community docker image based on the `Dockerfile` as mentioned above.

## Volumes

* /mnt/data


## Ports

* 80
* 443



## Available environment variables

```
OWNCLOUD_DOMAIN ${HOSTNAME}
OWNCLOUD_IPADDRESS $(hostname -i)
OWNCLOUD_LOGLEVEL 0
OWNCLOUD_DEFAULT_LANGUAGE en
OWNCLOUD_DB_TYPE sqlite
OWNCLOUD_DB_HOST
OWNCLOUD_DB_NAME owncloud
OWNCLOUD_DB_USERNAME
OWNCLOUD_DB_PASSWORD
OWNCLOUD_DB_PREFIX
OWNCLOUD_DB_TIMEOUT 180
OWNCLOUD_DB_FAIL true
OWNCLOUD_ADMIN_USERNAME admin
OWNCLOUD_ADMIN_PASSWORD admin
OWNCLOUD_REDIS_ENABLED false
OWNCLOUD_REDIS_HOST redis
OWNCLOUD_REDIS_PORT 6379
OWNCLOUD_MEMCACHED_ENABLED false
OWNCLOUD_MEMCACHED_HOST memcached
OWNCLOUD_MEMCACHED_PORT 11211
OWNCLOUD_OBJECTSTORE_ENABLED false
OWNCLOUD_OBJECTSTORE_CLASS OCA\\ObjectStore\\S3
OWNCLOUD_OBJECTSTORE_BUCKET owncloud
OWNCLOUD_OBJECTSTORE_AUTOCREATE true
OWNCLOUD_OBJECTSTORE_VERSION 2006-03-01
OWNCLOUD_OBJECTSTORE_REGION us-east-1
OWNCLOUD_OBJECTSTORE_KEY
OWNCLOUD_OBJECTSTORE_SECRET
OWNCLOUD_OBJECTSTORE_ENDPOINT s3-${OWNCLOUD_OBJECTSTORE_REGION}.amazonaws.com
OWNCLOUD_OBJECTSTORE_PATHSTYLE false
OWNCLOUD_CACHING_CLASS \\OC\\Memcache\\APCu
```

