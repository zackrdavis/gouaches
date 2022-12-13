# Watercolors

An incredibly simple toy demo.

Draw lines with the wax pencil.

Pick a color, click, and hold to make a spreading and diluting pool of pigment.

Typescript watch:

```
npx tsc -watch
```

Local host:

```
python3 -m http.server
```

### Next Steps:

- Reliably track pencil pixels for fill-blocking (edge fade confuses color tester)
- Fade color by maze distance, not as-the-crow-flies
- Draggable fill action
- Better algorithm for circular fill area
