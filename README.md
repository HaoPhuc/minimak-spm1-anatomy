# SPM1 anatomy

An interactive 3D anatomy of the MinimaK SPM1 simple magnetised torus by Rideo Systems, drawn in the style of [wheresryan22/anatomy](https://github.com/wheresryan22/anatomy): solid shaded parts with inked outlines on a framed card. Its aim is the structure of the machine: what each part is, how it attaches to the next one, and where each number comes from. It does not model the plasma physics.

Open [`index.html`](index.html) in a browser. The first time it needs an internet connection, to load three.js from jsDelivr. There is no build step.

## The page

| Area | What it does |
| --- | --- |
| **Assembly** (left) | On a first visit the list starts folded to its rail, so the machine has the room; the magnifier at the top of the rail, or `/`, opens it with the cursor in its search box, and once opened (or folded) it stays as you left it. The 30 components in seven groups. Click a name to read about it, double-click to inspect it on its own. The eye hides a part or a whole group. The dot gives the geometry basis (below). The search box filters by name, spec, description and the sub-parts' sheets, so a size or a seal finds its hardware: "M8" lists every M8 bolt and nut ring, "o-ring" the three KF joints' centring rings. A word matches from the start of a word ("led" no longer finds "sealed"), a plural finds its singular, and words such as *the*, *between* or *where* are dropped, so a question in plain words works: "the gasket between the right and back quarters" lists the Right–back joint's gasket. Not every word has to match: the parts and rows that match best are listed, a word in a name counting for more than one in a sheet and a rare word for more than a common one, and a line under the box names the words nothing listed has, or says that nothing matched. Words that name a piece or a sub-part ("left viewport bolt", "gasket back") also list the matching pieces under their part, such as *Left viewport (webcam) · 16 bolts*; a click on one inspects that piece and keeps its sheet open. "Listed, not drawn" collects options and upgrades that are named in the sources but not drawn. From the keyboard the list is one Tab stop, and the first Tab stop on the page, *Skip to the assembly*, jumps to it: ↑ ↓ move between rows, → ← open and close a group, Enter selects, Space hides or shows, and `I` inspects the selected part. |
| **Viewer** (centre) | The model, about 70% of the window's width on a first visit at 1280 px and wider (77% at 1920), with the whole machine in view, stand and pump included, clear of every label and button. Drag to turn it like a plotly turntable, right-drag or Shift-drag to pan, scroll to zoom toward the pointer. The triad in the corner shows the axes; click an axis end to look along it. The buttons at the view's left edge are the view's own: zoom in and out (not on touch, where you pinch), the home view (the whole machine; inspecting, the part), **Views** (a menu of the sides to look from, the triad's axes for the keyboard: ↑ ↓ move, Enter picks, Esc closes), pan with left-drag (a mode, lit while on), and the side panels. Nothing is framed under them. The scale bar is true at every zoom, because the view is orthographic. |
| **Inspector** (right) | **Machine**, the first tab and one click away from anything: what the machine is, how a run goes, **Take the tour** and **Where does it go?**, the headline numbers and how to use the page. **Part**: **Inspect on its own** first, then what the part does, how it attaches to each part it connects to, what it is made of, its pieces, its specification with a source tag on every row, and practical notes. **Sources**: every reference, what was taken from it, and how many rows cite it. **Controls**: the text size and single-letter keys settings, then every mouse, touch and key binding. |
| **Modebar** (top) | What changes the machine: Explode with its **Spread** slider, Cutaway, and the theme (**Colour**, **Greyscale** or **Hologram**). Explode and Cutaway are switches: the knob and its fill say whether each is on, and only an action (**Done**, **Next ›**) is a filled button. Moving round the model is the view's own (the buttons at its left edge, the triad). |

Drag the edge between a side panel and the view to size the panel. Double-click the edge for the default width, or focus it and use the arrow keys. Dragged nearly shut, a panel folds to a thin rail; the arrow in its header does the same, and a click on the rail opens it again. The panels button at the view's left edge (or `F`) folds or unfolds both, giving the model and its sheets the full width. The inspector is 23% of the window wide by default, between 300 and 360 px. The page remembers the sizes. On a narrow screen the panels stack under the model instead.

### Explode

**Explode** takes every component off the machine at once:

- The quarters move out, and the coils, ports and fittings lift off them.
- The PF and satellite coils rise.
- The table, the supplies and the pump drop away.
- Cables and the pump hose stay plugged into both ends.

