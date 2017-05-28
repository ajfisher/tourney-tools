# Tourney match maker tools

Makes a tournament of teams dealing with things like match making, leader
boards and pool divisions as well as elimination to find a winning team.

## Structure:

```
- api
  |- docs - documentation for the API in swagger files
  |- server - test server that can run the API.
     |- handlers - handler modules for the API server
  |- package.json - package dependencies to run all of the API server
- server
  |- tests - tests specific to the server
  |- package.json - package dependencies to run all of the server
- app
  |- build - build files to be deployed to the server
  |- src
  |  |- components - component files
  |  |  |- <component> - individual component items
  |  |     |- index.js - component class
  |  |     |- style.css - styles appropriate to the component
  |  |     |- test.js - component tests
  |  |- index.js - entry point
  |  |- index.css - top level css
  |  |- registerServiceWorker.js - make available via SW
  |  |- views - view definitions TBA
  |- public
     |- index.htm - entry point for the bootstrapper
- utils - tools for the project to use
```

