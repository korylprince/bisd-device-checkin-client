# Info

This is the front end interface for [bisd-device-checkin-server](https://github.com/korylprince/bisd-device-checkin-server), a small portal to assist in device pickup at Bullard ISD.

# Install

```
git clone https://github.com/korylprince/bisd-device-checkin-client.git
cd bisd-device-checkin-client
npm install
```

# Development

```
API_BASE="<api_location>" CHARGE_BASE="<report_location>" npm run dev-server
```

Use the `API_SERVER` environment variable to proxy `/api` to another server when using the dev-server.

# Build for Production

```
API_BASE="<api_location>" CHARGE_BASE="<report_location>" npm run build-prod
```

# Linting

```
npm run lint
```

# Libraries

(Of particular note)

* Material Design app components: [vuetify](https://vuetifyjs.com/)
* router: [vue-router](https://router.vuejs.org/en/)
* store: [vuex](https://vuex.vuejs.org/en/)
* validation: [vee-validate](http://vee-validate.logaretm.com/)
* HTTP calls: [axios](https://github.com/axios/axios)

See package.json for all dependencies.
