# Turns the screenshots in shots/ into the guide's pictures in img/: whole shots as JPEG 2000 px wide, the phone
# shots as they are, and crops. A crop is (shot, x0, y0, x1, y1) in CSS px of a shot taken at 2x; the marker and
# label positions in guide.html are in the same CSS px, so a crop that moves takes them with it.
import os
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
S, O = os.path.join(HERE, 'shots'), os.path.join(HERE, 'img')
os.makedirs(O, exist_ok=True)

FULL = ['first', 'guide', 'inspect', 'apart', 'sheets', 'showme', 'explode', 'desk', 'greyscale', 'blueprint', 'hologram']
PHONE = ['phone', 'phone-inspect', 'phone-more']
CROPS = {
    'bar': ('apart', 16, 48, 1264, 102),        # the Part tab's tools, without the step's caption
    'menu': ('views', 286, 112, 548, 395),      # the view buttons and the Views menu
    'tooltip': ('hover', 570, 495, 930, 635),
    'term': ('term', 886, 112, 1266, 376),
    'controls': ('controls', 886, 112, 1266, 646),
    'sources': ('sources', 886, 112, 1266, 383),
    'triad': ('first', 1166, 113, 1264, 211),
    'hero': ('first', 346, 203, 836, 720),      # the cover: the model alone, on the view's ground, as wide as the box
    'select': ('select', 286, 112, 954, 765),    # the view only, with the coils selected
    'wheel': ('wheel', 16, 275, 540, 700),       # the groups' wheel with the magnets fanned out
    'joint': ('joint', 16, 112, 954, 765),       # the view only, without the panels
    'tour': ('tour', 16, 48, 1264, 765),
    'quiz': ('quiz', 16, 112, 1264, 765),
    # The control desk's monitor in three states: VIDEO 1, its options and what the tracking reads.
    'desk-glow': ('desk-glow', 980, 288, 1252, 590),
    'desk-tf': ('desk', 980, 288, 1252, 590),
    'desk-pf': ('desk-pf', 980, 288, 1252, 590),
}
PHOTO = {'select', 'wheel', 'joint', 'tour', 'quiz'}               # crops with much of the model in them go as JPEG

def shot(n):
    return Image.open(os.path.join(S, f'{n}.png')).convert('RGB')

for n in FULL:
    im = shot(n)
    im.resize((2000, round(im.height * 2000 / im.width)), Image.LANCZOS).save(os.path.join(O, f'{n}.jpg'), quality=86)
for n in PHONE:
    shot(n).save(os.path.join(O, f'{n}.jpg'), quality=88)
for n, (s, x0, y0, x1, y1) in CROPS.items():
    im = shot(s).crop((x0 * 2, y0 * 2, x1 * 2, y1 * 2))
    if n in PHOTO:
        im.save(os.path.join(O, f'{n}-crop.jpg'), quality=86)
    else:
        im.save(os.path.join(O, f'{n}.png'))
print(len(os.listdir(O)), 'pictures in', O)