The **Spread** slider next to the button, or `[` and `]`, sets how far apart they go (0.4× to 2.5×). `[` and `]` spread only what is apart: a part taken apart while inspecting, else the machine exploded; with nothing apart they say so rather than explode a machine that is hidden behind the part. The plasma is off while the machine is apart. The windows are clear glass, and each elbow has a real opening behind its port, so you can look into the vessel through any window.

### Inspecting one component

Double-click a part, press **Inspect on its own**, or select it and press `I`. The rest of the machine fades to an x-ray ghost, then the part lifts out while the camera glides round to frame it, so you can see where it comes from. It is framed in the room the inspect bar and the sheets leave, never under them, with where it rests kept in the frame, taken apart or not, and as close as that allows: a part made of different objects (the gauge on its cable) is framed on its main object, so the gauge's sensor nut opens at about 550 visible px² in a 1366 × 768 window.

- **What it fits onto.** The parts it is joined to (*How it attaches*), where they meet it, are drawn half solid with their bolts and nuts, rather than as ghosts: the gauge shows the stack with its KF16 adaptor; a gasket shows its two flanges and their 20 bolts and nuts. Parts joined to it from further off (the gauge's cable to the control drawer) stay ghosts. **Ghost** off hides them with the rest.
- **Where it sits.** A dashed ring marks the face it sits down on in the machine (the gauge's clamp), with a tether from the lifted part to it.
- **Which side.** The table's edges are named for the quarters above them, printed on the table top: Front, Right, Back and Left. While inspecting, the quarters next to the part are named too: on the table where that edge is in sight, else at the edge of the view on the way to it, so a gasket between the right and back quarters reads *Right* and *Back*. The 3D view's text description says which side it is seen from. To give the model room, the assembly list folds to its rail while you inspect whenever the view would otherwise be under 1000 px wide, and on a touch screen in landscape under 1100 px wide the inspector folds too; **Done** opens them again. Then:

- **Take apart** separates the part into its sub-parts along the directions they come off:
  - Bolts slide out of their holes and nuts come off the back.
  - Gaskets come out from between their flanges.
  - A KF joint opens: the clamp comes off, and the centring ring with its O-ring drops out from between the two flanges.
  - A TF coil's copper former, winding and cover band separate along the coil axis.
  - The pump's motor and fan cover come off its block.

  Its own **Spread** slider sets the spacing. A part with several pieces is taken apart one piece at a time, starting with the nearest. A weld does not come apart, so a port tube stays with its flange and weld; where nothing comes off (a welded port, a gasket on its own) **Take apart** is off and says why.

  When the sub-parts come apart toward you (their main direction within 20° of your line of sight), they hide one another, so **Turn to see** appears in the inspect bar: it turns the view until they lie across it, 15° short of square so it keeps some depth. The view never turns by itself, and under reduced motion it cuts. One **trail**, a dotted line from a hollow ring, shows where the sub-part under the pointer (or its Made of row), else the one whose sheet the leader line comes from, sits on the piece and the way it came off; never one per bolt.

  **Steps.** Taken apart, a piece shows every sub-part off at once (**All**). The arrows beside it, ‹ **Step n / N** ›, step through the order they come off: at step n the first n steps' sub-parts are off and the rest are still in place, and fitting runs back up the steps. The order is in `ORDER` in `parts.js` (nuts, then bolts, then the flange, a CF gasket last; a weld is never a step), tagged *assumed*, as no procedure is published. The viewport, for example, comes apart in four: its 16 nuts, its 16 bolts, the viewport flange with its window, then the copper gasket.
  - Under the bar, each step says how, from its sheet: the size, length and spanner (*Draw out the 16 bolts, M8 × 50 mm (13 mm spanner)*), which way a flange's knife edge faces, and for a gasket that a new one goes in: a copper CF gasket is never reused. The step is announced.
  - The step's sub-parts are outlined and its trail drawn, and so is the part they bear on (the port, for each of the viewport's steps). When it takes off a ring of bolts or nuts, each head is numbered with its turn in the star order (the legacy cross pattern of ASME PCC-1: 1, 11, 6, 16 … round a 20-bolt flange); a number whose head is hidden is drawn faint. Callouts hide while you step.
  - Resting the pointer on one bolt or nut of a ring names it, in the tooltip and the readout: *Bolt 7 of 20 · star 3*, its place round the ring (clockwise from the top, seen from the heads) and its turn in the star order. A click still keeps the ring's sheet.

  **Open this joint** (or `J`), on a gasket or a vessel joint flange, opens the whole joint, which is three pieces of two parts and so cannot be taken apart as one: the 20 nuts off in star order, the 20 bolts out, the two quarters eased apart along the joint (with their elbows, as the flanges are welded on), then the gasket out, last. The joint's pieces are drawn solid and framed at each step, and Turn to see is offered within 35° of its axis, turning to a three-quarter view. **Open this joint** again, or Esc, puts it back. Like **Take apart**, **Section**, **Ghost** and **Sheets**, it is a switch: it keeps its label, and its switch says whether it is on.
- **Section** (or `X`) cuts the part in half. The plane runs through the middle of the piece and contains its axis where it has one (a flange, a gasket, a coil), turned to face you as far as it can, so the cut shows the true profile; it stays put as you turn the view. The parts it is joined to, within reach of it, are cut with it and drawn solid, so a gasket shows between its two flanges with both knife edges biting it. Cut faces are hatched.
- **Show me** brings one sub-part close up: the frame button on a sheet's bar or at the end of a **Made of** row, `Z`, Enter on a **Made of** row, or a double-click on the sub-part with a mouse. A tap on a sheet's bar is not one, as on a glove it sits next to × and Keep.
  - It frames the sub-part, on the piece in view, at two thirds of the free view (below the inspect bar, beside the sheets), so the gauge's sensor nut fills 67 % of its width in a 1366 × 768 window. It never turns the view. Under reduced motion it cuts rather than glides.
  - The rest of the part fades to a see-through wash with no outline, so the sub-part shows even through what is in front of it.
  - The inspect bar says where it is, each step a link: *Back quarter › Vacuum gauge › Sensor tube nut*. The quarter is the one of the vessel it is mounted on; the part link shows the whole part, the piece link that piece.
  - A dashed **seat ring** marks where the sub-part sits in the machine, with a tether to it from where it is now. When the seat is out of sight, a marker on the edge of the view points to it.
  - On a ring of bolts, one sample bolt (seen nearly side-on, on the outside of the ring) has its sizes drawn on as on a drawing: its length under the head with its thread (*M8 × 50 mm*), the grip it spans, and the width across flats of its head.
  - Turning or zooming keeps Show me; Esc glides back to the view you had before it. Picking another piece or part, or Take apart, ends it there.
- **Callouts.** A piece taken apart names its sub-parts on the model, in the gutters beside it, with short stubs: *3 · 8 bolts*, numbered as the **Made of** rows, which carry the same numbers. At most ten show, five at text size 2, the largest and the kept ones first. They are laid out when the view stops and hidden while it moves, so they never slide about while you read them. Where they would not fit beside the part, or a stub would cross another or the leader line (below), they become numbered balloons on the part instead. A click or tap on one previews its sheet, and focus on a **Made of** row lights its callout. Screen readers skip them: the rows say the same.
- Pieces are named by where they sit. The gaskets are named by their joint (*Right–back joint*: joint k sits on the diagonal between two quarters). The eight joint flanges are named by their joint and the quarter they are welded to (*Right–back joint, right side*).
- A part with several pieces (three viewports, eight TF coils) starts with all of them, and a click or a tap on one picks it. The arrows beside **All** in the inspect bar, or `,` and `.`, step through them one at a time, and so does a click on a row of the **Pieces** table. The other pieces fade to ghosts and the camera glides to the one you picked. Clicking **All** picks the nearest piece, or goes back to every piece.
- The **Pieces** table, in the Part tab, has one row per piece of a repeated part, named by where it sits, with whatever the sources tell apart for each piece and its tag: which ports each quarter carries, which port carries the pump line, the laser window or each electrode, and how each satellite coil is held. The piece in view is marked. Where the sources tell the pieces no differently (the TF coils, the joints, the PF pairs), a line under the rows says so. A part made of different objects (the HV supply and its two leads, the gas valve, the gauge, the spectrometer) has no Pieces table: **Made of** lists each object's sub-parts under its name instead.
- **How it attaches** names each part this one connects to, with a sentence on how the two are joined and its tags: the TF coils, for example, are wound onto copper formers mounted on the elbows (S4). Each of the 42 connected pairs has one sentence, read from either side, and a sentence that is partly a guess says which part is not published. While inspecting, a click on a name inspects that part, on its piece nearest the one you were looking at (from the webcam, *Viewports* opens on the left viewport); from a view of every piece it opens on every piece too. Every link goes both ways. **← name** in the inspect bar, or `Backspace`, goes back to the part and piece you came from.
- **Ghost** (or `G`) turns the see-through ghost of the rest of the machine on or off.
- **Copy link**, the link icon, copies a link to what you are looking at (below).
- **Esc** steps back one level: the preview, then Show me, then the joint opened, then the step shown (back to **All**), then from one piece to the whole part, then to the assembly, then the selection. It never closes a kept sheet. On the tour it stops at every piece and never leaves the tour: only **Done** does.
- **Done**, in the inspect bar or at the top of the Part tab, reverses the inspect at the pace of an explode, so you can see where the part goes:
  1. A part that was taken apart goes back together.
  2. The part flies home while the camera glides back to the view you had before.
  3. The rest of the machine gets its outlines, then turns solid, and the plasma lights again.

  Any drag, zoom or view button during the move takes over the camera. With reduced motion turned on, it goes back at once.

### How a run goes, the tour, and where it goes

The Machine tab gives a run in four steps, each naming the parts it uses; a click on a part selects it, or inspects it while you inspect:

1. **Pump down**: the rotary vane pump empties the chamber through the pump port and the bellows line, and the gauge reads the pressure.
2. **Let in a little gas**: nitrogen or helium, through a valve on the stack.
3. **Strike the glow**: high voltage between the electrodes (the anode) and the chamber wall (the cathode).
4. **Add the magnetic field**: the TF coils brighten the glow and gather it into a ring; PF1 and PF2 move it up or down.

The order follows the webinar (S4 slides 16–27). No operating procedure is published, so the steps say what each part does in a run, not how to operate the machine.

**Take the tour** inspects the parts in that order, eight stops from the empty chamber to the glow: the vessel, the pump, the gauge, the gas valve, the electrodes, the TF coils, PF1 and PF2, and the plasma. At each stop a line above *What it does* says why the part matters at that point, with its tags, and the inspect bar shows *Stop 3 of 8* and **Next ›**. From the first page that is eight clicks to the plasma. Inspecting a stop's part by any other way (**← name**, a link) makes it the current stop, and a link to a part off the tour keeps your place. Only **Done** leaves the tour; Esc steps back as far as the whole part and stops there.

**Where does it go?**, beside **Take the tour**, asks five questions. Each lifts a part out above the machine (its main object, for the gauge on its cable), framed with the machine from the table top up, and you click its place on the model, or pick one of four parts in the bar. The answer is checked against `connects`, read one way (`QUIZ` in `parts.js` says what each part sits on: a viewport goes on a lateral port, not on the webcam that looks through it), and must be a piece within reach of where the part rests: any of the three ports a viewport is on, but not the control drawer the gauge's cable runs to. A wrong answer names what you clicked and gives one more try; then the part flies home, its place is outlined, and the bar says how the two are joined. The round is scored on first tries (*Round done: 4 of 5 right first time*), and **New round** asks five more. The cutaway is off while it runs and comes back after. A round is a link: `#quiz=gauge,viewport,laser,needle,probe&q=2` opens it at the second question, so a lecturer can send one. Esc or **Done** ends it, and the view goes back to where it was. By keyboard, focus starts on the first choice, Enter answers and moves to **Next ›**. On touch, a tap on the place answers.

### Words explained where they are used

About two dozen words a first-year student may not know are explained on the page: torus, toroidal and poloidal, TF and PF, solenoid, tokamak, ConFlat (CF) and DN, knife edge, KF, OFHC copper, eV, glow discharge, cathode and anode, Langmuir probe, Pirani gauge, mbar and Torr, UHV, bake-out, TIG welding and feedthrough. On each page (the Machine tab, a Part tab, a part card, a sheet) the first use of each word in the text has a dotted underline. A click, or Tab onto it, opens the definition under its paragraph or table row, and a second click closes it; hovering alone opens nothing. One use can explain two words: *DN160CF* opens both DN and ConFlat. A definition taken from one of the sources carries its tag.

### Sheets

While inspecting, each sub-part has a technical sheet, and the sheets sit in a column on the right of the view. **Sheets** in the inspect bar, or `S`, turns them off and on.

- **Room.** The column is 280 px wide, wider at a larger text size, and keeps its room even while it is empty. It starts under the inspect bar. The camera frames the part in the rest of the view, so nothing that opens in the column moves the camera or covers the part. A column needs a view of at least 660 px (280 px more for each extra 1× of text size), which leaves the model at least 360 px. A narrower view has a dock under the model instead (below).
- **The part card.** The inspector's Part tab describes the component. When it is not beside the view, because the inspector is folded or the window is 960 px wide or less (where the inspector sits under the model), the column starts with a card that shows the same, built by the same code. It folds like a sheet and has no ×.
- **Previews.** Rest the pointer on a sub-part (it moves less than 4 px for 150 ms) and its sheet opens under the kept ones, with a dashed edge and the label *Preview*. A pointer crossing the model on its way somewhere opens nothing. The preview stays until the pointer rests on another sub-part, or you press **Keep** or × on it, press Esc, or change piece or part. On the way to it, pausing over empty space or over another sheet never closes it, and neither does a click that misses. It takes at most half the column, and a longer sheet scrolls inside it.
- **Keeping.** With one piece shown, or on a part with one piece, click the sub-part in the model, press **Keep** on the preview, or click its row under **Made of** in the inspector (or press Space on it; Enter on a row is Show me). The sheet opens at the end of the column and scrolls into view. A click on the model never closes a sheet: a click on a kept sub-part, on any piece, scrolls its sheet into view again, so a shaky hand or a double tap cannot lose it. × on the sheet's bar, or its row under **Made of**, closes it.
- **Small parts are easy to hit.** With a mouse, a click that hits nothing picks the smallest part within 12 px of it. On touch, a tap picks the smallest part within 24 px of the finger, even when it lands on a bigger one, so a tap on a flange beside a nut gets the nut. A press counts as a click unless it moves 10 px.
- **A loupe under the finger.** On touch, a finger held still for half a second opens a loupe above it: the view under it at 3×, drawn again by the renderer rather than stretched, with a ring at the point and the name of what a tap there would pick (*Bolt 16 of 16 · star 16* on a ring of bolts). Sliding the finger moves it. Lifting it acts as a tap there: inspecting, it previews that sub-part's sheet, or picks the piece with every piece shown; outside, it selects the part, or answers the question asked. Lifting over nothing changes nothing, so a preview stays open.
- **One sheet per sub-part.** Sheets belong to sub-parts, not pieces. The copper former kept on one TF coil is the same sheet on all eight, and the former is lit as kept on every coil. On a part with several pieces, the bar says on how many pieces the sheet is the same: *Same on all 8*, or *On 4 of 5*. What does tell the pieces apart is in the **Pieces** table.
- **The column scrolls.** Nothing in it folds or closes by itself. The chevron on a sheet's bar folds the sheet to its bar, which names the sub-part in full; the chevron again opens it. The header counts the kept sheets: **Fold all** folds them and the part card, and **Close all** closes the kept sheets.
- **Floating.** Drag a sheet, or the preview, out of the column by its bar: it floats where you drop it, and a preview dropped there is kept. Drop it back on the column to return it. While a sheet floats, **Tidy** (or `L`) in the header puts every floating sheet back. The camera never moves for any of this.
- **The dock.** In a view under 660 px (a phone, a narrow window, or a 1000 px window with the inspector open) the sheets sit in a dock under the model, at most 42 % of the view's height, one card at a time. Its room is kept even while it is empty, and the camera frames the part above it. Its header reads *Sheets n · ‹ card › · Close all*. The arrows step through the part card (when the inspector is under the model) and the kept sheets, and say which one shows: *Part*, or *kept 2 of 3*. A preview takes the card while it lasts, and the arrows clear it.
- **Mouse or touch.** The gestures follow the input, not the width. With a mouse, resting on a sub-part previews it and a click keeps it, in the column and in the dock alike. On touch, a tap previews, **Keep** keeps, and a tap on a kept sub-part shows its sheet. With every piece shown, a click or a tap picks a piece instead.
- **Linking.** Hovering a sheet lights its sub-part in the model, and pointing at a kept sub-part lights its sheet. A row under **Made of** or **Pieces**, a row of the assembly list or the search, and a part's name under **How it attaches** light their part too, on hover and on keyboard focus alike.
- **The leader line.** One line runs from a sheet to its sub-part, ending on a point of it you can see: the sheet under the pointer or keyboard focus, else the sheet kept last (in the dock, the card it shows). Like the callouts it is drawn only while the view is still, so nothing moves as you turn; when you stop, it is drawn again to where the sub-part now is.
- **What the light means.** In every theme a kept sub-part, or a selected part, is filled with the selection colour and outlined; the one whose sheet is under the pointer is filled brighter. A preview has a dashed outline, and a part under the pointer a plain one. In Colour the selection colour is teal: a dark teal fill on pale materials and a pale one on dark materials, so it stands out 3:1 or more against steel and copper alike. Greyscale and the hologram use amber.
- **Coming back.** Each part keeps its sheets, folds and places, so going back to it by a link, or inspecting it again later, brings them back.

A sheet gives the material, the dimensions and notes, with a tag on every row. Which port carries the probe, and which viewport serves the webcam, the spectrometer or the eye, is not published, so those Pieces rows are tagged assumed. A source id (S1–S10) means the number is published there; a click opens the source. The other tags say how a number was arrived at, and one key at the foot of each sheet and of the Part tab explains the ones it uses:

- **photo**: scaled from the webinar photos.
- **std**: follows from the CF standard (S9), but the SPM1's own part is not published. Bolt and nut threads are tagged this way. A click opens S9.
- **derived**: worked out from tagged numbers (vessel volume, field on axis, cable per coil, bolt grip).
- **assumed**: not published, picked for the drawing (outer PF radius, KF40 reducer outlet, probe placement, TF winding layout).

The Part tab shows the part's basis as *Drawn from: published spec*, *photos* or *a guess*, with the same dot as the tree. That is how far to trust its drawn shape and position, not the numbers in its rows.

- **Vacuum hardware** is drawn to the standard and documented from it:
  - ConFlat flanges, port tubes and copper gaskets for DN40, DN63, DN100 and DN160 come from the MBE-Komponenten table: OD, thickness, bolt circle, holes, knife edge and seal recess.
  - Bolts and nuts get the thread their holes take (M6 or ¼-28; M8 or 5/16-24) and their grip length.
  - The viewport windows (Kodial glass, Kovar sleeve, 90 × 6 mm for DN100CF, 38 × 3 mm for DN40CF, 350 °C bake-out) come from Lesker's reference parts.
  - Each sheet says when the SPM1's own part is not published.
- **Coils, electrodes, the gauge and the control parts** carry what the sources and photos show. Where nothing is published, the sheet says so rather than guessing.

### The frame

The drawing is the only thing on the page with colour and character; the frame round it stays quiet. The page's title, its one `h1`, is the machine's name with what this is under it. Labels are in sentence case, never tracked capitals; a tab's name is its own label, and a part's group and number sit under its name. There is one typeface, with tabular figures wherever numbers line up or change (the readout, the scale, the counts). The quarters' names in the view keep the capitals of the letters printed on the table. The colour drawing sits on a neutral stone ground (#f1f1ef, panels #fafaf9), and the page keeps 16 px from the window's edges.

### Themes

The theme buttons at the right of the modebar pick one of three drawings, and the page remembers the choice. With none chosen, a dark system theme opens the hologram and a light one the colour drawing. The buttons are one Tab stop: ← and → move to the next theme. Under 1440 px only the chosen theme keeps its label, and under 1320 px none do, so the modebar stays on one row.

- **Colour**: the light drawing, solid shaded parts in their own colours with inked outlines, on a neutral stone ground.
- **Greyscale**: the same drawing in greys, shaded like a CAD rendering (below).
- **Hologram**: glowing blue on black (below).

### Greyscale

Black and white with shades, like a rendering from a CAD package, on dimmed paper so it is easy on the eyes.

- The light comes from the upper left and turns with the view. Each face takes one of five flat shades by how squarely it faces the light, so rounded parts show bands.
- Parts cast hard shadows on each other and on the table. They come from a 4096 × 4096 shadow map that covers only what the view shows, so they stay sharp when you zoom in. A shadow takes a lit face to the shade of a face just turned away.
- Each material keeps its own grey: steel and ceramic pale, copper a mid grey set between steel's shades, the black parts dark.
- Two things are in colour. The plasma glows pink-violet, the colour nitrogen glows, as in the colour drawing: a grey glow could not be seen on the grey parts. The selection is amber, as in the hologram:
  - solid amber, keeping its shade, with an amber outline, on a selected part or a kept sheet's sub-part;
  - brighter amber on the sub-part whose sheet is under the pointer;
  - an amber outline round a part under the pointer, dashed round a preview.

  The plasma turns amber too while it is selected, but keeps its pink-violet while you inspect it.
- The panels are the colour drawing's, in greys. Amber marks the selection there too, on an ink edge so it shows on the grey. Focus rings and the axis triad are ink.

### Hologram

The palette is the soft ice blue of the displays in Tony Stark's workshop: `#4f9fd6` on deep navy, kept dim so it is easy on the eyes. The shading follows [holographic-shader-visualizer-three.Js](https://github.com/YasirAwan4831/holographic-shader-visualizer-three.Js) (fresnel rims and scan lines).

- Every surface adds light, brightest where it turns away from you, so the inside of the machine shows through.
- The nearest surface is drawn at full strength and the ones behind it faintly, so the front still reads first.
- The whole machine is one blue, a little brighter for parts that are light in the drawing. Only the plasma, which carries energy, glows in another colour (violet, pale at its core), and the selection in amber.
- The selection glows amber, so it stands apart from the blue machine, and stays visible through whatever is in front of it. So do the sub-parts whose sheets you keep. A hovered part gets an amber outline, and a preview a dashed one.
- Edges glow softly in the same blue.
- Scan lines drift up the model and a bright sweep passes through it every 7 s. Rings on the projector floor pulse outward.
- The panels and the sheets are drawn as a HUD, with blue corner brackets and a slow scan passing down each sheet.

The animation runs at 30 frames a second while the page is idle, and stands still with reduced motion.

### Keys

Arrows turn, Shift+arrows pan, `+`/`−` zoom, `0` resets, `A` fits everything, `1`–`4` pick a view, `E` explode, `[` `]` spread, `C` cutaway, `I` inspect, `T` take apart, `J` open the joint, `,` `.` previous and next piece, `G` ghost, `X` section, `S` sheets, `Z` Show me, `L` floating sheets back into the column, `Backspace` back to the previous part, `Esc` one step back, `F` panels, `H` hide.

### Settings, links and access

- **Settings.** The Controls tab starts with two, and the page remembers both:
  - **Text size**, 1×, 1.5× or 2×, scales the sheets, the inspect bar, the view's labels and the tooltips, for a projector or a lecture hall. The sheet column widens with it; at 2× in a 1920 × 1080 window a sheet's numbers are 25 px.
  - **Single-letter keys** can be turned off, for speech input or a hand that presses keys by accident. Then no key that types a character does anything; the arrows, Esc and Backspace still work.
- **Links.** The address follows what you look at: the part, the piece, the kept sheets, Take apart and its step, the joint opened, Section, Show me, the view and the theme, as in `#part=gaskets&piece=right-back-joint&sheets=ofhc-copper-gasket`, or `show=vacuum-gauge.sensor-tube-nut` for Show me on the gauge's sensor nut, or `joint=1&step=2` for a joint opened at its second step. Opening it, even in a fresh browser, inspects the same piece with the same sheets kept. A piece or a sheet can be named by the start of its name (`piece=right-back`), and an exact name wins. Inspecting another part or piece adds a step to the browser's history, so Back returns to the part before; turning the view only updates the address. **Copy link** in the inspect bar copies it.
- **Screen readers.** A status line announces Take apart, Explode, Ghost, Sheets, hiding and showing, leaving Inspect, each question and its answer, and what a search found nothing for (the line under the box is a status). A source tag moves focus to its source in the Sources tab, with **← back** to return to where you were. The 3D view's focus ring is drawn inside its edge, and keyboard focus anywhere stops the idle spin.
- **Touch.** Under a coarse pointer every button is at least 44 px. While a finger is down or the camera glides, the view draws at one pixel per CSS pixel and the Greyscale shadows wait, so it keeps up on a tablet.

## Files

| File | What it is |
| --- | --- |
| [`index.html`](index.html) | The page: renderer and ink pass, turntable camera, inspect mode, assembly tree, inspector |
| [`device.js`](device.js) | The geometry in centimetres. One table of dimensions (`D`) at the top, the ConFlat sizes (`CF`), and `DETACH`, how far each part travels when inspected. Each piece carries `apart`, where it goes in the exploded view. Each mesh carries `sub`, the sub-part it belongs to, and `ex`, where that sub-part goes when the part is taken apart |
| [`parts.js`](parts.js) | The documentation: `SOURCES`, `GROUPS`, one entry per component in `PARTS` (with `pieces` where the pieces differ), `NOT_DRAWN`, how each connected pair attaches (`JOINS`), the run steps (`RUN`), the tour (`TOUR`), the fitting order (`ORDER`), what each part asked about in *Where does it go?* sits on (`QUIZ`), the glossary (`GLOSSARY`), and the sub-part sheets (`SUBDOCS`, `SUBMAP`). A pair in `connects` with no join, or a join for parts that do not connect, is reported in the browser console |
| [`PLAN.md`](PLAN.md) | The first critique and plan for Inspect; its three phases are done |
| [`PLAN-2.md`](PLAN-2.md) | The next plan, from an eight-critic review panel: inspecting small parts, Stark-style, and showing where they go; Phases 0 to 3 are done. Its record is in [`review-panel/`](review-panel/) |

## Sources

| Id | Source | Used for |
| --- | --- | --- |
| S1 | [minitmak.com](https://www.minitmak.com/) | Vessel quarters and ring, port counts, TF turns, cable and current, PF and satellite coils, supplies, discharge, diagnostics, software |
| S2 | [minitmak.com/specification](https://www.minitmak.com/specification) | R₀ and a, TF field, PF control, solenoid drive, gases, plasma temperature, envelope |
| S3 | [rideosystems.biz/technology](https://www.rideosystems.biz/technology) | Confirms S2's headline numbers on the overview: R₀ and a, the TF field, the plasma, the envelope |
| S4 | [P. Apte, "The Minimak. Design, Build and Operation", Univ. of Manchester webinar, Oct 2025 (PDF)](https://www.minitmak.com/_files/ugd/5de522_5cee74b6dc514f1eb1a3fee4cb50b9e4.pdf) | Construction (TIG welds, ConFlat, leak test, copper TF formers, metal PF formers), pump and gauge, 40 A supplies, 4 kV glow supply, PLC, software, operating fields, upgrades. Its photos set most of the proportions |
| S5 | [Kurt J. Lesker, ConFlat technical notes](https://www.lesker.com/newweb/flanges/flanges_technicalnotes_conflat_1.cfm) | CF flange sizes |
| S6 | [Wikipedia, Vacuum flange](https://en.wikipedia.org/wiki/Vacuum_flange) | How CF and KF joints seal |
| S7 | [MKS, Mini-Convectron gauge](https://www.mks.com/p/275600-0-GD-T) | The Convectron gauge family and its range |
| S8 | [minimak-groundwork](https://github.com/HaoPhuc/minimak-groundwork) | Background, not cited by any row: TU/e context and the Langmuir fit script |
| S9 | [MBE-Komponenten, flange, gasket and tube dimensions](https://www.mbe-komponenten.de/service/flange-gasket/) | Every CF flange, port tube, gasket and bolt hole in the model and on the sheets |
| S10 | [Kurt J. Lesker, Kodial CF viewports](https://www.lesker.com/viewports/viewports-cf-flanged-kodial-glass.cfm) | Viewport glass, view diameter, thickness, Kovar seal, bake-out |
| S11 | [Kurt J. Lesker, KF technical notes](https://www.lesker.com/newweb/flanges/flanges_technicalnotes_kf_1.cfm) | How a KF joint goes together: centring ring and O-ring, the clamp on the flanges’ chamfered backs. Its dimension figure is not in its text, so the KF sizes are the drawing’s |

## How true it is

Every part has a basis, shown as the dot in the tree:

- **Spec** (filled dot): the number or placement is published. R₀ 230 mm, a 75 mm, four 150 mm elbows, 8 TF coils × 50 turns of 6 mm cable up to 40 A, 3 viewing + 1 vacuum + 4 diagnostic ports, the 90 × 90 × 160 cm envelope.
- **Photo** (half dot): scaled or placed from the webinar photos. The joints sit on the diagonals, clamped to four aluminium corner posts. The TF formers have fold-out copper tabs. The PF1/PF2 windings and leads are on a white central former. The satellite coils are hose-wound rings. The gauge and gas stack is on top of the back quarter. The table is a Thorlabs Nexus. The control drawer, the coil-supply chassis and the pump are under the table.
- **Assumed** (ring): placed where plausible. These are the outer PF coils (PF3, PF4), the solenoid's position, the HV supply, the gas valve, the Langmuir probe, the webcam and the spectrometer.

The flange sizes (DN160CF joints, DN100CF lateral ports, DN40CF top and bottom ports, ≈DN63CF gauge port) are drawn to the MBE-Komponenten CF table (S9) and match the bolt counts in the photos. Every sealing face has its knife edge and gasket recess at the S9 diameters, and every one of the 17 CF joints has its copper gasket. Bolts are drawn at their stock length (the grip, a nut and two threads, rounded up), with nuts on every through-bolted joint; only the DN40 holes on the reducer are tapped. The KF joints (the gauge on its KF16 adaptor, the bellows hose at the pump port and the pump) are drawn as two flanges, a centring ring with its O-ring, and a clamp; their sizes are the usual ISO-KF ones, marked "assumed", as no SPM1 KF part is published. The vessel is drawn as a 154 × 2 mm DN160CF tube, so its 150 mm bore gives the published 75 mm minor radius. Derived numbers in the inspector (vessel volume, field on axis, cable per coil) are marked "derived", and numbers picked for the drawing are marked "assumed".

To correct the model at the kickoff, change `D` at the top of `device.js` and the `basis` and spec rows in `parts.js`.
