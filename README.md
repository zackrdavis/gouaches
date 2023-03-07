# Gouaches

Minimal drawing canvas with a twist on the basic flood-fill.

1. Draw outlines with the wax pencil. 
2. Select a color, click and hold to create a growing pool of pigment.

[Live Demo](https://zackrdavis.github.io/gouaches/)

Typescript watch files:

```
npx tsc -watch
```

Local host:

```
python3 -m http.server
```

Reload for changes.

### Next Steps:

- Track pencil pixels for fill-blocking (color comparison is flakey due to anti-aliasing)
- Fade color by maze distance, not as-the-crow-flies
- Mix colors by subtraction, not addition
