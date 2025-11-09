# Server API

Express + Mongoose API for parks, paths, POI, and campsites.

## Base URL

- Local: http://localhost:3000/api

## Resources

- GET /campsites?park={parkid}
- GET /campsites/:siteid
- GET /parks
- GET /parks/:parkid
- GET /paths?park={parkid}
- GET /paths/:pathid
- GET /poi?park={parkid}
- GET /poi/:poiid

CRUD (POST, PUT, DELETE) supported for /campsites, /parks, /paths, /poi.

## Standard JSON errors

All API routes return JSON errors.

- 404 Not Found (resource-specific)

```json
{
  "error": "Park not found",
  "parkid": "bogus"
}
```

- 404 Not Found (unmatched API path)

```json
{
  "error": "Not Found",
  "path": "/api/unknown",
  "method": "GET"
}
```

- 500 Internal Server Error (uncaught)

```json
{
  "error": "Internal Server Error"
}
```

## Notes

- Filtering by park is supported on campsites, paths, and poi via `?park={parkid}`.
- Non-API routes use regular static behavior and may return HTML responses for 404s.
