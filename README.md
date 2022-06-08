# Gesinen platform Node.js API

This is a REST API for Gesinen Platform made in TypeScript using Node.js and Express.js.

The developement application is inside the `\src` folder. The production application is in the `\build` folder.

We use jsdoc to make the documentation, that is stored in `\doc` folder.

## Install
    
```shell
npm install
```

## Run the app in dev mode

You must run this commands in different cmd windows at the same time. Build command is for compile .ts to .js, and dev is for run the express server with nodemon

```shell
npm run build
npm run dev
```

## How to build a local version of the Database

 1. Instal [XAMPP](https://www.apachefriends.org/index.html) or [WAMP](https://www.wampserver.com/en/)
 2. Create a local MySQL repository using any of the applications console.
 3. Access the GESINEN server, which contains the actual Database.
 4. Create an exported .sql file using the following instructions.

Export
-------
```shell
mysqldump --add-drop-table -u root -p{password} swat_gesinen > fileName.sql
```

 5. Get into the [XAMPP](https://www.apachefriends.org/index.html) or [WAMP](https://www.wampserver.com/en/) installation folder.
 6. Import the previously created .sql file using the following instructions.

Import
-------
```shell
mysql -u root -p{password} swat_gesinen < fileName.sql
```


# Routes

// WIP //
There is the REST API route list:

## Get Anything

### Request

`GET /thing/`

    curl -i -H 'Accept: application/json' http://localhost:7000/thing/

### Response

    HTTP/1.1 200 OK
    Date: Thu, 24 Feb 2011 12:36:30 GMT
    Status: 200 OK
    Connection: close
    Content-Type: application/json
    Content-Length: 2

    []

## Create a new Thing

### Request

`POST /thing/`

    curl -i -H 'Accept: application/json' -d 'name=Foo&status=new' http://localhost:7000/thing

### Response

    HTTP/1.1 201 Created
    Date: Thu, 24 Feb 2011 12:36:30 GMT
    Status: 201 Created
    Connection: close
    Content-Type: application/json
    Location: /thing/1
    Content-Length: 36

    {"id":1,"name":"Foo","status":"new"}
