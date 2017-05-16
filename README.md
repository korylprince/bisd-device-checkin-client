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
API_BASE="<api_location>" CHARGE_BASE="<report_location>" npm run dev
```

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

* [vue](https://vuejs.org/)
* [vuetify](https://github.com/vuetifyjs/vuetify)

See package.json for all dependencies.
